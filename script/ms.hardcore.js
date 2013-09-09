
Mi.mineSweeper.hc = function() {
    return {
        init: function() {
        	this.clearHardCorePanel()
        	this.showHardCorePanel()
        	this.startTimer()
            this.reStartSweepTimer()
        	this.applyHardCoreEvents()
        },

        showHardCorePanel: function() {
			$('#hardcore-panel').removeClass('is-hidden')
        },

        clearHardCorePanel: function() {
			this.updateLog({
    			'spent-time': '',
                'sweep-time': ''
    		})
        },

        startTimer: function() {
        	$('#rec').addClass('on')
        	this.startTime = new Date()
        },

        stopTimer: function() {
        	$('#rec').removeClass('on')
        	this.elapsedTime = new Date() - this.startTime
        },

        reStartSweepTimer: function() {
            $('.sweep-time p').text('-> ')
            this.sweepStartTime = new Date()
        },

        setSweepExpireTime: function() {
            var d = this.sweepStartTime 
            this.sweepExpireTime = d.setSeconds(d.getSeconds() + 6)
        },

        sweepTimeCheckerStarted: false,

        startSweepTimeChecker: function() {
            var e = $('<strong>x</strong>')
            function checkTime() {
                setTimeout( function() {
                    if (Mi.mineSweeper.gameOn && new Date() < Mi.mineSweeper.hc.sweepExpireTime ) {
                        $('.sweep-time p').append(e.clone())
                        checkTime()
                    } else if (Mi.mineSweeper.gameOn) {
                        $(document).trigger('endGame')
                        Mi.mineSweeper.clearFeedback()
                        Mi.mineSweeper.notifyFail(4)
                        Mi.mineSweeper.hideGiveUpButton()
                        Mi.mineSweeper.unFreezeControlPanel()
                    }
                }, 250)
            }
            this.sweepTimeCheckerStarted = true
            checkTime()
        },

        applyHardCoreEvents: function() {
        	$(document).on('endGame', function(e) {
        		Mi.mineSweeper.hc.stopTimer()
                Mi.mineSweeper.hc.sweepTimeCheckerStarted = false
        		var spentTime = String(Mi.mineSweeper.hc.elapsedTime / 1000).toHHMMSS()

        		Mi.mineSweeper.hc.updateLog({
        			'spent-time': 'Total time: ' + spentTime
        		})
        	})

            $(document).on('sweep', function() {
                Mi.mineSweeper.hc.reStartSweepTimer()
                Mi.mineSweeper.hc.setSweepExpireTime()
                if (!Mi.mineSweeper.hc.sweepTimeCheckerStarted)
                    Mi.mineSweeper.hc.startSweepTimeChecker()
            })
        },

        updateLog: function(opt) {
        	$.each(opt, function(e, val) {
        		$('#' + e).text(val)
        	})
        }
    }
}()