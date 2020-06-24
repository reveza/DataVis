/**
 * Main file for the map.
 */

(function (L, d3, topojson, localization) {
  "use strict";

  var panel = d3.select("#panel");
  var map = L.map('map', {
    'worldCopyJump': true,
    'scrollWheelZoom': false,
    'zoomControl': false,
    'doubleClickZoom': false
  });

  /***** Loading data *****/
  var promises = [];
  promises.push(d3.csv("./data/Montréal.csv"));
  promises.push(d3.csv("./data/Québec.csv"));
  promises.push(d3.csv("./data/Canada.csv"));
  promises.push(d3.csv("./data/Montréal-Population.csv"));
  promises.push(d3.csv("./data/Québec-Population.csv"));
  promises.push(d3.csv("./data/Canada-Population.csv"));
  promises.push(d3.json("https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson"));
  promises.push(d3.json("https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/quebec.geojson"));
  promises.push(d3.json("./data/montreal_map.geojson"));

  Promise.all(promises)
    .then(function (results) {
      let cases = {};
      cases['montreal'] = results[0];
      cases['quebec'] = results[1];
      cases['canada'] = results[2];

      let populations = {};
      populations['montreal'] = results[3];
      populations['quebec'] = results[4];
      populations['canada'] = results[5];
      
      let canadaBorders = results[6];
      let quebecBorders = results[7];
      let montrealBorders = results[8];

      /***** Data preprocessing *****/
      mapConvertNumbers(cases, populations);

      let mtlAConfirmer = cases['montreal'].pop()['caseDates'];

      let data = mapCreateProportions(cases, populations);
      let sources = mapCreateSources(data)
      console.log(sources)

      /***** Map initialization *****/
      var mapSvg = initMap(L, map);
	    var g = undefined;
	    if (mapSvg) {
		    g = mapSvg.select("g");
	    }
      var path = createPath();

      createMapBorders(g, path, canadaBorders, showPanel);
      createMapCircles(g, canadaBorders, sources, path)
      map.on("moveend", function () {
        updateMap(mapSvg, g, path, canadaBorders, path);
      });
      updateMap(mapSvg, g, path, canadaBorders, path);

      /***** Information panel management *****/
      panel.select("button")
        .on("click", function () {
          reset(g);
          panel.style("display", "none");
        });

      /**
       * Display the panel for a specific distract.
       *
       * @param districtId    The number of the district to use to show the right information.
       */
      function showPanel(districtId) {
        /*var districtSource = sources.find(function (e) {
          return districtId === e.id;
        });

        panel.style("display", "block");
        updateDomains(districtSource, x, y);
        updatePanelInfo(panel, districtSource, localization.getFormattedNumber);
        updatePanelBarChart(barChartBarsGroup, barChartAxisGroup, districtSource, x, y, yAxis, color, parties)
        */
      }
    });

  /**
   * Projects a point in the map.
   *
   * @param x   The point X to project.
   * @param y   The point Y to project.
   */
  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }

  /**
   * Traces a set of coordinates in the map
   *
   * @return {*}  The transformation to use
   */
  function createPath() {
    var transform = d3.geoTransform({point: projectPoint});
    return d3.geoPath().projection(transform);
  }

})(L, d3, topojson, localization);

(function (d3, localization) {
  "use strict";

  /***** Configuration *****/
  var margin = {
    top: 1000,
    right: 50,
    bottom: 50,
    left: 80
  };
  //var width = 1000 - margin.left - margin.right;
  //var height = 600 - margin.top - margin.bottom;
  var width = 1000;
  var height = 500;

  /***** Scales *****/
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  var x = d3.scaleBand().range([0, width]).padding(0.1);
  var y = d3.scaleLinear().range([height, 0]);
  var r = 5;

  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y).tickFormat(localization.getFormattedNumber);

  /***** Creation of the required svg elements *****/
  var svg = d3.select("#histogram")
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
      /*tip.html(function(d) {
        return getToolTipText.call(this, d, localization.getFormattedNumber)
      });
      bubbleChartGroup.call(tip);*/
    });

})(d3, localization);
