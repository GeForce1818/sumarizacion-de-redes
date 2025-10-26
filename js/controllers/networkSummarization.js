import { ipToBinary, binaryToIp, prefixToMask } from '../utils.js';

class NetworkSummarizationController {
    constructor(view) {
        this.view = view;
    }

    calculateSummarization(networks) {
        // Validar formato CIDR
        const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
        for (let net of networks) {
            if (!cidrRegex.test(net)) {
                return {
                    error: true,
                    message: `❌ Formato inválido en: "${net}". Usa ej: 192.168.1.0/24`
                };
            }
            // Validar rango octetos y prefijo
            const [ip, prefix] = net.split('/');
            const octets = ip.split('.').map(Number);
            if (octets.some(o => o < 0 || o > 255) || prefix < 0 || prefix > 32) {
                return {
                    error: true,
                    message: `❌ Valores fuera de rango en: "${net}".`
                };
            }
        }

        // Convertir redes a binario
        let binaries = networks.map(net => {
            const [ip, prefix] = net.split('/');
            return ipToBinary(ip).slice(0, parseInt(prefix));
        });

        // Encontrar prefijo común
        let commonPrefix = binaries[0];
        for (let i = 1; i < binaries.length; i++) {
            let j = 0;
            while (j < commonPrefix.length && j < binaries[i].length && commonPrefix[j] === binaries[i][j]) {
                j++;
            }
            commonPrefix = commonPrefix.slice(0, j);
        }

        const newPrefixLength = commonPrefix.length;
        const summarizedBinary = commonPrefix.padEnd(32, '0');
        const summarizedIp = binaryToIp(summarizedBinary);
        const maskDecimal = prefixToMask(newPrefixLength);

        return {
            error: false,
            summarizedNetwork: `${summarizedIp}/${newPrefixLength}`,
            mask: maskDecimal
        };
    }

    saveToHistory(networks, summarized, mask) {
        const history = JSON.parse(localStorage.getItem('sumarizaciones')) || [];
        history.push({
            date: new Date().toLocaleString(),
            networks,
            summarized,
            mask
        });
        localStorage.setItem('sumarizaciones', JSON.stringify(history));
        return history;
    }

    clearHistory() {
        localStorage.removeItem('sumarizaciones');
        return [];
    }

    getHistory() {
        return JSON.parse(localStorage.getItem('sumarizaciones')) || [];
    }
}

export default NetworkSummarizationController;
