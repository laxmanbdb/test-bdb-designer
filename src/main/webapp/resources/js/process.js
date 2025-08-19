/**
 * Handle calls to Business layer
 */

var login=false;
var token="";
var rootFolders=new Array();
var startFolder;
var savedataobject;			
var formData = new FormData();		
var loadUserPage = null;
var copy = true;
var childId = [];
var headerdata;

var opendoc = false;

function internalErrorOccured() {
	loadContent("views/context/error.html", "#genericmodal-form", function(status) {
		if(status) {
			$("#initsessionbtn").click(function() {
				/*Enabling the Form fields*/
				$('form input').prop('disabled', false);		
				$('form select').prop('disabled', false);
				$('form textarea').prop('disabled', false);
				$('form button').prop('disabled', false);
				$('.btn-group button').css('background-color', '#FFFFFF');
				$('.file-input-wrapper').css('background-color', '#FFFFFF');
			});
			$('#genericModalLabel').text("Error !");
			$('.modal-footer button').show();
			$('.modal-body').show();
			$('#genericModal').modal('show');
			
			$(".loader").hide();
		}
	});
}

function reInitSession() {
	loadContent("views/context/session.html", "#genericmodal-form", function(status) {
		if(status) {
			$("#initsessionbtn").click(function() {
				$('<iframe/>', {
					class: "reinit-session",
					id: "reinitSession",
					src: "views/home/sessionout.html"
				}).appendTo(document.body);
				
				$("#genericmodal-form").empty();
				$('#genericModal').modal('hide');
				
				/*Enabling the Form fields*/
				$('form input').prop('disabled', false);		
				$('form select').prop('disabled', false);
				$('form textarea').prop('disabled', false);
				$('form button').prop('disabled', false);
				$('.btn-group button').css('background-color', '#FFFFFF');
				$('.file-input-wrapper').css('background-color', '#FFFFFF');
			});
			$('#genericModalLabel').text("Session Expired");
			$('.modal-footer button').show();
			$('.modal-body').show();
			$('#genericModal').modal('show');
			
			$(".loader").hide();
		}
	});
};

