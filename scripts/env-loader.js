// Environment variable loader for browser environments
class EnvLoader {
    constructor() {
        this.envVars = {};
        this.loadEnvFile();
    }
    
    async loadEnvFile() {
        try {
            // Try to fetch the .env file
            const response = await fetch('.env');
            if (response.ok) {
                const envContent = await response.text();
                this.parseEnvContent(envContent);
                console.log('Environment variables loaded from .env file');
            } else {
                console.log('No .env file found, using default configuration');
            }
        } catch (error) {
            console.log('Could not load .env file:', error.message);
            console.log('Using default configuration');
        }
    }
    
    parseEnvContent(content) {
        const lines = content.split('\n');
        
        lines.forEach(line => {
            line = line.trim();
            
            // Skip empty lines and comments
            if (!line || line.startsWith('#')) {
                return;
            }
            
            // Parse KEY=VALUE format
            const equalIndex = line.indexOf('=');
            if (equalIndex > 0) {
                const key = line.substring(0, equalIndex).trim();
                const value = line.substring(equalIndex + 1).trim();
                
                // Remove quotes if present
                const cleanValue = value.replace(/^["']|["']$/g, '');
                
                this.envVars[key] = cleanValue;
                
                // Set as global variable for immediate use
                if (typeof window !== 'undefined') {
                    window[key] = cleanValue;
                }
            }
        });
        
        console.log('Environment variables loaded:', Object.keys(this.envVars));
    }
    
    get(key) {
        return this.envVars[key];
    }
    
    getAll() {
        return { ...this.envVars };
    }
}

// Initialize the environment loader
const envLoader = new EnvLoader();
