	function parseFile(file, image) {
			var filename = file.name;
			var reader = new FileReader();
			reader.onload = function(file) {
				var arrayBuffer = reader.result;
				var byteArray = new Uint8Array(arrayBuffer);
				// set a short timeout to do the parse so the DOM has time to update itself with the above message
				setTimeout(
					function() {
						// Invoke the paresDicom function and get back a DataSet object with the contents
						var bRaw = true;
						var dataSet;

						var dicm = dicomParser.readFixedString(byteArray, 0x80, 4);
						//var extension = (filename || '').split('.').pop();// extension.toLowerCase() !== 'dcm'
						if (dicm == 'DICM') {
							bRaw = false;
							dataSet = dicomParser.parseDicom(byteArray);
						} else {

							try {
								// not used
								// assume IMPLICIT_VR_LIT_ENDIAN
								//var byteStream = new dicomParser.ByteStream(dicomParser.littleEndianByteArrayParser, byteArray, 0);
								//dataSet = new dicomParser.DataSet(byteStream.byteArrayParser, byteStream.byteArray, {});
							
								dataSet = dicomParser.parseDicom(byteArray);
								//var rslt = dicomParser.parseDicomDataSetImplicit(dataSet, byteStream, byteStream.byteArray.length);
								bRaw = false;
							} catch (e) {
								
								bRaw = true;
								//TODO handle the exception to confirm it is raw
								dataSet = {};
								var decoder = new TextDecoder("utf-8");
								var encodedString = decoder.decode(arrayBuffer);
								console.log("file length:" + encodedString.length);
								var lines = encodedString.split('\n', 30);
								var foundField = {  "ObjectType":false, 
													"NDims":false, 
													"BinaryData":false, 
													"BinaryDataByteOrderMSB":false, 
													"CompressedData":false, 
													"TransformMatrix":false, 
													"Offset":false, 
													"CenterOfRotation":false, 
													"AnatomicalOrientation":false, 
													"ElementSpacing":false, 
													"DimSize":false, 
													"ElementType":false, 
													"ElementDataFile":false, 
								};
								
								for(var i=0; i<30; i++){
									
									if(foundField["ObjectType"] == false && lines[i].includes("ObjectType")){
										var right = lines[i].split("=")[1].trim();
										dataSet.ObjectType = right;
										foundField["ObjectType"]= true;
									}
									
									if(foundField["NDims"]== false && lines[i].includes("NDims")){
										var val = lines[i].split("=")[1].trim();
										var nDim = parseInt(val);
										dataSet.NDims = nDim;
										foundField["NDims"]= true;
									}
									
									if(foundField["BinaryData"]== false && lines[i].includes("BinaryData") && lines[i].includes("BinaryDataByteOrderMSB")== false){
										var right = lines[i].split("=")[1].trim();
										var isBinaryData = right.toLowerCase() == "true"? true:false;
										dataSet.BinaryData = isBinaryData;
										foundField["BinaryData"]= true;
									}
									if(foundField["BinaryDataByteOrderMSB"]== false && lines[i].includes("BinaryDataByteOrderMSB")){
										var right = lines[i].split("=")[1].trim();
										var isMSB = right.toLowerCase() == "true"? true:false;
										dataSet.BinaryDataByteOrderMSB = isMSB;
										foundField["BinaryDataByteOrderMSB"]= true;
									}
									
									if(foundField["CompressedData"]== false && lines[i].includes("CompressedData")){
										var right = lines[i].split("=")[1].trim();
										var isCompressedData = right.toLowerCase() == "true"? true:false;
										dataSet.CompressedData = isCompressedData;
										foundField["CompressedData"]= true;
									}
									
									if(foundField["TransformMatrix"]== false && lines[i].includes("TransformMatrix")){
										var right = lines[i].split("=")[1].trim();
										var transMatrix = right.split(" ").map(Number);
										dataSet.TransformMatrix = transMatrix;
										foundField["TransformMatrix"]= true;
									}
									if(foundField["Offset"]== false && lines[i].includes("Offset")){
										var right = lines[i].split("=")[1].trim();
										var offset = right.split(" ").map(Number);
										dataSet.Offset = offset;
										foundField["Offset"]= true;
									}

									if(foundField["CenterOfRotation"]== false && lines[i].includes("CenterOfRotation")){
										var right = lines[i].split("=")[1].trim();
										var centerOfRotation = right.split(" ").map(Number);
										dataSet.CenterOfRotation = centerOfRotation;
										foundField["CenterOfRotation"]= true;
									}
									if(foundField["AnatomicalOrientation"]== false && lines[i].includes("AnatomicalOrientation")){
										var right = lines[i].split("=")[1].trim();
										dataSet.AnatomicalOrientation = right;
										foundField["AnatomicalOrientation"]= true;
									}
									if(foundField["ElementSpacing"]== false && lines[i].includes("ElementSpacing")){
										var right = lines[i].split("=")[1].trim();
										var spacing = right.split(" ").map(Number);
										dataSet.ElementSpacing = spacing;
										foundField["ElementSpacing"]= true;
									}
														
									if(foundField["DimSize"]== false && lines[i].includes("DimSize")){
										var right = lines[i].split("=")[1].trim();
										var vals = right.split(" ");
										dataSet.DimSize = vals.map(Number);
										foundField["DimSize"]= true;
									}
									if(foundField["ElementType"]== false && lines[i].includes("ElementType")){
										var right = lines[i].split("=")[1].trim();
										dataSet.ElementType = right;
										foundField["ElementType"]= true;
										/*
										if (format == "unsigned integer" && byte_per_pixel == 8) console.log("ElementType = MET_ULONG");
										else if (format == "unsigned integer" && byte_per_pixel == 4) console.log("ElementType = MET_UINT");
										else if (format == "unsigned integer" && byte_per_pixel == 2) console.log("ElementType = MET_USHORT");
										else if (format == "unsigned integer" && byte_per_pixel == 1) console.log("ElementType = MET_UCHAR");
										else if (format == "integer" && byte_per_pixel == 8)  console.log("ElementType = MET_LONG");
										else if (format == "integer" && byte_per_pixel == 4)  console.log("ElementType = MET_INT");
										else if (format == "integer" && byte_per_pixel == 2)  console.log("ElementType = MET_SHORT");
										else if (format == "integer" && byte_per_pixel == 1)  console.log("ElementType = MET_CHAR"); 
										else if (format == "float" && byte_per_pixel == 4) console.log("ElementType = MET_FLOAT");
										else if (format == "float" && byte_per_pixel == 8) console.log("ElementType = MET_DOUBLE");
										else console.log("ElementType = MET_INT");
										*/
									}
									if(foundField["ElementDataFile"]== false && lines[i].includes("ElementDataFile")){
										var right = lines[i].split("=")[1].trim();
										dataSet.ElementDataFile = right;
										var lineDataFile = lines[i];
										var pos = encodedString.search(lineDataFile) + lineDataFile.length + 1;//'\n' 
										dataSet.Data = arrayBuffer.slice(pos);
										//console.log(dataSet);
										foundField["ElementDataFile"]= true;
										break;
									}
								}
								
								///Example for raw without header
								if( foundField["DimSize"] == false || 
								    foundField["Offset"] == false || 
									foundField["ElementSpacing"] == false || 
									foundField["ElementType"] == false || 
									foundField["Data"] == false 
									) {
									console.log("Header info is incomplete!");
									dataSet["Offset"] = [0,0,0];
									dataSet["DimSize"] = [1024,1024,1];
									dataSet["ElementSpacing"] = [.5,.5,.5];
									dataSet["ElementType"] = "MET_INT";
									dataSet["Data"] = arrayBuffer;
									console.log("Now data is reset to : ", dataSet);
								}
								
								byteArray = null;
								arrayBuffer = null;
							}
						}
						getImagecore(dataSet, bRaw).then(function(value) {
							if( value == null ) {
								console.log("Warning: not a valid image file, skipped");
								return;
							}
							Object.assign(image, value);
							if(image.isRaw == false){
								
								imagestack.push([image.origin, image]);
								//imageindex++;
								ipps.push(image.origin);
							}
							else{
								console.log("raw image process");
								var imagesize = image.height * image.width;
								var rows = image.rows;
								var columns = image.columns;
								var windowCenter = image.windowCenter;
								var windowWidth = image.windowWidth;
								var patinfo = image.patinfo;
								var xSpacing = image.xspacing;
								var ySpacing = image.yspacing;
								var sliceSpacing = image.zspacing;
								for(var zi=0; zi<dataSet.DimSize[2];zi++)
								{
									var origin = new vec3(image.origin[0],image.origin[1], image.slicelocation[zi]);
									ipps.push(origin);
									imageindex++;
									var loc = imagesize*zi;
									let imagei = {
										isRaw: bRaw,
										height: rows,
										width: columns,
										windowCenter: windowCenter,
										windowWidth: windowWidth,
										slope: 1,
										intercept: 0,
										patinfo: patinfo,
										origin: origin,
										slicelocation: origin[2],
										rows: rows,
										columns: columns,
										slices: 1,
										xspacing: xSpacing,
										yspacing: ySpacing,
										zspacing: sliceSpacing,
										getPixelData: image.getPixelData.slice(loc,imagesize+loc)
									};
									var promise = new Promise((resolve) => {
										resolve(imagei);
									});
									promise.then(function(value){
										var image0 = new Object();
										Object.assign(image0, value);
										imagestack.push([origin,image0]);	
									});
								
								}
								console.log(dataSet.DimSize);
							}
	
						});

					},
					50);
			};
			reader['readAsArrayBuffer'](file);
		}
		/*
		function arrayBufferToString( buffer, encoding, callback ) {
			var blob = new Blob([buffer],{type:'text/plain'});
			var reader = new FileReader();
			reader.onload = function(evt){callback(evt.target.result);};
			reader.readAsText(blob, encoding);
		}
		
		//clEnqueueCopyBufferToImage
		//clEnqueueWriteImage
       */
	  
		function getImagecore(dataSet, bRaw) {
			var pixelSpacing = ["1.0", "1.0"];
			var patinfo=["",""];
			if (bRaw) {

				var modality;
				var pn;
				var patId;
				var instanceNum = 1;
				var rows = 512;//3072
				var columns = 512;//3072
				var slices = 512;
				var slicezi=[];
				
				var bitsAlloc = 16;
				var bitsStored = 16;
				var windowWidth = 1; //
				var windowCenter = .5; //
				var intcp = 0;
				var slope = 1;
				//var pixelRepresentation;
				//var sliceThick = 5;
				var sliceSpacing = .5;
				var sliceLoc = 0;
				
				
				var origin = new vec3(dataSet.Offset[0],dataSet.Offset[1],dataSet.Offset[2]);
				rows = dataSet.DimSize[0];
				columns = dataSet.DimSize[1];
				slices = dataSet.DimSize[2];
				var numPixels = rows * columns;
				var xSpacing = dataSet.ElementSpacing[0];
				var ySpacing = dataSet.ElementSpacing[1];
				sliceSpacing = dataSet.ElementSpacing[2];
				//sliceThick = sliceSpacing;

				for(var si=0;si<slices;si++){
					slicezi.push(origin[2] + si* sliceSpacing);
				}
				var pixelData = null;
				if( dataSet.ElementType == "MET_FLOAT"	) {
					pixelData = new Float32Array(dataSet.Data, 0, numPixels*slices);	
				}
				if( dataSet.ElementType == "MET_INT" ){
					pixelData = new Int16Array(dataSet.Data, 0, numPixels*slices);
				}
				if( dataSet.ElementType == "MET_UINT" ){
					pixelData = new Uint16Array(dataSet.Data, 0, numPixels*slices);
				}
				if( dataSet.ElementType == "MET_CHAR" ){
					pixelData = new Int8Array(dataSet.Data, 0, numPixels*slices);
				}
				if( dataSet.ElementType == "MET_UCHAR" ){
					pixelData = new Uint8Array(dataSet.Data, 0, numPixels*slices);
				}
				
				
				let image = {
					isRaw: bRaw,
					height: rows,
					width: columns,
					windowCenter: windowCenter,
					windowWidth: windowWidth,
					slope: slope,
					intercept: intcp,
					patinfo: patinfo,
					origin: origin, //ipp
					slicelocation: slicezi,
					rows: rows,
					columns: columns,
					slices: slices,
					xspacing: xSpacing,
					yspacing: ySpacing,
					zspacing: sliceSpacing,
					getPixelData: pixelData
				};
				var promise = new Promise((resolve) => {
					resolve(image);
				});
				return promise;
			}


			var modality = dataSet.string('x00080060'); //MODALITY

			if(modality != "CT" && modality != "MR") {
				return Promise.resolve(null);
			}
			var pn = dataSet.string('x00100010');
			var patId = dataSet.string('x00100020');
			var sliceThick = dataSet.string('x00180050');
			var sliceSpacing = dataSet.string('x00180088');
			if (sliceThick == undefined) {
				sliceThick = 2.5;
			} else {
				sliceThick = parseFloat(sliceThick);
			}
			if (sliceSpacing == undefined) {
				sliceSpacing = 2.75;
				if (sliceThick > sliceSpacing) {
					sliceSpacing = sliceThick;
				}
			} else {
				sliceSpacing = parseFloat(sliceSpacing);
			}
			var ipp = new vec3(0, 0, 0);
			if (dataSet.elements.x00200032 !== undefined) {
				ipp.x = dataSet.floatString('x00200032', 0);
				ipp.y = dataSet.floatString('x00200032', 1);
				ipp.z = dataSet.floatString('x00200032', 2);
			}
			var slicelocation = dataSet.floatString('x00201041');
			if(ipp.z != slicelocation)
			{
				console.log(ipp.z,slicelocation);
				ipp.z = slicelocation;
			}
			var photometricInterpret = dataSet.string('x00280004'); //MONOCHROME1
			var rows = dataSet.uint16('x00280010'); //ROWS
			var columns = dataSet.uint16('x00280011'); // COLUMNS
			var pixelSpacing2 = dataSet.string('x00280030');
			if( pixelSpacing2 )
				pixelSpacing = pixelSpacing2.split('\\'); //.split("\\").map(parsefloat); //PIXEL SPACING
			var bitsAlloc = dataSet.uint16('x00280100'); //BITS ALLOCATED;
			var bitsStored = dataSet.uint16('x00280101'); //BITS ALLOCATED;
			var pixelRepresentation = dataSet.uint16('x00280103');
			var intcp = 0;
			var slope = 1;
			var windowCenter = parseInt(dataSet.string('x00281050'));
			var windowWidth = parseInt(dataSet.string('x00281051'));

			intcp = dataSet.string('x00281052');
			slope = dataSet.string('x00281053');
			if (intcp == undefined) {
				intcp = 0;
			} else {
				intcp = parseInt(intcp); //RESCALE INTERCEPT //CT/PET
			}
			if (slope == undefined) {
				slope = 1;
			} else {
				slope = parseInt(slope); // RESCALE SLOPE  //CT/PET	
			}

			var pixelDataElement = dataSet.elements.x7fe00010;
			if( pixelDataElement === undefined || pixelDataElement.dataOffset === undefined){
				console.log("no pixel data");
			}
			var buffer = dataSet.byteArray.buffer;
			var dataOffset = pixelDataElement.dataOffset;
			var numPixels = rows * columns;
			var pixelData;
			if (pixelRepresentation === 0 && bitsAlloc === 8) {
				pixelData = new Uint8Array(buffer, dataOffset, numPixels);
			} else if (pixelRepresentation === 0 && bitsAlloc === 16) {
				pixelData = new Uint16Array(buffer, dataOffset, numPixels); ////pixelDataElement.length / 2
			} else if (pixelRepresentation === 1 && bitsAlloc === 8) {
				pixelData = new Int8Array(buffer, dataOffset, numPixels);
			} else if (pixelRepresentation === 1 && bitsAlloc === 16) {
				pixelData = new Int16Array(buffer, dataOffset, numPixels);
			} else {
				throw 'unrecognized image format';
			}

			let image = {
				isRaw: false,
				height: rows,
				width: columns,
				windowCenter: windowCenter,
				windowWidth: windowWidth,
				slope: slope,
				intercept: intcp,
				patinfo:[pn,patId],
				origin: ipp,
				slicelocation: ipp.z,
				rows: rows,
				columns: columns,
				slices:1,
				xspacing: parseFloat(pixelSpacing[0]),
				yspacing: parseFloat(pixelSpacing[1]),
				zspacing: sliceSpacing,
				getPixelData: pixelData
			};

			/*
				var image = new imagecore(
					false,
					rows,
					cols,
					windowCenter,
					windowWidth,
					slope,
					intcp,
					ipp,
					rows,
					cols,
					pixelData
					);
				return image;
			*/
			var promise = new Promise((resolve) => {
				resolve(image);
			});
			return promise;
		}