$("#search-input").keyup(function (event) {
    //first remove the results from any previous search
    var searchStatus = $("#search-input").val();

    if (searchStatus == "") {
        $(".search-results").remove();
        $("#clear-search").css("visibility", "hidden")
    }
    else {
        $("#clear-search").css("visibility", "visible");
        $(".search-results").replaceWith();
        var searchName = $("#search-input").val().trim();
        // calls deezer API to show search results
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + searchName,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
                "x-rapidapi-key": "2b465189c6msh70d8eec8b15ca2bp19227bjsn69a9133db5ad"
            }
        }

        //create the search results div only when a search is first called
        var searchResults = $("<div>");
        searchResults.addClass("search-results");
        $(".search-results-container").append(searchResults);

        $.ajax(settings).done(function (response) {
            var results = response.data;
            
            searchResultArr = results;
            // loop through search results and adds each song to search result container on page
            for (var i = 0; i < results.length; i++) {
                
                var searchResult = $("<div>").addClass("search-result").attr("data-target", "#add-song-modal").attr("data-toggle", "modal").attr("data-backdrop", "false");
                var nameContainers = $("<div>").addClass("name-container search-name");
                var artistName = results[i].artist.name;
                var songName = results[i].title_short;
                var songNameP = $("<p>").text(songName);
                var artistNameP = $("<p>").text(artistName);

                //deezer catalogue id
                var deezerID = results[i].id;

                //album artwork information
                var thumbnail = results[i].album.cover;
                var thumbnailImg = $("<img>");

                //link to preview of audio
                var songURL = results[i].preview;

                thumbnailImg.attr("src", thumbnail).addClass("album-pic");
                searchResult.attr("data-deezer", deezerID);
                searchResult.attr("data-artist", artistName);
                searchResult.attr("data-song", songName);
                searchResult.attr("data-preview", songURL);
                searchResult.attr("data-thumbnail", thumbnail);

                searchResult.append(thumbnailImg);
                nameContainers.append(songNameP, artistNameP);
                searchResult.append(nameContainers);
                searchResults.append(searchResult);
            }
        })
    }
});

// function to clear search results
function clearSearchResults() {
    $(".search-results").remove();
    $("#search-input").val("");
    $("#clear-search").css("visibility", "hidden")
}

// listens for click to clear search results
$(document).on("click", "#clear-search", clearSearchResults);

// listens for click on song in search result
$(document).on("click", ".search-result", function (event) {
    var newSong = {
        deezerID: $(this).attr("data-deezer"),
        artistName: $(this).attr("data-artist"),
        songName: $(this).attr("data-song"),
        songURL: $(this).attr("data-preview"),
        thumbnail: $(this).attr("data-thumbnail"),
        // upvote: 0
    };

    // var deezerID = $(this).attr("data-deezer");
    // console.log(deezerID);

    $.post("/api/songs", newSong).then(function(data) {
        console.log(data);
    })
});