
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

var droppedItemList = [];
try {
    if (localStorage.getItem("droppedItemList").split(",") != "") {
        droppedItemList = localStorage.getItem("droppedItemList").split(",")
    }
} catch(ex) {localStorage.setItem("droppedItemList", []);}
addDroppedItemsListToDoc();
window.addEventListener("storage", addDroppedItemsListToDoc);



$(document).ready(function() {
    // $.getJSON('shoes.json', setShoeData);

    var genderList = getGenderList();
    var genderFilterHtml = ``;
    for(var i in genderList) {
        genderFilterHtml += `
            <input type="radio" name="gender" id="${genderList[i].toLowerCase()}" value="${genderList[i]}">
            <label for="${genderList[i].toLowerCase()}">${genderList[i]}</label>
        `;
    };
    document.getElementById("gender_filter").innerHTML = genderFilterHtml;

    var styleList = getStyleList();
    var styleFilterHtml = ``;
    for(var i in styleList) {
        styleFilterHtml += `
            <input type="radio" name="style" id="${styleList[i].toLowerCase()}" value="${styleList[i]}">
            <label for="${styleList[i].toLowerCase()}">${styleList[i]}</label>
        `;
    };
    document.getElementById("style_filter").innerHTML = styleFilterHtml;

    var colorList = getColorList();
    var colorFilterHtml = ``;
    for(var i in colorList) {
        colorFilterHtml += `
            <input type="radio" name="color" id="${colorList[i].toLowerCase()}" value="${colorList[i]}">
            <label for="${colorList[i].toLowerCase()}">${colorList[i]}</label>
        `;
    };
    document.getElementById("color_filter").innerHTML = colorFilterHtml;

    var sizeList = getSizeList();
    var sizeFilterHtml = ``;
    for(var i in sizeList) {
        sizeFilterHtml += `
            <input type="radio" name="size" id="size_${String(sizeList[i]).split(".").join("_")}" value="${sizeList[i]}">
            <label for="size_${String(sizeList[i]).split(".").join("_")}" class="size_lbl">${sizeList[i]}</label>
        `;
    };
    document.getElementById("size_filter").innerHTML = sizeFilterHtml;

    minMaxDuo = getMinMaxPrice();
    $("#minPricesLbl").html(minMaxDuo[0]);
    $("#maxPricesLbl").html(minMaxDuo[1]);

    $(function() {
        $("#price_slider").slider({
            min: minMaxDuo[0],
            max: minMaxDuo[1],
            step: 1,
            values: [minMaxDuo[0], minMaxDuo[1]],
            slide: function(event, ui) {
                $("#minPricesLbl").html(ui.values[0]);
                $("#maxPricesLbl").html(ui.values[1]);
            }
        });
    });
    $( function() {
        $( "#shoe_filter_accordion" ).accordion({
            heightStyle: "content",
            icons: false
        });
    });

    $( function() {
        $( ".cartWishListSection" ).tabs(); 
    } );

    loadShoes();

    $( ".searchResult").draggable({
        helper: "clone",
        zIndex: 1,
        containment: "html",
        start: function(e, ui) { 
            $(ui.helper).css("transition", "none");
        }
    }); 

    $("#savedItems").droppable({
        drop:function(e, ui) {
            var droppedItemId = ui.draggable.attr("id");
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

    $("#search_btn").on("click", function() {

        var searchObj = {};

        var genderSelection = $("input[name='gender']:checked").val();
        var styleSelection = $("input[name='style']:checked").val();
        var colorSelection = $("input[name='color']:checked").val();
        var sizeSelection = $("input[name='size']:checked").val();
        var minPriceSelection = $("#minPricesLbl").html();
        var maxPriceSelection = $("#maxPricesLbl").html();

        if(genderSelection != null) {
            searchObj["gender"] = genderSelection.toLowerCase();
        }
        if(styleSelection != null) {
            searchObj["style"] = styleSelection.toLowerCase();
        }
        if(colorSelection != null) {
            searchObj["colour"] = colorSelection.toLowerCase();
        }
        if(sizeSelection != null) {
            searchObj["size"] = sizeSelection;
        }
        if(minPriceSelection != null) {
            searchObj["minprice"] = minPriceSelection;
        }
        if(maxPriceSelection != null) {
            searchObj["maxprice"] = maxPriceSelection;
        }

        window.location.href = `?${new URLSearchParams(searchObj).toString()}`;

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

});

function loadShoes() {
    
    var shoeResults = ``;
    var genderSelection = usp.get("gender");
    var styleSelection = usp.get("style");
    var colorSelection = usp.get("colour");
    var sizeSelection = usp.get("size");
    var minPriceSelection = usp.get("minprice");
    var maxPriceSelection = usp.get("maxprice");
    
    for(var i in shoeData.shoes) {
        if(genderSelection == shoeData.shoes[i].gender.toLowerCase() || genderSelection == null) {
            if(styleSelection==shoeData.shoes[i].style.toLowerCase() || styleSelection==null) {
                if(colorSelection==shoeData.shoes[i].colour.toLowerCase() || colorSelection==null) {
                    if(shoeData.shoes[i].sizes.includes(parseInt(sizeSelection)) || sizeSelection==null) {
                        if(minPriceSelection <= shoeData.shoes[i].price || minPriceSelection == null) {
                            if(maxPriceSelection >= shoeData.shoes[i].price || maxPriceSelection == null) {
                                shoeResults += `
                                    <div class="searchResult" style="border-left: ${shoeData.shoes[i].colour} 3px solid;" id="${shoeData.shoes[i].id}">
                                        <a href="shoe.html?id=${shoeData.shoes[i].id}" class="searchResultAnchor" target="_blank">
                                        <div class="searchResultContent">
                                            <img src="${shoeData.shoes[i].picture[0]}" alt="Image not avaiilable.">
                                            <div class="searchResultDescriptionBox">
                                                <div>
                                                    <span class="searchResultName"><b>${shoeData.shoes[i].name}</b></span><br>
                                                    <span class="searchResultDescrips">${shoeData.shoes[i].style}</span><br>
                                                    <span class="searchResultDescrips">${shoeData.shoes[i].colour}</span>
                                                </div>
                                                <div class="searchResultPriceBox">
                                                    <span class="searchResultDescrips">${shoeData.shoes[i].price}</span>
                                                </div>
                                            </div>
                                        </div>
                                        </a>
                                        <div class="searchResultCartWishListWrap">
                                            <button class="addToSaveListBtn" id="${shoeData.shoes[i].id}_AddToSavedItemsBtn">
                                            <button class="addToCartBtn" id="${shoeData.shoes[i].id}_AddToCartBtn">
                                        </div>
                                    </div>
                                `;
                            }
                        }
                                
                    }
                }
            }
        }  
    }
    
    document.getElementById("searchResultCards").innerHTML = shoeResults;
}

function getGenderList() {
    var genderList = [];
    for(var i in shoeData.shoes) {
        if(!genderList.includes(shoeData.shoes[i].gender)) {
            genderList.push(shoeData.shoes[i].gender);
        }
    }
    return genderList.sort();
}

function getStyleList() {
    var styleList = [];
    for(var i in shoeData.shoes) {
        if(!styleList.includes(shoeData.shoes[i].style)) {
            styleList.push(shoeData.shoes[i].style);
        }
    }
    return styleList.sort();
}

function getColorList() {
    var colorList = [];
    for(var i in shoeData.shoes) {
        if(!colorList.includes(shoeData.shoes[i].colour)) {
            colorList.push(shoeData.shoes[i].colour);
        }
    }
    return colorList.sort();
}

function getSizeList() {
    var sizeList = [];
    for(var i in shoeData.shoes) {
        for(var j in shoeData.shoes[i].sizes) {
            if(!sizeList.includes(shoeData.shoes[i].sizes[j])) {
                sizeList.push(shoeData.shoes[i].sizes[j]);
            }
        }
    }
    return sizeList.sort(function(a, b) {
        return parseInt(a) - parseInt(b);
    });
}

function getMinMaxPrice() {
    var minMaxDuo = [shoeData.shoes[0].price, shoeData.shoes[0].price];

    for(var i in shoeData.shoes) {
        if(shoeData.shoes[i].price < minMaxDuo[0]) {
            minMaxDuo[0] = shoeData.shoes[i].price;
        } 
        if(shoeData.shoes[i].price > minMaxDuo[1]) {
            minMaxDuo[1] = shoeData.shoes[i].price;
        }
    }
    return minMaxDuo;
}

function getShoeArrayIndexById(shoeId) {
    for (var i = 0; i < shoeData.shoes.length; i++) {
        if (shoeData.shoes[i].id == shoeId) {
            return i;
        }
    }
    return null;
}

function addDroppedItemsListToDoc() {
    try {
        if (localStorage.getItem("droppedItemList").split(",") != "") {
            droppedItemList = localStorage.getItem("droppedItemList").split(",");
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
                <a href="shoe.html?id=${droppedShoe.id}" target="_blank"><img src="images/icons/open_in_new_white.svg" alt="Image not avaiilable." id="CartWishListItempenInNewWindowImg"></a>
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

function myTestFunc(e) {
    alert("updated from to by outside!");
}
