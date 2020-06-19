"use strict";

/**
 * File used to draw the bubble chart.
 */


/**
 * Creates the bubble graph axis.
 *
 * @param g       The SVG group in which the bubble chart will be drawn.
 * @param xAxis   The X axis. 
 * @param yAxis   The Y axis.
 * @param height  The graphic's height.
 * @param width   The graphic's width.
 */
function createAxes(g, xAxis, yAxis, height, width) {
  // TODO: Draw the X and Y axes.
  g.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0," + height + " )")
    .call(xAxis);
  g.append("text")
    .attr("class", "x label")
    .text("Groupe d'âge")
    //Theres probably a better way to do this than just hardcode it
    .attr("transform", "translate(" + (width - 190) + "," + (height - 10) +")");
  g.append("g")
    .attr("class","y axis")
    .call(yAxis);
  g.append("text")
    .attr("class","y label")
    .text("Nombre d'individus")
    //Same here
    .attr("transform","translate(" + 17 + "," + 100 + "), rotate(-90)");
}

/**
 * Crée le graphique à bulles.
 *
 * @param g       The SVG group in which the bubble chart will be drawn.
 * @param data    Data to use.
 * @param x       Scale for the X axis.
 * @param y       Scale for the Y axis.
 * @param r       Scale for the circles' radiuses.
 * @param color   Scale for the circles' color.
 * @param tip     Tooltip to show when a circle is hovered.
 */
function createBubbleChart(g, data, x, y, r, color, tip) {
  // TODO: Draw the graph's circles by using the specified scales.
  //       Make sure you add the tooltip when a circle is hovered.
  g.selectAll("dot")
      .data(data)
      .enter()
      // .append("g")
      .append("circle")
      .attr("cx", function(d) { return x(d.lifeExpectancy);} )
      .attr("cy", function(d) { return y(d.income);} )
      .attr("r", function(d) { return r(d.population);} )
      .style("fill", function(d) { return color(d.zone);} )
      .style("opacity", "0.9")
      .on("mouseover", function(d){
        tip.show(d);
      })
      .on("mouseout", function(d){
        tip.hide();
      });
  
  }
