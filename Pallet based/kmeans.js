var correspondecias = [];
var correspondecias_im = [];
var means_salida = [];
var imagenes = [];
var bins = [];
var bins_color = [];
for (var i = 0; i < 16; i++) {
	for (var j = 0; j < 16; j++) {
		for (var k = 0; k < 16; k++) {
			bins_color[i * 256 + j * 16 + k] = rgb2lab(i*16, j*16, k*16);
		}
	}
}
bin = (r, g, b) => Math.floor(r / 16) * 256 + Math.floor(g / 16) * 16 + Math.floor(b / 16);
abin=(i)=>{
    r = Math.floor(i / 256);
    i = i % 256;
    g = Math.floor(i / 16);
    b = i % 16;
    return {
        r:r,g:g,b:b
    }
}

var app = (function () {

	var canvas = document.getElementById('canvas'),
		context = canvas.getContext('2d'),

		public = {};
	public.loadPicture = function () {
		

		var imagObj = new Image();
		
		
		imagObj.src = document.getElementById("texto").value;
		

		imagObj.onload = function () {
			context.drawImage(imagObj, 0, 0);
		};

		public.getImgData = function () {
			return context.getImageData(0, 0, canvas.width, canvas.height);
		}
		public.Ale = {};
		public.Ale.cargarBins = () => {
			var imageData = app.getImgData(),
				pixels = imageData.data,
				numpixels = imageData.width * imageData.height;
			for (var i = 0; i < 4096; i++) {
				bins[i] = 0;
			}
			for (var i = 0; i < numpixels; i++) {
				temp = bin(pixels[i * 4], pixels[i * 4 + 1], pixels[i * 4] + 2);
				bins[temp]++;
			}
		}
		public.Ale.centros = (k) => {
			k = Number(k);
			var means = [];
			//creamos bins(contenedores)
			public.Ale.cargarBins();
			means[0] = { l: 0, a: 0, b: 0 };
			//iterar por cada k
			for (var j = 1; j < k+1 ; j++) {
				var max = 0, indice = 0;
				//hallamos el mayor
				for (var i = 1; i < 4096; i++) {
					if (max < bins[i]) {
						indice = i;
						max = bins[i];
					}
				}
				color = bins_color[indice];
				bins[indice] = 0;
				//atenuamos los valores
				for (var i = 0; i < 4096; i++) {
					if (bins[i] == 0) continue;
					var delta = deltanL(color, bins_color[i]);
					bins[i] *= (1 - Math.exp(-Math.pow(delta, 2) / Math.pow(80, 2)));
				}
				means[j] = bins_color[indice];
			}
			


			return means;
		}
		public.Ale.copiar = (mean) => {
			var cpy_m = [];
			for (var i = 0; i < mean.length; i++) {
				cpy_m[i] = { l: mean[i].l, a: mean[i].a, b: mean[i].b };
				
			}
			return cpy_m;
		}
		public.Ale.diferencial = (k1, k2) => {
			if (k1.length != k2.length) {
				return -1;
			}
			var l = k1.length,
				dif = 0;
			for (var i = 1; i < l; i++) {
				dif += deltaE(k1[i],k2[i]);
			}
			return dif;
		}
		public.Ale.mas_cercano = (pixel, means) => {
			var corr = 0,
				last_d = 255 * 3,
				l = means.length;
		    //aun no es diferencia euclidiana
			for (var i = 0; i < l; i++) {
				var temp = means[i];
				var d = deltanL(pixel, temp);
				
				if (d < last_d) {
					corr = i;
					last_d = d;
				}
			}
			return corr;
		}
		public.Ale.actualizarPaletas = () => {
			//llenar las paletas
			for (var i = 0; i < means_salida.length; i++) {
				var colorp = document.getElementById("color" + i.toString());
				rgb_color = lab2rgb(means_salida[i].l, means_salida[i].a, means_salida[i].b);
				colorp.value = rgbToHex(rgb_color.r, rgb_color.g, rgb_color.b);
				colorp.hidden = false;
				if (i == 0) {
					colorp.disabled = "disabled";
				}
			}
		}
		public.Ale.procesar = (K) => {
			var imageData = app.getImgData(),
				pixels = imageData.data,
				numpixels = imageData.width * imageData.height,
				means = public.Ale.centros(K);
			var C_L = [], C_A = [], C_B = [], C = [];
			public.Ale.cargarBins();
			K = Number(K);
			
			
			//ordenamiento segun luminocidad
			for (var i = 0; i < (K + 1); i++) {
				for (var j = i + 1; j < (K + 1); j++) {
					if (means[i].l > means[j].l) {
						var temp = means[i];
						means[i] = means[j];
						means[j] = temp;
					}
				}
			}
			
			
			do {
				var old_means = public.Ale.copiar(means);
				//vaciamos contadores
				for (var i = 0; i < K + 1; i++) {
					C_L[i] = 0;
					C_A[i] = 0;
					C_B[i] = 0;
					C[i] = 0;
				}
				//calculamos a que grupo pertenecen
				for (var i = 0; i < 4096; i++) {
					correspondecias[i] = public.Ale.mas_cercano(bins_color[i], means);
				}
				//sumamos contadores
				for (var i = 0; i < 4096; i++) {
					for (var j = 0; j < 16; j++) {
						for (var k = 0; k < 16; k++) {
							C_L[correspondecias[i]] += bins_color[i].l * bins[i];
							C_A[correspondecias[i]] += bins_color[i].a * bins[i];
							C_B[correspondecias[i]] += bins_color[i].b * bins[i];
							C[correspondecias[i]] += bins[i];
						}
					}
				}

				for (var i = 1; i < K+1 ; i++) {
				    if (C[i] != 0) {
						means[i].l = (C_L[i] / C[i]);
						means[i].a = (C_A[i] / C[i]);
						means[i].b = (C_B[i] / C[i]);
				    }
				}
			} while (public.Ale.diferencial(means, old_means) > 0)
			
            //pixeles originales al kmeans
			for (var i = 0; i < numpixels; i++) {
				correspondecias[i] = public.Ale.mas_cercano(rgb2lab(pixels[i * 4], pixels[i * 4 + 1], pixels[i * 4 + 2]), means);
			}
			console.log(means);
			console.log(correspondecias.length);

			means_salida = means;
			public.Ale.actualizarPaletas();
			public.Ale.Dividir();
			return means;
		}
		public.Ale.Dividir = () => {
			var images = [];
			var imagen_base = app.getImgData();
			for (var i = 0; i < 10; i++) {
				imagen_temp = app.getImgData();
				images.push(imagen_temp);
			}

			numPixels = images[0].width * images[0].height;
		

			for (var j = 0; j < 10; j++) {
				for (var i = 0; i < numPixels; i++) {
					if (correspondecias[i] != j) {
						images[j].data[i * 4] = 0;
						images[j].data[i * 4 + 1] = 0;
						images[j].data[i * 4 + 2] = 0;
					}

				}
			}
			imagenes = images;

		}
		public.Ale.modificarL = (indice) => {
			var l = means_salida.length;
			for (var i = indice + 1; i < l; i++) {
				means_salida[i].l = Math.max(means_salida[i].l, means_salida[i - 1].l);
			}

			for (var i = indice - 1; i > 0; i--) {
				means_salida[i].l = Math.min(means_salida[i].l, means_salida[i + 1].l);
			}
		}

		public.Ale.setColor = (indice) => {
			var pixels = imagenes[indice].data,
				numpixels = imagenes[indice].width * imagenes[indice].height,
				colorp = document.getElementById("color" + indice.toString());
			original_color = means_salida[indice];
			nuevo_color = hexToRgb(colorp.value);
			C = original_color;
			C_ = rgb2lab(nuevo_color.r, nuevo_color.g, nuevo_color.b);
			Cb_ab = puntoInterseccion(C.a, C.b, C_.a, C_.b);

			means_salida[indice] = rgb2lab(nuevo_color.r, nuevo_color.g, nuevo_color.b);
			public.Ale.modificarL(indice);

			var l_anterior = means_salida[indice - 1].l;
			if (indice == means_salida.length - 1) {
				var l_posterior = 100;
			}
			else {
				var l_posterior = means_salida[indice + 1].l;
			}
			x_l = (l_anterior + l_posterior) / 2;
			for (var i = 0; i < numpixels; i++) {
				if (pixels[i * 4] == 0 && pixels[i * 4 + 1] == 0 && pixels[i * 4 + 2] == 0) {
					continue;
				}
				else {
					x = rgb2lab(pixels[i * 4], pixels[i * 4 + 1], pixels[i * 4 + 2]);
					x0_a = x.a + C_.a - C.a;
					x0_b = x.b + C_.b - C.b;
					if (estaDentro(x0_a, x0_b)) {
						//far case
						xb_ab = puntoInterseccion(x.a, x.b, x0_a, x0_b);
					}
					else {
						//near case
						xb_ab = puntoInterseccion(C_.a, C_.b, x0_a, x0_b);
					}
					x_ab = f1(C, Cb_ab, C_, x, xb_ab);
					ncolor = lab2rgb(x.l, x_ab.a, x_ab.b);
					pixels[i * 4] = ncolor.r;
					pixels[i * 4 + 1] = ncolor.g;
					pixels[i * 4 + 2] = ncolor.b;
				}

			}
			imagenes[indice].data = pixels;
			public.Ale.actualizarPaletas();
		}

	}
	return public;
}())