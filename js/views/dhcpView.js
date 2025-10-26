class DHCPView {
    constructor() {
        this.ipInput = document.getElementById('dhcpIp');
        this.poolInput = document.getElementById('dhcpPool');
        this.resultDiv = document.getElementById('dhcpResult');
        this.historyTable = document.querySelector('#dhcpHistoryTable tbody');
    }

    getFormValues() {
        return {
            ip: this.ipInput.value.trim(),
            pool: this.poolInput.value.trim()
        };
    }

    clearFields() {
        this.ipInput.value = '';
        this.poolInput.value = '';
        this.resultDiv.innerText = '';
    }

    showError(message) {
        this.resultDiv.style.color = 'red';
        this.resultDiv.innerText = message;
    }

    showResult(commands) {
        this.resultDiv.style.color = 'green';
        this.resultDiv.innerText = commands;
    }

    renderHistory(history) {
        this.historyTable.innerHTML = '';
        history.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.date}</td>
                <td>${item.ip}</td>
                <td>${item.pool}</td>
                <td><pre>${item.commands}</pre></td>
            `;
            this.historyTable.appendChild(tr);
        });
    }
}

export default DHCPView;
