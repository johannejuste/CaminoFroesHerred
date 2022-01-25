// ---------------  Maja ---------------

import mapInfoService from "./mapInfo.js"
import loaderService from "./loader.js"
class FetchService {
    constructor() {
        this.descriptions = [];
        this.startMarkers = [];
        this.fetchStartMarkers();
    }

    //.......................... Fetch the descriptions from wordpress api .................................
    async fetchDescription() {
        let response = await fetch("https://dittejohannejustesen.dk/wordpress/wordpress-cfh/wp-json/wp/v2/posts?_embed&categories=2&per_page=17")
        this.descriptions = await response.json();
    }

    // Get the descriptions
    async getDescriptions() {
        if (this.descriptions.length === 0) { // if the description array is empty ...
            await this.fetchDescription(); // fetch the descriptions
        }
        return this.descriptions // and return the descriptions
    }


    //.......................... Fetch the markers .................................
    async fetchMarkers() {
        loaderService.show(true) // show the loader
        await fetch("https://dittejohannejustesen.dk/wordpress/wordpress-cfh/wp-json/wp/v2/posts?_embed&categories=3&per_page=500")
            .then(function (response) {
                return response.json();
            })
            .then((json) => {
                mapInfoService.mapAndMarkers(json);
            });
        loaderService.show(false) // turn off the loader
    }

    //.......................... Fetch which markers should be on map from start .................................
    async fetchStartMarkers() {
        await fetch("https://dittejohannejustesen.dk/wordpress/wordpress-cfh/wp-json/wp/v2/posts?_embed&categories=9")
            .then(function (response) {
                return response.json();
            })
            .then((json) => {
                this.startMarkers = json[0].acf.onMapFromStart; // an arr with kategories

            });
    }

}
const fetchService = new FetchService();
export default fetchService;