domready(function () {
  // Toggle menu
  var _menuToggleElem = document.getElementById('menu-toggle');
  var _fullscreenMenuElem = document.getElementById('fullscreen-menu');
  var _menuListItems = _fullscreenMenuElem.querySelectorAll('ul > li');
  
  _menuToggleElem.addEventListener('click', function (e) {
    e.preventDefault();
    toggleMenu();
  });

  pageStuff();
  
  function toggleMenu(command, cb) {
    var _toggleClass = 'show-menu';
    
    if (command === 'hide') {
        document.body.classList.remove(_toggleClass);
    } else {
      if (!_isVisible()) {
        document.body.classList.toggle(_toggleClass);
      } else {
          document.body.classList.toggle(_toggleClass);
      }
    }
    
    function _isVisible() {
      return document.body.classList.contains('show-menu');
    }
  }
  
  // Barba.js
  var HideShowTransition = Barba.BaseTransition.extend({
    start: function() {
      toggleMenu('hide');
      /**
       * This function is automatically called as soon the Transition starts
       * this.newContainerLoading is a Promise for the loading of the new container
       * (Barba.js also comes with an handy Promise polyfill!)
       */

      // As soon the loading is finished and the old page is faded out, let's fade the new page
      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
    },

    fadeOut: function() {
      var _this = this;
      return new Promise(function (resolve, reject) {
        /**
         * this.oldContainer is the HTMLElement of the old Container
         */
        Velocity.animate(_this.oldContainer, { opacity: 0 }, function () {
          resolve();
        });
      });
    },

    fadeIn: function() {
      /**
       * this.newContainer is the HTMLElement of the new Container
       * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
       * Please note, newContainer is available just after newContainerLoading is resolved!
       */

      var _this = this;
      /**
       * Do not forget to call .done() as soon your transition is finished!
       * .done() will automatically remove from the DOM the old Container
       */

      document.documentElement.scrollTop = 0;
      _this.done();

      pageStuff();
      
      // run functions declared
      if (window.pageScripts) {
        window.pageScripts.forEach(function (func) {
          func();
        });
      }

      this.newContainer.style.visibility = 'visible',
      this.newContainer.style.opacity = '0';

      Velocity.animate(this.newContainer, { opacity: 1 }, 600, function() {
        // page is visible
      });
    }
  });
  Barba.Pjax.getTransition = function () {
    return HideShowTransition;
  };
  
  // Start Barba
  Barba.Pjax.start();
});

/**
 * pageStuff
 * Run on every page load and page change
 */
function pageStuff() {
  espaceFine(document.querySelector('.barba-wrapper'));
  if (window.smoothInst) {
    window.smoothInst.destroy(); // cleanup old smooth scroll
  }
  window.smoothInst = new SmoothScroll('a[href*="#"]', {
    speed: 600,
    speedAsDuration: true,
    easing: 'easeOutQuart',
    durationMax: 1500
  });
}
