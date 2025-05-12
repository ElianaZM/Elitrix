let ws;

function connectws () {
	ws = new WebSocket('wss://gamehubmanager-ucp2025.azurewebsites.net/ws');

	ws.onmessage = function(e) {
		console.log('Message:', e.data);
		try {
			const datos = JSON.parse(e.data);
			console.log(datos);

			if (!datos[0] || !Array.isArray(datos[0].players)) {
				throw new Error("Formato de datos inválido.");
			}

			const sortedPlayers = datos[0].players.sort((a, b) => b.value - a.value);
			const topPlayers = sortedPlayers.slice(0, 5);

			const leaderboard = document.getElementById("Leaderboard");
			leaderboard.innerHTML = ""; // Limpiar contenido anterior

			const title = document.createElement("h3");
			title.textContent = "🏆 Ranking";
			leaderboard.appendChild(title);
			leaderboard.appendChild(document.createElement("br"));

			topPlayers.forEach((player, index) => {
				const name = player.eventName || "Jugador desconocido";
				const value = player.value ?? 0;
				const entry = document.createElement("div");
				entry.textContent = `${index + 1}: ${name} (${value})`;
				leaderboard.appendChild(entry);
			});

		} catch (err) {
			console.error("Error procesando datos de ranking:", err);
			document.getElementById("Leaderboard").innerText = "Error cargando ranking.";
		}
	};
  
	ws.onclose = function(e) {
		console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
		setTimeout(connectws, 1000);
	};
  
	ws.onerror = function(err) {
		console.error('Socket encountered error: ', err.message, 'Closing socket');
		ws.close();
	};
}

connectws();


let playerName = localStorage.getItem("playerName");

if (!playerName) {
    playerName = prompt("Ingresá tu nombre para comenzar:");
    if (playerName) {
        localStorage.setItem("playerName", playerName);
    } 
}

$(document).ready(function() {
	ws.onopen = function(){
		console.log("initialize");
		initialize();
		}


	
});
function initialize(a) {
	window.rush = 1;
	window.lastTime = Date.now();
	window.iframHasLoaded = false;
	window.colors = ["#e74c3c", "#f1c40f", "#3498db", "#2ecc71"];
	window.hexColorsToTintedColors = {
		"#e74c3c": "rgb(241,163,155)",
		"#f1c40f": "rgb(246,223,133)",
		"#3498db": "rgb(151,201,235)",
		"#2ecc71": "rgb(150,227,183)"
	};

	window.rgbToHex = {
		"rgb(231,76,60)": "#e74c3c",
		"rgb(241,196,15)": "#f1c40f",
		"rgb(52,152,219)": "#3498db",
		"rgb(46,204,113)": "#2ecc71"
	};

	window.rgbColorsToTintedColors = {
		"rgb(231,76,60)": "rgb(241,163,155)",
		"rgb(241,196,15)": "rgb(246,223,133)",
		"rgb(52,152,219)": "rgb(151,201,235)",
		"rgb(46,204,113)": "rgb(150,227,183)"
	};

	window.hexagonBackgroundColor = 'rgb(236, 240, 241)';
	window.hexagonBackgroundColorClear = 'rgba(236, 240, 241, 0.5)';
	window.centerBlue = 'rgb(44,62,80)';
	window.angularVelocityConst = 4;
	window.scoreOpacity = 0;
	window.textOpacity = 0;
	window.prevGameState = undefined;
	window.op = 0;
	window.saveState = localStorage.getItem("saveState") || "{}";
	if (saveState !== "{}") {
		op = 1;
	}

	window.textShown = false;
	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
			window.setTimeout(callback, 1000 / framerate);
		};
	})();
	$('#clickToExit').bind('click', toggleDevTools);
	
	window.settings;

	if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('.rrssb-email').remove();
		settings = {
			os: "other",
			platform: "mobile",
			startDist: 227,
			creationDt: 60,
			baseScale: 1.4,
			scale: 1,
			prevScale: 1,
			baseHexWidth: 87,
			hexWidth: 87,
			baseBlockHeight: 20,
			blockHeight: 20,
			rows: 7,
			speedModifier: 0.73,
			speedUpKeyHeld: false,
			creationSpeedModifier: 0.73,
			comboTime: 310
		};
	} else {
		settings = {
			os: "other",
			platform: "nonmobile",
			baseScale: 1,
			startDist: 340,
			creationDt: 9,
			scale: 1,
			prevScale: 1,
			hexWidth: 65,
			baseHexWidth: 87,
			baseBlockHeight: 20,
			blockHeight: 15,
			rows: 8,
			speedModifier: 0.65,
			speedUpKeyHeld: false,
			creationSpeedModifier: 0.65,
			comboTime: 310
		};

	}
	if(/Android/i.test(navigator.userAgent)) {
		settings.os = "android";
	}

	if(navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)){
		settings.os="ios";
	}

	window.canvas = document.getElementById('canvas');
	window.ctx = canvas.getContext('2d');
	window.trueCanvas = {
		width: canvas.width,
		height: canvas.height
	};
	scaleCanvas();

	window.framerate = 60;
	window.history = {};
	window.score = 0;
	window.scoreAdditionCoeff = 1;
	window.prevScore = 0;
	window.numHighScores = 3;

	highscores = [];
	if (localStorage.getItem('highscores')) {
		try {
			highscores = JSON.parse(localStorage.getItem('highscores'));
		} catch (e) {
			highscores = [];
		}
	}
	window.blocks = [];
	window.MainHex;
	window.gdx = 0;
	window.gdy = 0;
	window.devMode = 0;
	window.lastGen = undefined;
	window.prevTimeScored = undefined;
	window.nextGen = undefined;
	window.spawnLane = 0;
	window.importing = 0;
	window.importedHistory = undefined;
	window.startTime = undefined;
	window.gameState;
	setStartScreen();
	if (a != 1) {
		window.canRestart = 1;
		window.onblur = function(e) {
			if (gameState == 1) {
				pause();
			}
		};
		$('#startBtn').off();
		if (settings.platform == 'mobile') {
			$('#startBtn').on('touchstart', startBtnHandler);
		} else {
			$('#startBtn').on('mousedown', startBtnHandler);
		}

		document.addEventListener('touchmove', function(e) {
			e.preventDefault();
		}, false);
		$(window).resize(scaleCanvas);
		$(window).unload(function() {

			if (gameState == 1 || gameState == -1 || gameState === 0) localStorage.setItem("saveState", exportSaveState());
			else localStorage.setItem("saveState", "{}");
		});

		addKeyListeners();
		
		

		document.addEventListener("pause", handlePause, false);
		document.addEventListener("backbutton", handlePause, false);
		document.addEventListener("menubutton", handlePause, false); //menu button on android

		setTimeout(function() {
			if (settings.platform == "mobile") {
				try {
					document.body.removeEventListener('touchstart', handleTapBefore, false);
				} catch (e) {

				}

				try {
					document.body.removeEventListener('touchstart', handleTap, false);
				} catch (e) {

				}

				document.body.addEventListener('touchstart', handleTapBefore, false);
			} else {
				try {
					document.body.removeEventListener('mousedown', handleClickBefore, false);
				} catch (e) {

				}

				try {
					document.body.removeEventListener('mousedown', handleClick, false);
				} catch (e) {

				}

				document.body.addEventListener('mousedown', handleClickBefore, false);
			}
		}, 1);
	}
}

