/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: UserScriptExecuter.js
 * @description Script execution triggers from here
 **/
function UserScriptExecuter() {};
UserScriptExecuter.prototype.execute = function (userScript, changedItem) {
	if (this.validateSuccess(userScript)) {
		var prevChangedItem = bizviz.lastChangedItem;
		var $self = changedItem.attributes;
		bizviz.setLastChangedItem(changedItem);
		try {
			sdk.pushLog("Execution Init");
			sdk.pushLog("Source - " + changedItem.key);
			sdk.pushLog(userScript, "EXEC");
			eval(userScript);
			if (prevChangedItem){
				bizviz.setLastChangedItem(prevChangedItem);
			}
		} catch (e) {
			sdk.pushLog("Message : " + e, "ERROR");
			console.log("Error occured from supplied script.");
			console.log("Message : " + e);
		}
	}
};
UserScriptExecuter.prototype.validateSuccess = function (userScript) {
	//	DO STUFF For validation
	//	Now all scripts are validate as success
	return true;
};
//# sourceURL=UserScriptExecuter.js