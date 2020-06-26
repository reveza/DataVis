/* Note:
 * Le Nunavik et Terres-Cries-de-la-Baie-James ne sont pas identifiées dans les zones de la carte.
 * Dans nos données, la Mauricie et le centre du Québec partagent les mêmes données alors
 * qu'elles sont séparées sur la carte.
*/

/* Note:
 * L'île Dorval n'est pas présente dans les zones géographiques de la carte.
*/

/**
 * Main file for the map.
 */

class mapSettings{
  constructor(L, d3, date, region) {
    this.L = L;
    this.d3 = d3;
    this.date = date;
    this.region = region;
  }
  
  createPath() {
    var map = this.map;
    var transform = d3.geoTransform({point: function(x,y){
      var point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }});
    return d3.geoPath().projection(transform);
  }

  mapSettingsInitViz(){   

    this.map = L.map('map', {
      'worldCopyJump': true,
      'scrollWheelZoom': false
    });
    this.tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0]);
  }


  async mapSettingsCreateSources(){
    /***** Loading data *****/
    var promises = [];
    promises.push(this.d3.csv("./data/Montréal.csv"));
    promises.push(this.d3.csv("./data/Québec.csv"));
    promises.push(this.d3.csv("./data/Canada.csv"));
    promises.push(this.d3.csv("./data/Montréal-Population.csv"));
    promises.push(this.d3.csv("./data/Québec-Population.csv"));
    promises.push(this.d3.csv("./data/Canada-Population.csv"));
    promises.push(this.d3.json("https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson"));
    promises.push(this.d3.json("https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/quebec.geojson"));
    promises.push(this.d3.json("./data/montreal_map.geojson"));
    promises.push(this.d3.json("./data/abbreviations.json"));

    let cases = {};

    cases['montreal'] = await promises[0];
    cases['quebec'] = await promises[1];
    cases['canada'] = await promises[2];

    let populations = {};
    populations['montreal'] = await promises[3];
    populations['quebec'] = await promises[4];
    populations['canada'] = await promises[5];
    
    this.canadaBorders = await promises[6];
    this.quebecBorders = await promises[7];
    this.montrealBorders = await promises[8];

    this.abbreviations = await promises[9]

    /***** Data preprocessing *****/
    mapConvertNumbers(cases, populations);
    let mtlAConfirmer = cases['montreal'].pop()['caseDates'];
    let data = mapCreateProportions(cases, populations);
    this.sources = mapCreateSources(data)
  }

  /***** Map initialization *****/
  mapSettingsInitMap(){
    this.mapSvg = initMap(this.L, this.map);
    this.g = undefined;
    if (this.mapSvg) {
      this.g = this.mapSvg.select("g");
    }
    this.path = this.createPath();
    

    createMapBorders(this.g, this.path, this.canadaBorders);
    createMapCircles(this.g, this.canadaBorders, this.sources, this.path, this.abbreviations, this.date, this.tip, this.region);
    this.map.on("moveend", () => {
      updateMap(this.mapSvg, this.g, this.path, this.canadaBorders);
    });
    updateMap(this.mapSvg, this.g, this.path, this.canadaBorders);
  }

  mapSettingsCreateTooltip(){
    let region = this.region;
    let date = this.date;
    let sources= this.sources;

    this.tip.html(function(d) {
      var zoneName;

      if(region == "montreal")
        zoneName = this.abbreviations.find(zone => zone['name'] == d.properties['district']).abbreviation;
      else
        zoneName = this.abbreviations.find(zone => zone.name == d.properties['name']).abbreviation;
      var zone = sources[date].find(variable => variable['name'] == zoneName);
      return showZoneInfo.call(this, zone)
    });
    this.g.call(this.tip);
  }

  mapSettingsUpdateDate(date){
    this.date = date;
    updateMapCircles(this.g, this.sources, this.abbreviations, date, this.region)
  }

}
