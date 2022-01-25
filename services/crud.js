import scrollService from "./nav.js"
import slideService from './slide.js'
import firebaseService from "./firebase.js";
class CrudService {
  constructor() {
    this._dataRef = firebaseService.getPostRef() // Global variable of collection "posts" in firebase
    this.read() // runs the function
    this._posts = []; // global array

  };


  //.......................... READ POSTS .................................
  //Johanne
  // 1: data from firebase
  // watch the database ref for changes
  read() {
    this._dataRef.onSnapshot(snapshotData => { //each time the contents change, another call updates the document snapshot.
      this._posts = []; // this asures that the posts array is empty every time new posts is pushed to is
      snapshotData.forEach(doc => { // loop through snapshotData - like for of loop
        let post = doc.data(); // save the data in a variable
        post.id = doc.id; // add the id to the data variable
        this._posts.push(post); // push the data object to the global array _posts
      });
    });
  }


  // --------------- Append posts from Wordpress - Helle ---------------
  // Starts with setting the content of the element #contentX to empty
  // Sets the totel amount of posts to 0, and the current post number to 0
  // Iterates through the posts. For every post where the etapeNr is equal to the post.etape number
  // the total number of posts goes up with 1
  // If the total amount of posts is 0, forst statment will be printet, else second statement will be printet.


  appendPosts(etapeNr) {

    document.querySelector(`#content${etapeNr}`).innerHTML = "";
    let total = 0;
    let currentNumber = 0;

    for (let post of this._posts) {
      if (etapeNr === post.etape) {
        total += 1
      }
    }

    for (let post of this._posts) {
      if (etapeNr === post.etape) {

        currentNumber += 1
        document.querySelector(`#content${etapeNr}`).innerHTML += `
      <div class="mySlides fade">
        <div class="numbertext">${currentNumber} / ${total}</div>
        <div class="say">
        <div class="sayImage">
          <img src="${post.image}">
        </div>
          <div class="sayText">
          <p>"${post.text}"</p>
          <p>-${post.name}</p>
        </div>

        <a class="prev" onclick="plusSlides(-1, ${etapeNr})">&#10094;</a>
        <a class="next" onclick="plusSlides(1, ${etapeNr})">&#10095;</a>
      <div>
    `;
      }
    }


    if (total < 1) {
      document.querySelector(`#content${etapeNr}`).innerHTML += `
    <div class="mySlides fade">
      <div class="numbertext">${currentNumber} / ${total}</div>
        <div class="say">
          <div class="sayImage">
          </div>
          <div class="sayText">
          <p>Der er endnu ingen beretninger fra denne etape. Skal du være den første?</p>
          </div>
        </div>
    </div>`
    };
  }

  // --------------- Append posts from Wordpress - End ---------------

  //.......................... PREVIEW IMAGE AND TRIGGER CHOOSE IMAGE .................................
  //Johanne

  // the parameter number is used to send and get the argument post.acf.stageNumber
  previewImage(file, number) {

    if (file) {
      let reader = new FileReader(); // reads the file, gets the src to show that it is an image tag
      reader.onload = (event) => {
        // makes variable. Gets the correct modal and stagenumber
        let modal = document.querySelector(`#commentsModal${number}`)


        //adds the specified attribute to event.target.result, and gives it the specified value 'src'.
        modal.querySelector('.imagePreview').setAttribute('src', event.target.result);
      };
      //reads the content of file
      reader.readAsDataURL(file);
    }
  }

  triggerChooseImg(number) { // Triggers the button "Vælg billede"
    // click event. Choose image to the corret stage number
    document.querySelector(`#commentsModal${number} .imgChoose`).click();
  }


  //.......................... CREATE POST .................................
  //Johanne
  // add a new post to firestore (database)
  createPost(number) {
    // references to the input fields in the modal with the correct stagenumber
    let stageInput = document.querySelector(`#commentsModal${number}`)

    //Finds the queryselector inside stageInput and makes a variable
    let nameInput = stageInput.querySelector('.formName');
    let textInput = stageInput.querySelector('.formText');
    let imageInput = stageInput.querySelector('.imagePreview');

    //object with properties
    let newPost = {
      name: nameInput.value,
      text: textInput.value,
      image: imageInput.src,
      etape: number
    };

    this._dataRef.add(newPost).then(() => {
      this.appendPosts(number);
      slideService.showSlides(1, number);
      scrollService.tabs('comments', number);
      stageInput.style.display = "none" //when created display none on modal / close modale existing group of collection post from firebase 
    });
  };


  //the parameter element is used to read .value.length. The argument (this) from html in home.js is the parameter element/textarea 
  textCountDown(element, number) {
    //length of the value in the element
    let lenght = element.value.length;

    // returns the HTML content to the corret modal stagenumber in the <p class="demo-text"> in html
    document.querySelector(`#commentsModal${number} .demo-text`).innerHTML = `Antal anslag: ${lenght} /250`;
  }
  //.......................... MODAL (modal open) .................................
  // Johanne ----------------------------------

  // // Triggers button "Hvad siger du?""
  modalOpen(number) {
    // Get the correct modal with #commentsModal${number}
    let modalSay = document.getElementById(`commentsModal${number}`);
    //show modal
    modalSay.style.display = "block";
  };

  // When the user clicks on <span> (x), close the modal
  modalClose(element) {
    // hide modal
    element.parentElement.parentElement.style.display = "none";
  }

  //If form fields (formName and formText) or one of them is empty, this function alerts a message, and returns false, to prevent the form from being submitted
  validateForm(number) {
    //variables of the value of name or textarea input in the form with the correct stagenumber
    let name = document.querySelector(`form.stage-${number} .formName`).value;
    let text = document.querySelector(`form.stage-${number} .formText`).value;
    //form fields name and text
    if (name == "" && text == "") {
      alert("Navn og beskrivelse skal udfyldes");
      return false;
      //form field name
    } else if (name == "") {
      alert("Navn skal udfyldes");
      return false;
    }
    //form field text
    else if (text == "") {
      alert("Beskrivelse skal udfyldes");
      return false;
    }



  }
}

const crudService = new CrudService();
export default crudService;