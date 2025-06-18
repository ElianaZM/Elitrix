// Gyroscope control for Elitrix

function initGyroscopeControl() {
    const display = document.createElement('div');
    display.id = 'gyro-display';
    display.style.position = 'fixed';
    display.style.top = '10px';
    display.style.left = '10px';
    display.style.backgroundColor = 'rgba(0,0,0,0.7)';
    display.style.color = 'white';
    display.style.padding = '10px';
    display.style.borderRadius = '5px';
    display.style.fontFamily = 'Exo 2';
    display.style.zIndex = '1000';
    document.body.appendChild(display);

    if (window.DeviceOrientationEvent) {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            const button = document.createElement('button');
            button.innerHTML = 'Activar giroscopio';
            button.style.position = 'fixed';
            button.style.top = '50%';
            button.style.left = '50%';
            button.style.transform = 'translate(-50%, -50%)';
            button.style.padding = '15px 30px';
            button.style.backgroundColor = '#2ecc71';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.fontFamily = 'Exo 2';
            button.style.fontSize = '18px';
            button.style.zIndex = '1001';
            document.body.appendChild(button);

            button.addEventListener('click', async () => {
                try {
                    const permission = await DeviceOrientationEvent.requestPermission();
                    if (permission === 'granted') {
                        startGyroControl();
                        button.remove();
                    }
                } catch (e) {
                    console.error('No se pudo obtener permiso para el giroscopio:', e);
                    display.innerHTML = 'Error: No se pudo activar el giroscopio';
                }
            });
        } else {
            // Android o navegadores que no requieren permiso
            startGyroControl();
        }
    } else {
        display.innerHTML = 'Este dispositivo no soporta giroscopio';
        console.warn('Device orientation no soportado');
    }
}

let lastGamma = 0;
let rotationThreshold = 15; // más ángulo = menos sensible
let lastRotationTime = 0;
let rotationCooldown = 300;

function startGyroControl() {
    const display = document.getElementById('gyro-display');

    window.addEventListener('deviceorientation', (event) => {
        const currentGamma = Math.round(event.gamma || 0);
        const now = Date.now();

        display.innerHTML = `
            <strong>Giroscopio:</strong><br>
            Gamma: ${currentGamma}°<br>
            Beta: ${Math.round(event.beta || 0)}°<br>
            Alpha: ${Math.round(event.alpha || 0)}°
        `;

        const gammaDiff = currentGamma - lastGamma;

        if (now - lastRotationTime > rotationCooldown) {
            if (Math.abs(gammaDiff) >= rotationThreshold) {
                if (currentGamma > 10) {
                    if (typeof rotateRight === 'function') rotateRight();
                    if (typeof Vibration !== 'undefined') Vibration.onBlockMatch(3);
                } else if (currentGamma < -10) {
                    if (typeof rotateLeft === 'function') rotateLeft();
                    if (typeof Vibration !== 'undefined') Vibration.onBlockMatch(3);
                }
                lastRotationTime = now;
                lastGamma = currentGamma;
            }
        }
    });
}

// Inicia al cargar la página
window.addEventListener('load', initGyroscopeControl);
