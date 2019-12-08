/*global tau */
(function(){
	/**
	 * page - Rotary event page element
	 * progressBar - Circle progress element
	 * progressBarWidget - TAU circle progress instance
	 * rotaryDetentHandler - rotarydetent event handler
	 */
	var page = document.getElementById( "pageRotaryEvent" ),
		progressBar,
		progressBarWidget,
		rotaryDetentHandler;

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function() {
		var resultDiv = document.getElementById("result"),
			direction,
			value;

		progressBar = document.getElementById("circleprogress");
		progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {size: "large"});
		resultDiv.innerText = progressBarWidget.value() + "%";

		// "rotarydetent" event handler
		rotaryDetentHandler = function(e) {
			// Get rotary direction
			direction = e.detail.direction;

			if (direction === "CW") {
				// Right direction
				if (parseInt(progressBarWidget.value(), 10) < 100) {
					value = parseInt(progressBarWidget.value(), 10) + 1;
				} else {
					value = 100;
				}
			} else if (direction === "CCW") {
				// Left direction
				if (parseInt(progressBarWidget.value(), 10) > 0) {
					value = parseInt(progressBarWidget.value(), 10) - 1;
				} else {
					value = 0;
				}
			}

			resultDiv.innerText = value + "%";
			progressBarWidget.value(value);
		};

		// Add rotarydetent handler to document
		document.addEventListener("rotarydetent", rotaryDetentHandler);
	});

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagehide", function() {
		progressBarWidget.destroy();
		document.removeEventListener("rotarydetent", rotaryDetentHandler);
	});
}());
