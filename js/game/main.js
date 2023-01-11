var socket;
var socketErrorText;
var reconnecting;
var tipArray;
var $container;
var CONST_WAIT_URL = "wait";
var CONST_ROOMCODE_COOKIE = "roomcode";
var CONST_USERID_COOKIE = "userID";
var CONST_ISSPECTATOR_COOKIE = "isSpectator";

const langArr = {
	ru: {
		socketError: "ОШИБКА: Невозможно связаться с сервером. Пожалуйста, проверьте подключение или состояние Wi-Fi.",
		version: "ВЕРСИЯ 1.0.0-03ru",
		uyw: "Своими Словами!",
		dyhp: "Есть проблема? (англ.)"
	},
	ua: {
		socketError: "ПОМИЛКА: Не вдається зв'язатися з сервером. Будь ласка, перевірте підключення або стан Wi-Fi.",
		version: "ВЕРСІЯ 1.0.0-01ua",
		uyw: "Своїми Словами!",
		dyhp: "Маєш проблеми? (англ.)"
	}
}

const langRu = document.querySelector('#lang-ru');
const langUa = document.querySelector('#lang-ua');

if(langRu) {
	langRu.addEventListener('click', setLang.bind(null, 'ru'));
	langRu.onclick = function() {
		window.location.reload();
	};
}
if(langUa){
	langUa.addEventListener('click', setLang.bind(null, 'ua'));
	langUa.onclick = function() {
		window.location.reload();
	};
}

function setLang(lang) {
	if (!langArr.hasOwnProperty(lang)) return;
	if (window.hasOwnProperty('localStorage'))
		window.localStorage.setItem('lang', lang);
	for (let key in langArr[lang]) {
		let elem = document.querySelector('.lang-' + key);
		if (elem) {
			elem.textContent = langArr[lang][key];
		}
	}
	if (lang == 'ru') {
		console.log('Русский');
	} else {
		console.log('Українською');
	}
}
var lang = (window.hasOwnProperty('localStorage') && window.localStorage.getItem('lang', lang)) || 'ru';
setLang(lang);

function escapeHTML(a) {
	var b = document.createElement("div");
	b.appendChild(document.createTextNode(a));
	return b.innerHTML
}

/*function loadContainer(a, b) {
	$container.load(a + ".html", function() {
		$.ajax({
			url: "js/game/" + a + ".js",
			dataType: "text",
			success: function(c) {
				$("<script>").attr("type", "text/javascript").text(c).appendTo($container);
				if (b) {
					b()
				}
			}
		})
	})
}*/

function loadContainer(a, b) {
	if(lang=='ru') {
		load = "ru/" + a + ".html"
	} else {
		load = "ua/" + a + ".html"
	}
	$container.load(load, function() {
		$.ajax({
			url: "js/game/" + a + ".js",
			dataType: "text",
			success: function(c) {
				$("<script>").attr("type", "text/javascript").text(c).appendTo($container);
				if (b) {
					b()
				}
			}
		})
	})
}

function goToWaiting(a) {
	loadContainer(CONST_WAIT_URL, function() {
		updateWaitingText(a);
		updateTip()
	})
}

function checkForSocketConnection() {
	if (socket.connected == false) {
		socketErrorText.show()
	}
}

function getRandomTip() {
	return tipArray[Math.floor(Math.random() * tipArray.length)]
}