function startBtnHandler() {
    setTimeout(function() {
        if (settings.platform == "mobile") {
            try {
                document.body.removeEventListener('touchstart', handleTapBefore, false);
            } catch (e) {
                // Manejo de errores si es necesario
            }

            try {
                document.body.removeEventListener('touchstart', handleTap, false);
            } catch (e) {
                // Manejo de errores si es necesario
            }

            document.body.addEventListener('touchstart', handleTap, false);
        } else {
            try {
                document.body.removeEventListener('mousedown', handleClickBefore, false);
            } catch (e) {
                // Manejo de errores si es necesario
            }

            try {
                document.body.removeEventListener('mousedown', handleClick, false);
            } catch (e) {
                // Manejo de errores si es necesario
            }

            document.body.addEventListener('mousedown', handleClick, false);
        }
    }, 5);

    if (!canRestart) return false;

    if ($('#openSideBar').is(':visible')) {
        $('#openSideBar').fadeOut(150, "linear");
    }

    if (importing == 1) {
        init(1);
        checkVisualElements(0);
    } else {
        resumeGame();
    }

    // Agregar el evento click al botón startBtn
    document.getElementById('startBtn').addEventListener('click', function() {
        console.log('Juego iniciado');
    });
}


function handlePause() {
	if (gameState == 1 || gameState == 2) {
		pause();
	}
}

function handleTap(e) {
	handleClickTap(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
}

function handleClick(e) {
	handleClickTap(e.clientX, e.clientY);
}

function handleTapBefore(e) {
	var x = e.changedTouches[0].clientX;
	var y = e.changedTouches[0].clientY;

	if (x < 120 && y < 83 && $('.helpText').is(':visible')) {
		showHelp();
		return;
	}
}

function handleClickBefore(e) {
	var x = e.clientX;
	var y = e.clientY;

	if (x < 120 && y < 83 && $('.helpText').is(':visible')) {
		showHelp();
		return;
	}
}
let deferredPrompt;
let installSource;

window.addEventListener('beforeinstallprompt', (e) => {
    $('#installAppButtonContainer').show(); 
    deferredPrompt = e;
    installSource = 'nativeInstallCard';


	e.userChoice.then(function (choiceResult) {
		if (choiceResult.outcome === 'accepted') {
			deferredPrompt = null;
		}

		ga('send', {
			hitType: 'event',
			eventCategory: 'pwa-install',
			eventAction: 'native-installation-card-prompted',
			eventLabel: installSource,
			eventValue: choiceResult.outcome === 'accepted' ? 1 : 0
		});
	});
});
function showToast(message, duration = 3000) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#333";
    toast.style.color = "#fff";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "8px";
    toast.style.zIndex = "10000";
    toast.style.fontFamily = "Arial, sans-serif";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease-in-out";
    
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.style.opacity = "1";
    });

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

const installApp = document.getElementById('installApp');
if (installApp) {
    installApp.addEventListener('click', async () => {
        installSource = 'customInstallationButton';

        if (deferredPrompt !== null) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                deferredPrompt = null;
            }

            if (typeof ga === 'function') {
                ga('send', {
                    hitType: 'event',
                    eventCategory: 'pwa-install',
                    eventAction: 'custom-installation-button-clicked',
                    eventLabel: installSource,
                    eventValue: outcome === 'accepted' ? 1 : 0
                });
            } else {
                console.warn("Google Analytics no está cargado todavía.");
            }
        } else {
            showToast?.('Notepad is already installed.');
        }
    }); 
}


