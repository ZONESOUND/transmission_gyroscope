//const anime = require('lib/anime.js');
//alert("?");
var animation = null;
var animation2 = null;
var drop = {
		targets: "#guide",
		translateY: [-1000, 0],
		duration: 1000,
		easing: 'easeOutElastic(1, 0.45)'
	};
var up = {
		targets: "#guide",
		translateY: [0, -1000],
		duration: 800,
		easing: 'easeInElastic(1, 1)',
		endDelay: 300
	};
var state = 0;
var timeout = null;
var start = false;
$(window).bind("load", function() {	

	animation = anime({
	  targets: "#move",
	  // rotate: 50,
	  rotateZ: [-15, 40],
	  duration: 500,
	  easing: 'easeInQuad',
	  loop: 4,
	  direction: 'alternate',
	  autoplay: false
	})

	animation2 = anime({
	  targets: "#move",
	  // rotate: 50,
	  rotateZ: [-30, 100],
	  duration: 400,
	  easing: 'easeInCirc',
	  loop: 6,
	  direction: 'alternate',
	  autoplay: false
	})

	anime(drop);
	// $("#move").css("z-index", "5");

	setTimeout(function() {
		restartAnime();
	}, 1000)

	//restartAnime();
})

function restartAnime() {
	animation.restart();
	start = true;
	timeout = setTimeout(function() {
		restartAnime();
	}, 3000);
}

function upAndDrop() {

	var myTimeline = anime.timeline();
	myTimeline.add(up);
	myTimeline.add(drop);
	
	//myTimeline.add(drop);
}

function stopAnime(s) {
	console.log("state:" + state);
	if (state == s) {
		//alert(s);
		clearTimeout(timeout);
		if (state == 0 && start) {
			console.log("stop1");
			state++;
			animation = animation2;
			upAndDrop();

			setTimeout(function() {
				var html = '<span id="shake" class="big_text">SHAKE</span></br>';
				html += '<span id="harder" class="big_text">HARDER</span></br>'
				html += '<span id="sound">to change timbre</span>';
				$("#text").html(html);
			}, 800);
			setTimeout(function() {
				restartAnime();
			}, 2100);
			
		} else if (state == 1) {
			state++;
			anime(up);

		}
	}
}

// $(function() {
// 	alert("?");
// 	anime({
// 	  targets: '#guide',
// 	  translateX: 250,
// 	  rotate: '1turn',
// 	  backgroundColor: '#FFF',
// 	  duration: 800
// 	})





// });