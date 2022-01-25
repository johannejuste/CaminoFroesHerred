// import your hideAllPages
import HomePage from "./pages/home.js";

// import your services
import fetchService from "./services/fetch.js"
import spaService from "./services/spa.js";
import mapService from "./services/map.js";

import scrollService from "./services/nav.js"
import mapInfoService from "./services/mapInfo.js";
import slideService from "./services/slide.js";

import crudService from "./services/crud.js";
import loaderService from "./services/loader.js";



// Declare and init pages
let homePage = new HomePage();

loaderService.show(true);
spaService.init();

mapService.fetchGeoJson();
if (window.innerWidth > 1024) {
    fetchService.fetchMarkers()
}


window.pageChange = () => spaService.pageChange();
window.dropdownDescription = () => homePage.dropdownDescription();
window.goTo = (number) => scrollService.goTo(number);
window.goFrom = (number) => scrollService.goFrom(number);
window.chosen = (number) => scrollService.chosen(number);
window.scrollToStage = (number) => scrollService.scrollToStage(number);
window.zoomToStage = (number) => scrollService.zoomToStage(number);
window.zoomOut = () => scrollService.zoomOut();
window.tabs = (tab, number) => scrollService.tabs(tab, number);
window.scrollToElement = (element) => scrollService.scrollToElement(element);
window.bigImg = (image) => scrollService.bigImg(image);
window.getFeaturedImageUrl = (post) => homePage.getFeaturedImageUrl(post);
window.plusSlides = (n, number) => slideService.plusSlides(n, number);
window.createPost = (number) => crudService.createPost(number);
/* window.closeOutsideModal = (event, number) => crudService.closeOutsideModal(event, number); */
window.modalClose = (element) => crudService.modalClose(element);
window.textCountDown = (element, number) => crudService.textCountDown(element, number);
window.modalOpen = (number) => crudService.modalOpen(number);
window.previewImage = (file, number) => crudService.previewImage(file, number);
window.triggerChooseImg = (number) => crudService.triggerChooseImg(number);
window.appendPosts = (etapeNr) => crudService.appendPosts(etapeNr);
window.plusSlides = (n, number) => slideService.plusSlides(n, number);
window.showSlides = (n, number) => slideService.showSlides(n, number);
// window.validateForm = (number) => crudService.validateForm(number);


// ---------------  Maja ---------------
// Set map coordinates for different devices
export let latitude = 55.356480;
export let longitude = 9.097975;
export let zoom = 10;

if (window.innerWidth > 1024) {
    latitude = 55.356480;
    longitude = 9.157975;
    zoom = 12;
} else if (window.innerWidth >= 720) {
    latitude = 55.356480;
    longitude = 9.097975;
    zoom = 11;
}

// create and export the map
export let map = new L.Map("mapid", {
    center: new L.LatLng(latitude, longitude),
    zoom: zoom
});

