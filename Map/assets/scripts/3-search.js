"use strict";

/**
 * Allows you to automatically zoom on the searched distrcy to make it stand out
 *
 * @param map           The Leaflet map. 
 * @param g             The group in which the traces of the districts were created 
 * @param districtId    The number of the district. 
 * @param bound         The bound used to zoom on the region
 * @param showPanel     The function that must be called to display the information panel
 *
 * @see http://leafletjs.com/reference-0.7.7.html#map-fitbounds
 */
function search(map, g, districtId, bound, showPanel) {
  map.fitBounds(bound, {
     maxZoom: 8,
     pan: {
      duration: 1,
      easeLinearity: 0.5,
      animate: true
     },
     zoom:{
       animate:true
     }
    });

  showPanel(districtId);
  g.selectAll(".district").classed("selected",false);
  g.selectAll(".district").filter(d => d.properties.NUMCF === districtId).classed("selected",true);

}
