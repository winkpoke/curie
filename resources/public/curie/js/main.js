	//let files = [];
	var isPrimary = true;
	
	var imagestack = [];
	var imageindex = 0;
	var imageindexx = 0;
	var imageindexy = 0;
	var imagezs = [
		[0, null]
	];
	var imageys = [
		[0, null]
	];
	var imagexs = [
		[0, null]
	];
	var imagestackx = [];
	var imagestacky = [];
	var imagestackz = []; // new imagestack
	var ipps = [];
	var mapzidxratio = [];

	var spacingxyz = [];
	var origin = [0, 0, 0];
	var xslices = [];
	var yslices = [];
	var zslices = [];
	
	var rows = 512;
	var cols = 512;
	var width = 512;
	var height = 512;
	var windowCenter = 0;
	var windowWidth = 2000;

	// View parameters
	var zoomScale = 1;
	var zoomCenterX = 256;
	var ZoomCenterY = 256;

	//var theTop, theLeft, theBottom, theRight;
	
	var inix = 0.5; //Math.random() ;
	var iniy = 0.5; //Math.random();
	var iniz = 0.5; //Math.random() 

	var imagestack1 = [];
	var imageindex1 = 0;
	var imageindexx1 = 0;
	var imageindexy1 = 0;
	var imagezs1 = [
		[0, null]
	];
	var imageys1 = [
		[0, null]
	];
	var imagexs1= [
		[0, null]
	];
	var imagestackx1 = [];
	var imagestacky1 = [];
	var imagestackz1 = []; // new imagestack
	var ipps1 = [];
	var mapzidxratio1 = [];
	
	
	var spacingxyz1 = [];
	var origin1 = [0, 0, 0];
	var xslices1 = [];
	var yslices1 = [];
	var zslices1 = [];	
		
	
	
	var imagestack2 = [];
	var imageindex2 = 0;
	var imageindexx2 = 0;
	var imageindexy2 = 0;
	var imagezs2 = [
		[0, null]
	];
	var imageys2 = [
		[0, null]
	];
	var imagexs2= [
		[0, null]
	];
	var imagestackx2 = [];
	var imagestacky2 = [];
	var imagestackz2 = []; // new imagestack
	var ipps2 = [];
	var mapzidxratio2 = [];
	
	
	var spacingxyz2 = [];
	var origin2 = [0, 0, 0];
	var xslices2 = [];
	var yslices2 = [];
	var zslices2 = [];
	
	
	///////////////////////////

	function reset() {
		//files.length = 0;
		isPrimary = true;
		
		imagestack.length = 0;
		imagestackx.length = 0;
		imagestacky.length = 0;
		ipps.length = 0;
		xslices.length = 0;
		yslices.length = 0;
		zslices.length = 0;
		mapzidxratio.length = 0;
		
		imagestack1.length = 0;
		imagestackx1.length = 0;
		imagestacky1.length = 0;
		ipps1.length = 0;
		xslices1.length = 0;
		yslices1.length = 0;
		zslices1.length = 0;
		mapzidxratio1.length = 0;	
		
		imagestack2.length = 0;
		imagestackx2.length = 0;
		imagestacky2.length = 0;
		ipps2.length = 0;
		xslices2.length = 0;
		yslices2.length = 0;
		zslices2.length = 0;
		mapzidxratio2.length = 0;	
			
		
		zoomScale = 1;
		ZoomCenterX=256;
		ZoomCenterY=256;
		switchps();
	}

	$('input[type=file]').change(function() {
		alert("Start read dicom files");
		//readDICOM();
	});

	function getCursorPos(e, img) {
		var a, x = 0,
			y = 0;
		e = e || window.event;
		/*get the x and y positions of the image:*/
		a = img.getBoundingClientRect();
		/*calculate the cursor's x and y coordinates, relative to the image:*/
		x = e.pageX - a.left;
		y = e.pageY - a.top;
		/*consider any page scrolling:*/
		x = x - window.pageXOffset;
		y = y - window.pageYOffset;
		return {
			x: x,
			y: y
		};
	}


	function resetSel() {
		if(isPrimary==true)
			fillWL(600,200);
		else
			fillWL(2,0.5);
	}
	
	function switchps() {	
		if(isPrimary == true){
			imagestack = imagestack1;
			imageindex = imageindex1;
			imageindexx = imageindexx1;
			imageindexy = imageindexy1;
			imagezs = imagezs1;
			imageys = imageys1;
			imagexs = imagexs1;
			imagestackx = imagestackx1;
			imagestacky = imagestacky;
			imagestackz = imagestackz1;  
			ipps = ipps1;
			mapzidxratio = mapzidxratio1;
			spacingxyz = spacingxyz1;
			origin = origin1;
			xslices = xslices1;
			yslices = yslices1;
			zslices = zslices1;
		}
		else{
			imagestack = imagestack2;
			imageindex = imageindex2;
			imageindexx = imageindexx2;
			imageindexy = imageindexy2;
			imagezs = imagezs2;
			imageys = imageys2;
			imagexs = imagexs2;
			imagestackx = imagestackx2;
			imagestacky = imagestacky2;
			imagestackz = imagestackz2;  
			ipps = ipps2;
			mapzidxratio = mapzidxratio2;
			spacingxyz = spacingxyz2;
			origin = origin2;
			xslices = xslices2;
			yslices = yslices2;
			zslices = zslices2;	
		}
	}
	
	function prepareData() {
		console.log("Prepare data for ", (isPrimary== true)? "primary":"secondary");
        var layers = imagestack.length;
		if (layers == 0) {
			alert("Data not loaded!");
			return;
		}
		resetSel();
		imagestack.sort(compareImage); //;function(a,b){a[0]>b[0];})
		ipps.sort(compareIPP);
		var image = imagestack[0][1];
		xspacing = image.xspacing;
		yspacing = image.yspacing;
		zspacing = image.zspacing;
		var minzspacing = findminzspacing(ipps, zspacing);
		zspacing = minzspacing;
		var minspacing = Math.min(xspacing, yspacing, zspacing);
		zspacing = minspacing;
		console.log(zspacing);
		spacingxyz = new vec3(xspacing, yspacing, zspacing);
		width = image.width;
		height = image.height;
		rows = image.rows;
		cols = image.columns;
		origin = imagestack[0][0];
		xslices = new Array(rows);
		yslices = new Array(cols);
		for (var i = 0; i < rows; i++) {
			xslices[i] = [origin.x + i * xspacing];
		}
		for (var i = 0; i < cols; i++) {
			yslices[i] = [origin.y + i * yspacing];
		}
		curx = xslices[Math.floor(rows / 2)];
		cury = yslices[Math.floor(cols / 2)];

		windowCenter = image.windowCenter;
		windowWidth = image.windowWidth;
		fillWL(image.windowWidth, image.windowCenter);
		showPatientInfo(image);
		calczslicesratio(imagestack, zspacing, mapzidxratio);
		zslices = new Array(mapzidxratio.length);
		for (var i = 0; i < zslices.length; i++) {
			zslices[i] = [origin.z + i * zspacing];
		}
	}
	function showPatientInfo(image){
		document.getElementById("patientnm").textContent = image.patinfo[0];
		document.getElementById("patientid").textContent = image.patinfo[1];
	}

	function checkdata() {

		if (imagestack.length == 0) {
			alert("No data loaded!");
			return false;
		}
		if (spacingxyz.length == 0 || spacingxyz[0] == 0 || spacingxyz[1] == 0 || spacingxyz[2] == 0) {
			alert("data is corrupt!");
			return false;
		}
	}

	function displayCurView(sliderpos, viewid) {
		if (checkdata() == false) return;

		if (viewid == "T") {
			var zi = Math.floor(sliderpos / 100. * zslices.length);
			displayZNext(zi);
		}

		if (viewid == "S") {

			var yi = Math.floor(sliderpos / 100. * yslices.length);
			displayYNext(yi);
		}

		if (viewid == "C") {

			var xi = Math.floor(sliderpos / 100. * xslices.length);
			displayXNext(xi);
		}

	}
	function displayview(sliderpos, viewid) {
		if (checkdata() == false) return;

		if (viewid == "T") {
			var xi = Math.floor(sliderpos / 100. * xslices.length);
			displayXNext(xi);
			
			var yi = Math.floor(sliderpos / 100. * yslices.length);
			displayYNext(yi);
		}

		if (viewid == "S") {
			var zi = Math.floor(sliderpos / 100. * zslices.length);
			displayZNext(zi);
			var xi = Math.floor(sliderpos / 100. * xslices.length);
			displayXNext(xi);
		}

		if (viewid == "C") {
			var yi = Math.floor(sliderpos / 100. * yslices.length);
			displayYNext(yi);
			var zi = Math.floor(sliderpos / 100. * zslices.length);
			displayZNext(zi);
		}
	}
	
	function addWL(deltaw, deltac) {
		document.getElementById("wwidth").value = windowWidth+deltaw;
		document.getElementById("wcenter").value = windowCenter+deltac;
	}
	
	function fillWL(ww, wc) {
		document.getElementById("wwidth").value = ww;
		document.getElementById("wcenter").value = wc;
	}

	function display() {
		//	setTimeout(function() {
		if (checkdata() == false) return;
		displayImage(imagestack[0][1], "T");

		var xi = Math.floor(inix * xslices.length);
		//for memory and speed only get 1 slice.
		if (imagestackx.length == 0) {
			slicex(imagestackx, imagestack, origin, cols, rows, xslices[xi], spacingxyz.x,
				windowCenter, windowWidth, mapzidxratio);
		}

		var yi = Math.floor(iniy * yslices.length);
		//for memory and speed only get 1 slice.
		if (imagestacky.length == 0) {
			slicey(imagestacky, imagestack, origin, cols, rows, yslices[yi], spacingxyz.y,
				windowCenter, windowWidth, mapzidxratio);
		}

		var zi = Math.floor(iniz * imagestackz.length);
		var zs = [zslices[zi]];
		slicez(imagezs, imagestack, origin, cols, rows, zs[0], spacingxyz.z,
			windowCenter, windowWidth, mapzidxratio);

		var ys = [yslices[yi]];
		slicey(imageys, imagestack, origin, cols, rows, ys[0], spacingxyz.y,
			windowCenter, windowWidth, mapzidxratio);
		var xs = [xslices[xi]];
		slicex(imagexs, imagestack, origin, cols, rows, xs[0], spacingxyz.x,
			windowCenter, windowWidth, mapzidxratio);
	}

	function showTSC() {
		if (imagestack.length == 0) {
			alert("Load data first!");
			return;
		}

		if (imagestackx.length == 0 && imagestacky.length == 0) {
			alert("Data not ready!");
			return;
		}

		displayT();
		displayS();
		displayC();
	}

	function displayT() {
		var idx = imagezs.length - 1;
		if (idx >= 0) {
			displayImage((imagezs[idx])[1], "T");
		}
	}

	function displayC() {
		var imagec;
		var len = imagestackx.length;
		if (len > 0) {
			len = Math.max(len - 1, 0);
			imagec = imagestackx[len][1];
			displayImage(imagec, "C");
		}
	}

	function displayS() {
		var images;
		len = imagestacky.length;
		if (len > 0) {
			len = Math.max(len - 1, 0);
			images = imagestacky[len][1];
			displayImage(images, "S");
		}
	}

	function displayZNext(zi) {
		var idx = imagezs.length - 1;
		if (idx >= 0) {
			displayImage((imagezs[idx])[1], "T");
		}
		var zs = [zslices[zi]];
		slicez(imagezs, imagestack, origin, cols, rows, zs[0], spacingxyz.z,
			windowCenter, windowWidth, mapzidxratio);
	}

	function displayYNext(yi) {
		var idx = imageys.length - 1;
		if (idx >= 0) {
			displayImage((imageys[idx])[1], "S");
		}
		var ys = [yslices[yi]];
		slicey(imageys, imagestack, origin, cols, rows, ys[0], spacingxyz.y,
			windowCenter, windowWidth, mapzidxratio);
	}

	function displayXNext(xi) {
		var idx = imagexs.length - 1;
		if (idx >= 0) {
			displayImage((imagexs[idx])[1], "C");
		}
		var xs = [xslices[xi]];
		slicex(imagexs, imagestack, origin, cols, rows, xs[0], spacingxyz.x,
			windowCenter, windowWidth, mapzidxratio);
	}

	function readDICOM(fs) {
		let files = [];
		//if (imageindex == 0) 
		{
			//files = document.getElementById("file").files;
			files=fs;
		}
		if (imageindex >= files.length) {
			imageindex = 0;
		}
		if (files && files.length > 0 && files.length > imageindex) {
			for (imageindex = 0; imageindex < files.length; imageindex++) {
				var image = new Object();
				parseFile(files[imageindex], image);

			}
		}

	}

	function compareImage(a, b) {
		let comparison = 0;
		if (Math.floor(a[0].z * 1000) > Math.floor(b[0].z * 1000)) {
			comparison = 1;
		} else if (Math.floor(a[0].z * 1000) < Math.floor(b[0].z * 1000)) {
			comparison = -1;
		}
		return comparison;
	}

	function compareIPP(a, b) {
		let comparison = 0;
		if (Math.floor(a.z + 1000.0) > Math.floor(b.z + 1000.0)) {
			comparison = 1;
		} else if (Math.floor(a.z + 1000.0) < Math.floor(b.z + 1000.0)) {
			comparison = -1;
		}
		return comparison;
	}

	function getCanvas(element, height, width) {
		var eleid = element.id;
		var firstCanvasId = 'canvas' + eleid;
		var canvas = document.getElementById(firstCanvasId);
		var existingCanvas = canvas != null;
		if (!existingCanvas) {
			alert("create new canvas");
			canvas = document.createElement('canvas');
			canvas.id = 'canvas' + element.id;
			canvas.style.display = 'block';
			canvas.height = height;
			canvas.width = width;	
			element.appendChild(canvas);
		}
		if( canvas.height != height || canvas.width != width )
		{
			canvas.height = height;
			canvas.width = width;
		}
		//canvas.addEventListener("click", setup, false);
		// //	setupMouseEvent(canvas);
		var secondCanvasId = firstCanvasId + '2';
		var canvas2 = document.getElementById(secondCanvasId);
		if( canvas2.height != height || canvas2.width != width )
		{
			canvas2.height = height;
			canvas2.width = width;
		}

		var thirdCanvasId = firstCanvasId + '3';
		var canvas3 = document.getElementById(thirdCanvasId);
		if( canvas3.height != height || canvas3.width != width)
		{
			canvas3.height = height;
			canvas3.width = width;
		}
		//alert(""+canvas3.height+":"+ canvas3.width );
		setup(canvas3);
		if(isPrimary == true )
			return canvas;
		else 
			return canvas2;
	}
	function updateWL(image){
		var ww = document.getElementById("wwidth").value;
		var wc = document.getElementById("wcenter").value;
		if (!isNaN(ww) && !isNaN(wc)) {
			image.windowWidth = ww;
			image.windowCenter = wc;
		}
		
	}
	function pixeltoGrayscale(image) {
		updateWL(image);
		var minWin = image.windowCenter - image.windowWidth / 2;
		var pixels = image.getPixelData;
		var data = [];
		var numPixels = image.width * image.height;
		//console.log(numPixels);
		for (var i = 0; i < numPixels; ++i) {
			var j = i * 4;
			var val = image.isRaw ? swap //No need to swap
				(pixels[i]) : (pixels[i]);
			val = val * image.slope + image.intercept;
			val = Math.round(255 * (val - minWin) / image.windowWidth);//255

			// Modify pixel data
			/*
			buffer.data[j + 0] = val; // R value
			buffer.data[j + 1] = val; // G value
			buffer.data[j + 2] = val; // B value
			buffer.data[j + 3] = 255; // A value
			*/
			data[j + 0] = val; // R value
			data[j + 1] = val; // G value
			data[j + 2] = val; // B value
			data[j + 3] = 255; // A value
		}
		return data;
	}

	function render(image, buffer, ctx, transform) {
		console.log(zoomScale);
		updateWL(image);
		var scaleh = zoomScale;
		var scalew = zoomScale;
		var cw1 = ctx.canvas.width;
		var ch1 = ctx.canvas.height;
		var cw2 = Math.ceil(cw1 * scalew);
		var ch2 = Math.ceil(ch1 * scaleh);
		var pixels = image.getPixelData;
		var minWin = image.windowCenter - image.windowWidth / 2;
		// copy each source pixel from c1's data1 into the c2's data2   
		if( isPrimary == true ){
			for (var y = 0; y < ch2; y++) {
				for (var x = 0; x < cw2; x++) {
					var i = (Math.floor(y / scaleh) * cw1 + Math.floor(x / scalew));
					var j = i * 4;
					var i2 = (y * cw2 + x) * 4;
					var val =  pixels[i] * image.slope + image.intercept;
					val = Math.round(255 * (val - minWin) / image.windowWidth);
					buffer.data[i2] = val;
					buffer.data[i2 + 1] = val/2;//val;
					buffer.data[i2 + 2] = val/3;//val;
					buffer.data[i2 + 3] = 255;
				}
			}
		}
		else{
			
				for (var y = 0; y < ch2; y++) {
					for (var x = 0; x < cw2; x++) {
						var i = (Math.floor(y / scaleh) * cw1 + Math.floor(x / scalew));
						var j = i * 4;
						var i2 = (y * cw2 + x) * 4;
						var val =  pixels[i] * image.slope + image.intercept;
						val = Math.round(255 * (val - minWin) / image.windowWidth);
						buffer.data[i2] = val/3;
						buffer.data[i2 + 1] = val/2;//val;
						buffer.data[i2 + 2] = val;//val;
						buffer.data[i2 + 3] =155;
					}
			}	
		}

		// Draw image buffer data to the canvas	
		//ctx.setTransform(1, 0, 0, 1, 0, 0);
		// Clear the canvas
		ctx.fillStyle = 'black'; //'white';'transparent';
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		/*
		if( rotate ){
			// var tmpCanvas = memdraw(buffer, ctx.canvas.width, ctx.canvas.height);
			rotate(ctx,tmpConvas,90);
			
		} else 
		*/
		{
			var centerx = cw1 * scalew / 2;
			var centery = ch1 * scaleh / 2;
			var left = cw1/ 2 - centerx;
			var top = ch1 / 2 - centery;
			//left = (cw1 / 2 - zoomCenterX)*scalew;
			//top  = (ch1 / 2 - ZoomCenterY)*scaleh;
			//left -=  zoomCenterX/4;
			//top  -=  ZoomCenterY/4;	
			//console.log(zoomCenterX);
	        var posx= left + transform.x;
			var posy= top + transform.y;
			posx = left + cw1 / 2 - image.width / 2;
			posy = top + ch1 / 2 - image.height / 2;
			ctx.putImageData(buffer, posx, posy );
		}

		//document.getElementById('window').textContent = "Window Width/Center: " + Math.round(image.windowWidth) +
		//	"/" + Math.round(image.windowCenter);
		document.getElementById('wwidth').textContent = windowWidth;
		document.getElementById('wcenter').textContent = windowCenter;
	}
