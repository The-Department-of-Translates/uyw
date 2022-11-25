function updateTip() {
	var a = getRandomTip();
	$("#tipText").html("<b>СОВЕТ:</b> " + a)
}

function updateWaitingText(a) {
	$("#waitText").text(a)
};
