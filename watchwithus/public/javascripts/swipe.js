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

$( "#window" ).on("swipeleft", swipeleftHandler);
 
  // Callback function references the event target and adds the 'swipeleft' class to it
function swipeleftHandler( event ){
  console.log("swiped left");
  $.get('/findmovie') {
    window.location.href = '/findmovie';
  }
}

$( "#window" ).on( "swiperight", swiperightHandler );
 
// Callback function references the event target and adds the 'swipeleft' class to it
function swiperightHandler( event ){
  console.log("swiped right");
  $.get('/findmovie') {
    window.location.href = '/findmovie';
  }
}