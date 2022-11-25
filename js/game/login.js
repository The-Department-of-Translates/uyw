var joinButton = $("button[id='join']");
var passwordInput = $("input[id='password']");
var radio = $("input[type='radio']");
joinButton.prop("disabled", true);
passwordInput.prop("disabled", false);

function loginButtonClick() {
	socket.emit("user.loginRoom", {
		room: $.cookie("roomcode"),
		password: passwordInput.val(),
		isSpectator: $("#spectator").prop("checked"),
		id: socket.id
	});
	goToWaiting("WAITING")
}
radio.click(function() {
	if ($("#player").prop("checked") && $("#passwordGroup").is(":visible")) {
		passwordInput.prop("disabled", false);
		if (passwordInput.val().length == 0) {
			joinButton.prop("disabled", true)
		} else {
			joinButton.prop("disabled", false)
		}
	} else {
		joinButton.prop("disabled", false);
		passwordInput.prop("disabled", false);
		passwordInput.val("")
	}
});
passwordInput.on("change keyup paste", function() {
	if (passwordInput.val().length == 0) {
		joinButton.prop("disabled", true)
	} else {
		joinButton.prop("disabled", false)
	}
});
joinButton.click(function() {
	loginButtonClick()
});

function loadOptions(a) {
	if (!a.allowSpectators) {
		$("div[id='radioGroup']").hide();
		$("input[id='password']").prop("disabled", false)
	} else {
		if (!a.requirePassword) {
			$("div[id='passwordGrop']").hide()
		}
	}
};