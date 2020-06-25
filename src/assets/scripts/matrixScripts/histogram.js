function matrixCreateHistogram(g, data, x, y, r, color, tip) {
    var y_iterators= [0,0,0,0,0,0,0]
    var x_iterators= [0,0,0,0,0,0,0]
    var maxCircle=0
    g.selectAll("circle")
    .data(data)
    .transition().duration(1000)
    // .enter()
    // .append("circle")
    .attr("cx",function(d){
      var index=x.domain().findIndex(function(n){return n==d.ageGroup})
      var position = 2*r*x_iterators[index]
      if(position<x.bandwidth()-10){
        x_iterators[index]+=1;
        return x(d.ageGroup)+position;
      }
      else{
        maxCircle=x_iterators[index];
        x_iterators[index]=0;
        return x(d.ageGroup);
      }
    })
    .attr("cy",function (d) {
      var index=x.domain().findIndex(function(n){return n==d.ageGroup})
      var position = 2*r*Math.floor(y_iterators[index]/(maxCircle+1));
      y_iterators[index]+=1
      return y("Exposition communautaire") - (position + r) + 300;
    })
    .attr("r",r)
    .style("fill", d=> color(d.status));

  }