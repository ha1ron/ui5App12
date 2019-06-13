sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/ui/model/Sorter"
], function(Controller, Fragment, Sorter) {
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
			this.initFragment();
			//this.getView().byId("recordCount").setText("1000000112");
			/*var oBinding = this.byId("it_item").getBinding("rows");
				oBinding.attachChange(function(sReason) {
					this.getView().byId("recordCount").setText(oBinding.getLength());
				});*/
			var count = this.getView().byId("it_item").getItems().length;
			this.getView().byId("recordCount").setText(count);
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
					filters: [
						filterBegSt,
						filterEndSt,
						filterCargo
					]
				});
			} else if (begSt && endSt) {
				filters = new sap.ui.model.Filter({
					and: true,
					filters: [
						filterBegSt,
						filterEndSt
					]
				});
			} else if (begSt && cargo) {
				filters = new sap.ui.model.Filter({
					and: true,
					filters: [
						filterBegSt,
						filterCargo
					]
				});
			} else if (endSt && cargo) {
				filters = new sap.ui.model.Filter({
					and: true,
					filters: [
						filterEndSt,
						filterCargo
					]
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
		/*
		 * Инициализация окна + добавление suggest items
		 */
		initFragment: function(oEvent) {
			this._oDialog = sap.ui.xmlfragment("APP12FirstLook.view.Dialog", this);
			this.getView().addDependent(this._oDialog);
			var begSt = this._oDialog.getFilterItems()[2].getCustomControl();
			var endSt = this._oDialog.getFilterItems()[3].getCustomControl();
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/Z00_APP12_SRV", false);
			var sRead = "/stbegSet";
			// инпуты станции начала и конца
			oModel.read(sRead, null, null, true, function(oData, oResponse) {
				var res = oData.results;
				res.forEach(function(item) {
					begSt.addSuggestionItem(new sap.ui.core.Item({
						key: item.st_spr,
						text: item.st_spr + " - " + item.Txtlg
					}));
					endSt.addSuggestionItem(new sap.ui.core.Item({
						key: item.st_spr,
						text: item.st_spr + " - " + item.Txtlg
					}));
				});
				// полнотекстовый поиск
				begSt.setFilterFunction(function(sTerm, oItem) {
					if (sTerm.length > 2) {
						return oItem.getText().match(new RegExp(sTerm, "i"));
					}
				});
				endSt.setFilterFunction(function(sTerm, oItem) {
					if (sTerm.length > 2) {
						return oItem.getText().match(new RegExp(sTerm, "i"));
					}
				});
			});
			// инпут кода груза
			var codeCargo = this._oDialog.getFilterItems()[1].getCustomControl();
			sRead = "/codeCargoSet";
			oModel.read(sRead, null, null, true, function(oData, oResponse) {
				var res = oData.results;
				res.forEach(function(item) {
					codeCargo.addSuggestionItem(new sap.ui.core.Item({
						key: item.kodgrgr,
						text: item.kodgrgr + " - " + item.cargo_text
					}));
				});
				// полнотекстовый поиск для фильтров кодов грузов
				codeCargo.setFilterFunction(function(sTerm, oItem) {
					return oItem.getText().match(new RegExp(sTerm, "i"));
				});
			});
		},
		onTableSettings: function(oEvent) {
			if (!this._oDialog) {
				this.initFragment();
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
			var oCustomFilter = this._oDialog.getFilterItems();
			oCustomFilter.forEach(function(item) {
				var filterValue = item.getCustomControl().getValue();
				if (filterValue) {
					var filtName = item.sId;
					var filterItem = new sap.ui.model.Filter(filtName, sap.ui.model.FilterOperator.EQ, filterValue.toString());
					filterList.push(filterItem);
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
		onExcel: function(oEvent) {
			var oTableData = this.getView().byId("it_item").getBinding("items");
			var filtersData = oTableData.sFilterParams;
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/Z00_APP12_SRV", false);
			var sRead = "/xlsUrlSet" + "?" + filtersData;
			oModel.read(sRead, null, null, true, function(oData, oResponse) {
				var url = "http://" + window.location.hostname + ":" + window.location.port + oData.results[0].url;
				var encodeUrl = encodeURI(url);
				sap.m.URLHelper.redirect(encodeUrl, false);
			});
		},
		/**
		 *@memberOf APP12FirstLook.controller.Details
		 */
		//onAfterRendering: function() {
		onUpdateFinish: function(oEvent) {
			var count = this.getView().byId("it_item").getItems().length;
			this.getView().byId("recordCount").setText(count);
		},

		begSuggest: function(oEvent) {
			var item = oEvent.getParameter("selectedItem");
			var key = item.getKey();
			var input = this._oDialog.getFilterItems()[2].getCustomControl();
			input.setValue(key);
		},
		endSuggest: function(oEvent) {
			var item = oEvent.getParameter("selectedItem");
			var key = item.getKey();
			var input = this._oDialog.getFilterItems()[3].getCustomControl();
			input.setValue(key);
		},
		cargoSuggest: function(oEvent) {
			var item = oEvent.getParameter("selectedItem");
			var key = item.getKey();
			var input = this._oDialog.getFilterItems()[1].getCustomControl();
			input.setValue(key);
		}
	});
});