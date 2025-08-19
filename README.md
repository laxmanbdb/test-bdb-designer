# html file that load all js files to render and preview of dashboards charts and ui
# use this code project to only migration of angularJs to angular 16 version only
# resrtricted copyrught @bdb.ai
<!DOCTYPE HTML>
<html>
	<head>
		<title>Dashboard Designer </title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="description" content="BDB Dashboard Designer is a web browser based application used to build dashboards and design analytics">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="icon" type="image/png" href="../../shared/brand/images/favicon.png?v3.0.0">
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
		<meta http-equiv="Pragma" content="no-cache">
		<meta http-equiv="Expires" content="0">
	</head>
	<body ng-controller="DesignerController as desVm" class="noselect" ng-click="onDocumentClick( $event )" data-theme="light">
		<!-- Loader animation -->
		<div class='bvz-loader-container'>
			<div class='bvz-loader'>
				<div class='bvz-loader--text' data-content=" Loading"></div>
			</div>
		</div>
<!-- 		<link rel="stylesheet" type="text/css" href="../../resources/file/fonts.css?v=9.0.1.20240708.151115"/> -->
		<!-- BizvizFont, Ubuntu, Raleway, Roboto and Lato family is taken from font.css -->
		<link rel="stylesheet" type="text/css" href="../../shared/brand/fonts/font.css?v=9.0.1.20240708.151115"/>
		<!-- <link rel="stylesheet" href="../../shared/resources/fonts/google-font/font.css?v=9.0.1.20240708.151115" type="text/css"/> -->
		<link rel="stylesheet" href="./resources/css/bvz-loader.min.css?v=9.0.1.20240708.151115" type="text/css"/>
		<!-- Script for loader and status messages-->
		<script src="./resources/plugins/jQuery/jquery-3.6.0.min.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script type="text/javascript">
			/** @description updates the loader text
			@param { string } msg : message to be displayed **/
			var showInLoader = function( msg ) {
				$( ".bvz-loader--text" ).text(" " + msg + " " ).css({"font-family": "BizvizFont, Roboto, Raleway, Helvetica, Verdana"});
			};
			showInLoader( 'Loading Styles' );
		</script>
		<link rel="stylesheet" href="../../shared/resources/fonts/bizviz-fonts/styles.css?v=9.0.1.20240708.151115" type="text/css" async/>
		<link rel="stylesheet" href="../../shared/resources/fonts/font-awesome/css/font-awesome.min.css?v=9.0.1.20240708.151115" type="text/css"/>
		<link rel="stylesheet" href="../../resources/common/style/bizviz-app.css?v=9.0.1.20240708.151115" type="text/css"/>
		<!-- Refer material icon.css from web, as it doesn't support icons from local in IE/ Edge -->
		<link rel="stylesheet" href="../../shared/resources/fonts/material-icons/icon.css?v=9.0.1.20240708.151115" />
		<link rel="stylesheet" href="./resources/plugins/bootstrap/css/bootstrap.min.css?v=9.0.1.20240708.151115" type="text/css"/>
		<link rel="stylesheet" href="./resources/plugins/bootstrap/css/bootstrap-tour.css?v=9.0.1.20240708.151115" type="text/css" async/>
		<link rel="stylesheet" href="./resources/plugins/angularjs/angular-notify.css?v=9.0.1.20240708.151115" type="text/css" async/>
		<link rel="stylesheet" href="./resources/plugins/bootstrap/css/select2.css?v=9.0.1.20240708.151115" type="text/css" async/>
		<link rel="stylesheet" href="./resources/plugins/polyfills/spectrum.css?v=9.0.1.20240708.151115" type="text/css" async/>
		<link rel="stylesheet" href="./resources/plugins/jQuery/jquery-ui-1.10.4.custom.min.css?v=9.0.1.20240708.151115" type="text/css"/>
		<link rel="stylesheet" href="./resources/css/hotkeys.css?v=9.0.1.20240708.151115" type="text/css" async/>
		<link rel="stylesheet" href="./resources/plugins/angularMD/angular-material.min.css?v=9.0.1.20240708.151115" type="text/css" async/>
		<link rel="stylesheet" href="../../resources/lib/textangular/textAngular.css?v=9.0.1.20240708.151115" type="text/css" async/>
		<link rel="stylesheet" href="../../resources/lib/codemirror/css/show-hint.css?v=9.0.1.20240708.151115" type="text/css" async/>
		<link rel="stylesheet" href="../../resources/lib/codemirror/css/codemirror.css?v=9.0.1.20240708.151115" type="text/css" async/>
		<link rel="stylesheet" href="./resources/plugins/tooltip/tooltip.style.css?v=9.0.1.20240708.151115" type="text/css" />
		
		<script src="../../shared/brand/script/brand-settings.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<!-- Encryption of dataservices -->
		<script src="../../shared/resources/lib/encryption/encryption.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="./resources/data/AttributeMigration.data?v=9.0.1.20240708.151115"></script>
		<script onload="showInLoader( 'Loading Plugins' )" src="../charting/src/bizviz.charting/components/resources/js/jquery.easyui.min.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="./resources/plugins/jQuery/jquery-ui-1.13.0.min.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="../charting/src/bizviz.charting/components/resources/js/jquery.ui.treemap.min.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="../charting/src/bizviz.charting/components/resources/js/jquery.sparkline.min.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="../charting/src/bizviz.charting/components/resources/js/leaflet-src.min.js?v=9.0.1.20240708.151115" type="text/javascript" async></script>
		<script src="../charting/src/bizviz.charting/components/resources/js/jquery.listswap.min.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="../charting/src/bizviz.charting/components/resources/js/jexcel.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="../charting/src/bizviz.charting/components/resources/js/jsuites.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="../charting/src/bizviz.charting/components/resources/js/echarts.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="../charting/src/bizviz.charting/components/resources/js/echarts-wordcloud.js?v=9.0.1.20240708.151115" type="text/javascript"></script>

		<script src="../charting/src/bizviz.charting/components/resources/js/visNetwork.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<!--  fflate  -->
		<script src="../../resources/lib/fflate/fflateindex.js?v=9.0.1.20240708.151115"></script>
		<script type="module" src="../../resources/lib/fflate/fflate.js?v=9.0.1.20240708.151115"></script>
		<!-- Code Mirror -->
		<script onload="showInLoader( 'Loading Scripting Engine' )" src="../../resources/lib/codemirror/js/codemirror.min.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="../../resources/lib/codemirror/mode/javascript.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="../../resources/lib/codemirror/js/show-hint.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script onload="showInLoader( 'Loading Utilities' )" src="../charting/src/bizviz.charting/components/resources/js/jQuery.blockUI.min.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="./resources/plugins/polyfills/modernizr.custom.99625.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="./resources/plugins/polyfills/spectrum.min.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="./resources/plugins/bootstrap/js/select2.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<!-- Angular JS -->
		<script onload="showInLoader( 'Loading Modules' )" src="./resources/plugins/angularjs/angular-1.8.2.min.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="../../resources/lib/textangular/textAngular-rangy.min.js?v=9.0.1.20240708.151115" type="text/javascript" async></script>
		<script src="../../resources/lib/textangular/textAngular-sanitize.min.js?v=9.0.1.20240708.151115" type="text/javascript" async></script>
		<script src="./resources/plugins/angularjs/textAngular.js?v=9.0.1.20240708.151115" type="text/javascript" async></script>
		<script src="./resources/plugins/angularjs/textAngularSetup.js?v=9.0.1.20240708.151115" type="text/javascript" async></script>
		<script src="../../resources/js/angular-translate.min.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="../../resources/js/angular-translate-loader-static-files.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="./resources/plugins/angularjs/ngDraggable.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="./resources/plugins/angularjs/angular-route.min.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="./resources/plugins/angularjs/hotkeys.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="./resources/plugins/angularjs/select2.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="./resources/plugins/angularjs/angular-notify.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="./resources/plugins/tooltip/popper.min.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="./resources/plugins/tooltip/tippy-bundle.umd.min.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		
		<!-- Bootstrap -->
		<script onload="showInLoader( 'Loading User Interface' )" src="./resources/plugins/bootstrap/js/bootstrap.min.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="./resources/plugins/bootstrap/js/ui-bootstrap-tpls-0.12.0.min.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="./resources/plugins/bootstrap/js/bootstrap-tour.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		
		<script onload="showInLoader( 'Loading Configurations' )" src="../../shared/model/url-conf.data?v=9.0.1.20240708.151115"></script>
		<script src="../../shared/model/url-api.data?v=9.0.1.20240708.151115"></script>
		
		<script src="../../resources/js/jstorage.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="../../resources/js/process.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="./build-config/build/appSettings.js?v=9.0.1.20240708.151115"></script>
		<script onload="showInLoader( 'Loading Theme' )" src="./utility/ThemeManager.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="./utility/DesignerUtil.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script src="../charting/src/bizviz.framework/FrameworkUtil.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script>
			showInLoader( 'Loading Controllers' );
			/** Load designer JS source based on variable defined in appSetting.js **/
			loadScript( {"urls": (dGlobals.isDevMode) ? global.src_url_designhome.devJS : global.src_url_designhome.prodJS, "type": "script", "async": "false", "cbArgs": "", "eCB": "", "sCB": ""} );
		</script>
		<script onload="showInLoader( 'Loading Converter' )" src="../charting/src/bizviz.charting/components/resources/js/xml2json.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<script onload="showInLoader( 'Loading SDK' )" src="../../shared/app/bizviz-sdk.js?v=9.0.1.20240708.151115" type="text/javascript"></script>
		<!-- Material UI -->
		<script src="./resources/plugins/angularMD/angular-material.min.js?v=9.0.1.20240708.151115" type="text/javascript" async></script>
		<script src="./resources/plugins/angularMD/angular-animate.min.js?v=9.0.1.20240708.151115" type="text/javascript" async></script>
		<script src="./resources/plugins/angularMD/angular-aria.js?v=9.0.1.20240708.151115" type="text/javascript" async></script>
		<script src="./resources/plugins/angularMD/angular-messages.min.js?v=9.0.1.20240708.151115" type="text/javascript" async></script>

		<script type="text/javascript">
			/** Global variables for charting components */
			var jqEasyUI = jQuery.noConflict( true );
			$ = jqEasyUI;
			
			/** Load designer CSS source **/
			loadCSS( {"urls": (dGlobals.isDevMode) ? global.src_url_designhome.devCSS : global.src_url_designhome.prodCSS, "type": "text", "async": "false", "cbArgs": "", "eCB": "", "sCB": function(args, data){
				$("body").append("<style>" + data + "</style>");
			}} );
		</script>
		<!-- Once load the init.js call a callback in DesignerUtil to bootstrap the designer -->
		<script src="../../shared/app/bizviz-init.js?pagetype=plugin;callback=onLoadBizvizInit;ducb=initSession?v=9.0.1.20240708.151115"></script>
		<link rel="stylesheet" href="../charting/src/bizviz.charting/components/resources/css/charting.min.css?v=9.0.1.20240708.151115" type="text/css" async/>
		<link rel="stylesheet" href="../charting/src/bizviz.charting/components/resources/css/listswap.min.css?v=9.0.1.20240708.151115" type="text/css" async/>
		<link rel="stylesheet" href="../charting/src/bizviz.charting/components/resources/css/leaflet.min.css?v=9.0.1.20240708.151115" type="text/css" async/>
		<link rel="stylesheet" href="../charting/src/bizviz.charting/components/resources/css/jexcel.css?v=9.0.1.20240708.151115" type="text/css" async/>
		<link rel="stylesheet" href="../charting/src/bizviz.charting/components/resources/css/jsuites.css?v=9.0.1.20240708.151115" type="text/css" async/>
		<!-- directive to render designer main page viewing content -->
		<design-home-view></design-home-view>
	</body>
</html>
