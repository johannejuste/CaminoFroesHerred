// ---------------  Maja ---------------
import {
    map,
    latitude,
    longitude,
    zoom
} from "./../main.js";
import fetchService from "./../services/fetch.js"
import mapService from "./map.js"
import loaderService from "./loader.js"
class ScrollService {
    constructor() {
        // Variables for the yellow tabunderliner
        this.trWidth = [];
        this.trMargin = [];

        // Counters
        this.numberImageCounter = [];
        this.numberDescriptionCounter = [];

        this.chosenNumber;
    }

    // Scroll to a specific element
    scrollToElement(element) {
        let top = document.querySelector(`#${element}`);
        top.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
        });
    }

    // Scroll to the specific stage (number)
    scrollToStage(number) {
        if (number) {
            let stage = document.querySelector(`#stage${number}`);
            if (number == 1) { // If stage 1...
                stage.scrollIntoView({
                    behavior: "smooth",
                    block: "start" //...then scroll to start of the element...
                });
            } else {
                stage.scrollIntoView({
                    behavior: "smooth",
                    block: "start" //...else scroll to center
                });
            }
            console.log(number)
        }
    }


    // Hover the line for the specific stage on the map
    goTo(number) {
        let line = document.getElementsByClassName(`line${number}`)[0];
        line.classList.add("hoverLine");
    }

    // Remove hover-class line for the specific stage on the map 
    goFrom(number) {
        let line = document.getElementsByClassName(`line${number}`)[0];
        line.classList.remove("hoverLine");
    }

    // Zoom to stage on the map
    zoomToStage(number) {
        for (const stage of mapService.fitBounds) { // Run thrugh the coordinates for all the stages
            if (stage.number == number) { // If the stage number matches the choosen stage
                map.flyToBounds([ // then zoom the map to these coordinates
                    [stage.southWest.lat, stage.southWest.lng],
                    [stage.northEast.lat, stage.northEast.lng]
                ], {
                    'padding': [50, 50],
                    'duration': 0.1
                });
            }
        }
    }

    // Zoom out to the map overview
    zoomOut() {
        map.flyTo(L.latLng(latitude, longitude), zoom) // setView to coordinates and zoomlevel
    }

    // Function which runs when a stage (number) is choosen
    chosen(number) {

        let numberOfStages = mapService.descriptions.length
        this.chosenNumber = number;


        //.......................... Style distance, line on map and buttons .................................

        for (let i = 1; i < (numberOfStages + 1); i++) { // Run thrug all stages
            let lines = document.getElementsByClassName(`line${i}`)[0]; // Line on the map
            lines.classList.remove("selectedLine"); // Deselect the line on the map

            let stage = document.querySelector(`#stage${i}`); // A stace article

            let distance = stage.querySelector('h4') // the stage distance
            distance.style.color = 'var(--text-color-light)' // Return the distance to default color

        }
        let line = document.getElementsByClassName(`line${number}`)[0]; // The choosen line
        line.classList.add("selectedLine") // Add class to the choosen line

        let stage = document.querySelector(`#stage${number}`); // The choosen stage
        let distance = stage.querySelector('h4') // The choosen stage distance
        distance.style.color = 'var(--camino-yellow)' // Highlight the distance



        // Adds the class "selected" to the button wich has been selected
        let allButtons = document.getElementsByClassName('navbtn');
        for (const button of allButtons) {
            // console.log(button)
            if (button.value == number) {
                button.classList.add("selected");
            } else {
                button.classList.remove("selected");
            }

        }

        //.......................... Stage dropdown .................................

        let allDropdowns = document.getElementsByClassName('dropdown');
        for (const dropdown of allDropdowns) {
            dropdown.style.display = "none";
        }


        let dropdown = stage.getElementsByClassName('dropdown')[0];
        dropdown.style.display = 'block';

        //.......................... Scroll to stage .................................

        if (number == 1) { // If stage 1 is choosen...
            stage.scrollIntoView({
                behavior: "smooth",
                block: "start" //...then scroll to start of the element...
            });
        } else {
            stage.scrollIntoView({
                behavior: "smooth",
                block: "start" //...else scroll to center
            });
        }






        //.......................... Tab underliner .................................
        this.createFirstTabUnderline(number);


        //.......................... Insert the description the first time the stage is choosen .................................
        let descriptionDiv = stage.getElementsByClassName('descriptionDiv')[0] // Parent element

        if (this.numberDescriptionCounter.indexOf(number) === -1) { // If the stage hasn´t been choosen earlier...
            this.numberDescriptionCounter.push(number)

            for (const stage of fetchService.descriptions) { // ... run thrugh the descriptions
                if (stage.acf.stageNumber == number) { // If the description number matches the stage...

                    descriptionDiv.innerHTML = `${stage.content.rendered}`; // ...insert description from WordPress API
                }
            }

        }


    }

    createFirstTabUnderline(number) {
        if (number) {
            //.......................... Tab underliner .................................
            let stage = document.querySelector(`#stage${number}`); // The choosen stage
            let listItem = stage.getElementsByClassName('tabNav'); // Tab items
            // console.log(listItem, number)
            this.trWidth = [];
            this.trMargin = [];
            for (const item of listItem) {
                this.trWidth.push(item.offsetWidth) // Get the width of the tab items and push into array
                this.trMargin.push(item.offsetLeft) // Get the postition of the tab items and push into array
                console.log(item.offsetWidth, item.offsetLeft)
            }


            let underline = document.querySelector(`#hr${number}`); // The underliner
            console.log(underline, this.trWidth)

            // Set the underliner width to the length of the first tab item
            // This value is set once for each stage on click

            underline.style.width = `${this.trWidth[0]}px`;


        }
        // loaderService.show(false)
    }


    //.......................... Stage tab navigation .................................
    tabs(tab, number) {

        // Tab variables
        let description = document.querySelector(`#description${number}`);
        let images = document.querySelector(`#images${number}`);
        let comments = document.querySelector(`#comments${number}`);

        // Hide all tabs
        description.style.display = 'none';
        images.style.display = 'none';
        comments.style.display = 'none';

        let chosenTab = document.querySelector(`#${tab}${number}`); // The choosen tab
        chosenTab.style.display = 'block'; // Show the choosen tab  



        //.......................... Underliner .................................
        let underline = document.querySelector(`#hr${number}`); // The line
        if (tab === "description") { // If the description tab is choosen...
            underline.style.marginLeft = '0px'; // ...set margin to 0%...
            underline.style.width = `${this.trWidth[0]}px`; // ...and set the matching width
        }

        if (tab === "images") { // If the image tab is choosen...
            let margin = this.trMargin[1] - this.trMargin[0] // ...calculate...
            underline.style.marginLeft = `${margin}px`; // and set margin...
            underline.style.width = `${this.trWidth[1]}px`; // ...and set the matching width
        }

        if (tab === "comments") { // If the comments tab is choosen...
            let margin = this.trMargin[2] - this.trMargin[0] // ...calculate...
            underline.style.marginLeft = `${margin}px`; // and set margin...
            underline.style.width = `${this.trWidth[2]}px`; // ...and set the matching width
        }
    }


    //.......................... Show big image (image tab) .................................
    bigImg(number) {

        // Run the following codeblock the first time each stage is choosen
        if (this.numberImageCounter.indexOf(number) === -1) {
            this.numberImageCounter.push(number)


            let stage = document.querySelector(`#stage${number}`); // The stage container
            let imageContainer = stage.getElementsByClassName('tabImages')[0]; // The image container
            for (const stage of fetchService.descriptions) { // Run thrugh descriptions from WordPress API
                if (stage.acf.stageNumber == number) { // If then stagenumber matches
                    imageContainer.innerHTML = `${stage.acf.images}`; // Insert images

                    let images = imageContainer.getElementsByTagName('img'); // All images in the container

                    for (const image of images) { // Run thrug the images
                        image.style.cursor = 'pointer'; // Change the cursor to pointer
                        image.onmouseover = function () { // Ad a mouseover to the image
                            this.style.opacity = "0.7";
                        }
                        image.onmouseout = function () { // Ad a mouseout to the image
                            this.style.opacity = "1";
                        }
                        image.addEventListener("click", function () { // Listen for a click on an image
                            let expandedImg = document.getElementById("expandedImg"); // Tag for the expanded image
                            let imgText = document.getElementById("imgtext"); // Element for imagetext
                            expandedImg.src = image.src; // Set the expanded image src to the choosen image src
                            imgText.innerHTML = image.alt; // Set the text from the alt attribute
                            expandedImg.parentElement.parentElement.style.display = "block"; // Show the ancestor
                        }, false);
                    }
                }
            }
        }
    }
}
const scrollService = new ScrollService();
export default scrollService;