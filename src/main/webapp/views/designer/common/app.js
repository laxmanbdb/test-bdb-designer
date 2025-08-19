/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: app.js
 * @description Configuration of "BDB Dashboard Designer"
 * **/
//# sourceURL=app.js
/** @description Sub-modules of designer **/
var designerModules = {
	"module": {
		"ComponentManager": "component-manager",
		"DashboardManager": "dashboard-manager",
		"WorkspaceManager": "workspace-manager",
		"DashboardDesignerManager": "dashboard-designer",
		"DataSourceManager": "datasource-manager",
		"DesignerManager": "designer-manager",
		"DesignerPropertyManager": "designer-property-manager",
		"MainMenuManager": "mainmenu-manager",
		"PropertyManager": "property-manager",
		"UserScriptManager": "userscript-manager",
		"HelpManager":"help-manager"
	}
};

( function() {
    "use strict";
    angular.module( "designer", [
        "ngDraggable",
        "cgNotify",
//      "toaster",
//      "ngAnimate",
//      "ngSanitize",
        "ui.select2",
        "ui.bootstrap",
        "ui.codemirror",
        "pascalprecht.translate",
        "cfp.hotkeys",
        "bvz.numberspinner",
        "ngMaterial",
        "textAngular",
        designerModules.module.DesignerManager,
        designerModules.module.MainMenuManager,
        designerModules.module.DashboardDesignerManager,
        designerModules.module.DesignerPropertyManager,
        designerModules.module.HelpManager
    ] );
    angular.module( designerModules.module.DesignerPropertyManager, [ 
        designerModules.module.ComponentManager,
        designerModules.module.DataSourceManager,
        designerModules.module.PropertyManager,
        designerModules.module.UserScriptManager
    ] );
    angular.module( designerModules.module.MainMenuManager, [
        designerModules.module.DashboardManager,
        designerModules.module.WorkspaceManager
    ] );
    angular.module( designerModules.module.DesignerManager, [] );
    angular.module( designerModules.module.DashboardManager, [] );
    angular.module( designerModules.module.WorkspaceManager, [] );
    angular.module( designerModules.module.DashboardDesignerManager, [] );
    angular.module( designerModules.module.ComponentManager, [] );
    angular.module( designerModules.module.DataSourceManager, [] );
    angular.module( designerModules.module.PropertyManager, [] );
    angular.module( designerModules.module.UserScriptManager, [] );
    angular.module( designerModules.module.HelpManager, [] );
} )();