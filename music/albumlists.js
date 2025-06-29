async function fetchJSONData(file) {
	const response = await fetch(file);
	if (!response.ok) {
		throw new Error(`HTTP error ${response.status}`);
	}
	return await response.json();
}

function filterFunction() {
	var input, filter, ul, li, a, i;
	input = document.getElementById("myInput");
	filter = input.value.toUpperCase();
	div = document.getElementById("dropdownResults");
	a = div.getElementsByTagName("a");
	for (i = 0; i < a.length; i++) {
		txtValue = a[i].textContent || a[i].innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			a[i].style.display = "";
		}
		else {
		  a[i].style.display = "none";
		}
	}
} 

async function getNextPage() {
	
	let album_slice = [];
	if (!filtercoll & !artistfiltered) {
		album_slice = album_json["items"].slice(current_page, current_page + page_size);
	}else{
		album_slice = filtered_list.slice(current_page, current_page + page_size);
	}
	let result_counter = 0;
	
	for (const item in album_slice) {
		
		const album_container = document.createElement("div");	// Create container for single album
		album_container.classList.add("albumcontainer");	// Mark as albumdiv for css
		
		const cover_container = document.createElement("div");
		cover_container.classList.add("covercontainer");
		
		const album_cover = document.createElement("img");	// Create cover node
		album_cover.src = `/covers/${album_slice[item]["id"].toString()}.webp`;	// Source is just i.webp
		album_cover.classList.add("albumcover");
		
		const data_container = document.createElement("div");
		data_container.classList.add("datacontainer");
		
		let title = album_slice[item]["title"];
		let artist = album_json["artists"][album_slice[item]["artist"]][0];
		
		let title_link = title.replaceAll("/", "%2F").replaceAll(" ", "+");
		let artist_link = artist.replaceAll("/", "%2F").replaceAll(" ", "+");
		
		const title_url = document.createElement("a");
		title_url.href = `https://www.last.fm/music/${artist_link}/${title_link}`;
		title_url.target = "_blank";
		
		const artist_url = document.createElement("a");
		artist_url.href = `https://www.last.fm/music/${artist_link}`;
		artist_url.target = "_blank";
		
		const album_title = document.createElement("h3");	// Create label for title
		album_title.innerHTML = title;	// Append string to album label
		album_title.title = title;
		const album_artist = document.createElement("h3");	// Create label for title
		album_artist.innerHTML = artist;	// Append string to album label
		album_artist.title = artist;
		album_title.classList.add("albumlabel");
		album_artist.classList.add("albumlabel");
		
		title_url.appendChild(album_title);
		artist_url.appendChild(album_artist);
		
		const album_date = document.createElement("h5");
		album_date.innerHTML = new Date(album_slice[item]["date"] * 1000).toLocaleDateString();
		album_date.classList.add("albumdate");
		
		const album_rating = document.createElement("img");	// Create new element for rating
		let img_rating = `/images/${album_slice[item]["rating"].toString()}stars.webp`;	// Get album link
		album_rating.src = img_rating;	// Set the source to the image link
		album_rating.classList.add("albumrating");	// Add it to albumrating class
		
		const text_fade = document.createElement("div");
		text_fade.classList.add("fadecontainer");
		
		data_container.appendChild(title_url);	// Append this to the single container div
		data_container.appendChild(artist_url);	// Append artist too bc its seperate
		data_container.appendChild(album_date);
		data_container.appendChild(album_rating);	// Also append the rating to this thing
		if (album_slice[item]["nsfw"]) {
			album_cover.classList.add("nsfwcover");
			const toggle_nsfw = document.createElement("input");
			toggle_nsfw.type = "checkbox";
			toggle_nsfw.classList.add("nsfwtoggle");
			cover_container.appendChild(toggle_nsfw);
		}
		cover_container.appendChild(album_cover);	// Add image to cover container
		album_container.appendChild(cover_container);	// Append cover image
		album_container.appendChild(data_container);	// Append data div
		album_container.appendChild(text_fade);
		if (album_slice[item]["discogs"]) {
			let discogs = document.createElement("a");
			discogs.href = `https://www.discogs.com/release/${album_slice[item]["discogs"].toString()}`;
			discogs.target = "_blank";
			let discogs_img = document.createElement("img");
			discogs_img.src = "discogs.webp";
			discogs_img.classList.add("discogs");
			discogs.appendChild(discogs_img);
			album_container.appendChild(discogs);
		}
		albums_container.appendChild(album_container);	// And then append that to the parent div
		current_page++;
		result_counter++;
	}
}

function set_size() {
	label.innerHTML = `Albums per page: ${this.value}`;
	current_page = 0;
	albums_container.textContent = "";
	page_size = parseInt(this.value);
	getNextPage();
	
}

function clearFilters() {
	artistfiltered = false;
	artist_filters = [];
	updatefromfilters();
}

