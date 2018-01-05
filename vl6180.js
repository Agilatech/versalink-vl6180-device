const VersalinkDevice = require(process.versalink.device);
const device = require('@agilatech/vl6180');

module.exports = class Vl6180 extends VersalinkDevice {
    
    constructor(config) {
        
        // The bus/file must be defined. If not supplied in config, then default to i2c-1
        const bus  = config['bus'] || "/dev/i2c-1";
        
        // Likewise, the address must be defined, so default to 0x29 if not present
        const addr  = config['addr'] || 0x29;

        const hardware = new device.Vl6180(bus, addr);
        
        super(hardware, config);
        
    }
        
}

