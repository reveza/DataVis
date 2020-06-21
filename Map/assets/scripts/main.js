/**
 * Main file for the map.
 */

(function (L, d3, topojson, localization) {
  "use strict";

  var panel = d3.select("#panel");
  var map = L.map('map', {
    'worldCopyJump': true,
    // 'scrollWheelZoom': false
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
      convertNumbers(cases, populations);

      let mtlAConfirmer = cases['montreal'].pop()['caseDates'];

      let data = createProportions(cases, populations);
      let sources = createSources(data)
      console.log(sources)

      /***** Map initialization *****/
      var mapSvg = initMap(L, map);
	    var g = undefined;
	    if (mapSvg) {
		    g = mapSvg.select("g");
	    }
      var path = createPath();

      createBorders(g, path, canadaBorders, showPanel);
      createCircles(g, canadaBorders, sources, path)
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
