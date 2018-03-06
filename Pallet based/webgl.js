//main();
function main() {
	var canvas = document.querySelector('#glcanvas');
	//const gl = initWebGL(canvas);
	const gl = canvas.getContext('experimental-webgl');
	if (!gl) {
		alert('no se puede iniciar opengl');
		return;
	}
	
    // Vertex shader program
	const vsSource = `
                attribute vec4 aVertexPosition;
				attribute vec2 aTextureCoord;
                uniform mat4 uModelViewMatrix;
                uniform mat4 uProjectionMatrix;
				
				varying highp vec2 vTextureCoord;

                void main() {
					gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
					vTextureCoord=aTextureCoord;
				}`;
	const fsSource = `
				varying highp vec2 vTextureCoord;
				uniform sampler2D uSampler;
				void main() {
					gl_FragColor=texture2D(uSampler,vec2(vTextureCoord.s,vTextureCoord.t));
					//gl_FragColor=vec4(0.0, 0.33, 0.78, 1.0);
				}`;
	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

	const programInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
			textureCoordAttribute: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			uSample: gl.getUniformLocation(shaderProgram, 'uSampler'),
		},
	};

	const buffers = initBuffers(gl);
	const texture = loadTexture(gl, 'entropy.jpg');

	drawScene(gl, programInfo, buffers, texture);
}


//funcion de carga de textura
function loadTexture(gl, url) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	
	// Because images have to be download over the internet
	// they might take a moment until they are ready.
	// Until then put a single pixel in the texture so we can
	// use it immediately. When the image has finished downloading
	// we'll update the texture with the contents of the image.
	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const pixel = new Uint8Array([0, 26, 164, 255]);  // opaque blue
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,		width, height, border, srcFormat, srcType,		pixel);

	const image = new Image();
	image.onload = function () {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
			srcFormat, srcType, image);
		
		// WebGL1 has different requirements for power of 2 images
		// vs non power of 2 images so check if the image is a
		// power of 2 in both dimensions.
		if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
			// Yes, it's a power of 2. Generate mips.
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			// No, it's not a power of 2. Turn of mips and set
			// wrapping to clamp to edge
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
	};
	image.src = url;	
	return texture;
}

function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}

initWebGL = (canvas) => {
	gl = null;
	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	}
	catch (e) { }

	if (!gl) {
		alert("Imposible inicializar Webgl. Tu navegador no puede soportarlo.");
		gl = null;
	}
	return gl;
}


initShaderProgram = (gl, vsSource, fsSource) => {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
   //creacion del programa del shader
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert('No se puede cargar el programa del shader: ' + gl.getProgramInfoLog(shaderProgram));
	}
	return shaderProgram;
}

loadShader = (gl, type, source) => {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert('Error compilando los shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}


initBuffers = (gl) => {
	//datos posiciones de vertice
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	const positions = [
		1.0, 1.0, 1.0,
		-1.0, 1.0, 1.0,
		1.0, -1.0, 1.0,
		-1.0, -1.0, 1.0,
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	//datos textura
	verticesTexture = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, verticesTexture);

	var textcoord = [
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textcoord), gl.STATIC_DRAW);
	return {
		position: positionBuffer,
		textureCoord: verticesTexture
	};
}


drawScene = (gl, programInfo, buffers,texture) => {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            //Matriz de la perpectiva
	const fieldOfView = 45 * Math.PI / 180; //radianes
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 100.0;
	const projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
	const modelViewMatrix = mat4.create();
	mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -5.0]);
	//cargamos los valores de las posiciones
	{
		const numComponents = 3;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
		gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
		gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
	}
	//cargamos los valores de la textura
	{
		const numComponents = 2;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
		gl.vertexAttribPointer(programInfo.attribLocations.textureCoordAttribute, numComponents, type, normalize, stride, offset);
		gl.enableVertexAttribArray(programInfo.attribLocations.textcoord);
	}

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(programInfo.uniformLocations.uSample, 0);
	gl.useProgram(programInfo.program);
	gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
	gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
	{
		const offset = 0;
		const vertexCount = 4;
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	}
}




