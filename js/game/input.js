function onEnterClick() {
	var a = $("#answer").val();
	a = a.trim();
	if (a.length == 0) {
		if(lang=='ru') {
			alert("Ответ не может быть пустым! ")
		} else{
			alert("Відповідь не може бути порожньою! ")
		}
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
	if(lang=='ru') {
		goToWaiting("ОЖИДАЕМ")
	} else{
		goToWaiting("ОЧІКУВАННЯ");
	}
}

function onPuntClick() {
	$("#button-enter").prop("disabled", true);
	$("#button-punt").prop("disabled", true);
	socket.emit("user.sendPunt", {
		room: $.cookie("roomcode"),
		userID: $.cookie("userID"),
		id: socket.id
	});
	if(lang=='ru') {
		goToWaiting("ОЖИДАЕМ")
	} else{
		goToWaiting("ОЧІКУВАННЯ");
	}
}

function loadOptions(a) {
	if (a.disablePunt) {
		$("#button-punt").prop("disabled", true)
	}
	if (a.taskText) {
		document.getElementById("taskText").innerText = a.taskText.toUpperCase()
	}
};
