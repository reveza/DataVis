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
  var width = 1000 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;

  /***** Scales *****/

  //var colors = ["#2ca02c","#ff7f0e","#d62728","#9467bd"]
  var status=setStatus();
  var color =domainColor(status);
  var x = d3.scaleBand().range([0, width]).padding(0.1);
  var y = d3.scaleLinear().range([height, 0]);
  var r = 5;

  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y).tickFormat(localization.getFormattedNumber);

  /***** Creation of the required svg elements *****/
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var bubbleChartGroup = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var files = ["./data/Stats_de_nerds.csv"]
  var dataset=[];
  /***** Data loading *****/
  Promise.all(files.map(url => d3.csv(url))).then(function (results) {
      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0]);

      /***** Data preprocessing *****/
      results.forEach(function (data) {
      dataset=initializeData(data);
      dataset.sort(function(a, b) {
          return status.indexOf(a.status)-status.indexOf(b.status);
        })
      });
    
      domainX(x);
      domainY(y);
      domainColor(color);

      /***** Creation of the bubble chart *****/
      createAxes(bubbleChartGroup, xAxis, yAxis, height, width);
      createBarChart(bubbleChartGroup, dataset, x, y, r, color, tip);

      /***** Creation of the legend *****/
      legend(svg, dataset, color);
      
      /***** Creation of the tooltip *****/
      tip.html(function(d) {
        return getToolTipText.call(this, d, localization.getFormattedNumber)
      });
      bubbleChartGroup.call(tip);
    });

})(d3, localization);
