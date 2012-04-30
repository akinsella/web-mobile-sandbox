$(document).ready(function () {

(function(w, d){

    // OK
	var body = d.body;

    // OK
	var $hnlist = $('#hnlist');

    // OK
	var hideAllViews = function() {
        var views = d.querySelectorAll('.view');
        for (var i=0, l=views.length; i<l; i++){
            views[i].classList.add('hidden');
        }
    };

    // OK
	var flip = function(opts) {
        var inEl = opts.in,
            outEl = opts.out,
            inClass = inEl.classList,
            outClass = outEl.classList,
            direction = opts.direction,
            fn = opts.fn,
            flipWise = {
                clockwise: ['flip-out-to-left', 'flip-in-from-left'],
                anticlockwise: ['flip-out-to-right', 'flip-in-from-right']
            },
            wise = flipWise[direction],
            reset = function(){
                inEl.removeEventListener('webkitAnimationEnd', reset, false);
                body.classList.remove('viewport-flip');
                outClass.add('hidden');
                inClass.remove('flip');
                outClass.remove('flip');
                outClass.remove(wise[0]);
                inClass.remove(wise[1]);
                if (fn) fn.apply();
            };
        body.classList.add('viewport-flip');
        inClass.remove('hidden');
        outClass.add('flip');
        inClass.add('flip');
        inEl.addEventListener('webkitAnimationEnd', reset, false);
        outClass.add(wise[0]);
        inClass.add(wise[1]);
    };

    // OK
	var slide = function(opts) {
        var inEl = opts.in,
            outEl = opts.out,
            inClass = inEl.classList,
            outClass = outEl.classList,
            direction = opts.direction,
            fn = opts.fn,
            slideWise = {
                rtl: ['slide-out-to-left', 'slide-in-from-right'],
                ltr: ['slide-out-to-right', 'slide-in-from-left']
            }
            wise = slideWise[direction],
            reset = function(){
                inEl.removeEventListener('webkitAnimationEnd', reset, false);
                outClass.add('hidden');
                outClass.remove('sliding');
                inClass.remove('sliding');
                outClass.remove(wise[0]);
                inClass.remove(wise[1]);
                inHeader.classList.remove('transparent');
                outHeader.classList.remove('transparent');
                if (fn) fn.apply();
            };
        var inHeader = inEl.querySelector('header'),
            outHeader = outEl.querySelector('header');
        inClass.remove('hidden');
        outClass.add('sliding');
        inClass.add('sliding');
        inEl.addEventListener('webkitAnimationEnd', reset, false);
        inHeader.classList.add('transparent');
        outHeader.classList.add('transparent');
        outClass.add(wise[0]);
        inClass.add(wise[1]);
    };

    // OK
    var errors = {
        connectionError: function(e){
            alert('Could not connect to server.');
            throw e;
        },
        serverError: function(e){
            alert('Server is currently unavailable. Please try again later.');
            throw e;
        }
    };

    // OK
	var currentView = null;

    // OK
	var routes = {
		'/': function(){
			var view = $('#view-home')[0];
			if (!currentView){
				hideAllViews();
				view.classList.remove('hidden');
			} else if (currentView == 'about'){
				flip({
                    in: view,
					out: $('#view-' + currentView)[0],
					direction: 'anticlockwise'
				});
			} else if (currentView != 'home'){
				slide({
					in: view,
					out: $('#view-' + currentView)[0],
					direction: 'ltr'
				});
			}
			currentView = 'home';
		},
		'/about': function(){
			var view = $('#view-about')[0];
			if (!currentView){
				hideAllViews();
				view.classList.remove('hidden');
			} else if (currentView != 'about'){
				flip({
					in: view,
					out: $('#view-home')[0],
					direction: 'clockwise'
				});
			}
			currentView = 'about';
		}
	};

    // OK
	Router(routes).configure({
		on: function(){
			amplify.store('hacker-hash', location.hash);
		},
		notfound: function(){
			location.hash = '/';
		}
	}).init(amplify.store('hacker-hash') || '/');

    // OK
	w.addEventListener('pagehide', function(){
		amplify.store('hacker-hash', location.hash);
		var views = d.querySelectorAll('.view'),
			hackerScrollTops = {};
		for (var i=0, l=views.length; i<l; i++){
			var view = views[i],
				viewID = view.id,
				scrollSection = view.querySelector('.scroll section');
			hackerScrollTops[viewID] = scrollSection.scrollTop || 0;
		}
		amplify.store('hacker-scrolltops', hackerScrollTops);
	}, false);

    // OK
	w.addEventListener('pageshow', function(){
		var hash = amplify.store('hacker-hash'),
			hackerScrollTops = amplify.store('hacker-scrolltops');
		setTimeout(function(){
			if (hash) location.hash = hash;
			for (var id in hackerScrollTops){
				$('#' + id)[0].querySelector('.scroll section').scrollTop = hackerScrollTops[id];
			}
		}, 1);
	}, false);


    // OK
//	tappable('#view-home-refresh', {
//		noScroll: true,
//		onTap: function(e){
//			console.log("Reload news");
//		}
//	});


    // OK
	// Auto-reload news for some specific situations...
	w.addEventListener('pageshow', function(){
		setTimeout(function(){
			if (currentView == 'home' && $hnlist.innerHTML && !amplify.store('hacker-news')){
				console.log("load news");
			}
		}, 1);
	}, false);



    //Ok
	// Some useful tips from http://24ways.org/2011/raising-the-bar-on-mobile
	var supportOrientation = typeof w.orientation != 'undefined',
		getScrollTop = function(){
			return w.pageYOffset || d.compatMode === 'CSS1Compat' && d.documentElement.scrollTop || body.scrollTop || 0;
		},
		scrollTop = function(){
			if (!supportOrientation) return;
			body.style.height = screen.height + 'px';
			setTimeout(function(){
				w.scrollTo(0, 1);
				var top = getScrollTop();
				w.scrollTo(0, top === 1 ? 0 : 1);
				body.style.height = w.innerHeight + 'px';
			}, 1);
		};
	scrollTop();
	if (supportOrientation) w.onorientationchange = scrollTop;
	w.addEventListener('load', function(){
		var scrollCheck = setInterval(function(){
			var top = getScrollTop();
			if (top <= 1){
				clearInterval(scrollCheck);
				setTimeout(function(){
					var loader = $('#apploader')[0];
					loader.classList.add('hide');
					loader.addEventListener('webkitTransitionEnd', function(){
						loader.parentNode.removeChild(loader);
					}, false);
				}, 400);
			}
		}, 15);
	}, false);

})(window, document);

});