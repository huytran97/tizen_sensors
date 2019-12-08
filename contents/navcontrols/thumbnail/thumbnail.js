/*global tau */
(function(){
	var page = document.getElementById("sectionChangerPage"),
		sectionChanger = document.getElementById("sectionChanger");

	page.addEventListener( "pagebeforeshow", function() {
		tau.widget.SectionChanger(sectionChanger, {
			orientation: "horizontal",
			fillContent: false
		});
	});
}());