import React from 'react';

function UltimosLancamentos(dados) {
    return dados.filter((dados, i) => {
        const data = new Date(dados.DT_REAL);
        const dataAtual = new Date();

        let timeDiff = Math.abs(data.getTime() - dataAtual.getTime());
        let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return diffDays <= 5
    })
}

export { UltimosLancamentos }

