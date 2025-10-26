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


//Configuración básica___________________________________________________________________________________________

// Convierte prefijo /24 o /30 a máscara decimal
function prefixToMask(prefix) {
  const num = parseInt(prefix.replace('/', ''));
  const maskBin = ''.padStart(num, '1').padEnd(32, '0');
  const mask = [];
  for (let i = 0; i < 32; i += 8) {
    mask.push(parseInt(maskBin.slice(i, i + 8), 2));
  }
  return mask.join('.');
}

function generateConfig() {
  const iface = document.getElementById('interface').value.trim();
  const ip = document.getElementById('ip').value.trim();
  const prefix = document.getElementById('prefix').value.trim();
  const resultDiv = document.getElementById('result');

  // Validaciones
  if (!iface || !ip || !prefix) {
    resultDiv.style.color = 'red';
    resultDiv.innerText = '❌ Todos los campos son obligatorios.';
    return;
  }

  // Validar IP
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) {
    resultDiv.style.color = 'red';
    resultDiv.innerText = '❌ Dirección IP inválida.';
    return;
  }

  // Validar prefijo
  const validPrefixes = ['/24', '/30'];
  if (!validPrefixes.includes(prefix)) {
    resultDiv.style.color = 'red';
    resultDiv.innerText = '❌ Prefijo inválido. Solo se acepta /24 o /30.';
    return;
  }

  const mask = prefixToMask(prefix);
  const commands = `int ${iface}
ip add ${ip} ${mask}
no shut
exit`;

  resultDiv.style.color = 'green';
  resultDiv.innerText = commands;

  saveToHistory(iface, ip + prefix, commands);
}

function clearFields() {
  document.getElementById('interface').value = '';
  document.getElementById('ip').value = '';
  document.getElementById('prefix').value = '';
  document.getElementById('result').innerText = '';
}

function saveToHistory(iface, ipPrefix, commands) {
  const history = JSON.parse(localStorage.getItem('routerConfigHistory')) || [];
  history.push({
    date: new Date().toLocaleString(),
    iface,
    ipPrefix,
    commands
  });
  localStorage.setItem('routerConfigHistory', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem('routerConfigHistory')) || [];
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = '';
  history.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.date}</td>
      <td>${item.iface}</td>
      <td>${item.ipPrefix}</td>
      <td><pre>${item.commands}</pre></td>
    `;
    tbody.appendChild(tr);
  });
}

function clearHistory() {
  localStorage.removeItem('routerConfigHistory');
  renderHistory();
}

document.addEventListener('DOMContentLoaded', renderHistory);

//DHCP_______________________________________________________________________________________________________

function generateDHCP() {
  const ip = document.getElementById('dhcpIp').value.trim();
  const pool = document.getElementById('dhcpPool').value.trim();
  const resultDiv = document.getElementById('dhcpResult');

  // Validaciones
  if (!ip || !pool) {
    resultDiv.style.color = 'red';
    resultDiv.innerText = '❌ Todos los campos son obligatorios.';
    return;
  }

  // Validar IP
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) {
    resultDiv.style.color = 'red';
    resultDiv.innerText = '❌ Dirección de red inválida.';
    return;
  }

  // Máscara fija /24
  const mask = '255.255.255.0';

  // Sumar 1 al último octeto
  const octets = ip.split('.').map(Number);
  if (octets[3] >= 254) {
    resultDiv.style.color = 'red';
    resultDiv.innerText = '❌ El último octeto de la IP debe ser menor a 254.';
    return;
  }
  const firstHost = `${octets[0]}.${octets[1]}.${octets[2]}.${octets[3] + 1}`;

  const commands = `ip dhcp excluded-address ${firstHost}
ip dhcp pool ${pool}
network ${ip} ${mask}
default-router ${firstHost}
exit`;

  resultDiv.style.color = 'green';
  resultDiv.innerText = commands;

  // Guardar en localStorage usando mismo patrón que interfaces
  const history = JSON.parse(localStorage.getItem('dhcpConfigHistory')) || [];
  history.push({
    date: new Date().toLocaleString(),
    ip,
    pool,
    commands
  });
  localStorage.setItem('dhcpConfigHistory', JSON.stringify(history));

  renderDHCPHistory(); // actualizar tabla inmediatamente
}

function clearDHCPFields() {
  document.getElementById('dhcpIp').value = '';
  document.getElementById('dhcpPool').value = '';
  document.getElementById('dhcpResult').innerText = '';
}

function renderDHCPHistory() {
  const history = JSON.parse(localStorage.getItem('dhcpConfigHistory')) || [];
  const tbody = document.querySelector('#dhcpHistoryTable tbody');
  tbody.innerHTML = '';
  history.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.date}</td>
      <td>${item.ip}</td>
      <td>${item.pool}</td>
      <td><pre>${item.commands}</pre></td>
    `;
    tbody.appendChild(tr);
  });
}

function clearDHCPHistory() {
  localStorage.removeItem('dhcpConfigHistory');
  renderDHCPHistory();
}

// Cargar historial al iniciar
document.addEventListener('DOMContentLoaded', renderDHCPHistory);
