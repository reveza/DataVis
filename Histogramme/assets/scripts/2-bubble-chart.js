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
    .attr("transform", "translate(" + (width - 50) + "," + (height + 30) +")");
  /*g.append("g")
    .attr("class","y axis")
    .call(yAxis);
  g.append("text")
    .attr("class","y label")
    .text("Nombre d'individus")
    //Same here
    .attr("transform","translate(" + 17 + "," + 100 + "), rotate(-90)");*/
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

  
    function createBarChart(g, data, x, y, r, color, tip) {
      var bars=g.selectAll(".bar,.label")
      .data(data)
      .enter()
      .append("circle")
      .attr("class","dot")
      .attr("cx",function(d){
  
        return x(d.ageGroup)+x.bandwidth()/2;
      })
      //.attr("height", x.bandwidth())
      .attr("cy",function (d,i) {
        return y(i*10);
      })
      .attr("r",function(d){
        return 5;
      })
      .style("fill",function(d){
        //if (color.domain().includes(d.status))
          return color(d.status);
        //else
         // return "grey"
      });
    //Add percentage to the right of each bars
    /*bars.append("text")
      .attr("class", "label")
      .attr("cy", function (d) {
        return 10;
      })
      .attr("x", function (d) {
        return 10 + 3;
      });
*/

    }
