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
					key: "{st_spr}",
					text: "{Txtlg} - {st_spr}"
				})
			});
			var inputEnd = oView.byId("inputEndStation");
			inputEnd.bindAggregation("suggestionItems", {
				path: "/stbegSet",
				template: new sap.ui.core.Item({
					key: "{st_spr}",
					text: "{Txtlg} - {st_spr}"
				})
			});
			var inputCode = oView.byId("codeCargo");
			inputCode.bindAggregation("suggestionItems", {
				path: "/codeCargoSet",
				template: new sap.ui.core.Item({
					text: "{kodgrgr}"
				})
			});
			input.setFilterFunction(function(sTerm, oItem) {
				// A case-insensitive 'string contains' style filter
				return oItem.getText().match(new RegExp(sTerm, "i"));
			});
			
			inputEnd.setFilterFunction(function(sTerm, oItem) {
				return oItem.getText().match(new RegExp(sTerm, "i"));
			});

			var myModel = this.getOwnerComponent().getModel();
			myModel.setSizeLimit(10000);
		},
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
		},
		/**
		 *@memberOf APP12FirstLook.controller.V_Header
		 */
		begSuggest: function(oEvent) {
			var item = oEvent.getParameter("selectedItem");
			var key = item.getKey();

			var input = this.getView().byId("inputSel");
			input.setValue(key);
		},
		/**
		 *@memberOf APP12FirstLook.controller.V_Header
		 */
		endSuggest: function(oEvent) {
			var item = oEvent.getParameter("selectedItem");
			var key = item.getKey();

			var input = this.getView().byId("inputEndStation");
			input.setValue(key);
		}
	});
});