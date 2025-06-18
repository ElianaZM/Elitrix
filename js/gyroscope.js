function search(twoD, oneD) {
    // Searches a two dimensional array to see if it contains a one dimensional array. indexOf doesn't work in this case
    for (var i = 0; i < twoD.length; i++) {
        if (twoD[i][0] == oneD[0] && twoD[i][1] == oneD[1]) {
            return true;
        }
    }
    return false;
}

function floodFill(hex, side, index, deleting) {
    if (hex.blocks[side] === undefined || hex.blocks[side][index] === undefined) return;

    // store the color
    var color = hex.blocks[side][index].color;
    // nested for loops for navigating the blocks
    for (var x = -1; x < 2; x++) {
        for (var y = -1; y < 2; y++) {
            // make sure they aren't diagonals
            if (Math.abs(x) == Math.abs(y)) { continue; }
            // calculate the side we're exploring using mods
            var curSide = (side + x + hex.sides) % hex.sides;
            // calculate the index
            var curIndex = index + y;
            // making sure the block exists at this side and index
            if (hex.blocks[curSide] === undefined) { continue; }
            if (hex.blocks[curSide][curIndex] !== undefined) {
                // checking equivalency of color, if it's already been explored, and if it isn't already deleted
                if (hex.blocks[curSide][curIndex].color == color &&
                    search(deleting, [curSide, curIndex]) === false &&
                    hex.blocks[curSide][curIndex].deleted === 0) {

                    // add this to the array of already explored
                    deleting.push([curSide, curIndex]);
                    // recall with next block explored
                    floodFill(hex, curSide, curIndex, deleting);
                }
            }
        }
    }
}

function consolidateBlocks(hex, side, index) {
    // Record which sides have been changed
    var sidesChanged = [];
    var deleting = [];
    var deletedBlocks = [];

    // Add start case
    deleting.push([side, index]);

    // Fill deleting array using flood fill
    floodFill(hex, side, index, deleting);

    // Make sure there are at least 3 blocks to be deleted
    if (deleting.length < 3) {
        return;
    }

    /* -----------------------------------------------------------
       🚨 NUEVO: vibrar **solo** cuando la coincidencia es de 3 bloques
       ----------------------------------------------------------- */
    if (deleting.length === 3 && window.Vibration) {
        // Llama a la API de vibración con el patrón definido para 3 bloques
        Vibration.onBlockMatch(3);
    }

    /* -----------------------------------------------------------
       Combo detection y sumatoria de puntos
       ----------------------------------------------------------- */
    if (deleting.length >= 3) {
        const puntos = 9 + (deleting.length - 3);
        console.log('Combo detectado: Se eliminaron', deleting.length, 'bloques.');
        saveEvent('score', puntos);
    }

    // Procesar la eliminación de bloques
    for (var i = 0; i < deleting.length; i++) {
        var arr = deleting[i];

        if (arr !== undefined && arr.length == 2) {
            // Add to sidesChanged if not already present
            if (sidesChanged.indexOf(arr[0]) == -1) {
                sidesChanged.push(arr[0]);
            }

            // Mark the block as deleted
            hex.blocks[arr[0]][arr[1]].deleted = 1;
            deletedBlocks.push(hex.blocks[arr[0]][arr[1]]);
        }
    }

    // Añadir la puntuación
    var now = MainHex.ct;
    if (now - hex.lastCombo < settings.comboTime) {
        settings.comboTime = (1 / settings.creationSpeedModifier) * (waveone.nextGen / 16.666667) * 3;
        hex.comboMultiplier += 1;
        hex.lastCombo = now;
        var coords = findCenterOfBlocks(deletedBlocks);
        hex.texts.push(new Text(coords['x'], coords['y'], "x " + hex.comboMultiplier.toString(), "bold Q", "#fff", fadeUpAndOut));
    } else {
        settings.comboTime = 240;
        hex.lastCombo = now;
        hex.comboMultiplier = 1;
    }

    var adder = deleting.length * deleting.length * hex.comboMultiplier;
    hex.texts.push(new Text(hex.x, hex.y, "+ " + adder.toString(), "bold Q ", deletedBlocks[0].color, fadeUpAndOut));

    // Update the last color scored
    hex.lastColorScored = deletedBlocks[0].color;

    // Add the score to the global score variable
    score += adder;
}