function setHeader(data){
	headerdata = {} ;
	if($.jStorage.get("token") != undefined){
		headerdata["authtoken"] = $.jStorage.get("token");
	}else{
		headerdata["authtoken"] = $.jStorage.get("opendoctoken");
	}
	if($.jStorage.get("spacekey") != undefined){
		headerdata["spacekey"] = $.jStorage.get("spacekey");
	}else{
		headerdata["spacekey"] = $.jStorage.get("opendocspacekey");
	}
	if($.jStorage.get("userID") != undefined){
		headerdata["userid"] = $.jStorage.get("userID");
	}else if($.jStorage.get("openDocUserId") != undefined){
		headerdata["userid"] = $.jStorage.get("openDocUserId");
	}else{
		headerdata["userid"] = data["userid"];
	}
	return headerdata;
}
function requestServer(url,data,successhandle) {
	$(".loader").show();
	setHeader(data);
	$.ajax({
		type: "POST",
		url: url,
		data: data,
		headers: headerdata,
		crossDomain:true,
		success:successhandle,
		error: function(data,status) {
		}
	});
}	
function uploadfile(url,data,successhandle) {
	$(".loader").show();
	$.ajax({
		type: "POST",
		url: url,
		data: data,
		headers: setHeader(data),
		contentType: false,
		processData: false,
		crossDomain:true,
		success:successhandle,
		error: function(jqXHR, exception) {
			if (jqXHR.status === 0) {
				reInitSession();
			}
		}
	});
}
function secureRequest(url,data,successhandle,errorHandle) {
	$(".loader").show();
	$.ajax({
		type: "POST",
		url: url,
		data: data,
		headers: setHeader(data),
		crossDomain:true,
		success: successhandle,
		statusCode: {
			304: function() {
				reInitSession();							// sessionExpired
			}
		},
		error: function(jqXHR, exception) {
			if (jqXHR.status === 0) {
				if(errorHandle==undefined) {
					internalErrorOccured();
				} else {
					errorHandle(jqXHR, exception);
				}
			}
			$(".loader").fadeOut(500);
		}
	});
}	
function secureAsyncRequest(url,data,successhandle) {
	$(".loader").show();
	$.ajax({
		type: "POST",
		url: url,
		async: false,
		data: data,
		headers: setHeader(data),
		crossDomain:true,
		success: successhandle,
		statusCode: {
			304: function() {
				reInitSession();							// sessionExpired
			}
		},
		error: function(jqXHR, exception) {
			if (jqXHR.status === 0) {
				internalErrorOccured();
			}
			$(".loader").fadeOut(500);
		}
	});
}	
function loadContextContent(page,div,title,optionid,docid,docTitle) {
	$( ".loader" ).show();
	$(div).text("");
	$.ajax({
		url: page,
		cache: false,
		error: function(jqXHR, exception) {
			var msg="";
			if (jqXHR.status === 0) {
				msg =(formatErrorContent('Not Connected.\n Verify Network.'));
			} else if (jqXHR.status == 404) {
				msg =(formatErrorContent('Requested page not found. [404]'));
			} else if (jqXHR.status == 500) {
				msg =(formatErrorContent('Internal Server Error [500].'));
			} else if (exception === 'parsererror') {
				msg =(formatErrorContent('Requested JSON parse failed.'));
			} else if (exception === 'timeout') {
				msg =(formatErrorContent('Time out error.'));
			} else if (exception === 'abort') {
				msg =(formatErrorContent('Ajax request aborted.'));
			} else {
				msg =(formatErrorContent('Uncaught Error.\n' + jqXHR.responseText));
			}
			$(div).append(msg);
		},
		success: function(html){
			$(div).append( html );
			$("#parentid").val(docid);
			if(docTitle != null){
				$("#foldertitle").val(docTitle);
			}
			$(".loader").fadeOut("slow");
		}
	});
}
function loadContentAndDo(page,div,successhandle) {
	$( ".loader" ).show();
	$(div).text("");
	$.ajax({
		url: page,
		cache: false,
		div: div,
		error: function(jqXHR, exception) {
			var msg="";
			if (jqXHR.status === 0) {
				msg =(formatErrorContent('Not Connected.\n Verify Network.'));
			} else if (jqXHR.status == 404) {
				msg =(formatErrorContent('Requested page not found. [404]'));
			} else if (jqXHR.status == 500) {
				msg =(formatErrorContent('Internal Server Error [500].'));
			} else if (exception === 'parsererror') {
				msg =(formatErrorContent('Requested JSON parse failed.'));
			} else if (exception === 'timeout') {
				msg =(formatErrorContent('Time out error.'));
			} else if (exception === 'abort') {
				msg =(formatErrorContent('Ajax request aborted.'));
			} else {
				msg =(formatErrorContent('Uncaught Error.\n' + jqXHR.responseText));
			}
			$(div).append(msg);
		},
		success: successhandle
	});
}
function loadGoogleDriveFiles(docID, accountID){
	$.jStorage.deleteKey("currentGoogleAccountID");
	$('#maincontent').hide();
	$('#helpcontent').hide();
	$.jStorage.set("currentGoogleAccountID", accountID);
	var url = urls[0].getContent;
	var data = {"id":docID,"token" : $.jStorage.get("token"),"spacekey" : $.jStorage.get("spacekey")};
	secureRequest(url,data,function(data,status){
		$("#googlecontent").text("");
		$("#googlecontent").append(data);
		$("#googlecontent").show();
		$("#googlecontent").css("height",$(window).height()-50);
		$('#googlecontent').css("overflow-y", "auto");
	});
}
function checkTokenValidity(data) {
	var tree = data["trees"];
	if(tree.hasOwnProperty('success')){
		if (tree.success==false) {
			$.jStorage.flush();
			$("#sidebar-wrapper").hide();

			$("#nav").hide();
			$("#loader").hide();
			$("#maincontent").hide();
			$("#login").show();
			return false;
		}
		return true;
	}
}