function onEnterClick() {
	var a = $("#answer").val();
	a = a.trim();
	if (a.length == 0) {
		alert("Answers can't be empty!");
		return
	}
	$("#button-enter").prop("disabled", true);
	$("#button-punt").prop("disabled", true);
	socket.emit("user.sendInput", {
		answer: $("#answer").val(),
		room: $.cookie("roomcode"),
		userID: $.cookie("userID"),
		id: socket.id
	});
	goToWaiting("WAITING")
}

function onPuntClick() {
	$("#button-enter").prop("disabled", true);
	$("#button-punt").prop("disabled", true);
	socket.emit("user.sendPunt", {
		room: $.cookie("roomcode"),
		userID: $.cookie("userID"),
		id: socket.id
	});
	goToWaiting("WAITING")
}

function loadOptions(a) {
	if (a.disablePunt) {
		$("#button-punt").prop("disabled", true)
	}
	if (a.taskText) {
		document.getElementById("taskText").innerText = a.taskText.toUpperCase()
	}
};