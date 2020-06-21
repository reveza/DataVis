"use strict";

function initMap(L, map) {
  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      maxZoom: 12,
      minZoom: 2
  }).addTo(map);
  map.setView([63, -97], 4);

  let svg = d3.select(map.getPanes().overlayPane).append("svg");
  svg.append("g").attr("class", "leaflet-zoom-hide");
      
  return svg;
}

function createMapBorders(g, path, borders) {
  g.selectAll('path')
    .data(borders.features)
    .enter()
      .append('path')
      .attr('d', path)
      .attr('class', 'district')
      .style('fill', '#C0E2FA')
      
}

function createMapCircles(g, borders, sources, path, abbreviations, date, tip, region) {
  console.log(sources)
  g.selectAll('circle')
    .data(borders.features)
    .enter()
      .append('circle')
      .attr('r', function(d) {
        var zone;
        if(region == "montreal")
          zone = abbreviations.find(zone => zone['name'] == d.properties['district']).abbreviation;
        else
          zone = abbreviations.find(zone => zone['name'] == d.properties['name']).abbreviation;
        
        return Math.sqrt(sources[date].find(variable => variable['name'] == zone)['percentage'])*200;
      })
      .attr('class', 'district')
      .attr('cx', function(d) {return path.centroid(d)[0];})
      .attr('cy', function(d) {return path.centroid(d)[1];})
      .style('fill', '#C52A0D')
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);
}

function updateMap(svg, g, path, borders) {
  let bounds = path.bounds(borders);
  
  let leftBound = bounds[0][0];
  let rightBound = bounds[1][0];
  let topBound = bounds[0][1];
  let bottomBound = bounds[1][1];
  
	svg.attr("width", rightBound - leftBound)
  .attr("height", bottomBound - topBound)
  .style("left", leftBound + "px")
  .style("top", topBound + "px");
  
  g.selectAll('circle')
    .attr('cx', function(d) {return path.centroid(d)[0];})
    .attr('cy', function(d) {return path.centroid(d)[1];})

  g.attr("transform", "translate(" + -leftBound + "," + -topBound + ")");

  d3.selectAll('.district').attr('d', path);
}
