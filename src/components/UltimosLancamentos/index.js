

function UltimosLancamentos(dados) {
    return dados.filter((dados, i) => {
        const data = new Date(dados.DT_REAL);
        const dataAtual = new Date();

        let timeDiff = Math.abs(data.getTime() - dataAtual.getTime());
        let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return diffDays <= 5
    })
}

/* Ultimos lançamentos com base nos ultimos 5 dias */
const ultimasLançamentosDespesa = (despesas) => UltimosLancamentos(despesas).filter((filtro) =>
    filtro.STATUS === 'Pagamento Realizado' ||
    filtro.STATUS === 'Fatura Pronta Para Pagamento' ||
    filtro.STATUS === 'Fatura Paga'
).map((data) => {
    return {
        Descricao: data.DESCR_DESPESA,
        Categoria: data.DESCR_CATEGORIA,
        Valor: data.VL_REAL * (-1),
        Data: data.STATUS === 'Fatua Paga' ? data.DT_CREDITO : data.DT_REAL,
        Tipo: 'Despesa'
    }
})

const ultimasLançamentosReceita = (receitas) => UltimosLancamentos(receitas).filter((filtro) =>
    filtro.STATUS === 'Pagamento Realizado'
).map((data) => {
    return {
        Descricao: data.DESCR_RECEITA,
        Categoria: data.DESCR_CATEGORIA,
        Valor: data.VL_REAL * (1),
        Data: data.DT_REAL,
        Tipo: 'Receita'
    }
})


export { UltimosLancamentos, ultimasLançamentosDespesa, ultimasLançamentosReceita }

