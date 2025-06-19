// Vibration utility for Hextris
const Vibration = {
    // Check if vibration is supported
    isSupported: 'vibrate' in navigator || 'mozVibrate' in navigator,

    // Vibration patterns for different events
    patterns: {
        match3: [100],               // Short vibration for 3‑block match
        match4: [50, 50, 100],       // Two quick pulses for 4‑block match
        match5: [50, 50, 50, 50, 150]// Three quick pulses for 5+ block match
    },

    // Initialize vibration settings
    init() {
        // Add vibration setting to game settings
        if (this.isSupported && typeof settings === 'object' && !('vibrationEnabled' in settings)) {
            settings.vibrationEnabled = true;
        }
    },

    onBlockMatch(numBlocks) {
    if (!this.isSupported || !settings?.vibrationEnabled) {
        console.log('Vibration not supported or disabled');
        return;
    }

    let pattern;
    if (numBlocks >= 5) {
        pattern = this.patterns.match5;
    } else if (numBlocks === 4) {
        pattern = this.patterns.match4;
    } else if (numBlocks === 3) {
        pattern = this.patterns.match3;
    }

    console.log('🔔 Llamando vibración con patrón:', pattern); // <- Agregado

    if (Array.isArray(pattern)) {
        try {
            navigator.vibrate([200]);
        } catch (e) {
            console.warn('Vibration failed:', e);
        }
    } else {
        console.warn('❌ Patrón no válido para vibración:', pattern);
    }
},


    // Enable/disable vibration
    enable() {
        if (this.isSupported) {
            settings.vibrationEnabled = true;
        }
    },

    disable() {
        if (this.isSupported) {
            settings.vibrationEnabled = false;
            navigator.vibrate(0); // Stop any ongoing vibration
        }
    }
};

// Initialize vibration when the file loads
Vibration.init();
