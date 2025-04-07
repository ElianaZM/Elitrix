
//remember to update history function to show the respective iter speeds
function update(dt) {
	MainHex.dt = dt;
	if (gameState == 1) {
		waveone.update();
		if (MainHex.ct - waveone.prevTimeScored > 1000) {
			waveone.prevTimeScored = MainHex.ct;
		}
	}
	const minRadius = (MainHex.sideLength / 2) * Math.sqrt(3); 
	var lowestDeletedIndex = 99;
	var i;
	var j;
	var block;

	var objectsToRemove = [];
	for (i = 0; i < blocks.length; i++) {
		if (!blocks[i].settled) {
			if (!blocks[i].initializing) {
				blocks[i].distFromHex -= blocks[i].iter * dt * settings.scale;

				if (blocks[i].distFromHex <= minRadius) {
					blocks[i].distFromHex = minRadius;
					blocks[i].settled = 1;
					blocks[i].checked = 1;
					saveEvent('collision');

					MainHex.addBlock(blocks[i]);
				}
			}
		} else if (!blocks[i].removed) {
			blocks[i].removed = 1;
		}
	}
	

	for (i = 0; i < MainHex.blocks.length; i++) {
		for (j = 0; j < MainHex.blocks[i].length; j++) {
			if (MainHex.blocks[i][j].checked ==1 ) {
				consolidateBlocks(MainHex,MainHex.blocks[i][j].attachedLane,MainHex.blocks[i][j].getIndex());
				MainHex.blocks[i][j].checked=0;
			}
		}
	}

	for (i = 0; i < MainHex.blocks.length; i++) {
		lowestDeletedIndex = 99;
		for (j = 0; j < MainHex.blocks[i].length; j++) {
			block = MainHex.blocks[i][j];
			if (block.deleted == 2) {
				MainHex.blocks[i].splice(j,1);
				blockDestroyed();
				if (j < lowestDeletedIndex) lowestDeletedIndex = j;
				j--;
			}
		}

		if (lowestDeletedIndex < MainHex.blocks[i].length) {
			for (j = lowestDeletedIndex; j < MainHex.blocks[i].length; j++) {
				MainHex.blocks[i][j].settled = 0;
			}
		}
	}

	for (i = 0; i < MainHex.blocks.length; i++) {
		for (j = 0; j < MainHex.blocks[i].length; j++) {
			block = MainHex.blocks[i][j];
			MainHex.doesBlockCollide(block, j, MainHex.blocks[i]);

			if (!MainHex.blocks[i][j].settled) {
				MainHex.blocks[i][j].distFromHex -= block.iter * dt * settings.scale;
			}
		}
	}

	for(i = 0; i < blocks.length;i++){
		if (blocks[i].removed == 1) {
			blocks.splice(i,1);
			i--;
		}
	}

	MainHex.ct += dt;
}
function enviarEvento(evento, valor) {
	const mensaje = {
		game: "Hetrix",
		player: "Eliana",
		event: rotate,
		value: 10
	};

	if (socket.readyState === WebSocket.OPEN) {
		socket.send(JSON.stringify(mensaje));
		console.log("Enviado:", mensaje);
	}
}