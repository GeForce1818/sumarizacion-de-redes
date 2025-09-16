function ipToBinary(ip) {
  return ip.split('.')
           .map(octet => parseInt(octet).toString(2).padStart(8, '0'))
           .join('');
}

function binaryToIp(bin) {
  let ip = [];
  for (let i = 0; i < 32; i += 8) {
    ip.push(parseInt(bin.slice(i, i+8), 2));
  }
  return ip.join('.');
}

// NUEVO: prefijo -> máscara decimal
function prefixToMask(prefix) {
  let maskBin = ''.padStart(prefix, '1').padEnd(32, '0');
  let mask = [];
  for (let i = 0; i < 32; i += 8) {
    mask.push(parseInt(maskBin.slice(i, i + 8), 2));
  }
  return mask.join('.');
}

function calculate() {
  const input = document.getElementById('networks').value.trim();
  const resultDiv = document.getElementById('result');

  // Limpiar resultado previo
  resultDiv.innerText = '';

  if (!input) {
    resultDiv.style.color = 'red';
    resultDiv.innerText = '❌ Por favor ingresa al menos una red.';
    return;
  }

  const networks = input.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // Validar formato CIDR
  const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
  for (let net of networks) {
    if (!cidrRegex.test(net)) {
      resultDiv.style.color = 'red';
      resultDiv.innerText = `❌ Formato inválido en: "${net}". Usa ej: 192.168.1.0/24`;
      return;
    }
    // Validar rango octetos y prefijo
    const [ip, prefix] = net.split('/');
    const octets = ip.split('.').map(Number);
    if (octets.some(o => o < 0 || o > 255) || prefix < 0 || prefix > 32) {
      resultDiv.style.color = 'red';
      resultDiv.innerText = `❌ Valores fuera de rango en: "${net}".`;
      return;
    }
  }

  // Si pasa validaciones -> proceder
  resultDiv.style.color = '#dceefb'; // restaurar color normal

  // Convertir redes a binario
  let binaries = [];
  for (let net of networks) {
    const [ip, prefix] = net.split('/');
    const bin = ipToBinary(ip).slice(0, parseInt(prefix));
    binaries.push(bin);
  }

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

  // NUEVO: máscara decimal
  const maskDecimal = prefixToMask(newPrefixLength);

  const result = `✅ Red sumarizada: ${summarizedIp}/${newPrefixLength}
📝 Máscara de red: ${maskDecimal}`;
  resultDiv.innerText = result;

  // Guardar en localStorage con máscara
  saveToHistory(networks.join(', '), `${summarizedIp}/${newPrefixLength}`, maskDecimal);
}

function clearFields() {
  document.getElementById('networks').value = '';
  document.getElementById('result').innerText = '';
}

function saveToHistory(networks, summarized, mask) {
  const history = JSON.parse(localStorage.getItem('sumarizaciones')) || [];
  history.push({
    date: new Date().toLocaleString(),
    networks,
    summarized,
    mask
  });
  localStorage.setItem('sumarizaciones', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem('sumarizaciones')) || [];
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = '';
  history.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.date}</td>
      <td>${item.networks}</td>
      <td>${item.summarized}</td>
      <td>${item.mask}</td>
    `;
    tbody.appendChild(tr);
  });
}

function clearHistory() {
  localStorage.removeItem('sumarizaciones');
  renderHistory();
}

// Cargar historial al iniciar
document.addEventListener('DOMContentLoaded', renderHistory);
