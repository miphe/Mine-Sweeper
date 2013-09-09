// MineSweeper by André Drougge - andre.drougge@gmail.com
// http://ms.miphe.com

Mi = Mi || {}

Mi.mineSweeper = function() {
    return {
        failureCode: function(m) {
            return {
                1: 'You hit a mine! Game over, get to the hospital and patch yourself up.',
                2: 'Time\'s up! You failed to sweep all mines on time.',
                3: 'You gave up! Try again, don\'t be discouraged.',
                4: 'BOOM! You took too long between clicks, the mines got unstable and blew up.'
            }[m]
        },

        successCode: function(m) {
            return {
                1: 'Congratulations! You have successfully swept all mines, this minefield is much safer now.'
            }[m]
        },

        gameOn: null,

        init: function() {
            Mi.mineSweeper.clearControlPanel()
            Mi.mineSweeper.applyInputRestrictionEvents()
            Mi.mineSweeper.unFreezeControlPanel()
            Mi.mineSweeper.applyGameEndEvents()

            sweep = $.Event('sweep')
            endGame = $.Event('endGame')

            $('#control-panel').on('click', '#start-game', function() {
                Mi.mineSweeper.gameOn = true
                Mi.mineSweeper.freezeControlPanel()
                Mi.mineSweeper.clearFeedback()
                var settings = Mi.mineSweeper.readControlPanel()
                Mi.mineSweeper.createBoard(settings.x, settings.y, settings.percentage)
                Mi.mineSweeper.applyGameEvents()

                if(settings.hc)
                    Mi.mineSweeper.hc.init()

                if(Mi.mineSweeper.gameOn) {
                    Mi.mineSweeper.showGiveUpButton()
                    Mi.mineSweeper.applyGiveUpEvents()
                }
            })
        },

        readControlPanel: function() {
            var cp = $('#control-panel')

            return {
                x: cp.find('.tiles-x').val() || 12,
                y: cp.find('.tiles-y').val() || 12,
                percentage: cp.find('.mine-percentage').val() || 25,
                hc: cp.find('#hardcore-mode').is(':checked') || false
            }
        },

        clearControlPanel: function() {
            $('#control-panel input[type=text]').val('');
        },

        freezeControlPanel: function() {
            $('#control-panel input, button').prop('disabled', true)
            $('#control-panel #start-game').addClass('is-disabled').text('Game in progress')
        },

        unFreezeControlPanel: function() {
            $('#control-panel input, button').prop('disabled', false)
            $('#control-panel #start-game').removeClass('is-disabled').text('Start game')
        },

        applyInputRestrictionEvents: function() {
            // Should only allow input between 8 and 23
            $('#control-panel').on('blur', '.tiles', function() {
                var v   = $(this).val()
                var va  = v < 8 ? 8 : v
                var val = va > 23 ? 23 : va
                $(this).val(val)
            })

            // Should only allow difficulty percentage between 3 and 95
            $('#control-panel').on('blur', '#mine-percentage', function() {
                var v   = $(this).val()
                var va  = v < 3 ? 3 : v
                var val = va > 95 ? 95 : va
                $(this).val(val)
            })
        },

        createBoard: function(x, y, p) {
            var board = $('<table class="board box-2"></table>')

            for (var i = 0; i < y; i++) {
                board.append(Mi.mineSweeper.boardRow(x))
            }
            Mi.mineSweeper.populateBoard(board, Math.round(x*y * p/100))
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
            $(c).addClass('swept-0').removeClass('flagged')
            var adjecentZeros = Mi.mineSweeper.sweepAdjecent(c)

            $.each(adjecentZeros, function(i, z) {
                if ($(z).is('.swept-0'))
                    return true

                $(z).addClass('swept-0')
                Mi.mineSweeper.sweepZero(z)
            })
        },

        applyGameEvents: function() {
            $('.board').on('click', 'td.hidden', function(e) {

                if (!Mi.mineSweeper.gameOn)
                    return

                $(document).trigger('sweep')
                var c = $(this)
                var thisBoard = c.closest('.board')
                c.removeClass('hidden flagged')

                if (c.is('td:contains("0")')) {
                    Mi.mineSweeper.sweepZero(c)
                } else if (c.is('.unsafe')) { // Hit a mine?
                    c.addClass('culprit')
                    setTimeout( function() {
                        Mi.mineSweeper.failGame(thisBoard)
                    }, 500)
                    
                } else if (thisBoard.find('.hidden.safe').length < 1) { // All safe tiles swept?
                    Mi.mineSweeper.sweepingDone(thisBoard)
                }
            })

            $('.board td.hidden').bind('contextmenu', function(){
                if ($(this).is('.hidden'))
                    Mi.mineSweeper.flagTile(this)

                return false;
            })
        },

        applyGameEndEvents: function() {
            $(document).on('endGame', function(e) {
                Mi.mineSweeper.gameOn = false
                Mi.mineSweeper.hideGiveUpButton()
            })
        },

        sweepingDone: function(board) {
            var allCells = board.find('td')
            allCells.removeClass('hidden')

            $(document).trigger('endGame')
            Mi.mineSweeper.notifySuccess(1)
            Mi.mineSweeper.unFreezeControlPanel()
        },

        failGame: function(board, reason) {
            var allCells = board.find('td')
            allCells.removeClass('hidden')
            reason = reason || 1

            $(document).trigger('endGame')
            Mi.mineSweeper.clearFeedback()
            Mi.mineSweeper.notifyFail(reason)
            Mi.mineSweeper.unFreezeControlPanel()
        },

        notifySuccess: function(reason) {
            var markup = '<p>' + Mi.mineSweeper.successCode(reason) + '</p>'
            $('.feedback-container').addClass('positive-message').append(markup).animate({
                height: 'toggle'
            })
        },

        notifyFail: function(reason) {
            var markup = '<p>' + Mi.mineSweeper.failureCode(reason) + '</p>'
            $('.feedback-container')
                .addClass('negative-message')
                .append(markup)
                .animate({
                    height: 'toggle'
                }
            )
        },

        clearFeedback: function() {
            $('.feedback-container').empty().attr('class', 'feedback-container').hide()
        },

        flagTile: function(c) {
            $(c).toggleClass('flagged')
        },

        showGiveUpButton: function() {
            Mi.mineSweeper.giveUpButton().appendTo('#button-row-2').animate({
                opacity: 'toggle'
            }, 2000)
        },

        hideGiveUpButton: function() {
            $('#give-up').remove()
        },

        giveUpButton: function() {
            var btn = '<a id="give-up" href="#" class="l-button v-1 t-2" style="display: none;">Give up?</a>'
            return $(btn)
        },

        applyGiveUpEvents: function() {
            $('#give-up').on('click', function() {
                // TODO: Grabbing the board here disables us
                // from having several boards in the future.
                // Refactor if thats something we need.
                Mi.mineSweeper.failGame($('.board'), 3)
            })
        }
    }
}()

$(document).ready( function() {
    Mi.unrelated.init()
    Mi.mineSweeper.init()
})