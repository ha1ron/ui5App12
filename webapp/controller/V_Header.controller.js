sap.ui.define(["sap/ui/core/mvc/Controller"], function(Controller) {
	"use strict";
	return Controller.extend("APP12FirstLook.controller.V_Header", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf APP12FirstLook.view.V_Header
		 */
		onInit: function() {
			var oView = this.getView();
		
			var input = oView.byId("inputSel");
			input.bindAggregation("suggestionItems", {
				path: "/stbegSet",
				template: new sap.ui.core.Item({
					text: "{st_spr}"
				})
			});
			
			var inputEnd = oView.byId("inputEndStation");
			inputEnd.bindAggregation("suggestionItems", {
				path: "/stbegSet",
				template: new sap.ui.core.Item({
					text: "{st_spr}"
				})
			});

			var inputCode = oView.byId("codeCargo");
			inputCode.bindAggregation("suggestionItems", {
				path: "/codeCargoSet",
				template: new sap.ui.core.Item({
					text: "{kodgrgr}"
				})
			});

			var myModel = this.getOwnerComponent().getModel();
			myModel.setSizeLimit(10000);
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf APP12FirstLook.view.V_Header
		 */
		//	onBeforeRendering: function() {
		//
		//	},
		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf APP12FirstLook.view.V_Header
		 */
		//	onAfterRendering: function() {
		//
		//	},
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf APP12FirstLook.view.V_Header
		 */
		//	onExit: function() {
		//
		//	}
		/**
		 *@memberOf APP12FirstLook.controller.V_Header
		 */
		goToDetails: function(oEvent) {
			var oView = this.getView();
			var inputValue = oView.byId("inputSel").getValue();
			var inputEndStation = oView.byId("inputEndStation").getValue();
			var codeCargo = oView.byId("codeCargo").getValue();
			if (!codeCargo) {
				codeCargo = " ";
			}
			if (!inputValue) {
				inputValue = " ";
			}
			if (!inputEndStation) {
				inputEndStation = " ";
			}
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("TargetDetails", {
				inputValue: inputValue,
				endStation: inputEndStation,
				code: codeCargo
			});
		},
		/**
		 *@memberOf APP12FirstLook.controller.V_Header
		 */
		suggestSet: function(oEvent) {

			/*	input.addSuggestionItem(
				new sap.ui.core.Item({
					key: '1',
					text: '123'
				})
			);*/
		}
	});
});