// MineSweeper by André Drougge - andre.drougge@gmail.com
// http://miphe.com

// TODO
// * Add automatic tile turnover when 0:s are adjecent 
// * Add user controlled settings (board size, difficulty)
// * Add game history, last games
// * Add timer
// * Add timetracker (best score)
// * Add stress indicator (too long between clicks)
// * Add hardcore mode
// ** Mines blow if time between clicks aren't fast enough
// ** When all safe zones are opened, do not notify, user needs to say 'ALL DONE' before game is over

Mi = {}

Mi.mineSweeper = function() {
    return {
        failureCode: function(m) {
            return {
                1: 'You hit a mine! Game over, get to the hospital and patch yourself up.',
                2: 'Time\'s up! You failed to sweep all mines on time.'
            }[m]
        },

        successCode: function(m) {
            return {
                1: 'Congratulations! You have successfully swept all mines, this minefield is much safer now.'
            }[m]
        },

        init: function() {

            // createBoard() takes two arguments:
            // x, number of horizonal tiles
            // y, number of vertical tiles

            this.createBoard(4, 4)
            this.applyGameEvents()
        },

        createBoard: function(x, y) {
            var board = $('<table class="board box-2"></table>')

            for (var i = 0; i < y; i++) {
                board.append(Mi.mineSweeper.boardRow(x))
            }

            Mi.mineSweeper.populateBoard(board, Mi.mineSweeper.boardSettings(x*y))
            Mi.mineSweeper.renderBoard(board)
        },

        renderBoard: function(board) {
            $('.board-container').html(board)
        },

        boardRow: function(x) {
            var row = $('<tr></tr>')
            for (var i = 0; i < x; i++) {
                row.append('<td class="hidden"></td>')
            }
            return row
        },

        getRowByCell: function(cell) {
            return $(cell).parent('tr')
        },

        getPositionByCell: function(cell) {
            var cells = $(cell).parent('tr').find('td')
            return cells.index(cell)
        },

        getAdjecentTiles: function(c) {
            var thisRow = Mi.mineSweeper.getRowByCell(c)
            var cellIndex = Mi.mineSweeper.getPositionByCell(c)
            var adjecentTiles = $()
            var prevRow = thisRow.prev('tr')
            var nextRow = thisRow.next('tr')

            function getCellsByRow(r) {
                return r.find('td')
            }

            function findAdjecentCells(coll, includeSelf) {

                var range = coll.length
                var result = $()

                // Following conditions makes sure that
                // no cells on opposite site of board
                // is deemed adjecent.

                if (cellIndex + 1 < range)
                    result = result.add(coll.get(cellIndex + 1))

                if (cellIndex > 0)
                    result = result.add(coll.get(cellIndex - 1))

                if (includeSelf)
                    result = result.add(coll.get(cellIndex))

                return result
            }

            adjecentTiles = adjecentTiles.add(findAdjecentCells(getCellsByRow(prevRow), true))
            adjecentTiles = adjecentTiles.add(findAdjecentCells(getCellsByRow(thisRow), false))
            adjecentTiles = adjecentTiles.add(findAdjecentCells(getCellsByRow(nextRow), true))

            return adjecentTiles
        },

        populateBoard: function(board, numberOfMines) {
            var cells = board.find('td')
            var numberOfTiles = cells.length

            cells.addClass('safe')

            // Attach each mine at random tile
            for (var i = 0; i < numberOfMines; i++) {

                var cellTarget = $(cells[Math.round(Math.random()*numberOfTiles)])

                // If we're targeting an already unsafe cell, rerun this loop
                // Makes sure we get correct amount of mines
                if (cellTarget.is('.safe')) {
                    cellTarget.removeClass('safe').addClass('unsafe').html('x')
                } else {
                    i--
                }
            }

            // Populate safe cells with numbers
            var safeCells = board.find('.safe')

            $.each(safeCells, function(i, c) {
                var adjecentMines = 0

                adjecentTiles = Mi.mineSweeper.getAdjecentTiles(c)

                $.each(adjecentTiles, function(i, tile) {
                    if ($(tile).hasClass('unsafe'))
                        adjecentMines += 1
                })

                $(c).html(adjecentMines)
            })
        },

        boardSettings: function(tiles) {

            // Supported settings:
            // 8x8, 12x12, 16x16

            var settings =  {
                numberOfMinesByTiles: {
                    64:  10, // 8x8     => 10 mines
                    144: 20, // 12x12   => 20 mines
                    256: 30  // 16x16   => 30 mines
                }
            }

            if (settings.numberOfMinesByTiles[tiles]) {
                return settings.numberOfMinesByTiles[tiles]
            } else {
                alert('Unsupported tile settings, this board will have 20% mines. Good luck!');
                return tiles*0.2
            }
                
        },

        sweepAdjecent: function(c) {
            var collection = Mi.mineSweeper.getAdjecentTiles(c)
            collection.removeClass('hidden')

            return Mi.mineSweeper.getAdjecentZeros(c)
        },

        getAdjecentZeros: function(c) {
            var collection = Mi.mineSweeper.getAdjecentTiles(c)
            var zeros = collection.filter(':contains(0)')

            return zeros
        },

        sweepZero: function(c) {
            $(c).addClass('swept-0')
            var adjecentZeros = Mi.mineSweeper.sweepAdjecent(c)

            $.each(adjecentZeros, function(i, z) {
                if ($(z).is('.swept-0'))
                    return true

                $(z).addClass('swept-0')
                Mi.mineSweeper.sweepZero(z)
            })
        },

        applyGameEvents: function() {
            $('.board').on('click', 'td.hidden', function() {
                var c = $(this)
                var thisBoard = c.closest('.board')
                c.removeClass('hidden')

                if (c.is('td:contains("0")')) {
                    Mi.mineSweeper.sweepZero(c)
                } else if (c.is('.unsafe')) { // Hit a mine?
                    c.addClass('culprit')
                    Mi.mineSweeper.failGame(thisBoard)
                } else if (thisBoard.find('.hidden.safe').length < 1) { // All safe tiles swept?
                    Mi.mineSweeper.sweepingDone(thisBoard)
                }
            })
        },

        sweepingDone: function(board) {
            var allCells = board.find('td')
            allCells.removeClass('hidden')

            // TODO: detemine more specifically what happened.
            Mi.mineSweeper.notifySuccess(1)
        },

        failGame: function(board) {
            var allCells = board.find('td')
            allCells.removeClass('hidden')

            // TODO: detemine more specifically why game ended.
            Mi.mineSweeper.notifyFail(1)
        },

        notifySuccess: function(reason) {
            var markup = '<p>' + Mi.mineSweeper.successCode(reason) + '</p>'
            $('.feedback-container').addClass('positive-message').append(markup).animate({
                height: 'toggle'
            })
        },

        notifyFail: function(reason) {
            var markup = '<p>' + Mi.mineSweeper.failureCode(reason) + '</p>'
            $('.feedback-container').addClass('negative-message').append(markup).animate({
                height: 'toggle'
            })
        }
    }
}()

$(document).ready( function() {
    Mi.mineSweeper.init()
})