function onReactClick() {
	var a = $("#answers input[name=answer]:checked");
	var b = $("#reactions input[name=reaction]:checked");
	if (a.length <= 0 || b.length <= 0) {
		if(lang=='ru') {
			alert("Никак не отреагировали!");
		} else{
			alert("Ніяк не відреагували!");
		}
		return
	}
	$("#button-enter").prop("disabled", true);
	$("#button-pass").prop("disabled", true);
	socket.emit("user.sendReaction", {
		answer: a.attr("id"),
		reaction: b.attr("id"),
		room: $.cookie("roomcode"),
		id: socket.id
	});
	if(lang=='ru') {
		goToWaiting("ЖДЁМ СЛЕДУЮЩЕГО РАУНДА...")
	} else{
		goToWaiting("ЧЕКАЄМО НАСТУПНОГО РАУНДУ...")
	}
}

function onPassClick() {
	$("#button-enter").prop("disabled", true);
	$("#button-pass").prop("disabled", true);
	if(lang=='ru') {
		goToWaiting("ЖДЁМ СЛЕДУЮЩЕГО РАУНДА...")
	} else{
		goToWaiting("ЧЕКАЄМО НАСТУПНОГО РАУНДУ...")
	}
}

function loadOptions(e) {
	var h = $("#answers");
	for (var d = 0; d < e.options.length; d++) {
		var a = e.options[d].userID;
		var g = '<li><input name="answer" id="' + a + '" type="radio" /><label for="' + a + '">' + twemoji.parse(escapeHTML(decodeURIComponent(atob(e.options[d].text)))) + "</label></li>";
		h.html(h.html() + g)
	}
	var c = $("input[name=answer]");
	var f = $("input[name=reaction]");
	c.click(function() {
		f.attr("disabled", !c.is(":checked"))
	});
	var b = $("button[type='button']");
	f.click(function() {
		b.attr("disabled", !f.is(":checked"))
	})
};
