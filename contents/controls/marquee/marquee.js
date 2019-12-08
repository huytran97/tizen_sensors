/*global tau */
(function() {
	var page = document.getElementById("marqueeTest"),
		marqueeEl = document.getElementById("marquee"),
		startBtn = document.getElementById("start"),
		resetBtn = document.getElementById("reset"),
		startFlag = true,
		marqueeWidget,
		pageShowHandler,
		pageHideHandler;

	/**
	 * Initializes global variables
	 */
	function clearVariables () {
		page = null;
		marqueeEl = null;
		startBtn = null;
		resetBtn = null;
		marqueeWidget = null;
	}

	/**
	 * marqueeend event handler
	 */
	function marqueeEndHandler () {
		startFlag = false;
		startBtn.textContent = "START";
		console.log("marquee end!");
	}

	/**
	 * marqueestart event handler
	 */
	function marqueeStartHandler () {
		startFlag = true;
		console.log("marquee Start!");
	}

	/**
	 * marqueestopped event handler
	 */
	function marqueeStoppedHandler () {
		startFlag = false;
		console.log("marquee Stopped!");
	}

	/**
	 * click event handler for start button
	 */
	function marqueeStartandStop () {
		if (startFlag) {
			startBtn.textContent = "START";
			marqueeWidget.stop();
		} else {
			startBtn.textContent = "STOP";
			marqueeWidget.start();
		}
	}

	/**
	 * click event handler for reset button
	 */
	function marqueeReset () {
		startBtn.textContent = "START";
		marqueeWidget.reset();
	}

	/**
	 * Adds event listeners
	 */
	function bindEvents () {
		marqueeEl.addEventListener("marqueeend", marqueeEndHandler);
		marqueeEl.addEventListener("marqueestart", marqueeStartHandler);
		marqueeEl.addEventListener("marqueestopped", marqueeStoppedHandler);
		startBtn.addEventListener("vclick", marqueeStartandStop);
		resetBtn.addEventListener("vclick", marqueeReset);
	}

	/**
	 * Removes event listeners
	 */
	function unbindEvents () {
		page.removeEventListener("pageshow", pageShowHandler);
		page.removeEventListener("pagehide", pageHideHandler);
		startBtn.removeEventListener("vclick", marqueeStartandStop);
		resetBtn.removeEventListener("vclick", marqueeReset);
		marqueeEl.removeEventListener("marqueeend", marqueeEndHandler);
		marqueeEl.removeEventListener("marqueestart", marqueeStartHandler);
		marqueeEl.removeEventListener("marqueestopped", marqueeStoppedHandler);
	}

	/**
	 * pageshow event handler
	 * Do preparatory works and adds event listeners
	 */
	pageShowHandler = function () {
		bindEvents();
		marqueeWidget = new tau.widget.Marquee(marqueeEl, {marqueeStyle: "endToEnd"});
	};

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	pageHideHandler = function() {
		marqueeWidget.destroy();
		unbindEvents();
		clearVariables();
	};

	page.addEventListener("pageshow", pageShowHandler, false);
	page.addEventListener("pagehide", pageHideHandler, false);
}());

