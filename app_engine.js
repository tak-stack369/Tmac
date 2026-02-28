const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const NovaEngine = {
    STATE_FILE: path.join(process.env.HOME, '.nova_state'),
    Z_THRESHOLD: -50.0,
    INTENT_BASELINE: 50.0,

    analyzeFriction: function(deviation) {
        const precision = (deviation / this.INTENT_BASELINE).toFixed(4);
        if (precision < 1.0) return "LOGICAL DISCONNECT";
        return "ANOMALOUS OVERLOAD";
    },

    evaluate: function(x, y, z) {
        const deviation = Math.sqrt(x*x + y*y + z*z);
        const frictionLog = this.analyzeFriction(deviation);

        // Check if Z hits the threshold
        if (z < this.Z_THRESHOLD) {
            this.triggerShield(z, frictionLog);
        }
    },

    triggerShield: function(z_val, frictionStr) {
        // Direct Hardware-State Write
        fs.writeFileSync(this.STATE_FILE, '1');
        
        const notebookPath = path.join(process.env.HOME, 'Nova_Notebook', `Session_${new Date().toISOString().split('T')[0]}.md`);
        // Force the Z value to a string with 2 decimal places to kill the 'undefined'
        const logEntry = `\n[${new Date().toISOString()}] TRIGGER | Z=${Number(z_val).toFixed(2)} | ${frictionStr}`;
        
        try {
            fs.appendFileSync(notebookPath, logEntry);
        } catch (e) {
            exec('mkdir -p ~/.nova_sentinel/logs');
        }
    }
};

module.exports = NovaEngine;
// Add this inside your commit function in app_engine.js
triggerAudio: function(res) {
    // If resonance is high, play a sharp frequency, otherwise a low thrum
    const volume = Math.min(Math.floor(res * 10), 100);
    if (res > 1.2) {
        // High frequency 'warning'
        exec(`termux-beep -f 800 -d 200`); 
    } else {
        // Low frequency 'heartbeat'
        exec(`termux-beep -f 200 -d 100`);
    }
}

