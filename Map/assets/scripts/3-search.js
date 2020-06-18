"use strict";

/**
 * File to display a search result on the map
 */


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

     /* TODO: Implement a zoom using the function "fitBounds" from Leaflet and respecting these constraints:
       - The maximum zoom level must be 8;
       - The pan must be animated (diration of 1s and "easeLinearity" of 0.5s);
       - The zoom must be animated

      Select the searched area by applying the class "selected" to it. Also, display the information panel for this
      district using the function "showPanel"
   */
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
