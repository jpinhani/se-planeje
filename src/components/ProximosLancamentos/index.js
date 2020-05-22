import React from 'react';

function ProximosLancamentos(dados) {
    return dados.filter((dados, i) => {
        const data = new Date(dados.DT_PREVISTO);
        const dataAtual = new Date();

        let timeDiff = data.getTime() - dataAtual.getTime()
        let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return diffDays <= 5
    })
}

export { ProximosLancamentos }