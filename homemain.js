function kill() {
	kirk.src="kirk/kirkdeath.webp";
	gunshot.currentTime = 0;
	gunshot.play();
}
function saveKirk() {
	kirk.src="kirk/kirklife.webp";
}
function noAudio() {
	bg.pause();
}
function fuck() {
	fuckr = !fuckr;
	if(fuckr){document.getElementById("mlpfuck").style="display:block;";}
	else{document.getElementById("mlpfuck").style="display:none;";}
}
function siteBegin() {
	document.getElementById("entered").style="display:block;";
	document.getElementById("image").style="display:none;";
	document.querySelector("html").style="background-image: url('background.png')";
	bg.play()
}
var fuckr = false;
var kirk = document.getElementById("kirky");
var crosshair = document.getElementById("crosshair");
var gunshot = new Audio("kirk/died.mp3");
var bg = new Audio("music.mp3");
bg.loop = true;
document.body.onpointermove = event => {
	const { clientX, clientY } = event;
		crosshair.animate({
		    left: `${clientX-(crosshair.width/2)}px`,
		    top: `${clientY-(crosshair.height/2)}px`
	    }, {duration: 0, fill: "forwards"})
}
async function fetchJSONData(file) {
	const response = await fetch(file);
	if (!response.ok) {
		throw new Error(`HTTP error ${response.status}`);
	}
	return await response.json();
}
async function main() {
	nowplaying = await fetchJSONData("https://workers-playground-broken-thunder-5091.lu-00e2n.workers.dev");
	console.log(nowplaying.recenttracks.track);
	lastfmimg = document.getElementById("lastfmimg");
	lastfm = document.getElementById("lastfminf");
	let track = document.createElement("a");
	track["href"] = nowplaying.recenttracks.track[0].url;
	track["target"] = "_blank";
	track.innerHTML = nowplaying.recenttracks.track[0].name;
	let img = document.createElement("img");
	img["src"] = nowplaying.recenttracks.track[0].image[2]["#text"];
	img["style"] = "height:10vw;animation:skew 0.5s linear infinite;";
	let album = document.createElement("i");
	album.innerHTML = `From album: ${nowplaying.recenttracks.track[0].album["#text"]}`;
	let artist = document.createElement("i");
	artist.innerHTML = `By artist: ${nowplaying.recenttracks.track[0].artist["#text"]}`;
	let playing = document.createElement("h2");
	playing.innerHTML = "NOW PLAYING:";
	playing["style"] = "margin:0 0 1vw 0;";
	if (!nowplaying.recenttracks.track[0]["@attr"]) {
		playing.innerHTML = "LAST PLAYED:";
	}
	lastfmimg.appendChild(img);
	lastfm.appendChild(playing);
	lastfm.appendChild(track);
	lastfm.appendChild(album);
	lastfm.appendChild(artist);
}
main();
