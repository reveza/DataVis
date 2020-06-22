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
    .attr("transform", "translate(" + (width - 100) + "," + (height + 30) +")");
  g.append("g")
    .attr("class","y axis")
    .call(yAxis)
    .selectAll("text")
    //TODO: make it better than hardcoded
    .attr("transform", "translate(-15, -100), rotate(-90)");
  // g.append("text")
  //   .attr("class", "Y label")
  //   .text("Type de transmission");
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
      var yc_iterators= [0,0,0,0,0,0,0]
      var yv_iterators= [0,0,0,0,0,0,0]
      var xc_iterators = [0,0,0,0,0,0,0]
      var xv_iterators = [0,0,0,0,0,0,0]
      var maxCircle=0
      var index = 0;
      g.selectAll(".bar,.label")
      .data(data)
      .enter()
      .append("circle")
      .attr("class","dot")
      .attr("cx",function(d){
        index += 1;
        var ageIndex = x.domain().findIndex(
          function(n){
            return n == d.ageGroup
          })
            if(d.transmission == "Exposition communautaire"){
              var position = 2*r*xc_iterators[ageIndex];
              if(position < x.bandwidth()-10){
                xc_iterators[ageIndex] += 1;
                return x(d.ageGroup) + position;
              } else {                  
                maxCircle = xc_iterators[ageIndex];
                xc_iterators[ageIndex]=0;            
                return x(d.ageGroup);
              }
            } else {
              var position = 2*r*xv_iterators[ageIndex];
              if(position < x.bandwidth()-10){
                xv_iterators[ageIndex] += 1;
                return x(d.ageGroup) + position;
              } else{
                maxCircle = xv_iterators[ageIndex];
                xv_iterators[ageIndex]=0;
                return x(d.ageGroup);  
              }
            }
  
      })
      //.attr("height", x.bandwidth())
      .attr("cy",function (d) {
        var ageIndex = x.domain().findIndex(
          function(n){
            return n == d.ageGroup
          })
        if(d.transmission == "Exposition communautaire"){
          var position = 2*r*Math.floor(yc_iterators[ageIndex]/(maxCircle+1));
          yc_iterators[ageIndex]+=1  
        } else{
          var position = 2*r*Math.floor(yv_iterators[ageIndex]/(maxCircle+1));
          yv_iterators[ageIndex]+=1  
        }
        return (y(d.transmission) - position) + 200;
      })
      .attr("r",r)
      .style("fill",function(d){
          return color(d.status);
      });
      console.log(index);


    }
