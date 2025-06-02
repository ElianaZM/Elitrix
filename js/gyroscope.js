// Gyroscope test implementation
function initGyroscopeTest() {
    // Create display container
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

    // Check if device supports orientation
    if (window.DeviceOrientationEvent) {
        // For iOS 13+ devices, we need to request permission
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            // Create permission button for iOS
            const button = document.createElement('button');
            button.innerHTML = 'Enable Device Orientation';
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
            document.body.appendChild(button);

            button.addEventListener('click', async () => {
                try {
                    const permission = await DeviceOrientationEvent.requestPermission();
                    if (permission === 'granted') {
                        startGyroscopeTest();
                        button.remove();
                    }
                } catch (e) {
                    console.error('Error requesting gyroscope permission:', e);
                    display.innerHTML = 'Error: Could not access gyroscope';
                }
            });
        } else {
            // Non-iOS devices can start directly
            startGyroscopeTest();
        }
    } else {
        display.innerHTML = 'Device orientation not supported';
        console.log('Device orientation not supported on this device');
    }
}

let lastGamma = 0;
let rotationThreshold = 10; // Minimum angle change to trigger rotation detection
let lastRotationTime = 0;
let rotationCooldown = 250; // Minimum time between rotation logs (ms)

function startGyroscopeTest() {
    const display = document.getElementById('gyro-display');
    
    window.addEventListener('deviceorientation', (event) => {
        // Get the current gamma value (left/right tilt)
        const currentGamma = Math.round(event.gamma || 0);
        const now = Date.now();

        // Update display
        const html = `
            <strong>Device Orientation:</strong><br>
            Left/Right tilt (gamma): ${currentGamma}°<br>
            Front/Back tilt (beta): ${Math.round(event.beta || 0)}°<br>
            Compass (alpha): ${Math.round(event.alpha || 0)}°<br>
            <br>
            <strong>Rotation Direction:</strong><br>
            ${getRotationDirection(currentGamma)}
        `;
        display.innerHTML = html;

        // Check for significant rotation
        if (now - lastRotationTime > rotationCooldown) {
            const gammaDiff = currentGamma - lastGamma;
            
            if (Math.abs(gammaDiff) >= rotationThreshold) {
                // Log rotation with detailed information
                console.log('🔄 Device Rotation Detected:');
                console.log(`  Direction: ${gammaDiff > 0 ? 'RIGHT ➡️' : 'LEFT ⬅️'}`);
                console.log(`  Angle Change: ${Math.abs(gammaDiff)}°`);
                console.log(`  Current Angle: ${currentGamma}°`);
                console.log(`  Previous Angle: ${lastGamma}°`);
                console.log('  Time:', new Date().toLocaleTimeString());
                console.log('------------------------');

                lastRotationTime = now;
                lastGamma = currentGamma;
            }
        }
    });
}

function getRotationDirection(gamma) {
    if (!gamma) return 'No rotation detected';
    
    if (gamma > 10) {
        return '<span style="color: #2ecc71">→ Tilting RIGHT</span>';
    } else if (gamma < -10) {
        return '<span style="color: #e74c3c">← Tilting LEFT</span>';
    } else {
        return 'Device is flat';
    }
}

// Start the test when the page loads
window.addEventListener('load', initGyroscopeTest);
