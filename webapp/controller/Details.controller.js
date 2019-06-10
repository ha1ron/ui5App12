sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/ui/core/Fragment",
		"sap/ui/model/Sorter"
	],
	function(Controller, Fragment, Sorter) {
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

				binding.filter(filters, sap.ui.model.FilterType.Control);
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
				} else if (begSt && endSt) {
					filters = new sap.ui.model.Filter({
						and: true,
						filters: [filterBegSt, filterEndSt]
					});
				} else if (begSt && cargo) {
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
			 *@memberOf APP12FirstLook.controller.Details
			 */
			toSelection: function(oEvent) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("TargetHeader", {});
			},

			onTableSettings: function(oEvent) {
				if (!this._oDialog) {
					this._oDialog = sap.ui.xmlfragment("APP12FirstLook.view.Dialog", this);
					//	this.getView().addDependent(this._oDialog);
					this._oDialog.open();
				} else {
					this._oDialog.open();
				}

			},

			onConfirm: function(oEvent) {

				var oView = this.getView();
				var oTable = oView.byId("it_item");
				var oBinding = oTable.getBinding("items");
				var mParams = oEvent.getParameters();
				var filterList = [];

				//ФИЛЬТРЫ
				var test;
				var oCustomFilter = this._oDialog.getFilterItems();
				oCustomFilter.forEach(function(item) {
					var filterValue = item.getCustomControl().getValue();
					if (filterValue) {
						var filtName = item.sId;
						var filterItem = new sap.ui.model.Filter( filtName, sap.ui.model.FilterOperator.EQ, filterValue);
						filterList.push(filterItem);
						test = filterItem;
					}
				});
				if (filterList.length > 0) {
					oBinding.filter(filterList, sap.ui.model.FilterType.Application);
				}

				// СОРТИРОВКА 
				var aSorters = [];
				var sPath = mParams.sortItem.getKey();
				var bDescending = mParams.sortDescending;
				aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
				oBinding.sort(aSorters);
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