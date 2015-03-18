// $(function(){
//   // Bind the swipeleftHandler callback function to the swipe event on div.box
//   $( "#window" ).on( "swipeleft", swipeleftHandler );
 
//   // Callback function references the event target and adds the 'swipeleft' class to it
//   function swipeleftHandler( event ){
//     console.log("swiped left");
//   	$.get('/findmovie') {
//     	window.location.href = '/findmovie';
//     }
//   }
// });

// $(function(){
//   // Bind the swipeleftHandler callback function to the swipe event on div.box
//   $( "#window" ).on( "swiperight", swiperightHandler );
 
//   // Callback function references the event target and adds the 'swipeleft' class to it
//   function swiperightHandler( event ){
//     console.log("swiped right");
//     $.get('/findmovie') {
//     	window.location.href = '/findmovie';
//     }
//   }
// });

require('node-touch')();

var windowElem = document.getElementById("window");

windowElem.addEventListener('swipeend', function (event) {
  console.log("here");
  if (event.direction == "RIGHT") {
    if (index == sizeOfMoviesArray - 1) {
          index = 0;
    } else {
      index++;
    }
    $("#watchMovieRating").val(aggregateRatings[index]);
    $("#watchMovieYear").val(years[index]);
    $("#watchMovieTitle").val(titles[index]);
    $("#watchMovieThumbnail").val(thumbnails[index]);
    $("#watchMovieGenres").val(allGenres[index]);

    /*$("#rateMoviesGenre").val(allGenres[index]);
    $("#rateMoviesYear").val(years[index]);
    $("#rateMovieRating").val(aggregateRatings[index]);
    $("#rateMovieTitle").val(titles[index]);  */

    var poster = document.getElementById("poster");
    poster.data = thumbnails[index];
    var title = document.getElementById("title");
    title.innerHTML = titles[index];
    var thanksForRatingElem = document.getElementById("thanksForRating");
    thanksForRatingElem.style.visibility = "hidden";

  }
  if (event.direction == "LEFT") {
    if (index == 0) {
        index = sizeOfMoviesArray - 1;
    } else {
      index--;
    }
    $("#watchMovieRating").val(aggregateRatings[index]);
    $("#watchMovieYear").val(years[index]);
    $("#watchMovieTitle").val(titles[index]);
    $("#watchMovieThumbnail").val(thumbnails[index]);
    $("#watchMovieGenres").val(allGenres[index]);

    /*$("#rateMoviesGenre").val(allGenres[index]);
    $("#rateMoviesYear").val(years[index]);
    $("#rateMovieRating").val(aggregateRatings[index]);
    $("#rateMovieTitle").val(titles[index]);*/

    var poster = document.getElementById("poster");
    poster.data = thumbnails[index];
    var title = document.getElementById("title");
    title.innerHTML = titles[index];
    var thanksForRatingElem = document.getElementById("thanksForRating");
    thanksForRatingElem.style.visibility = "hidden";
  }
});


/*$(document).on("swipeleft", function() {
	console.log("swiped left document");
});

$("#window").on("swipeleft", swipeleftHandler);*/
 
  // Callback function references the event target and adds the 'swipeleft' class to it
/*function swipeleftHandler( event ){
  console.log("swiped left window");
  $.get('/findmovie') {
    window.location.href = '/findmovie';
  }
}

$("#window").on( "swiperight", swiperightHandler );
 
// Callback function references the event target and adds the 'swipeleft' class to it
function swiperightHandler( event ){
  console.log("swiped right window");
  $.get('/findmovie') {
    window.location.href = '/findmovie';
  }
}*/