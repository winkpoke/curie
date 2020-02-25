function toNumber(span, spacing) {
	return Math.floor(span / spacing);
}

function slicexfloor(imagestack, cols, rows, origin, x, xspacing, windowCenter, windowWidth, mapzidx) {
	var layers = imagestack.length;
	if (mapzidx != undefined) layers = mapzidx.length;
	var originx = imagestack[0][0].x;
	var image0 = imagestack[0][1];
	var slope = image0.slope;
	var intercept = image0.intercept;
	var layer_x = toNumber(x - originx, xspacing);
	var rows_x = cols;
	var cols_x = layers;
	console.log(rows_x, cols_x);
	//const outPut0 = new Array(rows_x * cols_x);
	const outPut = new Array(rows_x * cols_x);
	if (mapzidx != undefined) {
		//coordinate conversion
		for (var i = 0; i < cols_x; i++) {
			var i1 = mapzidx[i][1];
			var i2 = mapzidx[i][3];
			var r1 = mapzidx[i][2];
			var r2 = mapzidx[i][4];
			for (var j = 0; j < rows_x; j++) {
				var v1 = (imagestack[i1][1]).getPixelData[layer_x * cols + j];
				var v2 = (imagestack[i2][1]).getPixelData[layer_x * cols + j];
				outPut[i * rows_x + rows_x - j] = v1 * r1 + v2 * r2;
			}
		}

	} else {

		for (var j = 0; j < rows_x; j++) {
			for (var i = 0; i < cols_x; i++) {
				//outPut[j*rows_x+i] = i*rows*cols + layer_x*cols + j;
				outPut[j * cols_x + i] = (imagestack[i][1]).getPixelData[layer_x * cols + j];
			}
		}
	}


	let image = {
		isRaw: false,
		height: cols_x, //rows_x,//
		width: rows_x, //cols_x,//
		windowCenter: windowCenter,
		windowWidth: windowWidth,
		slope: slope,
		intercept:intercept,

		origin: origin, //[origin.y, origin.z, origin.x],
		slicelocation: origin.x,
		rows: cols_x, //rows_x,//
		columns: rows_x, //cols_x,//
		xspacing: xspacing, //yspacing,
		yspacing: yspacing, //zspacing,
		zspacing: zspacing, //xspacing,
		getPixelData: outPut
	};
	var promise = new Promise((resolve) => {
		resolve(image);
	});
	return promise;
};
/*
x
|
|---z*/
function sliceyfloor(imagestack, cols, rows, origin, y, yspacing, windowCenter, windowWidth, mapzidx) {
	var layers = imagestack.length;
	if (mapzidx != undefined) layers = mapzidx.length;
	var originy = imagestack[0][0].y;
	var image0 = imagestack[0][1];
	var slope = image0.slope;
	var intercept = image0.intercept;
	var layer_y = toNumber(y - originy, yspacing);
	var rows_y = layers;
	var cols_y = rows;
	//console.log(rows_y, cols_y);
	//const outPut0 = new Array(rows_y * cols_y);
	const outPut = new Array(rows_y * cols_y);
	if (mapzidx != undefined) {
		for (var j = 0; j < rows_y; j++) {
			var j1 = mapzidx[j][1];
			var j2 = mapzidx[j][3];
			var r1 = mapzidx[j][2];
			var r2 = mapzidx[j][4];
			for (var i = 0; i < cols_y; i++) {
				var v1 = (imagestack[j1][1]).getPixelData[i * rows + layer_y];
				var v2 = (imagestack[j2][1]).getPixelData[i * rows + layer_y];
				//outPut0[j * cols_y + i] = v1 * r1 + v2 * r2;
				outPut[(rows_y - 1 - j) * cols_y + cols_y - 1 - i] = v1 * r1 + v2 * r2;
			}
		}
		//coordinate conversion
		/*
		for (var j = 0; j < rows_y; j++) {
			for (var i = 0; i < cols_y; i++) {
			outPut[j * cols_y + i] = outPut0[(rows_y-j)* cols_y + cols_y-i];
			}
		}	
		*/

	} else {
		for (var j = 0; j < rows_y; j++) {
			for (var i = 0; i < cols_y; i++) {
				//outPut[j*rows_y+i] = j*rows*cols+i*cols+layer_y;
				//outPut[j * rows_y + i] = (imagestack[j][1]).getPixelData[i * cols_y + layer_y];
				outPut[j * cols_y + i] = (imagestack[j][1]).getPixelData[i * rows + layer_y];
			}
		}
	}

	//console.log(outPut);
	let image = {
		isRaw: false,
		height: rows_y,
		width: cols_y,
		windowCenter: windowCenter,
		windowWidth: windowWidth,
		slope: slope,
		intercept: intercept,

		origin: origin, //[origin.z, origin.x, origin.y],
		slicelocation: origin.y,
		rows: rows_y,
		columns: cols_y,
		xspacing: xspacing, //zspacing,
		yspacing: yspacing, //xspacing,
		zspacing: zspacing, //yspacing,
		getPixelData: outPut
	};
	var promise = new Promise((resolve) => {
		resolve(image);
	});
	return promise;
};

