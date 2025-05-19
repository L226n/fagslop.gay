async function fetchJSONData() {
	try {
		const response = await fetch('albums.json');
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return await response.json();
	}
	catch (error) {
		console.error('Error fetching JSON:', error);
	}
}

async function main() {
	
	const album_json = await fetchJSONData();	// Get albums JSON
	const album_container = document.getElementById("albumcontainer");	// Get container for all albums
	
	for (const item in album_json["items"]) {
		
		const album_div = document.createElement("div");	// Create container for single album
		album_div.classList.add("albumdiv");	// Mark as albumdiv for css
		
		const cover_container = document.createElement("div");
		cover_container.classList.add("covercontainer");
		
		const album_cover = document.createElement("img");	// Create cover node
		album_cover.src = `covers/${item.toString()}.webp`;	// Source is just i.webp
		album_cover.classList.add("albumcover");
		
		const data_div = document.createElement("div");
		data_div.classList.add("datadiv");
		
		const album_title = document.createElement("h1");	// Create label for title
		album_title.innerHTML = album_json["items"][item]["title"];	// Append string to album label
		const album_artist = document.createElement("h1");	// Create label for title
		album_artist.innerHTML = album_json["items"][item]["artist"];	// Append string to album label
		album_title.classList.add("albumlabel");
		album_artist.classList.add("albumlabel");
		
		const album_rating = document.createElement("img");	// Create new element for rating
		let img_rating = `images/${album_json["items"][item]["rating"].toString()}stars.webp`;	// Get album link
		album_rating.src = img_rating;	// Set the source to the image link
		album_rating.classList.add("albumrating");	// Add it to albumrating class
		
		data_div.appendChild(album_title);	// Append this to the single container div
		data_div.appendChild(album_artist);	// Append artist too bc its seperate
		data_div.appendChild(album_rating);	// Also append the rating to this thing
		cover_container.appendChild(album_cover);	// Add image to cover container
		album_div.appendChild(cover_container);	// Append cover image
		album_div.appendChild(data_div);	// Append data div
		album_container.appendChild(album_div);	// And then append that to the parent div
	}
	delete label;
}
main();
