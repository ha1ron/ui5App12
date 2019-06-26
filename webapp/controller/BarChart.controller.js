sap.ui.define(["sap/ui/core/mvc/Controller",
	'sap/viz/ui5/controls/common/feeds/FeedItem',
	'sap/viz/ui5/data/FlattenedDataset'
], function(Controller, FeedItem, FlattenedDataset) {
	"use strict";
	return Controller.extend("APP12FirstLook.controller.BarChart", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf APP12FirstLook.view.BarChart
		 */
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("TargetBarChart").attachMatched(this._onRouteFound, this);
		},

		_onRouteFound: function(oEvent) {
			//var oArgument = oEvent.getParameter("arguments");
			//var begStation = oArgument.begst.trim();
			//var endStation = oArgument.endst.trim();
			//var month = oArgument.month.trim();

			/*	var filterList = [];
				if (begStation) {
					filterList.push(new sap.ui.model.Filter("stbeg", sap.ui.model.FilterOperator.EQ, begStation));
				}
				if (endStation) {
					filterList.push(new sap.ui.model.Filter("stend", sap.ui.model.FilterOperator.EQ, endStation));
				}
				if (month) {
					filterList.push(new sap.ui.model.Filter("calmonth", sap.ui.model.FilterOperator.EQ, month));
				}*/

			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z00_APP12_SRV/");
			this.getView().setModel(oModel);

			//	filterList.push(new sap.ui.model.Filter("stbeg", sap.ui.model.FilterOperator.EQ, "10002"));
			//	filterList.push(new sap.ui.model.Filter("calmonth", sap.ui.model.FilterOperator.EQ, "201501"));

			/*		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
						dimensions: [{
							name: 'Груз',
							value: "{kodgr_text}"
						}],

						measures: [{
							name: 'Сумма',
							value: '{miesumF}'
						}],

						data: {
							path: "/pieChartSet" //,
								//filters: filterList
						}
					});
					var oVizFrame = this.getView().byId("barChartId");
					oVizFrame.destroyFeeds();
					oVizFrame.setDataset(oDataset);
					oVizFrame.setModel(oModel);

					//      4.Set Viz properties
					oVizFrame.setVizProperties({
						title: {
							text: "Грузы"
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
					oVizFrame.addFeed(feedColor);*/

			//////////////////////////////////////////////////////////////
			var oVizFrame = this.getView().byId("barChartId");
			oVizFrame.destroyFeeds();

			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: 'Станция',
					value: "{Txtlg}"
				}],

				measures: [{
					name: 'Сумма',
					value: '{miesumF}'
				}],

				data: {
					path: "/barChartSet"
				}
			});
			oVizFrame.setDataset(oDataset);
			oVizFrame.setModel(oModel);
			oVizFrame.setVizType('column');

			oVizFrame.setVizProperties({
				title: {
					text: "Топ 5 станций (без фильтров)"
				},
				plotArea: {
					colorPalette: d3.scale.category20().range(),
						dataLabel: {
						visible: true,
						type: 'value'
					}
				}
			});

			var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "valueAxis",
					'type': "Measure",
					'values': ["Сумма"]
				}),
				feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "categoryAxis",
					'type': "Dimension",
					'values': ["Станция"]
				});
			oVizFrame.addFeed(feedValueAxis);
			oVizFrame.addFeed(feedCategoryAxis);

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf APP12FirstLook.view.BarChart
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf APP12FirstLook.view.BarChart
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf APP12FirstLook.view.BarChart
		 */
		//	onExit: function() {
		//
		//	}
		onBackButton: function(oEvent) {
			window.history.go(-1);
		}

	});

});