import {
    map
} from "./../main.js";
import fetchService from "./fetch.js"
class MapInfoService {
    constructor() {
        this.iconSizes = 29;
    }

    // --------------- Make the map ready - Maja ---------------
    mapAndMarkers(json) {

        // The HOT style
        let OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
        });

        // The toner style
        let toner = new L.StamenTileLayer("toner");


        map.addLayer(OpenStreetMap_HOT); // Add HOT to the map as default

        this.tilesAndControles(); // Add the map controles


        let iconClass = L.Icon.extend({ // Icon standard
            options: {
                iconSize: [this.iconSizes, this.iconSizes], // size of the icon
                shadowSize: [50, 64], // size of the shadow
                iconAnchor: [this.iconSizes / 2, this.iconSizes / 2], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 62], // the same for the shadow
                popupAnchor: [0, -15] // point from which the popup should open relative to the iconAnchor
            }
        })


        // --------------- Set the icons for the differet categories ---------------
        let Seng = new iconClass({
            iconUrl: 'images/ikoner-map/Seng.svg'
        }),
            Kirker = new iconClass({
                iconUrl: 'images/ikoner-map/Kirker.svg'
            }),
            Toiletter = new iconClass({
                iconUrl: 'images/ikoner-map/Toiletter.svg'
            }),
            Kanopladser = new iconClass({
                iconUrl: 'images/ikoner-map/Kanopladser.svg'
            }),
            Shelter = new iconClass({
                iconUrl: 'images/ikoner-map/Shelter.svg'
            }),
            Vandposter = new iconClass({
                iconUrl: 'images/ikoner-map/Vandposter.svg'
            }),
            Udsigtspunkter = new iconClass({
                iconUrl: 'images/ikoner-map/Udkigspunkter.svg'
            }),
            Telt = new iconClass({
                iconUrl: 'images/ikoner-map/Telt.svg'
            }),
            Busstop = new iconClass({
                iconUrl: 'images/ikoner-map/Busstop.svg'
            }),
            Forplejningsmuligheder = new iconClass({
                iconUrl: 'images/ikoner-map/Forplejningsmuligheder.svg'
            }),
            Seværdigheder = new iconClass({
                iconUrl: 'images/ikoner-map/Seværdigheder.svg'
            }),
            Genforeningssten = new iconClass({
                iconUrl: 'images/ikoner-map/Genforeningssten.svg'
            }),
            Legepladser = new iconClass({
                iconUrl: 'images/ikoner-map/Legepladser.svg'
            }),
            Indkøbsmuligheder = new iconClass({
                iconUrl: 'images/ikoner-map/Indkøbsmuligheder.svg'
            }),
            Parkering = new iconClass({
                iconUrl: 'images/ikoner-map/Parkering.svg'
            }),
            Hvilesteder = new iconClass({
                iconUrl: 'images/ikoner-map/Hvilesteder.svg'
            })


        let iconArr = []; // all the chosen categories 
        let stayArr = []; // all the chosen types of stay


        let OvernatningArr = [];
        let KirkerArr = [];
        let ToiletterArr = [];
        let KanopladserArr = [];
        let VandposterArr = [];
        let UdsigtspunkterArr = [];
        let BusstopArr = [];
        let ForplejningsmulighederArr = [];
        let SeværdighederArr = [];
        let GenforeningsstenArr = [];
        let LegepladserArr = [];
        let IndkøbsmulighederArr = [];
        let ParkeringArr = [];
        let HvilestederArr = [];

        // --------------- Create a marker on the map for each marker in wordpress ---------------
        for (let post of json) {
            iconArr.push(post.acf.infotype); // add category type to array
            let name = `${post.acf.infotype}Arr`

            if (post.acf.infotype === "Overnatning") { // if the category is stay
                eval(name).push(L.marker([post.acf.latitude, post.acf.longitude], {
                    icon: eval(post.acf.typeOfStay) // use the icon for the type of stay
                }).bindPopup(`<b>${post.title.rendered}</b><br>${post.content.rendered}`));
                stayArr.push(post.acf.typeOfStay) // push the type of stay to array

            } else {
                eval(name).push(L.marker([post.acf.latitude, post.acf.longitude], {
                    icon: eval(post.acf.infotype) // else use the category icon
                }).bindPopup(`<b>${post.title.rendered}</b><br>${post.content.rendered}`));
            }
        }
        iconArr = [...new Set(iconArr)]; // remove dublicate category types
        stayArr = [...new Set(stayArr)]; // remove dublicate stay types


        // --------------- Create layers to turn on or off ---------------
        OvernatningArr = this.clustermarkers(OvernatningArr);
        KirkerArr = this.clustermarkers(KirkerArr);
        ToiletterArr = this.clustermarkers(ToiletterArr);
        KanopladserArr = this.clustermarkers(KanopladserArr);
        VandposterArr = this.clustermarkers(VandposterArr);
        UdsigtspunkterArr = this.clustermarkers(UdsigtspunkterArr);
        BusstopArr = this.clustermarkers(BusstopArr);
        ForplejningsmulighederArr = this.clustermarkers(ForplejningsmulighederArr);
        SeværdighederArr = this.clustermarkers(SeværdighederArr);
        GenforeningsstenArr = this.clustermarkers(GenforeningsstenArr);
        LegepladserArr = this.clustermarkers(LegepladserArr);
        IndkøbsmulighederArr = this.clustermarkers(IndkøbsmulighederArr);
        ParkeringArr = this.clustermarkers(ParkeringArr);
        HvilestederArr = this.clustermarkers(HvilestederArr);


        // --------------- Be on map from start ---------------
        for (const marker of fetchService.startMarkers) {
            let markerArr = `${marker}Arr`
            map.addLayer(eval(markerArr))
        }

        // --------------- Category checkbox ---------------
        let overlayCategories = {};
        for (const icon of iconArr) { // for each icon
            let checkboxLine = "";
            let name = `${icon}Arr` // the specific array

            if (icon == "Overnatning") { // if the category is stay
                let stayIcon = "";
                let imageIcons = "";
                for (const stay of stayArr) { // run thrugh the array with stay types
                    imageIcons += `<img src='images/ikoner-map/${stay}.svg' />` // and add an icon for each
                }
                checkboxLine = `<p>${icon}</p><div>${imageIcons}</div>`; // Categoryname and icon
            } else {
                checkboxLine = `<p>${icon}</p><div><img src='images/ikoner-map/${icon}.svg' /></div>`; // Categoryname and icon
            }
            overlayCategories[checkboxLine] = eval(name); // Add property (The checkboxline) and value (the matching array) and push it to overlayCategories
        }

        let baseMaps = { // Different map style options
            "Farver": OpenStreetMap_HOT,
            "Gråtone": toner
        };
        L.control.layers(baseMaps, overlayCategories, { // add the checkboxes to the map
            position: 'bottomleft' // in the bottom left corner
        }).addTo(map);

    }

    // --------------- Map controles ---------------
    tilesAndControles() {

        // --------------- My location - Maja ---------------
        L.control.locate({
            initialZoomLevel: '14',
            flyTo: 'true'
        }).addTo(map);



        // --------------- Printer function - Helle ---------------
        L.control.browserPrint({
            title: 'Print kort',
            documentTitle: 'Kort printet ved brug af leaflet.browser.print plugin',
            manualMode: false
        }).addTo(map)

        L.control.browserPrint.mode.custom();
        L.control.browserPrint.mode.landscape();
        L.control.browserPrint.mode.portrait();
    }
    // --------------- Printer function - End ---------------

    // --------------- Cluster marker function - Helle ---------------

    clustermarkers(markersArr) {

        let clusterGroup = new L.MarkerClusterGroup({
            iconCreateFunction: function (cluster) {
                let childCount = cluster.getChildCount(); //Gets the amount of child elements
                let c = ' marker-cluster-';
                if (childCount < 5) { //When there are less than 5 items clustered, there will a small cluster
                    c += 'small';
                } else if (childCount < 10) { // now a medium cluster
                    c += 'medium';
                } else {
                    c += 'large'; //or a large cluster
                }

                return new L.DivIcon({ //Then a new icon is returned, and can be styled in css
                    html: '<div><span>' + childCount + '</span></div>',
                    className: 'marker-cluster' + c,
                    iconSize: new L.Point(40, 40)
                });;
            }
        });
        for (let i = 0; i < markersArr.length; i++) {

            let marker = markersArr[i];
            clusterGroup.addLayer(marker)

        }

        return clusterGroup;
    }
    // --------------- Cluster marker function - End ---------------

}

const mapInfoService = new MapInfoService();
export default mapInfoService;