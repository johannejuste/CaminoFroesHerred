// --------------- Helle & Maja ---------------

import fetchService from "./fetch.js"
import {
  map
} from "./../main.js";
import mapInfoService from "./mapInfo.js"
class MapService {
  constructor() {
    this.fitBounds = [];
    this.descriptions;
  }

  // ---------------  Get GPX files and draw lines based on geoJSON ---------------
  async fetchGeoJson() {
    this.descriptions = await fetchService.getDescriptions(); // Get the stages from wordpress api
    let numberOfStages = this.descriptions.length // Get save the number of stages

    for (let i = 1; i < (numberOfStages + 1); i++) { // for each stage...
      fetch(`geojson/Camino-Frøs-Herred-${i}.gpx`) // get the matching gpx-file
        .then(function (response) {
          return response.text();
        })
        .then((gpxData) => {
          let gpx = new gpxParser();
          gpx.parse(gpxData); // Use the gpxParser to make the data ready

          this.drawTrack(gpx.tracks[0], i); // Then draw the track
        });
    }
  }



  // ---------------  Draw the stages on the map ---------------
  drawTrack(track, number) {
    if (track) {

      // Track position and styling
      let coordinates = track.points.map(p => [p.lat.toFixed(5), p.lon.toFixed(5)]);
      let poly = L.polyline(coordinates, {
        weight: 5,
        color: 'var(--camino-blue)',
        className: `line${number}`, // add a class, to be able to controle the lines
        lineCap: 'round'
      })

      // Save the coorninates for the lines to be able to do a direct zoom onclik of a button
      this.fitBounds.push({
        number: number,
        southWest: poly._bounds._southWest,
        northEast: poly._bounds._northEast
      })

      poly.addTo(map); // Add the lines to the map


      let coordinateStart = coordinates[0];

      let dot = L.icon({
        iconUrl: 'images/circle.svg',

        iconSize: [15, 15], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [7.5, 7.5], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
      });


      //set new marker
      L.marker(coordinateStart, {
        icon: dot
      }).addTo(map);

    }
  }
};




const mapService = new MapService();
export default mapService;