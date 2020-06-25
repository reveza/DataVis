

function createBubbles(g, data, r, color, tip){

    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle");
  }

//add option[gender, state] with a toggle for color ?
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
  
  
function addXAxis(g, xAxis, yAxis, height, width){
    g.append("g")
      .attr("class","x axis")
      .attr("transform", "translate(0," + height + " )")
      .call(xAxis);
    g.append("text")
      .attr("class", "x label")
      .text("Groupe d'âge")
      .attr("transform", "translate(" + (width - 50) + "," + (height + 30) +")"); 
  }