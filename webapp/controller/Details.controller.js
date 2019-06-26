sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/ui/model/Sorter"
], function(Controller, Fragment, Sorter) {
	"use strict";
	var fragments = new Map();
	var selectParams = new Map();
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

		},
		_onRouteFound: function(oEvt) {
			var oArgument = oEvt.getParameter("arguments");
			var begStation = oArgument.inputValue;
			var codeCargo = oArgument.code;
			var endStation = oArgument.endStation;
			var month = oArgument.month;

			selectParams.set("month", month);
			selectParams.set("begst", begStation);
			selectParams.set("endst", endStation);
			selectParams.set("cargo", codeCargo);

			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z00_APP12_SRV/");
			this.getView().setModel(oModel);

			var filters = this.makeFilter(begStation.trim(), endStation.trim(), codeCargo.trim(), month.trim());
			var binding = this.byId("it_item").getBinding("items");
			binding.filter(filters, sap.ui.model.FilterType.Control);
		},
		makeFilter: function(begSt, endSt, cargo, month) {
			var filters;
			var filtersParams = [];
			var filterBegSt = new sap.ui.model.Filter("stbeg", sap.ui.model.FilterOperator.EQ, begSt);
			var filterEndSt = new sap.ui.model.Filter("stend", sap.ui.model.FilterOperator.EQ, endSt);
			var filterCargo = new sap.ui.model.Filter("kodgrgr", sap.ui.model.FilterOperator.EQ, cargo);
			var filterMonth = new sap.ui.model.Filter("calmonth", sap.ui.model.FilterOperator.EQ, month);

			if (begSt) {
				filtersParams.push(filterBegSt);
			}
			if (endSt) {
				filtersParams.push(filterEndSt);
			}
			if (cargo) {
				filtersParams.push(filterCargo);
			}
			if (month) {
				filtersParams.push(filterMonth);
			}
			filters = new sap.ui.model.Filter({
				and: true,
				filters: filtersParams
			});

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
			var begSt = this._oDialog.getFilterItems()[2].getCustomControl().getControlsByFieldGroupId("input")[0];
			var endSt = this._oDialog.getFilterItems()[3].getCustomControl().getControlsByFieldGroupId("input")[0];
			begSt.setFilterFunction(function(sTerm, oItem) {
				if (sTerm.length > 1) {
					return oItem.getText().match(new RegExp(sTerm, "i"));
				}
			});
			endSt.setFilterFunction(function(sTerm, oItem) {
				if (sTerm.length > 1) {
					return oItem.getText().match(new RegExp(sTerm, "i"));
				}
			});
			var codeCargo = this._oDialog.getFilterItems()[1].getCustomControl().getControlsByFieldGroupId("input")[0];
			codeCargo.setFilterFunction(function(sTerm, oItem) {
				return oItem.getText().match(new RegExp(sTerm, "i"));
			});
		},
		stationSuggest: function(oEvent) {
			var sTerm = oEvent.getParameter("suggestValue");
			var aFilters = [];
			if (sTerm) {
				aFilters.push(new sap.ui.model.Filter("st_spr", sap.ui.model.FilterOperator.Contains, sTerm));
				aFilters.push(new sap.ui.model.Filter("Txtlg", sap.ui.model.FilterOperator.Contains, sTerm));
			}
			oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
		},
		onTableSettings: function(oEvent) {
			if (!this._oDialog) {
				this.initFragment();
				this._oDialog.open();
			} else {
				this._oDialog.open();
			}
		},
		validate: function(oEvent) {
			// валидация zzr
			var inputZZr = this._oDialog.getFilterItems()[5].getCustomControl().getControlsByFieldGroupId("input")[0];
			if (inputZZr.getValue().length > 0) {
				// если целове число
				if (/^\+?(0|[1-9]\d*)$/.test(inputZZr.getValue())) {
					inputZZr.setValueState(sap.ui.core.ValueState.Success);
				} else {
					inputZZr.setValueState(sap.ui.core.ValueState.Error);
				}
			} else {
				inputZZr.setValueState(sap.ui.core.ValueState.None);
			}
			// валидация miesumF
			var inputMiesum = this._oDialog.getFilterItems()[4].getCustomControl().getControlsByFieldGroupId("input")[0];
			if (inputMiesum.getValue().length > 0) {
				// если целове число
				if (/^\+?(0|[1-9]\d*)$/.test(inputMiesum.getValue())) {
					inputMiesum.setValueState(sap.ui.core.ValueState.Success);
				} else {
					inputMiesum.setValueState(sap.ui.core.ValueState.Error);
				}
			} else {
				inputMiesum.setValueState(sap.ui.core.ValueState.None);
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

				//var filterValue = item.getCustomControl().mAggregations.content[0].getValue(); getControlsByFieldGroupId
				var inputFilterValue = item.getCustomControl().getControlsByFieldGroupId("input")[0].getValue();

				var selectedRadioIndex = item.getCustomControl().getControlsByFieldGroupId("radio")[0].getSelectedIndex();
				var filterParam;
				switch (selectedRadioIndex) {
					case 0:
						filterParam = sap.ui.model.FilterOperator.EQ;
						break;
					case 1:
						filterParam = sap.ui.model.FilterOperator.LT;
						break;
					case 2:
						filterParam = sap.ui.model.FilterOperator.GT;
						break;
					case 3:
						filterParam = sap.ui.model.FilterOperator.LT;
						break;
					case 4:
						filterParam = sap.ui.model.FilterOperator.GT;
						break;
				}
				if (inputFilterValue) {
					var filtName = item.sId;
					var filterItem = new sap.ui.model.Filter(filtName, filterParam, inputFilterValue.toString());
					filterList.push(filterItem);
				}
			});
			//	if (filterList.length > 0) {
			oBinding.filter(filterList, sap.ui.model.FilterType.Application);
			//	}
			// СОРТИРОВКА 
			var aSorters = [];
			var sPath = mParams.sortItem.getKey();
			var bDescending = mParams.sortDescending;
			aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
			oBinding.sort(aSorters);
		},
		onCancel: function(oEvent) {

		},
		onResetFilters: function(oEvent) {
			var oCustomFilter = this._oDialog.getFilterItems();
			oCustomFilter.forEach(function(item) {
				item.getCustomControl().getControlsByFieldGroupId("input")[0].setValue("");
			});
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
		onUpdateFinish: function(oEvent) {
			var count = this.getView().byId("it_item").getItems().length;
			this.getView().byId("recordCount").setText(count);
		},

		begSuggest: function(oEvent) {
			var item = oEvent.getParameter("selectedItem");
			var key = item.getKey();
			var input = this._oDialog.getFilterItems()[2].getCustomControl().getControlsByFieldGroupId("input")[0];
			input.setValue(key);
		},
		endSuggest: function(oEvent) {
			var item = oEvent.getParameter("selectedItem");
			var key = item.getKey();
			var input = this._oDialog.getFilterItems()[3].getCustomControl().getControlsByFieldGroupId("input")[0];
			input.setValue(key);
		},
		cargoSuggest: function(oEvent) {
			var item = oEvent.getParameter("selectedItem");
			var key = item.getKey();
			var input = this._oDialog.getFilterItems()[1].getCustomControl().getControlsByFieldGroupId("input")[0];
			input.setValue(key);
		},

		onPress: function(oEvent) {
			/*	if (!this._oDialog) {
					this._oDialog = sap.ui.xmlfragment("APP12FirstLook.view.Diagram", this);
					this.getView().addDependent(this._oDialog);
					this._oDialog.open();
				} else {
					this._oDialog.open();
				}*/
			if (!fragments.get("pieDiagram")) {
				var dialog = sap.ui.xmlfragment("APP12FirstLook.view.Diagram", this);
				this.getView().addDependent(dialog);
				fragments.set("pieDiagram", dialog);

				/*var fragmentId = this.getView().createId("APP12FirstLook.view.Diagram");
				var frame = dialog.getView().byId(fragmentId, "tt");
				debugger;*/

				dialog.open();
			} else {
				fragments.get("pieDiagram").open();
			}

		},
		closeDialog: function(oEvent) {
			fragments.get("pieDiagram").close();
		},

		onPieChart: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("TargetPieChart", {
				month: selectParams.get("month"),
				begst: selectParams.get("begst"),
				endst: selectParams.get("endst")
			});
		},
		onBarChart: function(oEvent){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("TargetBarChart", {});
		}
	});
});