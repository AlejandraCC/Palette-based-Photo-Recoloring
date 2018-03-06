﻿var cubeRotation = 0.0;


function main() {
	const canvas = document.querySelector('#glcanvas');
	const gl = canvas.getContext('experimental-webgl');

	if (!gl) {
		alert('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}

	const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;


	const fsSource = `
    varying highp vec2 vTextureCoord;
    //usamos varias texturas
    uniform sampler2D uSampler0;
    uniform sampler2D uSampler1;
	uniform sampler2D uSampler2;
	uniform sampler2D uSampler3;
    uniform sampler2D uSampler4;
	uniform sampler2D uSampler5;
	uniform sampler2D uSampler6;
    uniform sampler2D uSampler7;
	uniform sampler2D uSampler8;
    void main(void) {
      gl_FragColor = texture2D(uSampler0, vTextureCoord)+
						texture2D(uSampler1, vTextureCoord)+
texture2D(uSampler2, vTextureCoord)+
texture2D(uSampler3, vTextureCoord)+
texture2D(uSampler4, vTextureCoord)+
texture2D(uSampler5, vTextureCoord)+
texture2D(uSampler6, vTextureCoord)+
texture2D(uSampler7, vTextureCoord)+
texture2D(uSampler8, vTextureCoord);
    }
  `;

	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

	const programInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
			textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            //referencia a las texturas dentro del shader
			uSampler0: gl.getUniformLocation(shaderProgram, 'uSampler0'),
			uSampler1: gl.getUniformLocation(shaderProgram, 'uSampler1'),
			uSampler2: gl.getUniformLocation(shaderProgram, 'uSampler2'),
			uSampler3: gl.getUniformLocation(shaderProgram, 'uSampler3'),
			uSampler4: gl.getUniformLocation(shaderProgram, 'uSampler4'),
			uSampler5: gl.getUniformLocation(shaderProgram, 'uSampler5'),
			uSampler6: gl.getUniformLocation(shaderProgram, 'uSampler6'),
			uSampler7: gl.getUniformLocation(shaderProgram, 'uSampler7'),
			uSampler8: gl.getUniformLocation(shaderProgram, 'uSampler8'),
		},
	};

	const buffers = initBuffers(gl);
    //cargamos una textura por cada imagen que tenemos
	const textures = [];
	for (var i = 0; i < 9; i++) {
		textures[i] = loadTexture(gl, imagenes[i]);
	}
	var then = 0;

	function render(now) {
		now *= 0.000;  
		const deltaTime = now - then;
		then = now;

		drawScene(gl, programInfo, buffers, textures, deltaTime);

		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}


function initBuffers(gl) {


	const positionBuffer = gl.createBuffer();


	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


	const positions = [
		-1.0, -1.0, 1.0,
		1.0, -1.0, 1.0,
		1.0, 1.0, 1.0,
		-1.0, 1.0, 1.0,
	];


	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


	const textureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

	const textureCoordinates = [
		0.0, 1.0,
		1.0, 1.0,
		1.0, 0.0,
		0.0, 0.0,

	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
		gl.STATIC_DRAW);

	const indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

	const indices = [
		0, 1, 2, 0, 2, 3,    

	];


	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
		new Uint16Array(indices), gl.STATIC_DRAW);

	return {
		position: positionBuffer,
		textureCoord: textureCoordBuffer,
		indices: indexBuffer,
	};
}


function loadTexture(gl, imag) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	
	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const pixel = new Uint8Array([0, 0, 255, 255]);  
	const image = imag;
		gl.bindTexture(gl.TEXTURE_2D, texture);
		
		if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
			srcFormat, srcType, image);

	return texture;
}

function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}

function drawScene(gl, programInfo, buffers, textures, deltaTime) {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);  
	gl.clearDepth(1.0);                 
	gl.enable(gl.DEPTH_TEST);           
	gl.depthFunc(gl.LEQUAL);            


	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


	const fieldOfView = 45 * Math.PI / 180;   
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 100.0;
	const projectionMatrix = mat4.create();

	mat4.perspective(projectionMatrix,
		fieldOfView,
		aspect,
		zNear,
		zFar);

	const modelViewMatrix = mat4.create();


	mat4.translate(modelViewMatrix,     
		modelViewMatrix,     
		[-0.0, 0.0, -4.0]); 
	mat4.rotate(modelViewMatrix,  
		modelViewMatrix,  
		cubeRotation,     
		[0, 0, 1]);       
	mat4.rotate(modelViewMatrix,  
		modelViewMatrix,  
		cubeRotation * .7,
		[0, 1, 0]);       

	{
		const numComponents = 3;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
		gl.vertexAttribPointer(
			programInfo.attribLocations.vertexPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(
			programInfo.attribLocations.vertexPosition);
	}

	{
		const numComponents = 2;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
		gl.vertexAttribPointer(
			programInfo.attribLocations.textureCoord,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(
			programInfo.attribLocations.textureCoord);
	}

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);


	gl.useProgram(programInfo.program);


	gl.uniformMatrix4fv(
		programInfo.uniformLocations.projectionMatrix,
		false,
		projectionMatrix);
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.modelViewMatrix,
		false,
		modelViewMatrix);

    //vinculamos cada textura con los espacios en el shaders
	gl.uniform1i(programInfo.uniformLocations.uSampler0, 0);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textures[0]);

	gl.uniform1i(programInfo.uniformLocations.uSampler1, 1);
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, textures[1]);

	gl.uniform1i(programInfo.uniformLocations.uSampler2, 2);
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, textures[2]);

	gl.uniform1i(programInfo.uniformLocations.uSampler3, 3);
	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, textures[3]);

	gl.uniform1i(programInfo.uniformLocations.uSampler4, 4);
	gl.activeTexture(gl.TEXTURE4);
	gl.bindTexture(gl.TEXTURE_2D, textures[4]);

	gl.uniform1i(programInfo.uniformLocations.uSampler5, 5);
	gl.activeTexture(gl.TEXTURE5);
	gl.bindTexture(gl.TEXTURE_2D, textures[5]);

	gl.uniform1i(programInfo.uniformLocations.uSampler6, 6);
	gl.activeTexture(gl.TEXTURE6);
	gl.bindTexture(gl.TEXTURE_2D, textures[6]);

	gl.uniform1i(programInfo.uniformLocations.uSampler7, 7);
	gl.activeTexture(gl.TEXTURE7);
	gl.bindTexture(gl.TEXTURE_2D, textures[7]);

	gl.uniform1i(programInfo.uniformLocations.uSampler8, 8);
	gl.activeTexture(gl.TEXTURE8);
	gl.bindTexture(gl.TEXTURE_2D, textures[8]);
	
	

	{
		const vertexCount = 6;
		const type = gl.UNSIGNED_SHORT;
		const offset = 0;
		gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
	}


	cubeRotation += deltaTime;
}

function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);


	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	return shaderProgram;
}

function loadShader(gl, type, source) {
	const shader = gl.createShader(type);


	gl.shaderSource(shader, source);


	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}