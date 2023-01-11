function updateTip() {
	var a = getRandomTip();
	if (lang == 'ru') {
		tip = "<b>СОВЕТ:</b> "
	} else {
		tip = "<b>ПОРАДА:</b> "
	}
	$("#tipText").html(tip + a)
}

function updateWaitingText(a) {
	$("#waitText").text(a)
};
