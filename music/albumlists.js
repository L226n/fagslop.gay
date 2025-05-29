async function fetchJSONData(file) {
	const response = await fetch(file);
	if (!response.ok) {
		throw new Error(`HTTP error ${response.status}`);
	}
	return await response.json();
}

async function getNextPage() {
	
	let album_slice = album_json["items"].slice(current_page, current_page + page_size);
	
	for (const item in album_slice) {
		
		const album_container = document.createElement("div");	// Create container for single album
		album_container.classList.add("albumcontainer");	// Mark as albumdiv for css
		
		const cover_container = document.createElement("div");
		cover_container.classList.add("covercontainer");
		
		const album_cover = document.createElement("img");	// Create cover node
		album_cover.src = `/covers/${current_page.toString()}.webp`;	// Source is just i.webp
		album_cover.classList.add("albumcover");
		
		const data_container = document.createElement("div");
		data_container.classList.add("datacontainer");
		
		let title = album_slice[item]["title"];
		let artist = album_slice[item]["artist"];
		
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
		albums_container.appendChild(album_container);	// And then append that to the parent div
		current_page++;
	}
}

function set_size() {
	label.innerHTML = `Albums per page: ${this.value}`;
	current_page = 0;
	albums_container.textContent = "";
	page_size = this.value;
	getNextPage();
	
}

async function main() {
	
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
	
}

const url_params = new URLSearchParams(window.location.search);
let page_size = parseInt(url_params.get("page_size"));
if (!page_size) {
	page_size = 18;
}


var label = document.getElementById("sliderlabel");
const albums_container = document.getElementById("albumscontainer");	// Get container for all albums
var current_page = 0
main();
