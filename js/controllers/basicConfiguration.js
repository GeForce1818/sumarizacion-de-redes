import { prefixToMask } from '../utils.js';

class BasicConfigurationController {
    constructor(view) {
        this.view = view;
    }

    generateConfiguration(iface, ip, prefix) {
        // Validaciones
        if (!iface || !ip || !prefix) {
            return {
                error: true,
                message: '❌ Todos los campos son obligatorios.'
            };
        }

        // Validar IP
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!ipRegex.test(ip)) {
            return {
                error: true,
                message: '❌ Dirección IP inválida.'
            };
        }

        // Validar prefijo
        const validPrefixes = ['/24', '/30'];
        if (!validPrefixes.includes(prefix)) {
            return {
                error: true,
                message: '❌ Prefijo inválido. Solo se acepta /24 o /30.'
            };
        }

        const mask = prefixToMask(prefix);
        const commands = `int ${iface}\nip add ${ip} ${mask}\nno shut\nexit`;

        return {
            error: false,
            commands
        };
    }

    saveToHistory(iface, ipPrefix, commands) {
        const history = JSON.parse(localStorage.getItem('routerConfigHistory')) || [];
        history.push({
            date: new Date().toLocaleString(),
            iface,
            ipPrefix,
            commands
        });
        localStorage.setItem('routerConfigHistory', JSON.stringify(history));
        return history;
    }

    clearHistory() {
        localStorage.removeItem('routerConfigHistory');
        return [];
    }

    getHistory() {
        return JSON.parse(localStorage.getItem('routerConfigHistory')) || [];
    }
}

export default BasicConfigurationController;
