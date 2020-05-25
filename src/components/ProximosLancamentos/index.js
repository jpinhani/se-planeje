import moment from 'moment';

function ProximosLancamentos(dados) {
    return dados.filter((dados, i) => {
        const data = new Date(dados.DT_PREVISTO);
        const dataAtual = new Date();

        let timeDiff = data.getTime() - dataAtual.getTime()
        let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return diffDays <= 5
    })
}

const proximosLancamentosDespesa = (despesas) => ProximosLancamentos(despesas).filter((filtro) =>
    filtro.STATUS === 'Esperando Pagamento' ||
    filtro.STATUS === 'Fatura Pendente'
).map((data) => {
    return {
        /* Campos Modal Pagar*/
        ID: data.ID,
        ID_CARTAO: data.ID_CARTAO,
        ID_CATEGORIA: data.ID_CATEGORIA,
        VL_PREVISTO2: data.VL_PREVISTO,
        DATANOVA: moment(data.DT_PREVISTO).format("DD/MM/YYYY"),
        NUM_PARCELA: data.NUM_PARCELA,
        DESCR_DESPESA: data.DESCR_DESPESA,
        ID_GRUPO: data.ID_GRUPO,
        /* Campos Home*/
        Descricao: data.DESCR_DESPESA,
        Categoria: data.DESCR_CATEGORIA,
        Valor: data.VL_PREVISTO * (-1),
        Data: data.DT_PREVISTO,
        Tipo: 'Despesa'
    }
})

const proximosLancamentosReceita = (receitas) => ProximosLancamentos(receitas).filter((filtro) =>
    filtro.STATUS === 'Esperando Pagamento'
).map((data) => {
    return {
        /* Campos Modal Pagar*/
        ID: data.ID,
        ID_CATEGORIA: data.ID_CATEGORIA,
        VL_PREVISTO2: data.VL_PREVISTO,
        DATANOVA: moment(data.DT_PREVISTO).format("DD/MM/YYYY"),
        NUM_PARCELA: data.NUM_PARCELA,
        DESCR_RECEITA: data.DESCR_RECEITA,
        ID_GRUPO: data.ID_GRUPO,
        /* Campos Home*/
        Descricao: data.DESCR_RECEITA,
        Categoria: data.DESCR_CATEGORIA,
        Valor: data.VL_PREVISTO * (1),
        Data: data.DT_PREVISTO,
        Tipo: 'Receita'
    }
})


export { ProximosLancamentos, proximosLancamentosDespesa, proximosLancamentosReceita }