function calczslicesratio(imagestack, zspacing, mapzidx) {

	var len = imagestack.length;
	if (len < 1) return;
	for (let i = 0; i < len - 1; i++) {
		mapzidx.push([i, i, 1.0, i, 0]);
		var span = imagestack[i + 1][0].z - imagestack[i][0].z;
		var inserts = Math.floor(span / zspacing) - 1;
		if (inserts < 0) {
			//mapzidx.push([i,i,1.0,i,0]);
			console.log("small spacing", span, zspacing);
			continue;
		}
		var ratio = 1.0 / (inserts + 1);
		for (var j = 0; j < inserts; j++) {
			mapzidx.push([i, i, (inserts - j) * ratio, i + 1, (j + 1) * ratio]);
		}
	}
	mapzidx.push([len - 1, len - 1, 1, len - 1, 0]);
}


function slicezfloor(imagestack, cols, rows, origin, z, zspacing, windowCenter, windowWidth, mapzidx) {
	var layers = imagestack.length;
	var originz = imagestack[0][0].z;
	var image0 = imagestack[0][1];
	var slope = image0.slope;
	var intercept = image0.intercept;
	var layer_z = toNumber(z - origin.z, zspacing);
	var rows_z = rows;
	var cols_z = cols;
	const outPut = new Array(rows_z * cols_z);
	if (mapzidx !== undefined) {

		for (var j = 0; j < rows_z; j++) {
			for (var i = 0; i < cols_z; i++) {
				var z1 = mapzidx[layer_z][1];
				var z2 = mapzidx[layer_z][3];
				var r1 = mapzidx[layer_z][2];
				var r2 = mapzidx[layer_z][4];

				var v1 = (imagestack[z1][1]).getPixelData[j * cols_z + i];
				var v2 = (imagestack[z2][1]).getPixelData[j * cols_z + i];
				outPut[j * cols_z + i] = v1 * r1 + v2 * r2;
			}
		}
	} else {

		for (var j = 0; j < rows_x; j++) {
			for (var i = 0; i < cols_x; i++) {

				outPut[j * cols_z + i] = (imagestack[layer_z][1]).getPixelData[j * cols_z + i];
			}
		}
	}


	let image = {
		isRaw: false,
		height: rows_z,
		width: cols_z,
		windowCenter: windowCenter,
		windowWidth: windowWidth,
		slope: slope,
		intercept: intercept,

		origin: [origin.x, origin.y, origin.z],
		slicelocation: origin.z,
		rows: rows_z,
		columns: cols_z,
		xspacing: xspacing,
		yspacing: yspacing,
		zspacing: zspacing,
		getPixelData: outPut
	};
	var promise = new Promise((resolve) => {
		resolve(image);
	});
	return promise;
};



function slicex(out, imagestack, origin, cols, rows, xs, xspacing, windowCenter, windowWidth, mapzidx) {
	//console.log(xspacing);
	for (var i = 0; i < xs.length; i++) {
		var image = new Object();
		slicexfloor(imagestack, cols, rows, origin, xs[i], xspacing, windowCenter, windowWidth, mapzidx).then(function(
			value) {
			Object.assign(image, value);
			out.push([image.origin, image]);
		});
	}
};

function slicey(out, imagestack, origin, cols, rows, ys, yspacing, windowCenter, windowWidth, mapzidx) {
	for (var i = 0; i < ys.length; i++) {
		var image = new Object();
		sliceyfloor(imagestack, cols, rows, origin, ys[i], yspacing, windowCenter, windowWidth, mapzidx).then(function(
			value) {
			Object.assign(image, value);
			out.push([image.origin, image]);
		});
	}
}

// this is just for test
function slicez(out, imagestack, origin, cols, rows, zs, zspacing, windowCenter, windowWidth, mapzidx) {
	//	var out = [];
	//	for (var i = 0; i < ipps.length; i++) {
	//(rows_y*cols_y);
	//	out=out.concat(slicezfloor(numberofgrid,cols,rows,ipps[i].z,zspacing));
	//	}

	for (var i = 0; i < zs.length; i++) {
		var image = new Object();
		slicezfloor(imagestack, cols, rows, origin, zs[i], zspacing, windowCenter, windowWidth, mapzidx).then(function(
			value) {
			Object.assign(image, value);
			out.push([image.origin, image]);
		});
	}
};

function findminzspacing(ipps, dflt) {

	if (ipps.length < 2) {
		if (typeof dflt === undefined) {
			return 0;
		} else {
			return dflt;
		}
	}
	//console.log(ipps);
	var min = ipps[1].z - ipps[0].z;
	if (min < 0) {
		min = -min;
	}
	for (var i = 2; i < ipps.length; i++) {
		var m = ipps[i].z - ipps[i - 1].z;
		if (m < 0) {
			m = -m;
		}
		if (m < min) {
			min = m;
		}
	}
	if (min > dflt) {
		return dflt;
	}
	return min;
};
