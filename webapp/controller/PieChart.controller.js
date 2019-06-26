sap.ui.define(["sap/ui/core/mvc/Controller"], function(Controller) {
	"use strict";
	return Controller.extend("APP12FirstLook.controller.PieChart", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf APP12FirstLook.view.PieChart
		 */
		onInit: function() {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("TargetPieChart").attachMatched(this._onRouteFound, this);

			//TargetPieChart
			//TargetDetails

		},

		_onRouteFound: function(oEvent) {
			var oArgument = oEvent.getParameter("arguments");
			var begStation = oArgument.begst.trim();
			var endStation = oArgument.endst.trim();
			var month = oArgument.month.trim();
			
			var title = "Грузы -- ";
			

			var filterList = [];
			if (begStation) {
				filterList.push(new sap.ui.model.Filter("stbeg", sap.ui.model.FilterOperator.EQ, begStation));
				title = title + " Станция начала:" + begStation;
			}
			if (endStation) {
				filterList.push(new sap.ui.model.Filter("stend", sap.ui.model.FilterOperator.EQ, endStation));
				title = title + " Станция конца:" + endStation;
			}
			if (month) {
				filterList.push(new sap.ui.model.Filter("calmonth", sap.ui.model.FilterOperator.EQ, month));
				title = title + " Период:" + month;
			}

			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z00_APP12_SRV/");
			this.getView().setModel(oModel);

		//	filterList.push(new sap.ui.model.Filter("stbeg", sap.ui.model.FilterOperator.EQ, "10002"));
		//	filterList.push(new sap.ui.model.Filter("calmonth", sap.ui.model.FilterOperator.EQ, "201501"));

			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: 'Груз',
					value: "{kodgr_text}"
				}],

				measures: [{
					name: 'Сумма',
					value: '{miesumF}'
				}],

				data: {
					path: "/pieChartSet",
					filters: filterList
				}
			});
			var oVizFrame = this.getView().byId("pieChartId");
			oVizFrame.destroyFeeds();
			oVizFrame.setDataset(oDataset);
			oVizFrame.setModel(oModel);

			//      4.Set Viz properties
			oVizFrame.setVizProperties({
				title: {
					text: title 
				},
				plotArea: {
					//colorPalette: d3.scale.category20().range(),
					 //drawingEffect: "glossy",
					dataLabel: {
						visible: true,
						type: 'value',
						distance: 0.3,
						line: {
							visible: true
						},
						hideWhenOverlap: true,
						automaticInOutside: true,
						positionPreference: true
					}
				}
			});

			var feedSize = new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "size",
					'type': "Measure",
					'values': ["Сумма"]
				}),
				feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "color",
					'type': "Dimension",
					'values': ["Груз"]
				});
			oVizFrame.addFeed(feedSize);
			oVizFrame.addFeed(feedColor);

		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf APP12FirstLook.view.PieChart
		 */ //	onBeforeRendering: function() {
		//
		//	},
		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf APP12FirstLook.view.PieChart
		 */ //	onAfterRendering: function() {
		//
		//	},
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf APP12FirstLook.view.PieChart
		 */ //	onExit: function() {
		//
		//	}
		/**
		 *@memberOf APP12FirstLook.controller.PieChart
		 */
		onBackButton: function(oEvent) {
			window.history.go(-1);
		}
	});
});