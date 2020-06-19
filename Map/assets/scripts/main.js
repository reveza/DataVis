/**
 * Main file for the map. This file uses the other files
 * you must complete. 
 *
 * /!\ No modification is needed in this file!
 */
(function (L, d3, topojson, searchBar, localization) {
  "use strict";

  var panel = d3.select("#panel");
  var map = L.map('map', {
    'worldCopyJump': true
  });

  var barChartMargin = {
    top: 0,
    right: 40,
    bottom: 0,
    left: 40
  };
  var barChartWidth = 300 - barChartMargin.left - barChartMargin.right;
  var barChartHeight = 150 - barChartMargin.top - barChartMargin.bottom;

  /***** Scales *****/
  var projection = d3.geoMercator().center([-114, 67.5]).scale(625)
  var circles = d3.geoPath().projection(projection)
  var x = d3.scaleLinear().range([0, barChartWidth]);
  var y = d3.scaleBand().range([0, barChartHeight]).padding(0.1);

  var yAxis = d3.axisLeft(y);

  /***** Creation of bar chart elements *****/
  var barChartSvg = panel.select("svg")
    .attr("width", barChartWidth + barChartMargin.left + barChartMargin.right)
    .attr("height", barChartHeight + barChartMargin.top + barChartMargin.bottom);

  var barChartGroup = barChartSvg.append("g")
    .attr("transform", "translate(" + barChartMargin.left + "," + barChartMargin.top + ")");

  var barChartBarsGroup = barChartGroup.append("g");
  var barChartAxisGroup = barChartGroup.append("g")
    .attr("class", "axis y");

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
      convertNumbers(cases, populations);

      let mtlAConfirmer = cases['montreal'].pop()['caseDates'];

      let sources = createProportions(cases, populations);

      console.log(sources)

      /***** Map initialization *****/
      initTileLayer(L, map);
      var mapSvg = initSvgLayer(map);
	  var g = undefined;
	  if (mapSvg) {
		g = mapSvg.select("g");
	  }
      var path = createPath();

      createBorders(g, path, canadaBorders, showPanel);
      createCircles(g, canadaBorders, sources, circles)
      map.on("viewreset", function () {
        updateMap(mapSvg, g, path, canadaBorders);
      });
      updateMap(mapSvg, g, path, canadaBorders);

      /***** Search for a district *****/
      var autoCompleteSources = d3.nest()
        .key(function (d) {
          return d.id;
        })
        .entries(cases)
        .map(function (d) {
          return {
            id: +d.values[0].id,
            name: d.values[0].name
          };
        })
        .sort(function (a, b) {
          return d3.ascending(a.name, b.name);
        });

      var searchBarElement = searchBar(autoCompleteSources);
      searchBarElement.search = function (id) {
        var feature = canada.features.find(function (d) {
          return d.properties["NUMCF"] === id;
        });
        var bound = d3.geoBounds(feature);
        search(map, g, id, [
          [bound[0][1], bound[0][0]],
          [bound[1][1], bound[1][0]]
        ], showPanel);
      };

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

})(L, d3, topojson, searchBar, localization);
