// Utility functions for IP address manipulation
export function ipToBinary(ip) {
    return ip.split('.')
        .map(octet => parseInt(octet).toString(2).padStart(8, '0'))
        .join('');
}

export function binaryToIp(bin) {
    let ip = [];
    for (let i = 0; i < 32; i += 8) {
        ip.push(parseInt(bin.slice(i, i + 8), 2));
    }
    return ip.join('.');
}

export function prefixToMask(prefix) {
    if (typeof prefix === 'string') {
        prefix = parseInt(prefix.replace('/', ''));
    }
    let maskBin = ''.padStart(prefix, '1').padEnd(32, '0');
    let mask = [];
    for (let i = 0; i < 32; i += 8) {
        mask.push(parseInt(maskBin.slice(i, i + 8), 2));
    }
    return mask.join('.');
}
