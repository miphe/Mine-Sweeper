
Mi.mineSweeper.hc = function() {
    return {
        init: function() {
        	this.clearHardCorePanel()
        	this.showHardCorePanel()
        	this.startTimer()
        	this.applyHardCoreEvents()
        },

        showHardCorePanel: function() {
			$('#hardcore-panel').removeClass('is-hidden')
        },

        clearHardCorePanel: function() {
			Mi.mineSweeper.hc.updateLog({
    			'spent-time': ''
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

        applyHardCoreEvents: function() {
        	$(document).on('endGame', function(e) {
        		Mi.mineSweeper.hc.stopTimer()
        		var spentTime = String(Mi.mineSweeper.hc.elapsedTime / 1000).toHHMMSS()

        		Mi.mineSweeper.hc.updateLog({
        			'spent-time': 'Time: ' + spentTime
        		})
        	})
        },

        updateLog: function(opt) {
        	$.each(opt, function(e, val) {
        		$('#' + e).text(val)
        	})
        }
    }
}()