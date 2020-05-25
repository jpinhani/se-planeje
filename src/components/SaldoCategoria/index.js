let vet = 0;

const SaldoCategoria = (listaArray) => {
    return groupByCategoria(listaArray.reduce((acum, atual, i) => {
        let objeto = acum
        objeto[i] = {
            Conta: atual.DESCR_CONTA,
            Categoria: atual.DESCR_CATEGORIA,
            Valor: atual.VL_REAL,
            Status: atual.STATUS,
            Data: atual.DT_REAL
        }
        return objeto
    }, []).filter((dados) =>
        dados.Status === 'Pagamento Realizado' ||
        dados.Status === 'Fatura Paga' ||
        dados.Status === 'Fatura Pronta Para Pagamento'))
}

function groupByCategoria(ArrayCategoria) {
    vet = 0;
    return ArrayCategoria.reduce((acum, gaveta, i, dados) => {
        let novoArray = acum
        if (novoArray.filter((ary) => ary.Categoria === gaveta.Categoria).length === 0) {
            const Categoria = gaveta.Categoria
            const Saldo = dados.filter((ary) =>
                ary.Categoria === gaveta.Categoria).reduce((acum, valores) => acum + valores.Valor, 0)
            novoArray[vet] = { Categoria: Categoria, Valor: Saldo }
            vet = vet + 1
        }
        return novoArray
    }, []);
}

export { SaldoCategoria, groupByCategoria }