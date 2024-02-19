function loadActions() {
    checkEngine()
    document.getElementById("searchBar").value = ""
    getLinks()
}

function search() {
    let engineURL
    switch (getCookie("searchEngine")) {
        case "google":
            engineURL = "https://www.google.com/search?q="
            break;
        case "bing":
            engineURL = "https://www.bing.com/search?q="
            break;
        case "duckduckgo":
            engineURL = "https://duckduckgo.com/?q="
            break;
        case "yandex":
            engineURL = "https://yandex.com/search/?text="
            break;
        default:
            engineURL = "https://www.google.com/search?q="
            break;
    }
    let searchTerms = encodeURIComponent(document.getElementById("searchBar").value);
    let searchLink = engineURL + searchTerms
    window.open(searchLink, '_blank')
    document.getElementById("searchBar").value = ""
}
function searchEngineSelector(chosenEngine) {
    removeActiveEngine();
    const newEngine = "engine" + capitalise(chosenEngine)
    document.getElementById(newEngine).classList.add("active")
    document.getElementById(newEngine).tabIndex = 1
    setCookie("searchEngine", chosenEngine, 60)
    //     Update Search Box Placeholder
    if (getCookie("searchEngine") === "duckduckgo") {
        document.getElementById("searchBar").placeholder = "Search DuckDuckGo..."
    } else {
        document.getElementById("searchBar").placeholder = "Search " + capitalise(getCookie("searchEngine")) + "..."
    }
}
function checkEngine() {
    if (getCookie("searchEngine") === "") {
        searchEngineSelector("google")
    } else {
        searchEngineSelector(getCookie("searchEngine"))
    }

}

function removeActiveEngine() {
    const elements = document.querySelectorAll(".active")
    elements.forEach(element => {
        element.tabIndex = element.innerHTML
        element.classList.remove("active");
    })
}
function capitalise(word) {
    word = word.charAt(0).toUpperCase() + word.slice(1);
    return word
}
function setCookie(cookieName, cookieValue, expiryDays) {
    const d = new Date();
    d.setTime(d.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";SameSite=Strict" + ";path=/";
}
function getCookie(cookieName) {
    let name = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Links
function addLink(linkToAdd, linkName = "Untitled Link", linkLetter = "U") {
    if (getCookie("links") === "") {
        setCookie("links", JSON.stringify([]), 60)
    }
    if (linkName === "") {
        linkName = "Untitled Link"
    }
    if (linkLetter === "") {
        linkLetter = "U"
    }
    let links = JSON.parse(getCookie("links"))
    const linkID = crypto.randomUUID()
    const newLink = { id: linkID, url: linkToAdd, linkName: linkName, "linkLetter": linkLetter }
    links.push(newLink)
    setCookie("links", JSON.stringify(links), 60)

}
function linkModal(linkID) {
    if (linkID === undefined) {
        const modalContent = `<div class="link-modal-upper"><div class="link-modal-upper-left"><input type="text" class="link-modal-letter" id="linkLetter" onkeydown="this.value = ''"></div><div class="link-modal-upper-right"><div class="input-section"><label for="linkAddress">URL:</label><input type="url" name="linkAddress" id="linkAddress" autofocus></div><div class="input-section"><label for="linkName">Name:</label><input type="text" name="linkName" id="linkName"></div></div> </div>`
        const modalOptions = `<div class="modal-options"><button onclick="submitLink(document.getElementById('linkAddress').value, document.getElementById('linkName').value, document.getElementById('linkLetter').value)" id="linkSubmit" class="button">Add</button></div>`
        modalWindow("Add Link", modalContent, modalOptions, "Cancel")
    }
}

function modalWindow(titleText, modalBody = "", modalOptions = "", headerButtonText = "Close") {
    const mainContent = document.getElementById("mainContent");
    const modalWindow = document.getElementById("modalWindow");

    mainContent.style.display = "none"

    const modalHeader = `<div class="modal-header" id="modalHeader"><div class="modal-title" id="modalTitle">${titleText}</div><button class="button" onclick="modalClose()">${headerButtonText}</button></div>`
    modalWindow.innerHTML = `${modalHeader}<div class="modal-body" id="modalBody">${modalBody}</div><div class="modal-options" id="modalOptions">${modalOptions}</div>`
    modalWindow.style.display = "flex"
}

function modalClose() {
    const mainContent = document.getElementById("mainContent");
    const modalWindow = document.getElementById("modalWindow");

    mainContent.style.display = "flex"

    modalWindow.innerHTML = ""
    modalWindow.style.display = "none"
}
function submitLink(url, name, letter) {
    if (url === "") {
        url = "www.georgewild.dev";
    }
    if (url.includes("http") !== true) {
        url = `http://${url}`
    }
    addLink(url, name, letter)
    modalClose()
    getLinks()

}
// function isValidUrl(string) {
//     try {
//         new URL(string);
//         return true;
//     } catch (err) {
//         return false;
//     }
// }
// function urlCheck(element, buttonID){
//     let _button = document.getElementById(buttonID);
//     console.log(_button)
//     if (isValidUrl(element.value) === true) {
//         _button.disabled = false;
//     } else {
//         _button.disabled = true;
//         console.log("NO")
//     }
// }

function getLinks() {
    let linkCode = ''
    const linkList = JSON.parse(getCookie("links"))
    for (let linkNo in linkList) {
        const link = linkList.at(parseInt(linkNo))
        linkCode = linkCode + `<div class="link-wrapper" oncontextmenu="checkIfDelete('${link.id}', '${link.linkName}', '${link.url}');return false;"><button class="create-link search-link" onclick="openLink('${link.url}')">${link.linkLetter}</button><div class="link-title">${link.linkName}</div></div>`;
    }
    linkCode = linkCode + `<div class="link-wrapper" ><button class="create-link search-link" onclick="linkModal()"><img width="75" src="static/search/material-icons/add.svg" alt="plus symbol"></button><div class="link-title">Add New</div></div>`;
    document.getElementById("searchLinks").innerHTML = linkCode;
}

function openLink(address) {
    window.open(address, '_blank');
}


// TODO Add a delete function

//function checkIfDelete(id, linkName, linkUrl) {
//    modalWindow("Delete Link", `Are you sure you want to delete the link "${linkName}" (to "${linkUrl}")?`, `<button id="deleteLink" class="button" onclick="deleteLink('${id}')">Delete</button>`)
//}
//
//function deleteLink(id) {
//	const linkList = JSON.parse(getCookie("links"));
//	let newList = linkList
//	for (linkNo in linkList) {
//		const link = linkList.at(parseInt(linkNo));
//		if (link.id === id) {
//			let p1 = newList.slice(0, linkNo)
//			newList = p1.concat(newList.slice((linkNo + 1)))
//		}
//	}
//	console.log(newList)
//	setCookie("links", `[${newList.toString()}]`, 60)
//	modalClose()
//	getLinks()
//}
