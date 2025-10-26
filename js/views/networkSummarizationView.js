class NetworkSummarizationView {
    constructor() {
        this.networksInput = document.getElementById('networks');
        this.resultDiv = document.getElementById('result');
        this.historyTable = document.querySelector('#historyTable tbody');
    }

    getNetworks() {
        return this.networksInput.value.trim()
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
    }

    clearFields() {
        this.networksInput.value = '';
        this.resultDiv.innerText = '';
    }

    showError(message) {
        this.resultDiv.style.color = 'red';
        this.resultDiv.innerText = message;
    }

    showResult(summarizedNetwork, mask) {
        this.resultDiv.style.color = '#dceefb';
        this.resultDiv.innerText = `✅ Red sumarizada: ${summarizedNetwork}\n📝 Máscara de red: ${mask}`;
    }

    renderHistory(history) {
        this.historyTable.innerHTML = '';
        history.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.date}</td>
                <td>${item.networks}</td>
                <td>${item.summarized}</td>
                <td>${item.mask}</td>
            `;
            this.historyTable.appendChild(tr);
        });
    }
}

export default NetworkSummarizationView;
