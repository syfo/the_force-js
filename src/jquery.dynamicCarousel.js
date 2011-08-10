/* 
  - will calculate and set width of content page from elementWidth
  - cannot contain any elements originally
  - events fire on every scroll/push/remove, whether a next/prev availability state has changed or not
  - add new elements via push(), passing blocks of html
  - dynamicCarousel will set up default behavior for clicking on previous/next if passed nextButton: and prevButton: selectors
  
  todo:
    clear ul float properly
    add remove by index
  
  usage:
    <div id="carousel"></div>
    <script>
      $('#carousel').dynamicCarousel({elementWidth:100, elementsShown: 5});
      $('#carousel').data('dynamicCarousel').push('<p>first element</p>');
    </script>

  fyi...'firstelement' refers to the first element showing on the left side of the carousel
*/

(function($) {
  var DynamicCarousel = function(e, options) {
    var t = this;
    t.pane = $(e);x
    t.options = options || {};
    t.options = $.extend({trimLeft: 0, trimRight: 0}, options);
    t.firstElementShown = 0;
    
    t.init = function() {
      t.pane.append($('<ul></ul>').css({'list-style-type': 'none', 'padding': '0', 'margin': '0', 'overflow': 'hidden'}));
      t.content = t.pane.children().slice(0,1);
  
      t.elementWidth = t.options.elementWidth || 0;
      t.elementsShown = t.options.elementsShown || 5;

      t.pane.css({overflow: 'hidden'});
      t.setPaneWidthFromElementsShown();
      t.setContentWidthFromElementWidth
      t.pane.data('dynamicCarousel', t);
            
      t.initDefaultScrollButtonBehavior();
      t.triggerEvents();
    }
    
    t.initDefaultScrollButtonBehavior = function() {
      $(t.options.nextButton).click(function(e) {
        e.preventDefault();
        t.scroll(1);
      });

      $(t.options.prevButton).click(function(e) {
        e.preventDefault();
        t.scroll(-1);
      });
      
      t.pane.bind('dc:previousNotAvailable ', function(e) { $(t.options.prevButton).addClass('dc-button-disabled'); });
      t.pane.bind('dc:previousAvailable', function(e) { $(t.options.prevButton).removeClass('dc-button-disabled'); });
      t.pane.bind('dc:nextNotAvailable', function(e) { $(t.options.nextButton).addClass('dc-button-disabled'); });
      t.pane.bind('dc:nextAvailable', function(e) { $(t.options.nextButton).removeClass('dc-button-disabled'); });
    };
  
    t.push = function(html, id) {
      t.insert(t.elements().length, html, id);
    };
    
    t.insert = function(index, html, id) {
      var el = $('<li></li>').css({'float': 'left', 'width': t.elementWidth, 'overflow': 'hidden'}).append($(html));
      if(id) { 
        if(t.elementWithId(id)) { return false; }
        
        el.data('dynamicCarouselElementId', id);
      }
      
      var priorElement = $('li', t.content).eq(index);
      if(priorElement.size()) {
        priorElement.before(el);
      } else {
        t.content.append(el);
      }
      t.setContentWidthFromElementWidth();

      if(t.elements().length == 1) {
        t.showFirst(1);
      }

      t.triggerEvents();
    };
    
    t.unshift = function(html, id) {
      t.insert(0, html, id);
    };
    
    t.elements = function() {
      return t.content.find('li');
    };
    
    t.elementWithId = function(id) {
      t.elements().each(function(i, e) {
        if($(e).data('dynamicCarouselElementId') == id) {
          return $(e);
        }
      });
      
      return false;
    };
  
    t.removeById = function(id) {
      var element = false;

      t.elements().each(function() {
        if($(this).data('dynamicCarouselElementId') == id) {
          element = $(this)
        }
      });
      
      if(element) {
        element.remove()
        t.setContentWidthFromElementWidth();
        t.repositionFirstElementAfterRemove();
      
        t.triggerEvents();
        
        return element;
      } else {
        return false;
      }
    };
    
    t.repositionFirstElementAfterRemove = function() {
      t.showFirst(t.boundedFirstElement(t.firstElementShown));
    };
  
    t.scroll = function(offset) {
      t.showFirst(t.firstElementShown + offset);
      t.triggerEvents();
    };

    t.triggerEvents = function() {
      if(t.firstElementShown <= 1) { 
        t.pane.trigger('dc:previousNotAvailable'); 
      } else { 
        t.pane.trigger('dc:previousAvailable');
      }

      if(t.firstElementShown == t.greatestPossibleFirstElement()) {
        t.pane.trigger('dc:nextNotAvailable');
      } else { 
        t.pane.trigger('dc:nextAvailable');
      }
    };
    
    t.showFirst = function(i) {
      i = t.boundedFirstElement(i);
      t.firstElementShown = i;
      t.setContentOffsetFromFirstElement();
    };
    
    t.boundedFirstElement = function(i) {
      return Math.max(Math.min(t.elements().length, 1), Math.min(i, t.greatestPossibleFirstElement()));
    };
    
    t.greatestPossibleFirstElement = function() {
      return Math.max(Math.min(t.elements().length, 1), t.elements().length - t.elementsShown + 1);
    };

    t.setContentOffsetFromFirstElement = function() {
      t.content.css('margin-left', (1-t.firstElementShown)*t.elementWidth);
    };
    
    t.setPaneWidthFromElementsShown = function() {
      t.pane.css('width', t.elementsShown*t.elementWidth - t.options.trimLeft - t.options.trimRight);
    };
    
    t.setContentWidthFromElementWidth = function() {
      t.content.css('width', (t.elements().length * t.elementWidth) + "px");
    }
    
    t.init();
  };
  
  $.fn.dynamicCarousel = function(options) {
    return this.each(function(){
       (new DynamicCarousel(this, options));
    });
  };
})(jQuery);