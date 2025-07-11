async function fetchJSONData(file) {
	const response = await fetch(file);
	if (!response.ok) {
		throw new Error(`HTTP error ${response.status}`);
	}
	return await response.json();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function addhint() {
	if (!end) {
		switch (hintlevel) {
			case 0:
				artisthint.innerHTML = `Artist: ${album_json["artists"][currentalbum["artist"]][0]}`;
				break;
			case 1:
				ratinghint.innerHTML = `Rating: ${currentalbum["rating"]}/5`;
				break;
			case 2:
				datehint.innerHTML = `Listened: ${new Date(currentalbum["date"] * 1000).toLocaleDateString()}`;
				break;
			case 3:
				repixel(15);
				break;
			case 4:
				repixel(7);
				break;
		}
		hintlevel++;
	}
}

function repixel(size) {
	let img = new Image();
	img.src=`/covers/${currentalbum["id"].toString()}.webp`;
	
	img.onload = () => {
	  // Set canvas size to match displayed size
	  canvas.width = canvas.clientWidth;
	  canvas.height = canvas.clientHeight;

	  drawPixelated(size, img);
  }
}

async function getNewImg() {
	let value = getRandomInt(album_json["items"].length);
	currentalbum = album_json["items"][value];
	let img = new Image();
	img.src=`/covers/${currentalbum["id"].toString()}.webp`;
	
	img.onload = () => {
	  // Set canvas size to match displayed size
	  canvas.width = canvas.clientWidth;
	  canvas.height = canvas.clientHeight;

	  drawPixelated(25, img);
	};
}

function playagain() {
	artisthint.innerHTML = "Artist: ";
	ratinghint.innerHTML = "Rating: ";
	datehint.innerHTML = "Listened: ";
	albumhint.innerHTML = "ALBUM: ";
	hintlevel=0;
	guessesint=0;
	getNewImg();
	end=false;
	butt.style.display = "none";
	guesses.innerHTML = `Guesses: 0/5`;
}

function reveal() {
	artisthint.innerHTML = `Artist: ${album_json["artists"][currentalbum["artist"]][0]}`;
	ratinghint.innerHTML = `Rating: ${currentalbum["rating"]}/5`;
	datehint.innerHTML = `Listened: ${new Date(currentalbum["date"] * 1000).toLocaleDateString()}`;
	albumhint.innerHTML = `ALBUM: ${currentalbum["title"]}`;
	repixel(1);
	end=true;
	trotal++;
	
	g1.innerHTML = `Correct guesses: ${correct}`;
	g2.innerHTML = `Incorrect guesses: ${incorrect}`;
	g3.innerHTML = `Win rate: ${Math.round(correct/trotal*100)}%`;
	
	butt.style.display = "block";
	
}

function search(ele) {
	if (!end) {
		if(event.key=="Enter") {
			guessesint++;
			if(ele.value.toUpperCase()==currentalbum["title"].toUpperCase()) {
				guesses.innerHTML = "You win!";
				correct++;
				reveal();
			}
			else{
				if (guessesint == 5) {
					guesses.innerHTML = "You lose!";
					incorrect++;
					reveal();
				}
				else {
				guesses.innerHTML = `Guesses: ${guessesint}/5`;
				}
			}
		}
	}
}

function drawPixelated(pixelSize, img) {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate size to draw the low-res image
  const scaledWidth = Math.ceil(canvas.width / pixelSize);
  const scaledHeight = Math.ceil(canvas.height / pixelSize);

  // Disable smoothing for pixelated effect
  ctx.imageSmoothingEnabled = false;

  // Draw the image small (low-res)
  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, scaledWidth, scaledHeight);

  // Then scale the small image up to fill the canvas
  ctx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight, 0, 0, canvas.width, canvas.height);
}

async function main() {
	album_json = await fetchJSONData("../albums/albums.json");	// Get albums JSON
	getNewImg();
}
let hintlevel = 0;
let currentalbum = 0;
let guessesint = 0;
let end=false;

let correct = 0;
let incorrect = 0;
let trotal = 0;

const canvas = document.getElementById("pixelbox");
const artisthint = document.getElementById("artisthint");
const ratinghint = document.getElementById("ratinghint");
const datehint = document.getElementById("datehint");
const albumhint = document.getElementById("albumhintlol");
const guesses = document.getElementById("guesses");

const g1 = document.getElementById("g1");
const g2 = document.getElementById("g2");
const g3 = document.getElementById("g3");
const butt = document.getElementById("butt");

const ctx = canvas.getContext('2d');
main();
