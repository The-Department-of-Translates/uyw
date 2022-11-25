var joinButton = $("button[id='join']");
var nameInput = $("input[id='name']");

function joinButtonClick() {
	var b = $("input[type='radio']:checked");
	var a = null;
	if (b.length > 0) {
		a = b.attr("id");
		if (a == "newUser") {
			a = null
		}
	}
	if (a == null) {
		socket.emit("user.joinRoom", {
			room: $.cookie("roomcode"),
			name: nameInput.val(),
			id: socket.id
		})
	} else {
		socket.emit("user.joinRoom", {
			room: $.cookie("roomcode"),
			inactiveID: a,
			id: socket.id
		})
	}
	goToWaiting("START ONCE EVERYONE'S IN!")
}

function loadOptions(k) {
	if (k.inactiveUsers.length > 0) {
		var b = $("#inactiveUsers");
		var e = $("#newUserContainer");
		e.hide();
		var d = [];
		for (var c = 0; c < k.inactiveUsers.length; c++) {
			var l = k.inactiveUsers[c].id;
			var g = k.inactiveUsers[c].name;
			var j = k.inactiveUsers[c].score;
			var h = d.indexOf(l);
			if (h != -1) {
				continue
			}
			d.push(l);
			var f = '<li><input name="radio" id="' + l + '" type="radio" /><label for="' + l + '">' + g + " (" + j + " Points)</label></li>";
			b.html(b.html() + f)
		}
		b.html(b.html() + '<li><input name="radio" id="newUser" type="radio" /><label for="newUser">New Player</label></li>');
		nameInput.prop("disabled", true);
		joinButton.prop("disabled", true);
		var a = $("input[type='radio']");
		a.click(function() {
			nameInput.prop("disabled", true);
			joinButton.prop("disabled", false);
			if ($("#newUser").prop("checked")) {
				e.show();
				nameInput.prop("disabled", false);
				if (nameInput.val().length == 0) {
					joinButton.prop("disabled", true)
				}
			} else {
				e.hide()
			}
		})
	} else {
		$("#inactiveUsers").hide()
	}
	nameInput.on("change keyup paste", function() {
		if (nameInput.val().length > 0) {
			joinButton.prop("disabled", false)
		} else {
			joinButton.prop("disabled", true)
		}
	})
}
joinButton.click(function() {
	joinButtonClick()
});