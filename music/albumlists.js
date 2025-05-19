async function fetchJSONData(page) {
	try {
		const response = await fetch(`albums/albums${page.toString()}.json`);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return await response.json();
	}
	catch (error) {
		console.error('Error fetching JSON:', error);
	}
}

async function getNextPage() {
	if (next_page >= total_pages) {return;}
	const album_json = await fetchJSONData(next_page.toString());	// Get albums JSON
	const albums_container = document.getElementById("albumscontainer");	// Get container for all albums
	
	for (const item in album_json["items"]) {
		
		const album_container = document.createElement("div");	// Create container for single album
		album_container.classList.add("albumcontainer");	// Mark as albumdiv for css
		
		const cover_container = document.createElement("div");
		cover_container.classList.add("covercontainer");
		
		const album_cover = document.createElement("img");	// Create cover node
		album_cover.src = `/covers/${page_offset.toString()}.webp`;	// Source is just i.webp
		album_cover.classList.add("albumcover");
		
		const data_container = document.createElement("div");
		data_container.classList.add("datacontainer");
		
		let title = album_json["items"][item]["title"];
		let artist = album_json["items"][item]["artist"];
		
		const title_url = document.createElement("a");
		title_url.href = `https://www.last.fm/music/${artist}/${title}`;
		title_url.target = "_blank";
		
		const artist_url = document.createElement("a");
		artist_url.href = `https://www.last.fm/music/${artist}`;
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
		album_date.innerHTML = new Date(album_json["items"][item]["date"] * 1000).toLocaleDateString();
		album_date.classList.add("albumdate");
		
		const album_rating = document.createElement("img");	// Create new element for rating
		let img_rating = `/images/${album_json["items"][item]["rating"].toString()}stars.webp`;	// Get album link
		album_rating.src = img_rating;	// Set the source to the image link
		album_rating.classList.add("albumrating");	// Add it to albumrating class
		
		const text_fade = document.createElement("div");
		text_fade.classList.add("fadecontainer");
		
		data_container.appendChild(title_url);	// Append this to the single container div
		data_container.appendChild(artist_url);	// Append artist too bc its seperate
		data_container.appendChild(album_date);
		data_container.appendChild(album_rating);	// Also append the rating to this thing
		cover_container.appendChild(album_cover);	// Add image to cover container
		album_container.appendChild(cover_container);	// Append cover image
		album_container.appendChild(data_container);	// Append data div
		album_container.appendChild(text_fade);
		albums_container.insertBefore(album_container, albums_container.firstChild);	// And then append that to the parent div
		page_offset++;
	}
	next_page++;
}

async function main() {
	
	getNextPage();
	
}
var total_pages = 1;
var next_page = 0;
var page_offset = 0;
main();
