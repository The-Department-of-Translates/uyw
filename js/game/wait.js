function updateTip() {
	var a = getRandomTip();
	$("#tipText").html("<b>TIP:</b> " + a)
}

function updateWaitingText(a) {
	$("#waitText").text(a)
};