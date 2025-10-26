class BasicConfigurationView {
    constructor() {
        this.interfaceInput = document.getElementById('interface');
        this.ipInput = document.getElementById('ip');
        this.prefixInput = document.getElementById('prefix');
        this.resultDiv = document.getElementById('result');
        this.historyTable = document.querySelector('#historyTable tbody');
    }

    getFormValues() {
        return {
            iface: this.interfaceInput.value.trim(),
            ip: this.ipInput.value.trim(),
            prefix: this.prefixInput.value.trim()
        };
    }

    clearFields() {
        this.interfaceInput.value = '';
        this.ipInput.value = '';
        this.prefixInput.value = '';
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
                <td>${item.iface}</td>
                <td>${item.ipPrefix}</td>
                <td><pre>${item.commands}</pre></td>
            `;
            this.historyTable.appendChild(tr);
        });
    }
}

export default BasicConfigurationView;
