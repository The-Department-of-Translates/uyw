function onVoteClick() {
	var a = $("#votes input[type='radio']:checked");
	if (a.length <= 0) {
		if(lang=='ru') {
			alert("Ничего не выбрано!");
		} else{
			alert("Нічого не вибрано!");
		}
		return
	}
	$("#button-enter").prop("disabled", true);
	socket.emit("user.sendVote", {
		vote: a.attr("id"),
		room: $.cookie("roomcode"),
		userID: $.cookie("userID"),
		id: socket.id
	});
	if(lang=='ru') {
		goToWaiting("ОЖИДАЕМ");
	} else{
		goToWaiting("ОЧІКУВАННЯ");
	}
}

function loadOptions(e) {
	var g = $("#votes");
	for (var d = 0; d < e.options.length; d++) {
		var b = e.options[d].userID;
		var f = '<li><input name="radio" id="' + b + '" type="radio" ';
		if (b == $.cookie("userID")) {
			f += "disabled"
		}
		f += ' /><label style="word-wrap:break-word; display:inline-block;" for="' + b + '">' + twemoji.parse(escapeHTML(decodeURIComponent(atob(e.options[d].text)))) + "</label></li>";
		g.html(g.html() + f)
	}
	var a = $("input[type='radio']");
	var c = $("button[type='button']");
	a.click(function() {
		c.attr("disabled", !a.is(":checked"))
	})
};
