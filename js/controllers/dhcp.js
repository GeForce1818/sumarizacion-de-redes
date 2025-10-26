class DHCPController {
    constructor(view) {
        this.view = view;
    }

    generateConfiguration(ip, pool) {
        // Validaciones
        if (!ip || !pool) {
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
                message: '❌ Dirección de red inválida.'
            };
        }

        // Máscara fija /24
        const mask = '255.255.255.0';

        // Sumar 1 al último octeto
        const octets = ip.split('.').map(Number);
        if (octets[3] >= 254) {
            return {
                error: true,
                message: '❌ El último octeto de la IP debe ser menor a 254.'
            };
        }
        const firstHost = `${octets[0]}.${octets[1]}.${octets[2]}.${octets[3] + 1}`;

        const commands = `ip dhcp excluded-address ${firstHost}\nip dhcp pool ${pool}\nnetwork ${ip} ${mask}\ndefault-router ${firstHost}\nexit`;

        return {
            error: false,
            commands,
            firstHost
        };
    }

    saveToHistory(ip, pool, commands) {
        const history = JSON.parse(localStorage.getItem('dhcpConfigHistory')) || [];
        history.push({
            date: new Date().toLocaleString(),
            ip,
            pool,
            commands
        });
        localStorage.setItem('dhcpConfigHistory', JSON.stringify(history));
        return history;
    }

    clearHistory() {
        localStorage.removeItem('dhcpConfigHistory');
        return [];
    }

    getHistory() {
        return JSON.parse(localStorage.getItem('dhcpConfigHistory')) || [];
    }
}

export default DHCPController;
