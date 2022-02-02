
var shoeData; 

$.ajax({
    type:"GET",
    url:"shoes.json",
    async: false,
    success: function(response){
        shoeData = response;
    }
});

var usp = new URLSearchParams(window.location.search);

var currentImageNumber = 0;

var shoeId = usp.get("id");
var shoeIdIndex = getShoeArrayIndexById(shoeId);

var droppedItemList = [];
try {
    if (localStorage.getItem("droppedItemList").split(",") != "") {
        droppedItemList = localStorage.getItem("droppedItemList").split(",")
    }
} catch(ex) {localStorage.setItem("droppedItemList", []);}
addDroppedItemsListToDoc();
window.addEventListener("storage", addDroppedItemsListToDoc);

$("title").html(shoeData.shoes[shoeIdIndex].name);

$(document).ready(function() {
    var usp = new URLSearchParams(window.location.search);

    loadImages(currentImageNumber);

    if(usp.get("gender") != null) {
        document.getElementById("midSection").innerHTML = `<h1>${usp.get("gender")}</h1>`
    }

    $("#shoeName").html(shoeData.shoes[shoeIdIndex].name);
    $("#shoePriceSpan").html(shoeData.shoes[shoeIdIndex].price);
    $("#colorGenderStyleSection").html(`
        <div>
            <span>COLOUR:</span>
            <input type="radio" name="color" id="${shoeData.shoes[shoeIdIndex].colour.toLowerCase()}" checked="true" value="${shoeData.shoes[shoeIdIndex].colour}">
            <label for="${shoeData.shoes[shoeIdIndex].colour.toLowerCase()}">${shoeData.shoes[shoeIdIndex].colour}</label>
        </div>
        <div>
            <span>GENDER:</span>
            <input type="radio" name="gender" id="${shoeData.shoes[shoeIdIndex].gender.toLowerCase()}" checked="true" value="${shoeData.shoes[shoeIdIndex].gender}">
            <label for="${shoeData.shoes[shoeIdIndex].gender.toLowerCase()}" id="genderLbl">${shoeData.shoes[shoeIdIndex].gender}</label>
        </div>
        <div>
            <span>STYLE:</span>
            <input type="radio" name="style" id="${shoeData.shoes[shoeIdIndex].style.toLowerCase()}" checked="true" value="${shoeData.shoes[shoeIdIndex].style}">
            <label for="flat">${shoeData.shoes[shoeIdIndex].style}</label>
        </div>
    `);

    for (var i in shoeData.shoes[shoeIdIndex].sizes) {
        $("#shoeSizes").append(`
            <input type="radio" name="size" id="size_${String(shoeData.shoes[shoeIdIndex].sizes[i]).split(".").join("_")}" value="${shoeData.shoes[shoeIdIndex].sizes[i]}">
            <label for="size_${String(shoeData.shoes[shoeIdIndex].sizes[i]).split(".").join("_")}" class="size_lbl">${shoeData.shoes[shoeIdIndex].sizes[i]}</label>
        `);
    }

    $("#productDescriptionParagraph").html(shoeData.shoes[shoeIdIndex].description);

    for (var i in shoeData.shoes[shoeIdIndex].quickspecs) {
        $("#quickSpecList").append(`
            <li>${shoeData.shoes[shoeIdIndex].quickspecs[i]}</li>
        `);
    }

    var sizeGuide = {
        "sizeGuideRows": [
            [2, 24, 35, 212],
            [2.5, 35, 35.5, 216],
            [3,	35.5, 36, 221],
            [3.5, 36, 36.5,	225],
            [4, 37, 37, 229],
            [4.5, 37.5, 37.5, 233],
            [5, 38,	38, 237],
            [5.5, 39, 38.5, 241],
            [6, 39.5, 39, 246],
            [6.5, 40, 40, 250],
            [7, 41, 41, 254],
            [7.5, 41.5, 41.5, 258],
            [8, 42, 42, 263],
            [8.5, 42.5, 42.5, 267],
            [9, 43, 43, 272],
            [9.5, 44, 44, 276],
            [10, 44.5, 45, 280],
            [10.5, 45, 45.5, 285],
            [11, 46, 46, 289],
            [11.5, 46.5, 46.5, 293],
            [12, 47, 47, 298],
            [12.5, 47.5, 47.5, 302],
            [13, 48, 48, 306],
            [13.5, 49, 48.5, 310],
            [14, 49.5, 49, 314],
            [14.5, 50, 50, 319],
            [15, 51, 51, 323]
        ]
    }

    for (var i in sizeGuide.sizeGuideRows) {
        $("#sizeGuideTable").append(`
            <tr>
                <td>${sizeGuide.sizeGuideRows[i][0]}</td>
                <td>${sizeGuide.sizeGuideRows[i][1]}</td>
                <td>${sizeGuide.sizeGuideRows[i][2]}</td>
                <td>${sizeGuide.sizeGuideRows[i][3]}</td>
            </tr>
        `);
    }

    $( function() {
        $( "#detailTabSection" ).tabs();
    } );
    $( function() {
        $( ".cartWishListSection" ).tabs(); 
    } );

    $( "#mainImageDiv").draggable({
        start: function(e, ui) { 
            $(ui.helper).css({"transition": "none", "width": "400px", "height": "auto"});
        },
        helper: "clone",
        zIndex: 1,
    }); 
    $("#savedItems").droppable({
        drop:function(e, ui) {
            var droppedItemId = shoeData.shoes[shoeIdIndex].id; 
            if(!droppedItemList.includes(droppedItemId)) {
                droppedItemList.push(droppedItemId);

                try {
                    localStorage.setItem("droppedItemList", droppedItemList);
                } catch(e) {
                    console.log("Error!");
                }

                addDroppedItemsListToDoc();
            } 
        }
    });

    $(document).on("click", ".savedItemRemoveBtn", function(e) {
        var savedItemRemoveBtn_ShoeId = e.target.id.split("_")[0];
        savedItemRemove(savedItemRemoveBtn_ShoeId);
    });
    $(document).on("click", ".addToSaveListBtn", function(e) {
        var addToSaveListBtn_ShoeId = e.target.id.split("_")[0];
        if(!droppedItemList.includes(addToSaveListBtn_ShoeId)) {
            droppedItemList.push(addToSaveListBtn_ShoeId);
            try {
                localStorage.setItem("droppedItemList", droppedItemList);
            } catch(ex) {}
            addDroppedItemsListToDoc(); 
        }
    });

    $("#navToPrevImageBtn").on("click", function() {
        currentImageNumber--;
        $("#navToNextImageBtn").prop("disabled", false);
        if(currentImageNumber == 0) {
            $("#navToPrevImageBtn").prop("disabled", true);
        }
        loadImages(currentImageNumber);
    });
    $("#navToNextImageBtn").on("click", function() {
        currentImageNumber++;
        $("#navToPrevImageBtn").prop("disabled", false);
        if(currentImageNumber == shoeData.shoes[shoeIdIndex].picture.length-1) {
            $("#navToNextImageBtn").prop("disabled", true);
        }
        loadImages(currentImageNumber);
    });
    
    $(document).on("click", ".shoePreviewSection", function(e) {
        if(!(e.target.id == "navToPrevImageBtn" || e.target.id == "navToNextImageBtn")) {
            document.getElementById("enlargedImageSection").style.visibility = "visible";
        }
    });
    $("#closeEnlargedImageBtn").on("click", function() {
        document.getElementById("enlargedImageSection").style.visibility = "hidden";
    });

});

