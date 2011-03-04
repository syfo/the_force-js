var TheForce = {
	defined: function(x) { 
		try {
			return eval("typeof " + x + " != 'undefined'"); 
		}
		catch(e) { return false; }
	},

  has_tag: function(tag, attr, url) {
    var tags = document.getElementsByTagName(tag);
    for (i = 0; i<tags.length; i++) {
      if (typeof tags[i].attributes[attr] != "undefined") {
        if (tags[i].attributes[attr].textContent == url) {
          return true; } } }
    return false;
  },
  
  load_css: function(url, props) {
    var e = document.createElement('link');
    e.setAttribute('rel','stylesheet');
    e.setAttribute('type','text/css');
    e.setAttribute('media','screen,projection');
    e.setAttribute('href', url);

    return TheForce.load_tag(e, props);
  },

  load_js: function(url, props) {
    var e = document.createElement('script');
    e.setAttribute('type','text/javascript');
    e.setAttribute('src', url);
    
    return TheForce.load_tag(e, props);
  },

  load_tag: function(e, props) { /* onload, place, remove, look_for */
    if (typeof props == 'undefined') props = {}; 
    props.place = props.place ? props.place : document.getElementsByTagName('head')[0];
    var loaded = false;
    
    if (!TheForce.defined(props.look_for)) {
      e.onload = e.onreadystatechange = function() {
        var rs = this.readyState;
        if (rs && rs != 'complete' && rs != 'loaded') return;
        if(typeof props.onload == 'function') props.onload();
        if (props.remove) props.place.removeChild(this);
      }
      props.place.appendChild(e);
    }
    else
      if(typeof props.onload == 'function') props.onload();

    return e;
  }
};