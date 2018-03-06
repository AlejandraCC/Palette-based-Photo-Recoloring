//funciones auxiliares
rgbToHex = (r, g, b) => "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
hexToRgb = (hex) => {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}
f = (t) => {
	if (t > Math.pow(6 / 29, 3))
		return Math.pow(t, 1 / 3);
	else
		return (1 / 3) * Math.pow(29 / 6, 2) * t + 4 / 29;
}

// the following functions are based off of the pseudocode
// found on www.easyrgb.com

lab2rgb = (l, a, b) => {
	var y = (l + 16) / 116,
		x = a / 500 + y,
		z = y - b / 200,
		r, g, b;

	x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16 / 116) / 7.787);
	y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16 / 116) / 7.787);
	z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16 / 116) / 7.787);

	r = x * 3.2406 + y * -1.5372 + z * -0.4986;
	g = x * -0.9689 + y * 1.8758 + z * 0.0415;
	b = x * 0.0557 + y * -0.2040 + z * 1.0570;

	r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1 / 2.4) - 0.055) : 12.92 * r;
	g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1 / 2.4) - 0.055) : 12.92 * g;
	b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1 / 2.4) - 0.055) : 12.92 * b;

	return {
		r: Math.round(Math.max(0, Math.min(1, r)) * 255),
		g: Math.round(Math.max(0, Math.min(1, g)) * 255),
		b: Math.round(Math.max(0, Math.min(1, b)) * 255)
	}
}


rgb2lab = (r, g, b) => {
	var r = r / 255,
		g = g / 255,
		b = b / 255,
		x, y, z;

	r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
	g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
	b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

	x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
	y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
	z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

	x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
	y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
	z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;

	return {
		l: (116 * y) - 16,
		a: 500 * (x - y),
		b: 200 * (y - z)
	}
}

// calculate the perceptual distance between colors in CIELAB
// https://github.com/THEjoezack/ColorMine/blob/master/ColorMine/ColorSpaces/Comparisons/Cie94Comparison.cs

deltaE = (labA, labB) => {
	var deltaL = labA.l - labB.l;
	var deltaA = labA.a - labB.a;
	var deltaB = labA.b - labB.b;
	var c1 = Math.sqrt(labA.a * labA.a + labA.b * labA.b);
	var c2 = Math.sqrt(labB.a * labB.a + labB.b * labB.b);
	var deltaC = c1 - c2;
	var deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
	deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
	var sc = 1.0 + 0.045 * c1;
	var sh = 1.0 + 0.015 * c1;
	var deltaLKlsl = deltaL / (1.0);
	var deltaCkcsc = deltaC / (sc);
	var deltaHkhsh = deltaH / (sh);
	var i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
	return i < 0 ? 0 : Math.sqrt(i);
}

deltanL = (labA, labB) => {
    var l1 = labA.l, a1 = labA.a, b1 = labA.b, l2 = labB.l, a2 = labB.a, b2 = labB.b;
    var K1 = 0.045, K2 = 0.015;
    var del_L = l1 - l2;
    var c1 = Math.sqrt(a1 * a1 + b1 * b1);
    var c2 = Math.sqrt(a2 * a2 + b2 * b2);
    var c_ab = c1 - c2;
    var h_ab = (a1 - a2) * (a1 - a2) + (b1 - b2) * (b1 - b2) - c_ab * c_ab;
    return del_L * del_L + c_ab * c_ab / (1 + K1 * c1) / (1 + K1 * c1) + h_ab / (1 + K2 * c1) / (1 + K2 * c1);
}

puntoInterseccion = (x1, y1, x2, y2) => {
	var a = x2 - x1,
		b = y2 - y1,
		alpha = Math.pow(a, 2) + Math.pow(b, 2),
		betha = 2 * x1 * a + 2 * y1 * b,
		gamma = Math.pow(x1, 2) + Math.pow(y1, 2) - Math.pow(128, 2),
		//formula general
		m = (-betha + Math.sqrt(Math.pow(betha, 2) - 4 * alpha * gamma)) / (2 * alpha);
	return {
		a: x1 + a * m,
		b: y1 + b * m
	}
}

estaDentro = (x, y) => Math.pow(x, 2) + Math.pow(y, 2) <= Math.pow(128, 2);

distancia = (p1, p2) => Math.sqrt(Math.pow(p2.b - p1.b, 2) + Math.pow(p2.a - p1.a, 2));

f1 = (C, Cb, C_, x, xb) => {
	var m = Math.min(1, distancia(x, xb) / distancia(C, Cb)),
		k = m * distancia(C, C_),
		d = (xb.b - x.b) / (xb.a - x.a),
		alpha = Math.sqrt(Math.pow(k, 2) / (Math.pow(d, 2) + 1)),
		xa = xb.a - x.a > 0 ? x.a + alpha : x.a - alpha;
	return {
		a: xa,
		b: d * (xa - x.a) + x.b
	}
}