function loadImages(imgNumber) {
    $("#enlargedImageWrapper").html(`
        <img src="${shoeData.shoes[shoeIdIndex].picture[imgNumber]}" alt="Image not avaiilable."></img>
    `);
    $("#mainImageDiv").html(`
        <img src="${shoeData.shoes[shoeIdIndex].picture[imgNumber]}" alt="Image not avaiilable.">
    `);
}
function getShoeArrayIndexById(shoeId) {
    for (var i = 0; i < shoeData.shoes.length; i++) {
        if (shoeData.shoes[i].id == shoeId) {
            return i;
        }
    }
    return null;
}
function addAutoUpdatedDroppedItemsListToDoc(e) {
    alert();
}
function addDroppedItemsListToDoc(e) {
    try {
        if (localStorage.getItem("droppedItemList").split(",") != "") {
            droppedItemList = localStorage.getItem("droppedItemList").split(",")
        }
    } catch(ex) {}
    var savedItemHtml = ``;
    for (var i=0; i<droppedItemList.length; i++) {
        var droppedShoe = shoeData.shoes[getShoeArrayIndexById(droppedItemList[i])];

        savedItemHtml += `
            <div class="savedItem">
                <div class="savedItemContent">
                    <img src="${droppedShoe.picture[0]}" alt="Not found!">
                    <div class="savedItemDescrips">
                        <span class="savedItemName">${droppedShoe.name}</span><br>
                        <span>${droppedShoe.colour}</span><br>
                        <span class="savedItemPrice">${droppedShoe.price}</span><br>
                    </div>
                </div>
                <div class="savedItemContentWrapper"></div>
                <a href="?id=${droppedShoe.id}" target="_blank"><img src="images/icons/open_in_new_white.svg" alt="Image not avaiilable." id="CartWishListItempenInNewWindowImg"></a>
                <button class="savedItemRemoveBtn" id="${droppedShoe.id}_savedItemRemoveBtn">X</button>
            </div>
        `;
    }

    document.getElementById("savedItems").innerHTML = savedItemHtml;
}
function savedItemRemove(savedItemRemoveBtn_ShoeId) {
    droppedItemList.splice(droppedItemList.indexOf(savedItemRemoveBtn_ShoeId), 1);
    try {
        localStorage.setItem("droppedItemList", droppedItemList);
    } catch(ex) {}
    addDroppedItemsListToDoc();
}