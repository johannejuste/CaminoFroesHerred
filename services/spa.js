import mapInfoService from "./mapInfo.js";
import mapService from "./map.js";
import scrollService from "./nav.js"
import loaderService from "./loader.js"
import fetchService from "./fetch.js"
import {
  map
} from "./../main.js";
class SpaService {
  constructor() {
    this.defaultPage = "home";
    this.counter = 0;
    this.visitedPages = [];
  }

  init() {
    this.pages = document.querySelectorAll(".page");
    this.navItems = document.querySelectorAll(".tabbar a");
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    this.pageChange();
  }

  // hide all pages
  hideAllPages() {
    for (let page of this.pages) {
      page.style.display = "none";
    }
  }

  // show page or tab
  showPage(pageId) {
    if (window.innerWidth <= 1024) {
      this.hideAllPages();
      document.querySelector(`#${pageId}`).style.display = "block";
      this.setActiveTab(pageId);
    }
  }

  // sets active tabbar/ menu item
  setActiveTab(pageId) {
    for (let navItem of this.navItems) {
      if (`#${pageId}` === navItem.getAttribute("href")) {
        navItem.classList.add("active");
      } else {
        navItem.classList.remove("active");
      }
    }
  }

  // navigate to a new view/page by changing href
  navigateTo(pageId) {
    window.location.href = `#${pageId}`;
  }

  // set default page or given page by the hash url
  // function is called 'onhashchange'
  // ---------------  Maja ---------------
  pageChange() {



    let page = this.defaultPage;
    if (window.location.hash) {
      page = window.location.hash.slice(1);
      console.log(page)

    }

    // Only show loader the first time on each page
    if (this.visitedPages.indexOf(page) === -1) {
      loaderService.show(true)
    }
    this.visitedPages.push(page)

    if (window.innerWidth > 1024) { // if desktop navigate to frontpage
      this.navigateTo('');
    } else {
      this.showPage(page);

      //
      if (page === 'grid-posts') {
        document.querySelector('.navigationEtape').style.display = 'block'; // Show aside
        document.querySelector('.maparea').style.display = 'block'; // show content

        scrollService.scrollToStage(scrollService.chosenNumber); // scroll to the chosen number
        if (this.visitedPages[0] !== page) {
          scrollService.createFirstTabUnderline(scrollService.chosenNumber) // Create a underline, if this page wasn´t loaded first
        }
        loaderService.show(false) // turn off the loader


      } else if (page === 'home') {
        if (window.innerWidth <= 1024) { // Hide or show elements based on screen width
          document.querySelector('.navigationEtape').style.display = 'none'; // remove aside
          document.querySelector('.maparea').style.display = 'none'; // remove content
        } else {
          document.querySelector('.navigationEtape').style.display = 'block'; // show aside
          document.querySelector('.maparea').style.display = 'block'; // show content
        }
        loaderService.show(false) // turn off the loader


      } else if (page === 'mapid') {
        document.querySelector('.navigationEtape').style.display = 'block'; // show aside
        document.querySelector('.maparea').style.display = 'block'; // show content
        if (this.visitedPages[0] !== page) { // if map wasn´t the first page
          map._onResize(); // run the map
        }
        loaderService.show(false) // turn off the loader
        if (this.counter === 0) { // create markers the first time, the map is visited
          // mapInfoService.createMarkers();
          fetchService.fetchMarkers()
          this.counter++
        }
      }
    }

  }

  // show and hide tabbar
  hideTabbar(hide) {
    let tabbar = document.querySelector('#tabbar');
    if (hide) {
      tabbar.classList.add("hide");
    } else {
      tabbar.classList.remove("hide");
    }
  }
}
const spaService = new SpaService();
export default spaService;