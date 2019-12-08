/*global tau */
/*jslint unparam: true */
(function() {
	var page = document.getElementById("selectModePage"),
		listview = document.querySelector('#selectModePage .ui-listview'),
		list = listview.getElementsByTagName("li"),
		listLength = list.length,
		selectWrapper = document.querySelector(".select-mode"),
		selectBtn = document.getElementById("select-btn"),
		selectBtnText =  document.getElementById("select-btn-text"),
		selectAll = document.getElementById("select-all"),
		deselectAll = document.getElementById("deselect-all"),
		drawerElement = page.querySelector("#rightDrawer"),
		handler = document.getElementById("handler"),
		selector = page.querySelector("#selector"),
		selectorComponent,
		selectCount,
		drawerHelper,
		i,
		addFunction,
		fnSelectAll,
		fnDeselectAll,
		fnPopup,
		fnPopupClose,
		fnBackKey;

	/**
	 * Updates the number of the selected list items
	 */
	function textRefresh() {
		selectBtnText.innerHTML =
			selectCount < 10 ? "0" + selectCount : selectCount;
	}

	/**
	 * Shows select mode
	 */
	function modeShow() {
		selectWrapper.classList.remove("open");
		handler.style.display = "block";
		selectWrapper.classList.add("show-btn");
		textRefresh();
	}

	/**
	 * Hides select mode
	 */
	function modeHide() {
		selectWrapper.classList.remove("open");
		handler.style.display = "none";
		selectWrapper.classList.remove("show-btn");
		selectCount = 0;
	}

	/**
	 * Select/Deselects a list item
	 * click event handler for list item
	 */
	addFunction = function(event){
		var target = event.target;
		if ( !target.classList.contains("select")) {
			target.classList.add("select");
			selectCount++;
			modeShow();
		} else {
			target.classList.remove("select");
			selectCount--;
			if (selectCount <= 0) {
				modeHide();
			} else {
				textRefresh();
			}
		}
	};

	/**
	 * Select all list items
	 * click event handler for 'select all' button
	 */
	fnSelectAll = function(){
		for (i = 0; i < listLength; i++) {
			list[i].classList.add("select");
		}
		selectCount = listLength;
		modeShow();
	};

	/**
	 * Deselect all list items
	 * click event handler for 'deselect all' button
	 */
	fnDeselectAll = function(){
		for (i = 0; i < listLength; i++) {
			list[i].classList.remove("select");
		}
		modeHide();
	};

	/**
	 * Shows a context popup that has select/deselect buttons
	 * click event handler for button that displays the number of selected list items
	 */
	fnPopup = function() {
		selectWrapper.classList.add("open");
		event.preventDefault();
		event.stopPropagation();
	};

	/**
	 * Closes a context popup that has select/deselect buttons
	 * click event handler for closing the popup
	 */
	fnPopupClose = function() {
		selectWrapper.classList.remove("open");
	};

	/**
	 * Back key event handler
	 */
	fnBackKey = function() {
		var drawer = tau.widget.Drawer(drawerElement),
			classList = selectWrapper.classList;
		if( event.keyName === "back" && drawer.getState() === "closed" && classList.contains("show-btn")) {
			if (classList.contains("open")) {
				classList.remove("open");
			} else {
				fnDeselectAll();
			}
			event.preventDefault();
			event.stopPropagation();
		}
	};

	/**
	 * pageshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pageshow", function() {
		listview.addEventListener('click', addFunction, false);
		selectAll.addEventListener("click", fnSelectAll, false);
		deselectAll.addEventListener("click", fnDeselectAll, false);
		selectBtn.addEventListener("click", fnPopup, false);
		selectWrapper.addEventListener("click", fnPopupClose, false);
		modeHide();
	}, false);

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagehide", function() {
		listview.removeEventListener('click', addFunction, false);
		selectAll.removeEventListener("click", fnSelectAll, false);
		deselectAll.removeEventListener("click", fnDeselectAll, false);
		document.removeEventListener('tizenhwkey', fnBackKey);
		modeHide();
		drawerHelper.destroy();
	}, false);

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener( "pagebeforeshow", function() {
		/********** drawer ******************/
		drawerHelper = tau.helper.DrawerMoreStyle.create(drawerElement, {
			handler: ".drawer-handler"
		});
		selectorComponent = tau.widget.Selector(selector);
		selectorComponent.disable();
		document.addEventListener('tizenhwkey', fnBackKey);
	});

	/*
	 * If you want to use Selector with Snaplistview, you should control to Selector enable status
	 * because 'rotarydetent' event has been used in both Selector and Snaplistview.
	 */
	drawerElement.addEventListener("draweropen", function() {
		selectorComponent.enable();
	});

	drawerElement.addEventListener("drawerclose", function() {
		selectorComponent.disable();
	});
	/*
	 * When user click the indicator of Selector, drawer will close.
	 */
	selector.addEventListener("click", function(event) {
		var target = event.target,
			drawerComponent = tau.widget.Drawer(drawerElement);

		// 'ui-selector-indicator' is default indicator class name of Selector component
		if (target.classList.contains("ui-selector-indicator")) {
			drawerComponent.close();
		}
	});
}());