function addArtistFilter() {
	artistfiltered = true;
	artist_filters.push(this.innerHTML);
	updatefromfilters();
}

function updatefromfilters() {
	filtered_list = [];
	if (artistfiltered & filtercoll) {
		for (const item in album_json["items"]) {
			if (artist_filters.includes(album_json["artists"][album_json["items"][item]["artist"]][0]) & album_json["items"][item]["discogs"]) {
				filtered_list.push(album_json["items"][item]);
			}
		}
	}
	else if (artistfiltered & !filtercoll) {
		for (const item in album_json["items"]) {
			if (artist_filters.includes(album_json["artists"][album_json["items"][item]["artist"]][0])) {
				filtered_list.push(album_json["items"][item]);
			}
		}
	}
	else if (!artistfiltered & filtercoll) {
		for (const item in album_json["items"]) {
			if (album_json["items"][item]["discogs"]) {
				filtered_list.push(album_json["items"][item]);
			}
		}
	}
	current_page = 0;
	albums_container.textContent = "";
	getNextPage();
	if(showrates){getRatings();}
	
}

async function getRatings() {
	let album_slice = [];
	if (!filtercoll & !artistfiltered) {
		album_slice = album_json["items"];
	}else{
		album_slice = filtered_list;
	}
	let ratings = new Array(11).fill(0);
	let total = 0;
	for (const item in album_slice) {
		const rate = album_slice[item]["rating"]
		ratings[rate*2]++;
		total++;
	}
	const unit = 100/ratings.reduce((a, b) => Math.max(a, b), -Infinity);
	
	for (let i = 0; i < 11; i++) {
		const bar = document.getElementById(`bc${(i/2).toString().replace(".", "-")}`);
		bar.style = `width: ${(unit*ratings[i]).toString()}%;`;
		bar.innerHTML = "";
		const ratebox = document.createElement("div");
		ratebox.classList.add("thingco");
		const rate = document.createElement("p");
		let percent = ratings[i]/total*100;
		rate.innerHTML = `${ratings[i].toString()} (${percent.toFixed(0)}%)`;
		rate.classList.add("thing");
		ratebox.appendChild(rate);
		bar.appendChild(ratebox);
	}
	const bar = document.getElementById("all");
	const ratingsavg = [];
	for (const item in ratings) {
		for (let i = 0; i < ratings[item]; i++) {
			ratingsavg.push(parseInt(item))
		}
	}
	console.log(ratingsavg);
	console.log(ratingsavg.length);
	const avg = ratingsavg.reduce((partialSum, a) => partialSum + a, 0)/total/2;
	bar.innerHTML = `${total.toString()} ratings, average at ${avg.toFixed(3)}`;
	
}

async function main() {
	
	const input = document.getElementById('myInput');
	const menu = document.getElementById('dropdownResults');

	input.addEventListener('focus', () => {
		menu.style.display = 'block';
	});

	document.addEventListener('click', (e) => {
		if (!input.contains(e.target) && !menu.contains(e.target)) {
			menu.style.display = 'none';
		}
	});
	
	let slider = document.getElementById("sizerange");
	slider.value = page_size;
	slider.oninput = set_size;
	label.innerHTML = `Albums per page: ${page_size.toString()}`;
	
	try {
		album_json = await fetchJSONData("albums/albums.json");	// Get albums JSON
		getNextPage();
	}
	catch (error) {
		console.error("Couldnt fetch albums/albums.json");
		return;
	}
	const dropdown = document.getElementById("dropdownResults");
	
	let temp = album_json["artists"].slice();
	const names = temp.map(item => item[0]);
	names.sort((a, b) => a[0].localeCompare(b[0]));
	
	for (const item in names) {
		let name = document.createElement("a");
		name.innerHTML = names[item];
		name.onclick = addArtistFilter;
		dropdown.appendChild(name);
	}
	
}

const url_params = new URLSearchParams(window.location.search);
let page_size = parseInt(url_params.get("page_size"));
if (!page_size) {
	page_size = 18;
}
const collection = document.getElementById('collection')

collection.addEventListener('change', (event) => {
	if (event.currentTarget.checked) {
		filtercoll = true;
		updatefromfilters();
		
	} else {
		filtercoll = false;
		updatefromfilters();
	}
})

const rate = document.getElementById("rate");

rate.addEventListener("change", (event) => {
	showrates = !showrates;
	if (showrates) {
		ratingscontainer["style"] = "display: flex;";
		getRatings();
	}else{
		ratingscontainer["style"] = "display: none;";
	}
})

var artistfiltered = false;
var filtercoll = false;
var showrates = false;
var filtered_list = [];
var artist_filters = [];
var label = document.getElementById("sliderlabel");
const albums_container = document.getElementById("albumscontainer");	// Get container for all albums
const ratingscontainer = document.getElementById("ratingschart");
var current_page = 0
main();
