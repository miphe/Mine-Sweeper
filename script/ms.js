Mi = {}

Mi.mineSweeper = function() {
    return {
        init: function() {

            // createBoard() takes two arguments:
            // x, number of horizonal tiles
            // y, number of vertical tiles

            this.createBoard(8, 8)
            this.startGame()
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
                row.append('<td></td>')
            }
            return row
        },

        populateBoard: function(board, numberOfMines) {
            var cells = board.find('td')
            var numberOfTiles = cells.length

            cells.addClass('safe').html('<span>-</span>')

            // Attach each mine at random tile
            for (var i = 0; i < numberOfMines; i++) {

                var cellTarget = $(cells[Math.round(Math.random()*numberOfTiles)])

                // If we're targeting an already unsafe cell, rerun this loop
                // Makes sure we get correct amount of mines
                if (cellTarget.is('.safe')) {
                    cellTarget.removeClass('safe').addClass('unsafe').html('<span>x</span>')
                } else {
                    i--
                }
            }

            function getRowByCell(cell) {
                return $(cell).parent('tr')
            }

            function getPositionByCell(cell) {
                var cells = $(cell).parent('tr').find('td')
                return cells.index(cell)
            }

            function getAdjecentTiles(thisRow, cellIndex) {

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
            }

            // Populate safe cells with numbers
            var safeCells = board.find('.safe')

            $.each(safeCells, function(i, c) {
                var adjecentMines = 0

                adjecentTiles = getAdjecentTiles(
                    getRowByCell(c),
                    getPositionByCell(c)
                )

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
                alert('Unsupported tile settings, this board will have 40% mines. Good luck!');
                return tiles*0.4
            }
                
        },

        startGame: function() {
            //
        }
    }
}()

$(document).ready( function() {
    Mi.mineSweeper.init()
})