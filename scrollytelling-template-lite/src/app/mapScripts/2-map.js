"use strict";

export function initMap(L, map, region) {
  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
  }).addTo(map);

  if (region === 'canada') {
    map.setView([63, -96.3], 4);
  } else if (region === 'quebec' ){
    map.setView([55, -67], 5);
  } else {
    map.setView([45.55, -73.72], 11);
  }

  let svg = d3.select(map.getPanes().overlayPane).append("svg");
  svg.append("g").attr("class", "leaflet-zoom-hide");
      
  return svg;
}

export function createMapBorders(g, path, borders) {
  g.selectAll('path')
    .data(borders.features)
    .enter()
      .append('path')
      .attr('d', path)
      .attr('class', 'district')
      .style('fill', '#C0E2FA')
}

export function createMapCircles(g, borders, sources, path, abbreviations, date, tip, region) {

  console.log(date)
  g.selectAll('circle')
    .data(borders.features)
    .enter()
      .append('circle')
      .attr('r', function(d) {
        var zone;
        if (region == "montreal")
          zone = abbreviations.find(zone => zone['name'] == d.properties['district']).abbreviation;
        else
          zone = abbreviations.find(zone => zone['name'] == d.properties['name']).abbreviation;
        return Math.sqrt(sources[date].find(variable => variable['name'] == zone)['percentage']) * 1000;
      })

    
      .attr('class', 'district')
      .attr('cx', function(d) { return path.centroid(d)[0]; })
      .attr('cy', function(d) { return path.centroid(d)[1]; })
      .style('fill', '#C52A0D')
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);
}

export function updateMapCircles(g, sources, abbreviations, date, region) {
  console.log(date)
  g.selectAll('circle')
    .attr('r', function(d) {
      var zone;
      if (region == "montreal")
        zone = abbreviations.find(zone => zone['name'] == d.properties['district']).abbreviation;
      else
        zone = abbreviations.find(zone => zone['name'] == d.properties['name']).abbreviation;
      let result = Math.sqrt(sources[date].find(variable => variable['name'] == zone)['percentage']) * 1000;
      return result
    })
}

export function updateMap(svg, g, path, borders) {
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
    .attr('cx', function(d) { return path.centroid(d)[0]; })
    .attr('cy', function(d) { return path.centroid(d)[1]; })

  g.attr("transform", "translate(" + -leftBound + "," + -topBound + ")");

  d3.selectAll('.district').attr('d', path);
}
