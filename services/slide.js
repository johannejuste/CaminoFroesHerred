// ---------------  Helle ---------------

class SlideService {
  constructor() {
    this.fitBounds = [];
    this.slideIndex = 1;
  }

  // Function that works on the next and previous controls
  plusSlides(n, number) {
    showSlides(this.slideIndex += n, number);
  }

  // n = slideIndex, number = stageNumber
  // If slideindex is heigher than the, the the total amount of slides is 1, and it is not posibne to slide
  // If slideIndex is smaller then the length, the slideIndex is the length of all the slides.
  // The slides that are "out of sight" is displayed none, the slide in sight, is displayed block.
  showSlides(n, number) {

    let i;
    let etape = document.querySelector(`#stage${number}`);
    let slides = etape.getElementsByClassName("mySlides");

    if (n > slides.length) {
      this.slideIndex = 1
    }
    if (n < 1) {
      this.slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }

    slides[this.slideIndex - 1].style.display = "block";
  }
}

const slideService = new SlideService();
export default slideService;