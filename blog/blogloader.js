async function fetchJSONData(file) {
	const response = await fetch(file);
	if (!response.ok) {
		throw new Error(`HTTP error ${response.status}`);
	}
	return await response.json();
}

async function createEntries(json) {
	const blogcontainer = document.getElementById("bodylol");
	
	for (const item in json) {
		const entrybox = document.createElement("div");
		entrybox.classList.add("dottedbox", "blogentry");
		
		const entrydate = document.createElement("h2");
		entrydate.classList.add("fakelink");
		entrydate.innerHTML = json[item]["date"];
		entrybox.appendChild(entrydate);
		
		const blogbody = document.createElement("i");
		for (const item2 in json[item]["body"].slice(0, -1)) {
			if (json[item]["body"][item2][0] == "$") {
				const linkscontainer = document.createElement("div");
				
				const images = json[item]["body"][item2].slice(1).split(";");
				for (const item3 in images) {
					images[item3] = images[item3].split(".");
					
					const imageshow = document.createElement("a");
					imageshow.classList.add("fakelink");
					imageshow["href"] = `#${images[item3][2]}`;
					imageshow.innerHTML = `[Show Image] (${images[item3][0]}KB)`;
					//<img loading="lazy" class="hideimage hideimagey" id="1" src="images/1.webp">
					const image = document.createElement("img");
					image["loading"] = "lazy";
					image["id"] = images[item3][2];
					image.classList.add("hideimage", `hideimage${images[item3][1]}`);
					image["src"] = `images/${images[item3][2]}.webp`;
					
					linkscontainer.appendChild(imageshow);
					linkscontainer.appendChild(image);
					linkscontainer.insertAdjacentHTML("beforeend", "<br>");
				}
				linkscontainer.insertAdjacentHTML("beforeend", "<br>");
				blogbody.appendChild(linkscontainer);
			}
			else {
				blogbody.insertAdjacentHTML("beforeend", `${json[item]["body"][item2]}<br><br>`);
			}
		}
		console.log(json[item]["body"].slice(-1)[0]);
		blogbody.insertAdjacentHTML("beforeend", `${json[item]["body"].slice(-1)[0]}`);
		entrybox.appendChild(blogbody);
		
		blogcontainer.appendChild(entrybox);
	}
}

async function main() {
	blog_json = await fetchJSONData("entries.json");	// Get albums JSON	
	createEntries(blog_json.reverse());
}
main();
