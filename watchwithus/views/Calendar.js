function Calendar(divName) {
	this.element = document.getElementById(divName);
	this.render = function(date) {
		var numDaysInMonth = new Date(date.getYear(), date.getMonth() + 1, 0).getDate();
		var day = new Date(date.getYear(), date.getMonth(), 0).getDay();
	}
}