function gera_cor() {
    var hexadecimais = '0123456789ABCDEF';
    var cor = '#';
    for (let i = 0; i < 6; i++) {
        cor += hexadecimais[Math.floor(Math.random() * 16)];
    }
    return cor;
}


export { gera_cor }