"use strict";

/**
 * Crée le graphe à bulles.
 *
 * @param g       The SVG group in which the bubble chart will be drawn.
 * @param data    Data to use.
 * @param width   Width of the svg group.
 * @param height  Height of the svg group.
 * @param r       Scale for the circles' radiuses.
 * @param color   Scale for the circles' color.
 * @param tip     Tooltip to show when a circle is hovered.
 * @param domainX Domain of x -> age group
 * @param domainY Domain of y -> transmission type
 */

function createBubbleMatrix(g, data, width, height, r, color, tip, domainX , domainY){
  
  //Location to move the cicrcles towards
  var ageTTCenters = {}
  var sizeXgroup = width / (domainX.length + 1);
  var sizeYgroup = height / (domainY.length + 1);
  var titlesPosition ={}
  domainY.forEach((y,j) => (
    titlesPosition[y] = (j+1)*sizeYgroup,
    domainX.forEach((x,i) => (
      titlesPosition[x] = (i+1)*sizeXgroup,
      ageTTCenters[x.concat(y)] = {"x":(i+1)*sizeXgroup, "y":(j+1)*sizeYgroup})))
  );
    

  //Show titles according to bubbles positions
  g.selectAll('.titles')
    .data(domainY)
    .enter()
    .append('text')
    .attr('class', 'transmission')
    .attr('x', 0)
    .attr('y', function(d){ return titlesPosition[d]})
    .text(function (d) { return d;})
    .attr("transform", "translate(0, -80)");
  g.selectAll('.titles')
    .data(domainX)
    .enter()
    .append('text')
    .attr('class', 'age')
    .attr('x', function(d){ return titlesPosition[d]})
    .attr('y', height)
    .text(function (d) { return d;})
    .attr("transform", "translate(-20,10)");

  //Force applied to each node for it to go to its respective positions
  var forceStrength = 0.03;
  var charge = -Math.pow(r, 2.0) * forceStrength;
  var simulation = d3.forceSimulation(data)
    // .velocityDecay(0.25)
    .force('x', d3.forceX().x(d => nodePosition(d).x))
    .force('y', d3.forceY().y(d => nodePosition(d).y))
    .force('collision', d3.forceCollide().radius(r))
    // .force('charge', d3.forceManyBody().strength(-2*r/3))
      //   function(d){
    //     if(d.status == "deceased"){ return r}
    //     if(d.status == "intensiveCare"){ return 0}
    //     if(d.status == "hospitalization"){return -1*r/5}
    //     else { return -1*r}  
    // }
    .on('tick', ticked);

  
  function ticked() {
    var bubbles = g.selectAll("circle").data(data);
    bubbles
      .enter()
      .append("circle")
      .classed('bubble', true)
      .attr('r', r)
      .on('mouseover', function(d){ tip.show(d);})
      .on('mouseout', function(d) { tip.hide();})
      .merge(bubbles)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("fill",function(d){return color(d.status);});

    bubbles.exit().remove();
  }

  function nodePosition(d){
    return ageTTCenters[d.ageGroup.concat(d.transmission)];
  }

}

//add option = [gender, state] for color ?
function getLegend(g, width, height, color, option){
  var boxSize = 10;
  var spaceBetweenBoxes = 10;
  var xLegend = width - 100;
  var yLegend = 20;
  var legend = g.selectAll('.legend')
    .data(["deceased", "healthy", "hospitalization", "intensiveCare"])
    .enter()
    .append('g')
    .attr('class','legend');
  legend.append("rect")
    .attr("name", d => d)
    .attr("x", xLegend)
    .attr("y", function(d,i) { return yLegend + i * (boxSize + spaceBetweenBoxes)})
    .attr("width", boxSize)
    .attr("height", boxSize)
    .attr("fill", d=> color(d))
  legend.append("text")
    .attr("x", xLegend + 20)
    .attr("y", function(d,i){return yLegend + 8 + i * (boxSize + spaceBetweenBoxes)})
    .text(d => d)
    .style("fill", d => color(d))
    .style("alignement-baseline", "middle");
}