/*
	function sleep(delay) {
		//delay ms
		var start = (new Date()).getTime();
		while ((new Date()).getTime() - start < delay) {
			continue;
		}
	}
	// https://zeit.co/blog/async-and-await
	function sleep2(time) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}
*/	
	function scaleImage(cw1, ch1, c2, data1, scalew, scaleh, ctx) {
		var ctx2 = c2.getContext('2d');
		var imgData2 = ctx2.getImageData(0, 0, cw2, ch2);
		var data2 = imgData2.data;

		var cw2 = c2.width = Math.ceil(cw1 * scalew);
		var ch2 = c2.height = Math.ceil(ch1 * scaleh);

		// copy each source pixel from c1's data1 into the c2's data2   
		for (var y = 0; y < ch2; y++) {
			for (var x = 0; x < cw2; x++) {
				var i1 = (Math.floor(y / scaleh) * cw1 + Math.floor(x / scalew)) * 4;
				var i2 = (y * cw2 + x) * 4;
				data2[i2] = data1[i1];
				data2[i2 + 1] = data1[i1 + 1];
				data2[i2 + 2] = data1[i1 + 2];
				data2[i2 + 3] = data1[i1 + 3];
			}
		}

		// put the modified pixels back onto c2
		ctx2.canvas.width = cw1;
		ctx2.canvas.height = ch1;
		var centerx = cw1 * scalew / 2;
		var centery = ch1 * scaleh / 2;
		if (scalew > 1 || scaleh > 1) {
			centerx = ctx2.canvas.width / 2 - centerx;
			centery = ctx2.canvas.height / 2 - centery;
		}
		ctx.fillStyle = 'black'; //'white';'transparent';
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.putImageData(imgData2, centerx, centery);
	}

	function memdraw(buffer, w, h) {
		var tmpCanvas = document.createElement('canvas');
		tmpCanvas.height = h;
		tmpCanvas.width = w;
		var tmpCtx = tmpCanvas.getContext('2d');
		tmpCtx.fillStyle = 'red'; //'black';'transparent';
		tmpCtx.fillRect(0, 0, w, h);
		if (buffer !== null)
			tmpCtx.putImageData(buffer, 0, 0);
		drawRect(tmpCtx, 5, 20);
		return tmpCanvas;
	}

	function show() {
		display();
		showTSC();
	}

	function WLChange2() {
		show();
	}

	function rotate(ctx, tmpCanvas, degree) {
		ctx.translate(ctx.canvas.width, 0);
		ctx.rotate(degree * Math.PI / 180);
		ctx.drawImage(tmpCanvas, 50, 50)
		ctx.rotate(-degree * Math.PI / 180);
	}

	function displayImage(image, viewid) {
		var element = document.getElementById(viewid);
		var canvas = getCanvas(element, image.height, image.width);
		var ctx = canvas.getContext('2d');
		if(zoomScale>10){
			alert("Max zoom reached - ", zoomScale);
			//return;
			zoomScale = 10;
		}
		
		var buffer = ctx.createImageData(Math.ceil(image.width * zoomScale), Math.ceil(image.height * zoomScale)); ///////////!!!!!!!////
		var transform = {transform:false,x:0,y:0};
		render(image, buffer, ctx, transform);
		var x = document.getElementById('INPUT' + viewid);
		var v = document.getElementById("slice" + viewid);
		if (v == null) {
			v = document.createElement("input");
			v.type = "text";
			v.value = "50%";
			v.size = 3;
			v.setAttribute("id", "slice" + viewid);
		}
		if (x == null) {
			x = document.createElement("input");
			x.setAttribute("id", "INPUT" + viewid);
			x.setAttribute("type", "range");
			x.setAttribute("class", "slider");
			x.setAttribute("step","2");////
			x.oninput = function() {
				var output = document.getElementById("slice" + viewid);
				output.value = this.value + "%";
				displayview(this.value, viewid);
			}
			element.appendChild(v);
			element.appendChild(x);
		}
		var lastX;
		var lastY;
		
		// add event handlers to mouse move to adjust window/center
		document.getElementById("TSC3D").addEventListener('mousedown', function(e) {
			lastX = e.offsetX//e.pageX;
			lastY = e.offsetY//e.pageY;
			
			//alert("Mouse down");
			function mouseMoveHandler(e) {
			//	if (e.ctrlKey == false || e.shiftKey == false)
			//		return;
				if(e.ctrlKey == true ){
					//alert("ctrlKey");
					const deltaX = e.offsetX - lastX;
					const deltaY = e.offsetY - lastY;
					console.log(deltaX +"," + deltaY);
					//lastX = e.pageX;
					//lastY = e.pageY;
					addWL(deltaX, deltaY);
	
					transform.x = 0;
					transform.y = 0;	
					render(image, buffer, ctx, transform);	
				} else	if(e.shiftKey == true ){
					//alert("shiftKey");
					transform.x = e.offsetX;
					transform.y = e.offsetY;	
					render(image, buffer, ctx, transform);	
				}
				
			}

			function mouseUpHandler() {
				canvas.invalid = false;
				document.getElementById("TSC3D").removeEventListener('mousemove', mouseMoveHandler);
				document.getElementById("TSC3D").removeEventListener('mouseup', mouseUpHandler);
			}

			document.getElementById("TSC3D").addEventListener('mousemove', mouseMoveHandler);
			document.getElementById("TSC3D").addEventListener('mouseup', mouseUpHandler);

		});

	}

	/*
	function mouseWheel(){
		function wheel(event){
			var delta = 0;
			if (!event) event = window.event;
			if (event.wheelDelta) {
				delta = event.wheelDelta/120; 
			} else if (event.detail) {
				delta = -event.detail/3;
			}
			if (delta)
				handle(delta);
		        if (event.preventDefault)
		                event.preventDefault();
		        event.returnValue = false;
		}
	
	/* Initialization code. */
	/*		if (window.addEventListener)
				window.addEventListener('DOMMouseScroll', wheel, false);
			window.onmousewheel = document.onmousewheel = wheel;
			
		}
	*/


	function swap(val) {
		return ((val & 0xff) << 8) | ((val >> 8) & 0xff);
	}

	function _swap16(val) {

		return ((val & 0xff) << 8) | ((val >> 8) & 0xff);

	}

	function _swap32(val) {

		return (
			((val & 0xff) << 24) | ((val & 0xff00) << 8) | ((val >> 8) & 0xff00) | ((val >> 24) & 0xff)
		);
	}

	// Converts image to canvas; returns new canvas element
	function convertImageToCanvas(image) {
		var canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;
		canvas.getContext("2d").drawImage(image, 0, 0);

		return canvas;
	}
	var zoomingCanvas="";
	function convertCanvasToImage(canvas) {
		var image = new Image();
		image.src = canvas.toDataURL("image/png");
		img.crossOrigin = "anonymous";
		return image;
	}

	////////
	function setup(cnvs) {
		setupMouseEvent(cnvs);
	}
	var mouseDown = false;
	function setupMouseEvent(canvas) {
		var startX = 0;
		var startY = 0;
		var ctxT2 = canvas.getContext("2d");

		canvas.addEventListener("mousedown", handleMouseDown, false); // click and hold to pan
		canvas.addEventListener("mousemove", handleMouseMove, false);
		canvas.addEventListener("mouseup", handleMouseUp, false);
		canvas.addEventListener("mouseout", handleMouseOut, false);
		//canvas.addEventListener("mousewheel", handleMouseWheel, false); // mousewheel duplicates dblclick function
		//canvas.addEventListener("DOMMouseScroll", handleMouseWheel, false); // for Firefox
		//canvas.addEventListener("dblclick", handleDblClick, false); // dblclick to zoom in at point, shift dblclick to zoom out.	

		function drawRect(ctx, x, y) {
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.beginPath();
			var width = x - startX;
			var height = y - startY;
			ctx.rect(startX, startY, width, height);
			ctx.strokeStyle = 'white';
			ctx.lineWidth = 1;
			ctx.stroke();
		}

		function handleMouseDown(e) {
			if (e.ctrlKey == true || e.shiftKey == true)
				return;
			bDone = false;
			mouseDown = true;
			this.style.cursor = "crosshair";

			mouseX = parseInt(e.clientX); // - offsetX);
			mouseY = parseInt(e.clientY); //- offsetY);

			startX = mouseX;
			startY = mouseY;				
			ctxT2.clearRect(0, 0, canvas.width, canvas.height);
		}

		function handleMouseUp(e) {
			if(mouseDown == false)
				return;
			if (e.ctrlKey == true || e.shiftKey == true)
				return;
			zoomingCanvas = e.srcElement.id;
			//alert(zoomingCanvas);	
			this.style.cursor = "auto";
			mouseDown = false;
			mouseX = parseInt(e.clientX); // - offsetX);
			mouseY = parseInt(e.clientY); // - offsetY);

			drawRect(ctxT2, mouseX, mouseY);
			ctxT2.clearRect(0, 0, canvas.width, canvas.height);
			//alert( startX +',' + startY +' ; '+ mouseX +',' + mouseY);
		
			var xShift = Math.abs(mouseX - startX);
			var yShift = Math.abs(mouseY - startY);
			if(xShift<10 || yShift <10) return;	
			zoomCenterX = Math.floor((startX+mouseX)/2);
			zoomCenterY = Math.floor((startY+mouseY)/2);
			var xscale = canvas.width / xShift;
			var yscale = canvas.height / yShift;
			//alert(xscale + "," + yscale);
			zoomScale *= xscale < yscale ? xscale : yscale;
			if (zoomScale > 10){
				zoomScale = 10;
				//alert("Max reaches: " + zoomScale +"X");
				//return;
			}
	
			showTSC();
		
			//canvas.invalid = false;
			//canvas.removeEventListener('mousemove', handleMouseMove);
			//canvas.removeEventListener('mouseup', handleMouseUp);
			//canvas.removeEventListener('mousedown', handleMouseDown);
			//canvas.removeEventListener('mouseout', handleMouseOut);
			/*	*/
		}

		function handleMouseOut(e) {
			if (e.ctrlKey == true || e.shiftKey == true)
				return;
			mouseDown = false;
			mouseX = parseInt(e.clientX); //- offsetX);
			mouseY = parseInt(e.clientY); // - offsetY);
			// Put your mouseup stuff here
			//drawRect(ctxT2, mouseX, mouseY);
			//ctxT2.clearRect(0, 0, canvas.width, canvas.height);
		}

		function handleMouseMove(e) {
			if (e.ctrlKey == true || e.shiftKey == true)
				return;
			ctxT2.clearRect(0, 0, canvas.width, canvas.height);
			mouseX = parseInt(e.clientX); // - offsetX);
			mouseY = parseInt(e.clientY); // - offsetY);

			// Put your mousemove stuff here
			if (mouseDown) {
				
				drawRect(ctxT2, mouseX, mouseY);
			}

		}
	}


	function ZoomIn() {
		zoomScale *= 1.2;
		/*
		if( zoomScale < .91){
			zoomScale += 0.1;	
		}
		 else if(zoomScale < 10)
		{
			zoomScale +=1;   
		}
		*/
		if (zoomScale > 10.1){
			zoomScale = 10;
			alert("Max reaches: " + zoomScale +"X");
			return;
		}
		showTSC();
	}

	function ZoomOut() {
		zoomScale /= 1.2;
		/*
		if( zoomScale <= 1.1) 
		  zoomScale -= 0.1;
		else if(zoomScale >= 2) {
			zoomScale -=1;
		}
		*/
		if (zoomScale < 0.1){
			zoomScale = 0.1;
			alert("Min reaches: " + zoomScale +"X");
			return;
		}
		showTSC();
	}

	function resetZoom() {
		zoomScale = 1;
		if(isPrimary== true){
			windowCenter=60;
			windowWidth=400;
		}
		else{
			windowCenter = 0.5;
			windowWidth = 1;	
		}
		showTSC();
	}
	function onPrimary(){
		isPrimary = true;
	}
	function onSecondary(){
		isPrimary = false;
	}
	function resetPan() {
		windowCenter=60;
		windowWidth=400;
		showTSC();
	}
	function setBkColor(color,id1,id2){
		document.getElementById(id1).style.backgroundColor= color;
		if(id2 !== undefined )
			document.getElementById(id2).style.backgroundColor= color;
	}

/*
	function getCursorPos(e) {
			var a, x = 0,
				y = 0;
			e = e || window.event;
			//get the x and y positions of the image:
			a = img.getBoundingClientRect();
			//calculate the cursor's x and y coordinates, relative to the image:
			x = e.pageX - a.left;
			y = e.pageY - a.top;
			//consider any page scrolling:
			x = x - window.pageXOffset;
			y = y - window.pageYOffset;
			return {
				x: x,
				y: y
			};
		}
	} 
*/
