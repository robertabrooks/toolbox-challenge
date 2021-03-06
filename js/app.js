
"use strict";

// when document is ready
$(document).ready(function() {
    var gameBoard = $('#gameBoard');
    var clicks = 0;
    var elapsedSeconds = 0;
    var matches = 0;
    var img;
    var tile1;
    var tiles = [];
    for (var i = 1; i <= 32; i++) {
        tiles.push({
            tileNum: i,
            src: 'img/tile' + i + '.jpg',
            flipped: false,
            matched: false
        });
    }  // for each tile

    var resetInterval = null;
    $('#startGame').click(function() {
        gameBoard.empty();
        if (clearInterval) {
            window.clearInterval(resetInterval);
        }
        clicks = 0;
        matches = 0;
        var remain = 8;
        $('#elapsed-seconds').text("Time: " + elapsedSeconds);
        $('#matches').text("Matches: " + matches);
        $('#remain').text("Remaining: " + (8 - matches));
        $('#failedAttempts').text("Attempts: " + (clicks - matches));
        tiles = _.shuffle(tiles);
        var toUse = tiles.slice(0, 8);
        var pairs = [];
        _.forEach(toUse, function(tile) {
            pairs.push(tile);
            pairs.push(_.clone(tile));
        });
        pairs = _.shuffle(pairs);
        var row = $(document.createElement('div'));
        _.forEach(pairs, function(tile, elemIndex) {
            if (elemIndex > 0 && elemIndex % 4 == 0) {
                gameBoard.append(row);
                row = $(document.createElement('div'));
            }
            img = $(document.createElement('img'));
            img.attr({
                src: 'img/tile-back.png',
                alt: 'tile ' + tile.tileNum
            });
            img.data('tile', tile);
            row.append(img);
        });
        gameBoard.append(row);
        var seconds = Date.now();
        resetInterval = window.setInterval(function() {
            elapsedSeconds = (Date.now() - seconds) / 1000;
            elapsedSeconds = Math.floor(elapsedSeconds);
            var minutes = Math.floor(elapsedSeconds / 60);
            elapsedSeconds = elapsedSeconds % 60;
            if (elapsedSeconds < 10) {
                elapsedSeconds = "0" + elapsedSeconds;
            }
            $('#elapsed-seconds').text('Time: ' + minutes + ':' + elapsedSeconds);
        }, 1000);

        var firstClick= null;
        $('#gameBoard img').click(function() {
            var clickedImg = $(this);
            var tile = clickedImg.data('tile');
            flipTile(tile, clickedImg);
            if (firstClick != null) {
                tile1 = firstClick.data('tile');
                if (tile.src !== tile1.src) {
                    setTimeout(function() {
                        flipTile(tile, clickedImg);
                        flipTile(tile1, firstClick);
                        firstClick = null;
                    }, 1000);
                }
                else {
                    matches++;
                    remain--;
                    tile.matched = true;
                    tile1.matched = true;
                    firstClick = null;
                }
                clicks++;
            }
            else {
                firstClick = clickedImg;
            }
            update(pairs, matches, remain, clicks);
            $('#matches').text("Matches: " + matches);
            $('#remain').text("Remaining: " + (8 - matches));
            $('#failedAttempts').text("Attempts: " + (clicks - matches));
        });
    });
});

function flipTile(tile, img) {
    img.fadeOut(100, function() {
        if (tile.flipped) {
            img.attr('src', 'img/tile-back.png');
        } else {
            img.attr('src', tile.src);
        }
        tile.flipped = !tile.flipped;
        img.fadeIn(100);
    });
}

function update(pairs, matched, unmatched, attempts) {
    $('#attempts').text(attempts);
    $('#matches').text(matched);
    $('#remain').text(unmatched);
    var win = true;
    _.forEach(pairs, function(tile, elemIndex) {
        win = tile.matched && win;
    });
    if (win) {
        window.alert('YOU WON!');
    }
}