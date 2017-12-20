// Create a list that holds all of your images
// Duplicated images
var images = ["diamond","paper-plane-o","anchor","bolt","leaf","bicycle","diamond","paper-plane-o","anchor","bolt","leaf","bicycle"];

// define used variables
var cardFace;
var match;
var moves;
var time;
var fix;


// an empty array created
var imagesArray = [];
// pushed images into Array
// push once only, as they are duplicated in a list
for (var i=0; i<images.length; ++i) {
	imagesArray.push(images[i]);
}

 // Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
   var currentIndex = array.length, temporaryValue, randomIndex;

   while (currentIndex !== 0) {
       randomIndex = Math.floor(Math.random() * currentIndex);
       currentIndex -= 1;
       temporaryValue = array[currentIndex];
       array[currentIndex] = array[randomIndex];
       array[randomIndex] = temporaryValue;
   }
   return array;
}

// starting the game
function createGame() {
  imagesArray = shuffle(imagesArray);
  resetVariables();
	// resetTimer();
	// moves = 0;
	// resetRating();
// console.log(1);

  $("ul.deck").empty();
  firstCard =true;
	for (var i=0; i<imagesArray.length; ++i) {
		$('<li class="card"><i class="fa fa-'+imagesArray[i]+'"></i></li>').appendTo($("ul.deck"));
		
	}
	$('.fa').each((i,v) => {
		// console.log(i,v);
		$(v).parent().on('click', function(){
			// console.log(firstCard);
			if (firstCard == true) {
				countTimer();
				firstCard = false;
			}
			startGame($(v), i);
			
		});
	});
	
}

function startGame(obj,i) {
	// keep the card open
	obj.parent().addClass("open").addClass("show");
	if (!cardFace){
		fix =i;
		cardFace=obj;
		// moves = moves +1; // would count each click, not pair
	} else {
		console.log(i,fix);
		if (i!=fix){
			moves = moves +1;
			countMoves();
			setRating();
			var class1 = obj.attr("class").split(" ")[1];
			var class2 = cardFace.attr("class").split(" ")[1];
			if (class1 == class2){
				console.log("match");
				match = match +1;
				cardFace = false;
				setFound();//if match, call the setFound function.
			} else {
				// timeout for comparing both cards
				setTimeout(function(){
					obj.parent().removeClass("show");
					obj.parent().removeClass("open");
					cardFace.parent().removeClass("open");
					cardFace.parent().removeClass("show");	
					cardFace = false;
				},500);


			}
		}
		
	}
}
// reset all variables
function resetVariables() {
	cardFace = null;
	fix = false;
	moves = 0;
	match = 0;
	resetTimer();
}
// moves counter
function countMoves() {
	// searches HTML for span element with class = moves 
	$("span.moves").text(moves);
}
// display match when a pair is found
function setFound() {
	console.log('setFound');
	if (match == images.length/2) {
		setTimeout(function() {
			startModal()
		},500);
	}
}
// the Modal will display when all matches are found and the timer will stop
function startModal() {
	clearInterval(time);
	$("ul.stars").clone().appendTo($("div.starlets"));
	$("div.timer").text($(".time").text().slice(5));
	$("div.moves").text(moves);
	$("#modal-message").show();
}

// game timer function
function countTimer() {
	console.log(1);
	let startTime = new Date().getTime();
	// updating timer
	time = setInterval(function() {
		current = new Date().getTime();
		timer = current - startTime;
		// have to devide into minutes and seconds
		let minutes = Math.floor((timer % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((timer % (1000 * 60)) / 1000);
		// formatting seconds
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		// adding time to HTML
		$(".time").text("Time: "+minutes+":"+seconds);
  }, 1000);
}
// set timer to 0:00
function resetTimer() {
	clearInterval(time);
	timer = "0:00";
	$(".time").text("Time: "+timer);
}


// give star rating based on number of moves
function setRating() {
	if (moves <= 9) {
		num = 3;
	} else if (moves > 9 && moves <= 12) {
		num = 2;
	} else {
		num = 1;
	}
	$("ul.stars").empty();
	for (var i=0; i<num; i=i+1) {
		$('<li><i class="fa fa-star"></i></li>').appendTo($("ul.stars"));
	}
}

// reset rating
function resetRating() {
	var num = 3;
	$("ul.stars").empty();
	for (var i=0; i<num; i=i+1) {
		$('<li><i class="fa fa-star"></i></li>').appendTo($("ul.stars"));
	}
}

//restart all game features when restart is clicked
$(document).ready(function() {
 	createGame();
 	$("div.restart").on("click", function() {
 		imagesArray = shuffle(imagesArray);
    	createGame();
    	resetVariables();
 		countMoves();
 		resetRating();
 	})
	//modal window restart and reset variables
	$("#init").on("click", function() {
		$(".modal").hide();
		imagesArray = shuffle(imagesArray);
		createGame();
		resetVariables();
		countMoves();
		resetRating();
	})
});

createGame();
