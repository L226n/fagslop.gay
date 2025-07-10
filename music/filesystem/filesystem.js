/**
 * Format bytes as human-readable text.
 * 
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use 
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 * 
 * @return Formatted string.
 */
function humanFileSize(bytes, si=false, dp=1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si 
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10**dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u];
}

function truncate(str, maxLength) {
  return str.length > maxLength
    ? str.slice(0, maxLength - 3) + "..."
    : str;
}

async function fetchJSONData(file) {
	const response = await fetch(file);
	if (!response.ok) {
		throw new Error(`HTTP error ${response.status}`);
	}
	return await response.json();
}

async function showFolders(json, parent, tits=true) {
	for (const item in json) {
		if (item.slice(-5) != "/size") {
			let div = document.createElement("div");
			div.classList.add("fsitem");
			let v = parent.parentElement.parentElement.getAttribute("data-path");
			if (v) {
				div.setAttribute("data-path", `${v}  ${item.replaceAll("\\", "\\\\").replaceAll(" ", "\\ ")}`);
			} else {
				div.setAttribute("data-path", item.replaceAll("\\", "\\\\").replaceAll(" ", "\\ "));
			}
			
			let spandiv = document.createElement("div");
			spandiv.classList.add("spandiv");
			
			if (tits) {
				let thingidk = document.createElement("p");
				thingidk.innerHTML = "└";
				thingidk.classList.add("fuckknows");
				spandiv.appendChild(thingidk);
			}
			
			let img = document.createElement("img");
			let folder = false;
			if (json[item]) {
				img["src"] = "/images/folder.svg";
				folder = true;
			} else {
				if (item.slice(-4) == ".jpg" || item.slice(-4) == ".png") {
					img["src"] = "/images/image.svg";
				}
				else if (item.slice(-5) == ".flac") {
					img["src"] = "/images/flac.svg";
				}
				else if (item.slice(-4) == ".mp3" || item.slice(-4) == ".m4a" || item.slice(-4) == ".ogg") {
					img["src"] = "/images/mp3.svg";
				}
				else {
					img["src"] = "/images/file.svg";
				}
			}
			if (folder) {
				let folderinput = document.createElement("input");
				folderinput["type"] = "checkbox";
				folderinput.setAttribute("data-virgin", "yeah");
				folderinput.classList.add("folderdrop");
				spandiv.appendChild(folderinput);
			}
			img.classList.add("fsicon");
			spandiv.appendChild(img);
			
			
			let namespan = document.createElement("span");
			namespan.classList.add("spanleft");
			let name = document.createElement("i");
			name.innerHTML = truncate(item, 160);
			namespan.appendChild(name);
			spandiv.appendChild(namespan);
			let middlespan = document.createElement("span");
			middlespan.classList.add("spanmiddle");
			spandiv.appendChild(middlespan);
			let endspan = document.createElement("span");
			endspan.classList.add("spanright");
			let size = document.createElement("i");
			size.innerHTML = humanFileSize(json[`${item}/size`]);
			endspan.appendChild(size);
			spandiv.appendChild(endspan);
			div.appendChild(spandiv);
			if (folder) {
				let blocky = document.createElement("div");
				blocky.classList.add("fuck");
				let block = document.createElement("div");
				block.classList.add("newcontblock");
				let append = document.createElement("div");
				append.classList.add("newcont");
				blocky.appendChild(block);
				blocky.appendChild(append);
				div.appendChild(blocky);
			}
			parent.appendChild(div);
		}
	}
	const checkboxes = document.querySelectorAll('.folderdrop');
	checkboxes.forEach(checkbox => {
	  checkbox.addEventListener('change', function () {
		if (this.checked) {
				if (this.getAttribute("data-virgin") == "yeah") {
				let x = this.parentElement.parentElement;
				let items = x.getAttribute("data-path").split("  ");
				let new_json = fs_json;
				for (const item in items) {
					new_json = new_json[items[item].replaceAll("\\ ", " ").replaceAll("\\\\", "\\")];
				}
				console.log(new_json);
				let appendbox = x.querySelectorAll(".newcont")[0];
				showFolders(new_json, appendbox);
				console.log(this.parentElement.parentElement.querySelectorAll(".newcont")[0])
				this.setAttribute("data-virgin", "nope");
			}
			this.parentElement.parentElement.querySelectorAll(".newcont")[0]["style"] = "display: block;";
		} else {
			this.parentElement.parentElement.querySelectorAll(".newcont")[0]["style"] = "display: none;";
		}
	  });
	});
}

async function main() {
	try {
		fs_json = await fetchJSONData("filesystem.json");	// Get albums JSON
		let sizecont = document.createElement("div");
		let i = document.createElement("i");
		i.innerHTML = `Total collection size: ${humanFileSize(fs_json[0])}`;
		sizecont.appendChild(i);
		let g = document.getElementById("fsbox");
		g.appendChild(sizecont);
		
		fs_json = fs_json[1]
		showFolders(fs_json, document.getElementById("fsbox"), tits=false)
	}
	catch (error) {
		console.error("Couldnt fetch filesystem.json");
		return;
	}
}
let fs_json = 0;
main();
