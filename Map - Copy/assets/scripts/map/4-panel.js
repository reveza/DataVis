"use strict";

/**
 * Update the X and Y domains used by the horizontal bar chart when the data is modified. 
 *
 * @param districtSource    The data associated to a district
 * @param x                 The X scale
 * @param y                 The Y scale
 */
function updateDomains(districtSource, x, y) {
  x.domain([d3.min(districtSource.results, d => d.votes),
            d3.max(districtSource.results, d => d.votes)]);

  let parties = [];
  districtSource.results.forEach(res => parties.push(res.party));
  y.domain(parties)
}

/**
 * Update the textual information in the information panel based on the new data
 *
 * @param panel             The D3 element corresponding to the information panel.
 * @param districtSource    The data associated to a district.
 * @param formatNumber      Function to correctly format numbers. 
 */
function updatePanelInfo(panel, districtSource, formatNumber) {
  panel.select('#district-name').text(districtSource.name + ' [' + districtSource.id + ']');
  panel.select('#elected-candidate').text(districtSource.results[0].candidate + ' (' + districtSource.results[0].party + ')')
  panel.select('#votes-count').text(formatNumber(districtSource.results[0].votes) + ' votes')

}

/**
 * Met à jour le diagramme à bandes horizontales à partir des nouvelles données de la circonscription sélectionnée.
 * Updates the horizontal bar chart based on the new data from the selected district. 
 *
 * @param gBars             The group where the bars should be created. 
 * @param gAxis             The group where the Y axis of the graph should be created. 
 * @param districtSource    The data associated to a riding. 
 * @param x                 The X scale. 
 * @param y                 The Y scale. 
 * @param yAxis             The Y axis. 
 * @param color             The color scale associated to each political party. 
 * @param parties           The information to use on the different parties. 
 *
 * @see https://bl.ocks.org/hrecht/f84012ee860cb4da66331f18d588eee3
 */
function updatePanelBarChart(gBars, gAxis, districtSource, x, y, yAxis, color, parties) {

  gBars.selectAll(".bar").remove();
  
  yAxis.tickFormat(d => {
    let cur_parties = parties.find(p => p.name === d)
    if(typeof(cur_parties) === 'undefined')
      return "Autre"
    return cur_parties.abbreviation
  })
  gAxis.attr("class", "y axis")
       .call(yAxis);
  
  let bars = gBars.selectAll(".bar")
       .data(districtSource.results)
       .enter()
       .append('g')
       .classed('bar', true)

  bars.append('rect')
        .attr("y", d =>  y(d.party))
        .attr("fill", d => color.domain().includes(d.party) ? color(d.party) : 'gray')
        .attr("width", d => x(d.votes))
        .attr("height", y.bandwidth())

  bars.append('text')
        .attr('x', d => x(d.votes) + 3)
        .attr('y', d => y(d.party) + y.bandwidth()/2)
        .style('text-anchor', 'start')
        .style('alignment-baseline','middle')
        .text(d => d.percent)

}

/**
 * Reinitialize the map display when the information panel is closed. 
 *
 * @param g     The group in which the traces for the circumsciptions is created. 
 */
function reset(g) {
  g.selectAll(".district").classed("selected",false);
}
