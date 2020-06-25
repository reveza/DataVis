var abbreviations = [
  {name: "Quebec", abbreviation: "QC"},
  {name: "Newfoundland and Labrador", abbreviation: "NL"},
  {name: "British Columbia", abbreviation: "BC"},
  {name: "Nunavut", abbreviation: "NU"},
  {name: "Northwest Territories", abbreviation: "NT"},
  {name: "New Brunswick", abbreviation: "NB"},
  {name: "Nova Scotia", abbreviation: "NS"},
  {name: "Saskatchewan", abbreviation: "SK"},
  {name: "Alberta", abbreviation: "AB"},
  {name: "Prince Edward Island", abbreviation: "PE"},
  {name: "Yukon Territory", abbreviation: "YT"},
  {name: "Manitoba", abbreviation: "MB"},
  {name: "Ontario", abbreviation: "ON"},
/* Note:
 * Le Nunavik et Terres-Cries-de-la-Baie-James ne sont pas identifiées dans les zones de la carte.
 * Dans nos données, la Mauricie et le centre du Québec partagent les mêmes données alors
 * qu'elles sont séparées sur la carte.
*/
  {name: "Saguenay - Lac-Saint-Jean", abbreviation: "Saguenay–Lac-Saint-Jean"},
  {name: "Gaspésie - Îles-de-la-Madeleine", abbreviation: "Gaspésie–Îles-de-la-Madeleine"},
  {name: "Abitibi-Témiscamingue", abbreviation: "Abitibi-Témiscamingue"},
  {name: "Mauricie", abbreviation: "Mauricie–Centre-du-Québec"},
  {name: "Capitale-Nationale", abbreviation: "Capitale-Nationale"},
  {name: "Outaouais", abbreviation: "Outaouais"},
  {name: "Montérégie", abbreviation: "Montérégie"},
  {name: "Estrie", abbreviation: "Estrie"},
  {name: "Nord-du-Québec", abbreviation: "Nord-du-Québec"},
  {name: "Laurentides", abbreviation: "Laurentides"},
  {name: "Lanaudière", abbreviation: "Lanaudière"},
  {name: "Chaudière-Appalaches", abbreviation: "Chaudière-Appalaches"},
  {name: "Côte-Nord", abbreviation: "Côte-Nord"},
  {name: "Bas-Saint-Laurent", abbreviation: "Bas-Saint-Laurent"},
  {name: "Centre-du-Québec", abbreviation: "Mauricie–Centre-du-Québec"},
  {name: "Montréal", abbreviation: "Montréal"},
  {name: "Laval", abbreviation: "Laval"},
/* Note:
 * L'île Dorval n'est pas présente dans les zones géographiques de la carte.
*/
  {name: "Ahuntsic-Cartierville", abbreviation: "Ahuntsic–Cartierville"},
  {name: "Lachine", abbreviation: "Lachine"},
  {name: "L’Île-Bizard–Sainte-Geneviève", abbreviation: "L'Île-Bizard–Sainte-Geneviève"},
  {name: "Pierrefonds-Roxboro", abbreviation: "Pierrefonds–Roxboro"},
  {name: "Rivière-des-Prairies–Pointe-aux-Trembles", abbreviation: "Rivière-des-Prairies–Pointe-aux-Trembles"},
  {name: "Le Sud-Ouest", abbreviation: "Sud-Ouest"},
  {name: "Ville-Marie", abbreviation: "Ville-Marie"},
  {name: "DOLLARD-DES-ORMEAUX", abbreviation: "Dollard-des-Ormeaux"},
  {name: "CÔTE-SAINT-LUC", abbreviation: "Côte-Saint-Luc"},
  {name: "KIRKLAND", abbreviation: "Kirkland"},
  {name: "Outremont", abbreviation: "Outremont"},
  {name: "Le Plateau-Mont-Royal", abbreviation: "Plateau-Mont-Royal"},
  {name: "Saint-Léonard", abbreviation: "Saint-Léonard"},
  {name: "SAINTE-ANNE-DE-BELLEVUE", abbreviation: "Sainte-Anne-de-Bellevue"},
  {name: "Anjou", abbreviation: "Anjou"},
  {name: "BAIE D'URFE", abbreviation: "Baie-D'Urfé"},
  {name: "BEACONSFIELD", abbreviation: "Beaconsfield"},
  {name: "Côte-des-Neiges–Notre-Dame-de-Grâce", abbreviation: "Côte-des-Neiges–Notre-Dame-de-Grâce"},
  {name: "DORVAL", abbreviation: "Dorval"},
  {name: "HAMPSTEAD", abbreviation: "Hampstead"},
  {name: "LaSalle", abbreviation: "LaSalle"},
  {name: "Mercier–Hochelaga-Maisonneuve", abbreviation: "Mercier–Hochelaga-Maisonneuve"},
  {name: "MONTRÉAL-EST", abbreviation: "Montréal-Est"},
  {name: "MONTRÉAL-NORD", abbreviation: "Montréal-Nord"},
  {name: "MONTRÉAL-OUEST", abbreviation: "Montréal-Ouest"},
  {name: "MONT-ROYAL", abbreviation: "Mont-Royal"},
  {name: "Rosemont–La Petite-Patrie", abbreviation: "Rosemont–La Petite Patrie"},
  {name: "POINTE-CLAIRE", abbreviation: "Pointe-Claire"},
  {name: "Saint-Laurent", abbreviation: "Saint-Laurent"},
  {name: "SENNEVILLE", abbreviation: "Senneville"},
  {name: "Verdun", abbreviation: "Verdun"},
  {name: "Villeray–Saint-Michel–Parc-Extension", abbreviation: "Villeray–Saint-Michel–Parc-Extension"},
  {name: "WESTMOUNT", abbreviation: "Westmount"}
];

/**
 * Main file for the map.
 */

class mapSettings{
  constructor(L, d3, date, region) {
    this.L = L;
    this.d3 = d3;
    this.date = date;
    this.region = region
  }


  // projectPoint(x, y) {
  //   var point = map.latLngToLayerPoint(new L.LatLng(y, x));
  //   this.stream.point(point.x, point.y);
  // }
  
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

    /***** Data preprocessing *****/
    mapConvertNumbers(cases, populations);
    let mtlAConfirmer = cases['montreal'].pop()['caseDates'];
    let data = mapCreateProportions(cases, populations);
    this.sources = mapCreateSources(data)
    console.log(this.sources)
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
    createMapCircles(this.g, this.canadaBorders, this.sources, this.path, abbreviations, this.date, this.tip, this.region);
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
        zoneName = abbreviations.find(zone => zone['name'] == d.properties['district']).abbreviation;
      else
        zoneName = abbreviations.find(zone => zone.name == d.properties['name']).abbreviation;
      var zone = sources[date].find(variable => variable['name'] == zoneName);
      return showZoneInfo.call(this, zone)
    });
    this.g.call(this.tip);
  }

  mapSettingsUpdateDate(date){
    this.date = date;
    updateMapCircles(this.g, this.sources, abbreviations, date, this.region)
  }

}
