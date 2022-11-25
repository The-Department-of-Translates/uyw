var roomCodeInput = $("input[id='roomcode']");
var connectButton = $("button[id='connect']");

function connectClick() {
	connectButton.prop("disabled", true);
	connectSocket(roomCodeInput.val().toUpperCase())
}
connectButton.prop("disabled", true);
roomCodeInput.on("change keyup paste", function() {
	if (roomCodeInput.val().length == 4) {
		connectButton.prop("disabled", false)
	} else {
		if (roomCodeInput.val().length > 4) {
			roomCodeInput.val(roomCodeInput.val().substr(0, 4));
			connectButton.prop("disabled", false)
		} else {
			connectButton.prop("disabled", true)
		}
	}
});
connectButton.click(function() {
	connectClick()
});