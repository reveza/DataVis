/* Note:
 * Le Nunavik et Terres-Cries-de-la-Baie-James ne sont pas identifiées dans les zones de la carte.
 * Dans nos données, la Mauricie et le centre du Québec partagent les mêmes données alors
 * qu'elles sont séparées sur la carte.
*/

/* Note:
 * L'île Dorval n'est pas présente dans les zones géographiques de la carte.
*/

(function (L, d3) {
  "use strict";

  var date = "20/04/26";
  var region = "canada"
  var map = L.map('map', {
    'worldCopyJump': true
  });
  var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0]);

  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }

  function createPath() {
    var transform = d3.geoTransform({point: projectPoint});
    return d3.geoPath().projection(transform);
  }

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
  promises.push(d3.json("./data/abbreviations.json"));

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

      let abbreviations = results[9];

      /***** Data preprocessing *****/
      mapConvertNumbers(cases, populations);

      let mtlAConfirmer = cases['montreal'].pop()['caseDates'];

      let data = mapCreateProportions(cases, populations);
      let sources = mapCreateSources(data)

      /***** Map initialization *****/
      var mapSvg = initMap(L, map);
	    var g = undefined;
	    if (mapSvg) {
		    g = mapSvg.select("g");
	    }
      var path = createPath();

      createMapBorders(g, path, canadaBorders);
      createMapCircles(g, canadaBorders, sources, path, abbreviations, date, tip, region)
      map.on("moveend", function () {
        updateMap(mapSvg, g, path, canadaBorders);
      });
      updateMap(mapSvg, g, path, canadaBorders);

      /***** Creation of the tooltip *****/
      tip.html(function(d) {
        var zoneName;
        if(region == "montreal")
          zoneName = abbreviations.find(zone => zone['name'] == d.properties['district']).abbreviation;
        else
          zoneName = abbreviations.find(zone => zone.name == d.properties['name']).abbreviation;
        var zone = sources[date].find(variable => variable['name'] == zoneName);
        return showZoneInfo.call(this, zone)
      });
      g.call(tip);
    });

})(L, d3);
