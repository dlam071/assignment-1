function initMap() {
    map = new google.maps.Map(document.querySelector(".box.map"), {
        center: { lat: 44.525049, lng: -110.83819 },
        zoom: 17,
        mapTypeId: 'satellite'
    })
}

document.addEventListener("DOMContentLoaded", function () {

    const galleries = "https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php";

    fetch(galleries)
        .then(resp => resp.json())
        .then(gallery => {
            document.querySelector("#loader1").style.display = "none";
            document.querySelector("div.list section").style.display = "block";
            listGalleries(gallery);
        })
        .catch(err => console.error(err));

    function listGalleries(gallery) {
        for (let g of gallery) {
            let li = document.createElement("li");
            li.textContent = g.GalleryName;

            li.addEventListener("click", function () {
                document.querySelector("div.info section").style.display = "grid";
                displayInfo(g);
                document.querySelector("div.paintings section").style.display = "block";
                displayPaintings(g);
                displayMap(g);
            });

            sortPaintings(g);
            toggleButton();
            document.querySelector("#galleryList").appendChild(li);
        }
    }

    function toggleButton() {
        let toggle = document.querySelector("#toggle")
        toggle.addEventListener("click", e => {
            let list = document.querySelector(".list");
            let info = document.querySelector(".info");
            let main = document.querySelector("main");
            let map = document.querySelector(".map");
            if (e.target.nodeName.toLowerCase() == 'button' && list.style.display != "none") {
                list.style.display = "none";
                main.style.gridTemplateColumns = "17.5% 17.5% auto";
                info.style.gridColumn = "1 / span 2";
                map.style.gridColumn = "1 / span 2";
                toggle.textContent = "Show Gallery List"
            } else {
                list.style.display = "grid";
                main.style.gridTemplateColumns = "20rem 25rem auto";
                info.style.gridColumn = "2 / span 1";
                map.style.gridColumn = "2/ span 1";
                toggle.textContent = "Hide Gallery List"

            }
        })
    }

    //This function displays the gallery information that has been retrieved from the JSON file.
    function displayInfo(gallery) {
        document.querySelector("#galleryName").innerHTML = gallery.GalleryName;
        document.querySelector("#galleryNative").innerHTML = gallery.GalleryNativeName;
        document.querySelector("#galleryAddress").innerHTML = gallery.GalleryAddress;
        document.querySelector("#galleryCity").innerHTML = gallery.GalleryCity;
        document.querySelector("#galleryCountry").innerHTML = gallery.GalleryCountry;

        let website = document.querySelector("#galleryWebsite");
        website.href = gallery.GalleryWebSite;
        website.innerHTML = "Website";
    }

    //This function displays the location given from the JSON file 
    function displayMap(gallery) {
        map = new google.maps.Map(document.querySelector(".box.map"), {
            center: { lat: gallery.Latitude, lng: gallery.Longitude },
            zoom: 17,
            mapTypeId: 'satellite'
        });
    }

    function displayPaintings(gallery) {
        fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery=${gallery.GalleryID}`)
            .then(resp => resp.json())
            .then(paintings => {

                createPaintingTable(paintings);
                sortPaintings(paintings);

            })
    }

    function createPaintingTable(paintings) {
        document.querySelector("tbody").innerHTML = ""
        document.querySelector("#loader2").style.display = "none";

        for (let p of paintings) {

            let tableBody = document.querySelector("#paintingTable tbody");
            let tr = document.createElement("tr");
            tr.className = "tempTr";
            tableBody.appendChild(tr);

            let imgTd = document.createElement("td");
            let img = smallImage(p);
            imgTd.appendChild(img);
            imgTd.className = "img";
            tr.appendChild(imgTd);


            let artistTd = document.createElement("td");
            artistTd.setAttribute("class", "artist");
            let titleTd = document.createElement("td");
            titleTd.setAttribute("class", "title");
            titleTd.style.textDecoration = "underline";
            let yearTd = document.createElement("td");
            yearTd.setAttribute("class", "year");

            if (p.FirstName == null) {
                artistTd.textContent = `${p.LastName}`;
            } else if (p.LastName == null) {
                artistTd.textContent = `${p.FirstName}`;
            } else {
                artistTd.textContent = `${p.FirstName} ${p.LastName}`;
            }

            titleTd.textContent = `${p.Title}`;
            titleTd.setAttribute("id", `${p.ImageFileName}`);
            yearTd.textContent = `${p.YearOfWork}`;

            tr.appendChild(artistTd);
            tr.appendChild(titleTd);
            tr.appendChild(yearTd);


            img.addEventListener("click", function (e) {
                bigImage(e);
                displayPaintingInfo(e, paintings);

            })

            titleTd.addEventListener("click", function (e) {
                bigImage(e);
                displayPaintingInfo(e, paintings);

            })
        }
    }

     // Function lets us sort through the paintings list by clicking on artists, title, year.
     function sortPaintings(paintings) {
        let sortArtist = document.querySelector("#artist");
        let sortTitle = document.querySelector("#title");
        let sortYear = document.querySelector("#year");
        
        sortArtist.addEventListener("click", function () {
            paintings.sort((a, b) => {
                return a.LastName < b.LastName ? -1 : 1;
            });
            createPaintingTable(paintings);
        });
    
        sortTitle.addEventListener("click", function () {
            paintings.sort((a, b) => {
                return a.Title < b.Title ? -1 : 1;
            });
            createPaintingTable(paintings);
        });
    
        sortYear.addEventListener("click", function () {
            paintings.sort((a, b) => {
                return a.YearOfWork < b.YearOfWork ? -1 : 1;
            });
            createPaintingTable(paintings);
        });
    
    }

    function smallImage(painting) {
        let img = document.createElement("img");
        img.src = `https://res.cloudinary.com/funwebdev/image/upload/w_50/art/paintings/${painting.ImageFileName}`;
        img.id = `${painting.ImageFileName}`;
        return img;
    }

    function bigImage(e) {
        document.querySelector("main").style.display = "none";
        document.querySelector("#bigPainting").style.display = "block";

        let bigImage = document.querySelector("#bigImage");
        bigImage.src = `https://res.cloudinary.com/funwebdev/image/upload/w_400/art/paintings/${e.target.id}`;

        biggerImage(e);
    }

    function displayPaintingInfo(e, paintings) {;
        let painting = paintings.find(p => p.ImageFileName == e.target.id);
        document.querySelector("#pTitle").innerHTML = painting.Title;
        if (painting.FirstName == null) {
            document.querySelector("#pName").innerHTML = `${painting.LastName}`;
        } else if (painting.LastName == null) {
            document.querySelector("#pName").innerHTML = `${painting.FirstName}`;
        } else {
            document.querySelector("#pName").innerHTML = `${painting.FirstName} ${painting.LastName}`;
        }
        document.querySelector("#pGalleryName").innerHTML = painting.GalleryName;
        document.querySelector("#pGalleryCity").innerHTML = painting.GalleryCity;
        document.querySelector("#pCopyright").innerHTML = painting.CopyrightText;
        document.querySelector("#pYear").innerHTML = painting.YearOfWork;
        document.querySelector("#pWidth").innerHTML = painting.Width;
        document.querySelector("#pHeight").innerHTML = painting.Height;
        document.querySelector("#pMedium").innerHTML = painting.Medium;
        if (painting.Description == null) {
            document.querySelector("#pDescription").innerHTML = "Description Not Given.";
        } else {
            document.querySelector("#pDescription").innerHTML = painting.Description;
        }

        let website = document.querySelector("#pGalleryWebsite");
        website.href = painting.MuseumLink;
        website.innerHTML = "Website";

        displayColours(painting);
        closeButton();

    }

    function closeButton() {
        document.querySelector("#closeButton").addEventListener("click", e => {
            if (e.target.nodeName.toLowerCase() == 'button') {
                document.querySelector("#bigPainting").style.display = "none";
                document.querySelector("main").style.display = "grid";

            }
        })
    }

    function displayColours(painting) {
        const colours = document.querySelector("#pColours");
        colours.innerHTML = "";
        for (let c of painting.JsonAnnotations.dominantColors) {
            let hex = c.web;
            let span = document.createElement("span");
            span.title = `Name: ${c.name}, Hex: ${hex}`;
            span.style.backgroundColor = hex;
            colours.appendChild(span);
        }
    }

    function biggerImage(painting) {
        let bigPainting = document.querySelector("#bigPainting");
        let bigImage = document.querySelector("#bigImage");
        let biggerImage = document.querySelector("#biggerImage");
        let modal = document.querySelector("#modal");
        biggerImage.src = `https://res.cloudinary.com/funwebdev/image/upload/w_600/art/paintings/${painting.target.id}`
        bigImage.addEventListener("click", e => {
            bigPainting.style.display = "none";
            biggerImage.style.display = "block";
        });

        modal.addEventListener("click", e => {
            biggerImage.style.display = "none";
            bigPainting.style.display = "block";
        });
    }
})