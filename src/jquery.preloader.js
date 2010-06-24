$.preload = function(images, callback) {
  if(!$.imageCacheArray) { $.imageCacheArray = []; } //I think this needs to be global
  
  $.each(images, function(i, image) {
    if (image) { $.imageCacheArray.push($('<img></img>').attr('src', image)); }
  });
};

//tie = $.callbackTie(size, cb);
//tie = $.callbackTie(cb);
CallbackTie = function() {

  
};