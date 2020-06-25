/**
 * Main file allowing to display the required chart. This file uses the other files that you have to complete.
 */

(function (d3, localization) {
  "use strict";

  /***** Configuration *****/
  var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 80
  };
  var width = 1300 - margin.left - margin.right;
  var height = 800 - margin.top - margin.bottom;

  /***** Scales *****/
  var color = d3.scaleOrdinal();
  var x = d3.scaleBand().range([0, width]).padding(0.1);
  var y = d3.scaleBand().range([height, 0]).padding(0.1);
  var r = 5;

  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y);

  /***** Creation of the required svg elements *****/
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var matrixChartGroup = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var files = ["./data/Stats_de_nerds.csv"]
  var dataset=[];
  /***** Data loading *****/
  Promise.all(files.map(url => d3.csv(url))).then(function (results) {
      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0]);
      console.log(results[0]);
      /***** Data preprocessing *****/
      results.forEach(function (data) {
        dataset = initializeData(data);
        data.sort(function(a, b) {
          return d3.ascending(a.date, b.date);
        })
      });
    
      domainX(x);
      domainY(y);
      domainColor(color, results, null);
      //domainRadius(r, currentData);
      /***** Creation of the bubble chart *****/
      // createAxes(matrixChartGroup, xAxis, yAxis, height, width);
      getLegend(matrixChartGroup, width, height, color, results, null);
      createBubbleMatrix(matrixChartGroup, dataset, width, height, r, color, tip, x.domain(), y.domain());
      
      /***** Creation of the tooltip *****/
      tip.html(function(d) {
        return getToolTipText.call(this, d)
      });
      matrixChartGroup.call(tip);
    });

})(d3, localization);
