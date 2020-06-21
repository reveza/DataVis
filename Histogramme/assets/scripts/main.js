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
  var color = d3.scaleOrdinal(d3.schemeCategory10);
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
        data.sort(function(a, b) {
          return d3.ascending(a.date, b.date);
        })
      });
      //console.log(dataset)
    
      domainX(x);
      domainY(y);
      //domainColor(color, currentData);
      //domainRadius(r, currentData);

      /***** Creation of the bubble chart *****/
      createAxes(bubbleChartGroup, xAxis, yAxis, height, width);
      createBarChart(bubbleChartGroup, dataset, x, y, r, color, tip);

      /***** Transitions between the year 2000 and 2014. *****/
      var toggleButtons = d3.selectAll(".toggle-buttons > button");
      toggleButtons.on("click", function(d, i) {
          currentYear = d3.select(this).text();
          currentData = dataset[i];
          toggleButtons.classed("active", function() {
            return currentYear === d3.select(this).text();
          });

          domainRadius(r, currentData);
          transition(bubbleChartGroup, currentData, x, y, r);
        });

      // Adding event handler for the input search bar and its associated button. 
      var searchBarInput = d3.select("#search-bar input");
      searchBarInput.on("keydown", function () {
        if (d3.event.key === "Enter") {
          validateInput();
        } else {
          reset(bubbleChartGroup);
          searchBarInput.classed("error", false);
        }
      });
      d3.select("#search-bar button")
        .on("click", validateInput);

      /**
       * Validates the input in the search bar and does a search.
       */
      function validateInput() {
        function normalize(str) {
          return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
        var value = searchBarInput.node().value.toLowerCase();
        if (!value) {
          return;
        }
        var currentValue = normalize(value);
        const countryFound = currentData.find(function(zone) {
          return normalize(zone.name.toLowerCase()) === currentValue;
        });
        if (countryFound) {
          search(countryFound.name, bubbleChartGroup);
        } else {
          reset(bubbleChartGroup);
          searchBarInput.classed("error", true);
        }
      }

      /***** Creation of the tooltip *****/
      tip.html(function(d) {
        return getToolTipText.call(this, d, localization.getFormattedNumber)
      });
      bubbleChartGroup.call(tip);
    });

})(d3, localization);
