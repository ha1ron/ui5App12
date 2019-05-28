sap.ui.define(["sap/ui/core/mvc/Controller"], function(Controller) {
	"use strict";
	return Controller.extend("APP12FirstLook.controller.Details", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf APP12FirstLook.view.Details
		 */
		onInit: function() {
			// Get the Router Info
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// Validate/Match the Router Details sent from source using oRouter.navTo("Router_Detail", {SelectedItem: selectPO});
			oRouter.getRoute("TargetDetails").attachMatched(this._onRouteFound, this);
			
		
			var myModel = this.getOwnerComponent().getModel();
			myModel.setSizeLimit(999);
		},
		_onRouteFound: function(oEvt) {
			var oArgument = oEvt.getParameter("arguments");
			var begStation = oArgument.inputValue.trim();
			var codeCargo = oArgument.code.trim();
			var endStation = oArgument.endStation.trim();



			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z00_APP12_SRV/");
			this.getView().setModel(oModel);

			var filters = this.makeFilter(begStation, endStation, codeCargo);
			var binding = this.byId("it_item").getBinding("items");

			binding.filter(filters);
		},
		makeFilter: function(begSt, endSt, cargo) {
			var filters;

			var filterBegSt = new sap.ui.model.Filter("stbeg", sap.ui.model.FilterOperator.EQ, begSt);
			var filterEndSt = new sap.ui.model.Filter("stend", sap.ui.model.FilterOperator.EQ, endSt);
			var filterCargo = new sap.ui.model.Filter("kodgrgr", sap.ui.model.FilterOperator.EQ, cargo);

			if (begSt && endSt && cargo) {
				filters = new sap.ui.model.Filter({
					and: true,
					filters: [filterBegSt, filterEndSt, filterCargo]
				});
			}  else if (begSt && endSt) {
				filters = new sap.ui.model.Filter({
					and: true,
					filters: [filterBegSt, filterEndSt]
				});
			}  else if (begSt && cargo) {
				filters = new sap.ui.model.Filter({
					and: true,
					filters: [filterBegSt, filterCargo]
				});
			} else if (endSt && cargo) {
				filters = new sap.ui.model.Filter({
					and: true,
					filters: [filterEndSt, filterCargo]
				});
			} else if (begSt) {
				filters = new sap.ui.model.Filter({
					and: true,
					filters: [filterBegSt]
				});
			} else if (endSt) {
				filters = new sap.ui.model.Filter({
					and: true,
					filters: [filterEndSt]
				});
			} else if (cargo) {
				filters = new sap.ui.model.Filter({
					and: true,
					filters: [filterCargo]
				});
			}
			return filters;
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf APP12FirstLook.view.Details
		 */
		//	onBeforeRendering: function() {
		//
		//	},
		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf APP12FirstLook.view.Details
		 */
		//	onAfterRendering: function() {
		//
		//	},
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf APP12FirstLook.view.Details
		 */
		//	onExit: function() {
		//
		//	}
		/**
		 *@memberOf APP12FirstLook.controller.Details
		 */
		toSelection: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("TargetHeader", {});
		},
		/**
		 *@memberOf APP12FirstLook.controller.Details
		 */
		testSelect: function(oEvent) {
			var selectItem = oEvent.getSource().getBindingContext().getProperty("stbeg");
			alert(selectItem);
		}
	});
});