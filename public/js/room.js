var roomID = window.location.pathname.substring(6);
var playlistArr;
var currentSong = "";

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
        roomID: roomID
        // upvote: 0
    };

    // var deezerID = $(this).attr("data-deezer");
    // console.log(deezerID);

    $.post("/api/songs/", newSong).then(function (data) {
        console.log(data);
        getPlaylist();
    });
});

function getPlaylist() {
    $.get("/api/songs/" + roomID).then(function (songs) {
        playlistArr = songs;
        renderPlaylist();
    })
}

function renderPlaylist() {
    console.log(playlistArr)
    // empty current song container
    $(".queued-track-container").empty();

    // loads playlist on screen

    // checks if there is a current song
    if (currentSong == "") {
        //creates playlist format for each song
        currentSong = playlistArr[0];
        $("#song").attr("src", playlistArr[0].preview);
        var queuedTrack = $("<div>").addClass("current-song-container").attr("data-id", playlistArr[0].deezerID);
        var nameContainer = $("<div>").addClass("name-container current-song");
        var artistName = playlistArr[0].artistName;
        var songName = playlistArr[0].songName;
        var songNameP = $("<p>").text(songName).addClass("song-name");
        var artistNameP = $("<p>").text(artistName).addClass("artist-name");
        var thumbsDiv = $("<div>").addClass("thumbs-container");

        thumbsDiv.addClass("btn-group");
        thumbsDiv.attr("role", "group");

        var upButton = $("<a>");
        // create upvote button
        upButton.attr("data-deezer", playlistArr[0].deezerID);
        upButton.addClass("btn btn-flat waves-effect waves-green upvote");
        upButton.html("<i class='material-icons'>thumb_up</i>");
        // create downvote button
        var downButton = $("<a>");
        downButton.attr("data-deezer", playlistArr[0].deezerID);
        downButton.addClass("btn btn-flat waves-effect waves-red downvote");
        downButton.html("<i class='material-icons'>thumb_down</i>");
        // add upvote to song container
        thumbsDiv.append(upButton);
        thumbsDiv.append(downButton);


        //album artwork information
        var thumbnail = playlistArr[0].thumbnail;
        var thumbnailImg = $("<img>").addClass("album-pic current-album");
        thumbnailImg.attr("src", thumbnail);

        nameContainer.append(songNameP, artistNameP);
        queuedTrack.append(thumbnailImg);
        queuedTrack.append(nameContainer);
        queuedTrack.append(thumbsDiv);
        // append current song to page
        $("#current-track-box").empty();
        $("#current-track-box").append(queuedTrack);
    }
    // checks if song ID matches current song ID
    for (var i = 0; i < playlistArr.length; i++) {
        if (playlistArr[i].id !== currentSong.id) {
            //creates playlist format for each song
            var queuedTrack = $("<div>").addClass("queued-song");
            var nameContainer = $("<div>").addClass("name-container");
            var artistName = playlistArr[i].artistName;
            var songName = playlistArr[i].songName;
            var songNameP = $("<p>").text(songName).addClass("song-name");
            var artistNameP = $("<p>").text(artistName).addClass("artist-name");
            var thumbsDiv = $("<div>");

            //album artwork information
            var thumbnail = playlistArr[i].thumbnail;
            var thumbnailImg = $("<img>").addClass("album-pic");
            thumbnailImg.attr("src", thumbnail);
            // create upvote button
            var upButton = $("<a>");
            upButton.attr("data-deezer", playlistArr[i].deezerID);
            upButton.addClass("btn btn-flat waves-effect waves-green upvote");
            upButton.html("<i class='material-icons'>thumb_up</i>");
            // create downvote button
            var downButton = $("<a>");
            downButton.attr("data-deezer", playlistArr[i].deezerID);
            downButton.addClass("btn btn-flat waves-effect waves-red downvote");
            downButton.html("<i class='material-icons'>thumb_down</i>");

            thumbsDiv.append(upButton);
            thumbsDiv.append(downButton);

            nameContainer.append(songNameP, artistNameP);
            queuedTrack.append(thumbnailImg);
            queuedTrack.append(nameContainer);
            queuedTrack.append(thumbsDiv);
            // append song to playlist container on page
            $(".queued-track-container").append(queuedTrack);
        }
    }
}

getPlaylist();

