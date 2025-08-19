module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			// uglify js task configuration for Charting files goes here.
			applyCharting: {
				options: {
					banner: '/*! <%= pkg.chartingTitle %> V<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>) \n <%= pkg.license %> */\n',
					sourceMap: true,
					sourceMapIncludeSources: true,
					maxLineLen: 32000,
					mangle: {
						reserved: ['jqEasyUI']
					},
					compress: {
						drop_console: true
					}
				},
				files: [{
						src: ['<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/Widget.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/Chart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/DataGrid.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/Filter.js'
						],
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/chartingBase.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/jquery.sparkline.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/jquery.sparkline.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/svg.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/svg.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/sha256.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/sha256.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/xml2json.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/xml2json.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/Leaflet.MakiMarkers.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/Leaflet.MakiMarkers.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/leaflet.markercluster-src.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/leaflet.markercluster-src.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/leaflet.provider.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/leaflet.provider.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/visTimeline.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/visTimeline.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/visNetwork.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/visNetwork.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/jquery.ui.treemap.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/jquery.ui.treemap.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/jquery.listswap.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/js/jquery.listswap.min.js'
					},
					{
						src: ['<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/AreaChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/BarChart.js',
						    '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/BenchmarkAnalysisChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/BoxPlotChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/BubbleChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/CandleStickChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/ChevronChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/CircumplexChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/ColumnStackChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/CustomChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/DecisionTreeChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/DecompositionChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/GroupBarChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/GroupColumnChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/HeatMapChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/HistogramChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/InvertedFunnelChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/KPITile.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/LineChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/MitoPlotChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/MixedChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/NewWordCloudChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/PieChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/ProgressChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/ProjectTimelineChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/SankeyChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/ScatteredPlotChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/SentimentPlotChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/SparkLineChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/SpiderChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/TimelineChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/TreeMapChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/TrellisChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/WaterfallChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/WordCloudChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/InvertedFunnelChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/SimpleFunnelChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/PyramidChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/maps/WorldMapChart.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/datagrids/DynamicDataGrid.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/datagrids/SimpleDataGrid.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/datagrids/PagingDataGrid.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/datagrids/TreeGrid.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/datagrids/JExcelDataGrid.js',							
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/filters/ListFilter.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/filters/CheckboxFilter.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/filters/ComboFilter.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/filters/HierarchicalCombo.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/filters/RadioFilter.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/container/Rectangle.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/buttons/ExportToPPTButton.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/buttons/FilterSaver.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/Bullet.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/DataSearch.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/DatePicker.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/Gauge.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/GuidedTour.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/HSlider.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/ImageComponent.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/InfoButton.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/Label.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/Legend.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/NumericStepper.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/SemiGauge.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/SVGImage.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/SVGShape.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/TextBox.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/Trend.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/UrlButton.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/VSlider.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/FilterChips.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/InputButton.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/InputBox.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/TabComponent.js'
						],
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/chartingComponents.min.js'
					},
					{
						src: ['<%= pkg.srcPath %>src/main/webapp/views/charting/src/bdbizviz.ext/BizVizDesignUserSDK.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bdbizviz.ext/UserScriptExecuter.js'
						],
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.ext/chartingSDK.min.js'
					},
					{
						src: ['<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.framework/Parser.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.framework/DataManager.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.framework/ServiceManager.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.framework/GlobalVariableController.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.framework/RendererController.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.framework/FrameworkController.js',
							'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.framework/FrameworkComponents.js'
						],
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.framework/chartingFramework.min.js'
					},

					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/buttons/ExportPlugin.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/buttons/ExportPlugin.min.js'
					},

					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/buttons/FilterSaver.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/buttons/FilterSaver.min.js'
					},
					
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/buttons/ExportToPPTButton.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/buttons/ExportToPPTButton.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/AreaChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/AreaChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/BarChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/BarChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/BenchmarkAnalysisChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/BenchmarkAnalysisChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/BoxPlotChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/BoxPlotChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/BubbleChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/BubbleChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/CandleStickChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/CandleStickChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/ChevronChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/ChevronChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/CircumplexChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/CircumplexChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/ColumnStackChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/ColumnStackChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/CustomChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/CustomChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/DecisionTreeChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/DecisionTreeChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/DecompositionChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/DecompositionChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/GroupBarChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/GroupBarChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/GroupColumnChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/GroupColumnChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/HeatMapChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/HeatMapChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/HistogramChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/HistogramChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/KPITile.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/KPITile.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/LineChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/LineChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/MitoPlotChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/MitoPlotChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/MixedChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/MixedChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/NewWordCloudChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/NewWordCloudChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/PieChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/PieChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/ProjectTimelineChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/ProjectTimelineChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/ProgressChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/ProgressChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/SankeyChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/SankeyChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/ScatteredPlotChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/ScatteredPlotChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/SentimentPlotChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/SentimentPlotChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/SparkLineChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/SparkLineChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/SpiderChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/SpiderChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/TimelineChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/TimelineChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/TreeMapChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/TreeMapChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/TrellisChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/TrellisChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/WaterfallChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/WaterfallChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/WordCloudChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/WordCloudChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/InvertedFunnelChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/InvertedFunnelChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/SimpleFunnelChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/SimpleFunnelChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/charts/PyramidChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/charts/PyramidChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/maps/WorldMapChart.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/maps/WorldMapChart.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/container/Rectangle.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/container/Rectangle.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/datagrids/DynamicDataGrid.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/datagrids/DynamicDataGrid.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/datagrids/SimpleDataGrid.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/datagrids/SimpleDataGrid.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/datagrids/PagingDataGrid.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/datagrids/PagingDataGrid.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/datagrids/TreeGrid.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/datagrids/TreeGrid.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/datagrids/JExcelDataGrid.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/datagrids/JExcelDataGrid.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/filters/CheckboxFilter.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/filters/CheckboxFilter.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/filters/ComboFilter.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/filters/ComboFilter.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/filters/HierarchicalCombo.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/filters/HierarchicalCombo.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/filters/ListFilter.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/filters/ListFilter.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/filters/RadioFilter.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/filters/RadioFilter.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/Bullet.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/Bullet.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/DataSearch.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/DataSearch.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/DatePicker.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/DatePicker.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/Gauge.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/Gauge.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/GuidedTour.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/GuidedTour.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/HSlider.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/HSlider.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/ImageComponent.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/ImageComponent.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/InfoButton.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/InfoButton.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/Label.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/Label.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/Legend.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/Legend.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/NumericStepper.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/NumericStepper.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/SemiGauge.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/SemiGauge.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/SVGImage.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/SVGImage.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/SVGShape.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/SVGShape.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/TextBox.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/TextBox.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/Trend.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/Trend.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/UrlButton.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/UrlButton.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/VSlider.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/VSlider.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/FilterChips.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/FilterChips.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/InputButton.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/InputButton.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/InputBox.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/InputBox.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/singleValuedComponent/TabComponent.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/components/singleValuedComponent/TabComponent.min.js'
					}
				]
			},
			applyDesigner: {
				// uglify js task configuration for Designer files goes here.
				options: {
					banner: '/*! <%= pkg.designerTitle %> V<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>) \n <%= pkg.license %> */\n',
					sourceMap: true,
					sourceMapIncludeSources: true,
					maxLineLen: 32000,
					compress: {
						drop_console: true
					}
				},
				files: [{
						src: ['<%= pkg.srcPath %>src/main/webapp/views/designer/common/app.js', '<%= pkg.srcPath %>src/main/webapp/views/designer/controllers/*.js'],
						dest: '<%= pkg.srcPath %>src/main/webapp/views/designer/build-config/build/designer.ctrl.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/designer/directives/*.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/designer/build-config/build/designer.dir.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/designer/factories/*.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/designer/build-config/build/designer.fact.min.js'
					},
					{
						src: '<%= pkg.srcPath %>src/main/webapp/views/designer/resources/plugins/bvzPlugins/js/bvzNumberSpinner.js',
						dest: '<%= pkg.srcPath %>src/main/webapp/views/designer/build-config/build/bvzNumberSpinner.min.js'
					}
				]
			}
		},
		cssmin: {
			// css min task configuration goes here.
			applyDesigner: {
				files: [
					{src: ['<%= pkg.srcPath %>src/main/webapp/views/designer/resources/css/help.css', '<%= pkg.srcPath %>src/main/webapp/views/designer/resources/css/Designer.css'], dest: '<%= pkg.srcPath %>src/main/webapp/views/designer/build-config/build/designer.min.css'},
					{src: '<%= pkg.srcPath %>src/main/webapp/views/designer/resources/plugins/bvzPlugins/css/bvzNumberSpinner.css', dest: '<%= pkg.srcPath %>src/main/webapp/views/designer/build-config/build/bvzNumberSpinner.min.css'},
					{src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/css/charting.css', dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/css/charting.min.css'},
					{src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/css/leaflet.css', dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/css/leaflet.min.css'},
					{src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/css/listswap.css', dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/css/listswap.min.css'},
					{src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/css/visTimeline.css', dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/css/visTimeline.min.css'},
					{src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/css/easyui.css', dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/css/easyui.min.css'},
					{src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/css/bdbizviz-font-styles.css', dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/css/bdbizviz-font-styles.min.css'},
					{src: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/css/jquery-smoothness-ui.css', dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/css/jquery-smoothness-ui.min.css'},
				]
			},
			applyCharting: {
				files: [
					{src: ['<%= pkg.srcPath %>src/main/webapp/resources/lib/bootstrap/css/bootstrap.css', 
					'<%= pkg.srcPath %>src/main/webapp/resources/lib/bootstrap/css/bootstrap-tour.css', 
					'<%= pkg.srcPath %>src/main/webapp/views/designer/resources/css/bvz-loader.css', 
					'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/css/easyui.css', 
					'<%= pkg.srcPath %>src/main/webapp/views/charting/src/bizviz.charting/components/resources/css/jquery-smoothness-ui.css'], dest: '<%= pkg.srcPath %>src/main/webapp/views/charting/build-config/build/bizviz.charting/resources/css/chartingDependencies.min.css'}
					]
			}
		},
		cache_control: {
			your_target: {
				source: ["<%= pkg.srcPath %>src/main/webapp/views/charting/dashboardhome.html", "<%= pkg.srcPath %>src/main/webapp/views/designer/views/Preview.html"],
				options: {
					version: '<%= pkg.version %>.<%= grunt.template.today("yyyymmdd") %>.<%= grunt.template.today("HHMMss") %>',
					links: true,
					scripts: true,
					replace: true,
					filesToIgnore: ["src/bizviz.charting/components/resources/js/"],
					dojoCacheBust: false
				}
			}
		},
		replace_json: {
			dotenv:{
				src: '<%= pkg.srcPath %>src/main/webapp/views/designer/resources/data/appSettings.data',
				changes: {
					'global.versionDetail': '<%= pkg.version %>',
					'global.buildDate': '<%= grunt.template.today("mmmm d, HH:MM") %>'
				}
			}
		},
		replace: {
		      dist: {
		        options: {
		          patterns: [
		        	{
		        		json: {
		        			"timestamp": '<%= pkg.version %>.<%= grunt.template.today("yyyymmdd") %>.<%= grunt.template.today("HHMMss") %>', // replaces "@@timestamp" to "version+timestamp"
		        			"versionDetail": '<%= pkg.version %>',
		        			"buildDate": '<%= grunt.template.today("mmmm d, HH:MM") %>'
		        		}
		        	}
		          ]
		        },
		        files: [
		          {expand: true, flatten: true, src: ['<%= pkg.srcPath %>src/main/webapp/views/designer/common/appSettings.js'], dest: '<%= pkg.srcPath %>src/main/webapp/views/designer/build-config/build/'}
		        ]
		      }
		    }
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Load the plugin that provides the "css minification" task.
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	
	// Load the plugin that provides the "versioning" task.
	grunt.loadNpmTasks('grunt-cache-control');
	
	// Load the plugin that provides the "json update" task.
	grunt.loadNpmTasks('grunt-replace-json');
	
	// Load the plugin that provides the "js replace" task.
	grunt.loadNpmTasks('grunt-replace');
	
	// Default task(s).
	grunt.registerTask('default', ['uglify', 'cssmin', 'cache_control', 'replace_json', 'replace']);

};