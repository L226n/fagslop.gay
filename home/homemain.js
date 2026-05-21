function kill() {
	kirk.src="kirk/kirkdeath.webp";
	gunshot.currentTime = 0;
	gunshot.play();
}
function saveKirk() {
	kirk.src="kirk/kirklife.webp";
}
var kirk = document.getElementById("kirky");
var crosshair = document.getElementById("crosshair");
var gunshot = new Audio("kirk/died.mp3");
document.body.onpointermove = event => {
	const { clientX, clientY } = event;
		crosshair.animate({
		    left: `${clientX-(crosshair.width/2)}px`,
		    top: `${clientY-(crosshair.height/2)}px`
	    }, {duration: 0, fill: "forwards"})
}
