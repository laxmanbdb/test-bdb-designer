var canvas_error_flag = false;
var analyse_flag = false;
function screenshotCapture() {
	document.getElementById('content-Div').className = '';
	var $frame = $("#contentView iframe");
	if( $frame.length != 0 ) {
		$frame.contents().find("#bizDocBtn").trigger("click");
	} else {
		screenshotClip("div #contentView");//"div #contentView"
	}
}

function screenshotClip( container) 
{
	analyse_flag = parent.$("#ScreenshotButton").attr("bs-analyse");
	if( window.parent.BIZVIZ ) {
		window.parent.BIZVIZ.UTIL.fnShowLoader();
	} else if( window.BIZVIZ ){
		window.BIZVIZ.UTIL.fnShowLoader();
	}
	
	var canvas_array = [];
	var iframe_body;
	var stylesheet_array = [];
	var div_body = $(container);
	debugger;
    html2canvas(div_body, {
        allowTaint: false,
        taintTest: false,
        useCORS: true,
        onrendered: function(canvas) {
    		var imagefinal = canvas.toDataURL('image/jpeg', 1.0);  
    		var delImgs = document.getElementsByClassName('delImgPseudo');
    		while(delImgs.length > 0)
    			{
    				delImgs[0].parentNode.removeChild(delImgs[0]);
    			}
    		if( window.parent.BIZVIZ ) {
    			window.parent.BIZVIZ.UTIL.fnHideLoader();
    		} else if( window.BIZVIZ ){
    			window.BIZVIZ.UTIL.fnHideLoader();
    		}
    		croppie(imagefinal);
		}
	});
}
function croppie(imagefinal){
	var vEl = document.getElementById('resizer-demo'),
	resize = new Croppie(vEl, {
	viewport: { width: 600, height: 400 },
	boundary: { width: 800, height: 480 },
	showZoomer: true,
    enableResize: true,
    enableOrientation: true
});
resize.bind({
    url: imagefinal,
    zoom: 0
});
vEl.addEventListener('update', function (ev) {
	console.log('resize update', ev);
});
$('#resizer-demo').append('<button class="resizer-result btn btn-default" style="position: absolute; right: 100px; bottom: 15px; z-index: 2;">CROP</button>');
$('#resizer-demo').removeClass("hide");
$("#content-Div").addClass("hide");
$('#WatermarkDiv').css('opacity','0.2');
parent.$("#content-Div").addClass("hide");
$(parent.$('#ScreenshotButton')).hide();
document.querySelector('.resizer-result').addEventListener('click', function (ev) {
	resize.result({
		type: 'base64',
		size: 'original',
		format: 'jpeg'
	}).then(function (blob) {
		blob = blob.replace("image/jpeg", "image/octet-stream");
		saveImageToDatabase(blob);
	});
});
$(".cr-boundary").css({"-webkit-box-shadow": "0 5px 15px rgba(0,0,0,0.5)",
					   "box-shadow": "0 5px 15px rgba(0,0,0,0.5);"
					  });
}
function saveImageToDatabase(imagefinal)
{
	$('#resizer-demo').html('').addClass("hide");
 	var modal = document.createElement('div');
 	modal.className = "modalImage";
 	var data = '<div id="myModal1" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header" style="padding: 0px 15px;"><h2 class="modal-title">Save screenshot...</h2></div><div class="modal-body" style="padding: 0px 15px;"><img class="my-image" id = "imageCrp" src="'+imagefinal+'" alt="Picture"  style="max-width: 500px; max-height: 250px; image-rendering: -webkit-optimize-contrast;"><h3>Image Name</h3><input class ="inputField" type="text" id="imageName" name="imageName" placeholder="Give a name to screenshot.."><small id="imgNameError"></small><h3>Tags</h3><input class ="inputField" type="text" id="tagname" name="tagname" placeholder="Tags must be separated with space.."></div><div class="modal-footer"></div></div></div></div>';
 	modal.innerHTML+= data;
 	modal.style.display = "block";
 	var btn = document.createElement('button');
 	btn.className = "btn btn-default saveImg";
 	btn.innerHTML = "Save";
    btn.onclick = function(){
    	var imagename = window.parent.document.getElementsByName('imageName')[0].value;
    	var tags = window.parent.document.getElementsByName('tagname')[0].value;
    	if(imagename == ''){
    		parent.$("#imgNameError").html('<label style="color: #e51c23;">Mandatory: Field cannot be empty</label>');
    	}
    	else{
    	var data_req = {
    			name: imagename,
    			tag: tags, 
    			imageData: imagefinal.slice(31)};
	    var reqData = {
	    		isSecure: true,
	    		consumerName: "BIZVIZ_GALLERY", 
	    		serviceName: "saveImageForUser",
	    		data: JSON.stringify(data_req)
	    };
	    if(typeof req_url != 'undefined')
	    	{
			    parent.BIZVIZ.SDK.secureRequest(req_url.gallery.pluginService, reqData, function(data, status) {
					var object;
					if( status && data && data.bizvizGalleryImages ) 
						{
							if( window.parent.BIZVIZ ) {
								window.parent.BIZVIZ.UTIL.bizvizDialog("showAlert",
								{
											success: true, 
											message: "Screenshot saved"
								});
							} else if( window.BIZVIZ ){
								window.BIZVIZ.UTIL.bizvizDialog("showAlert",
								{
											success: true, 
											message: "Screenshot saved"
								});
							}
						}
					else
						{
							if( window.parent.BIZVIZ ) {
								window.parent.BIZVIZ.UTIL.bizvizDialog("showAlert",
								{
											success: false, 
											message: "Failed to save Screenshot!!!"
								});
							} else if( window.BIZVIZ ){
								window.BIZVIZ.UTIL.bizvizDialog("showAlert",
								{
											success: false, 
											message: "Failed to save Screenshot!!!"
								});
							}
						}
			     });
	    	}
	    else
	    	{
		    parent.BIZVIZ.SDK.secureRequest(parent.req_url.gallery.pluginService, reqData, function(data, status) {
				var object;
				if( status && data && data.bizvizGalleryImages ) 
					{
						if( window.parent.BIZVIZ ) {
							window.parent.BIZVIZ.UTIL.bizvizDialog("showAlert",
							{
										success: true, 
										message: "Screenshot saved"
							});
						} else if( window.BIZVIZ ){
							window.BIZVIZ.UTIL.bizvizDialog("showAlert",
							{
										success: true, 
										message: "Screenshot saved"
							});
						}
					}
				else
				{
					if( window.parent.BIZVIZ ) {
						window.parent.BIZVIZ.UTIL.bizvizDialog("showAlert",
						{
									success: false, 
									message: "Failed to save Screenshot!!!"
						});
					} else if( window.BIZVIZ ){
						window.BIZVIZ.UTIL.bizvizDialog("showAlert",
						{
									success: false, 
									message: "Failed to save Screenshot!!!"
						});
					}
				}
		     });
	    	}

	    parent.$(".modalImage").remove();
    	$("#content-Div").addClass("hide");
    	parent.$("#content-Div").addClass("hide");
    	$('#WatermarkDiv').css('opacity','1');
    	$(parent.$('#ScreenshotButton')).show();
    	}
    };
    var closeBtn = document.createElement('button');
    closeBtn.className = "btn btn-default";
    closeBtn.innerHTML = "Close";
    closeBtn.onclick = function(){
    	parent.$(".modalImage").remove();
    	$("#content-Div").addClass("hide");
    	parent.$("#content-Div").addClass("hide");
    	$('#WatermarkDiv').css('opacity','1');
    	$(parent.$('#ScreenshotButton')).show();
    };
    modal.getElementsByClassName('modal-footer')[0].appendChild(btn);
    modal.getElementsByClassName('modal-footer')[0].appendChild(closeBtn);
    if(document.getElementById('content-Div'))
    	{
    		$("#content-Div").removeClass("hide");
    		$("#resizer-demo").addClass("hide");
    		document.getElementById('content-Div').appendChild(modal);
    	}
    else{
    		parent.$('#content-Div').removeClass('hide');
    		parent.$("#resizer-demo").addClass("hide");
    		window.parent.document.getElementById('content-Div').appendChild(modal);
   		}
}