function connectSocket(a) {
	socket = io("https://wordsgame.lol", {
		timeout: 120000
	});
	socket.on("connect", function() {
		if (!reconnecting) {
			socketErrorText.hide();
			setInterval(checkForSocketConnection(), 3000);
			socket.emit("user.connectRoom", {
				room: a,
				id: socket.id
			})
		}
		reconnecting = false
	});
	socket.on("reconnect", function() {
		$("#socketError").hide();
		reconnecting = true;
		if (!!$.cookie(CONST_ROOMCODE_COOKIE) && (!!$.cookie(CONST_USERID_COOKIE) || !!$.cookie(CONST_ISSPECTATOR_COOKIE))) {
			socket.emit("user.reconnect", {
				room: $.cookie(CONST_ROOMCODE_COOKIE),
				inactiveID: $.cookie(CONST_USERID_COOKIE),
				id: socket.id,
				isSpectator: $.cookie(CONST_ISSPECTATOR_COOKIE)
			})
		}
	});
	socket.on("game.requestReaction", function(b) {
		loadContainer("react", function() {
			loadOptions(b)
		})
	});
	socket.on("server.invalidRoom", function(b) {
		if (b === socket.id) {
			if(lang=='ru') {
				alert("Неправильный или несуществующий код комнаты!");
			} else {
				alert("Неправильний або неіснуючий код кімнати!");
			}
			socket.close();
			$("#join").prop("disabled", false)
		}
	});
	socket.on("server.correctRoom", function(b) {
		if (b.id === socket.id) {
			$.cookie(CONST_ROOMCODE_COOKIE, b.room.toUpperCase());
			if(lang=='ru') {
				goToWaiting("ОЖИДАЕМ");
			} else {
				goToWaiting("ОЧІКУВАННЯ");
			}
			socket.emit("user.requestUserState", {
				room: b.room.toUpperCase(),
				id: socket.id
			})
		}
	});
	socket.on("game.disconnect", function() {
		if(lang=='ru') {
			alert("Вы были отключены!");
		} else {
			alert("Ви були відключені!");
		}
		$.removeCookie(CONST_ROOMCODE_COOKIE);
		$.removeCookie(CONST_USERID_COOKIE);
		$.removeCookie(CONST_ISSPECTATOR_COOKIE);
		window.location.replace("index.html")
	});
	socket.on("game.userState", function(b) {
		loadContainer("joinRoom", function() {
			loadOptions(b)
		})
	});
	socket.on("game.requestLogin", function(b) {
		loadContainer("login", function() {
			loadOptions(b)
		})
	});
	socket.on("game.userJoinSuccess", function(b) {
		$.cookie(CONST_USERID_COOKIE, b.userID)
	});
	socket.on("game.spectatorJoinSuccess", function(b) {
		$.cookie(CONST_ISSPECTATOR_COOKIE, true);
		if(lang=='ru') {
			goToWaiting("ЖДЁМ ОТВЕТОВ ИГРОКОВ...");
		} else {
			goToWaiting("ЧЕКАЄМО ВІДПОВІДЕЙ ГРАВЦІВ...");
		}
	});
	socket.on("game.userJoinFailure", function(b) {
		alert(b.message);
		$.removeCookie(CONST_ROOMCODE_COOKIE);
		socket.close();
		window.location.replace("index.html")
	});
	socket.on("game.goToWaiting", function(b) {
		if(lang=='ru') {
			goToWaiting("ОЖИДАЕМ");
		} else{
			goToWaiting("ОЧІКУВАННЯ");
		}
	});
	socket.on("game.requestInput", function(b) {
		loadContainer("input", function() {
			loadOptions(b)
		})
	});
	socket.on("game.requestVote", function(b) {
		loadContainer("voting", function() {
			loadOptions(b)
		})
	});
	socket.on("game.updateWaitMessage", function(c) {
		var b = $.cookie(CONST_ISSPECTATOR_COOKIE);
		if (b == false || b == undefined) {
			goToWaiting(c.message)
		}
	});
	socket.on("game.spectatorMessage", function(b) {
		if (!!$.cookie(CONST_ISSPECTATOR_COOKIE)) {
			goToWaiting(b.message)
		}
	})
}
$(document).ready(function() {
	$.removeCookie(CONST_ROOMCODE_COOKIE);
	$.removeCookie(CONST_USERID_COOKIE);
	$.removeCookie(CONST_ISSPECTATOR_COOKIE);
	reconnecting = false;
	socketErrorText = $("#socketError");
	socketErrorText.hide();
	$container = $("#container");
	if(lang=='ru') {
		langcode = "ru";
	} else {
		langcode = "ua";
	};
	$.getJSON(langcode + "/tips.json", function(a) {
		tipArray = a
	});
	loadContainer("connectToRoom", null)
});
