import moment from 'moment';
let vet = 0;

const SaldoCategoria = (listaArray, visao, tipo, cartaoListagem) => {

    const dados = listaArray.reduce((acum, atual, i) => {
        let objeto = acum
        objeto[i] = {
            Conta: atual.DESCR_CONTA,
            IdCartao: atual.ID_CARTAO,
            Cartao: atual.DESCR_CARTAO,
            Categoria: atual.DESCR_CATEGORIA,
            ValorReal: atual.VL_REAL,
            DataReal: atual.DT_REAL,
            ValorPrevisto: atual.VL_PREVISTO,
            DataPrevisto: atual.DT_PREVISTO,
            Status: atual.STATUS
        }
        return objeto
    }, [])

    let rs = []
    if (visao.length > 0) {
        if (tipo === 'PREVISTO') {
            rs = groupByCategoria(
                cartaoPrevisto(dados, cartaoListagem, visao[0].DT_INICIO, visao[0].DT_FIM),
                tipo)

        } else if (tipo === 'REAL') {
            rs = groupByCategoria(
                cartaoReal(dados, cartaoListagem, visao[0].DT_INICIO, visao[0].DT_FIM),
                tipo)

        } else if (tipo === 'FORECAST') {
            rs = groupByCategoria(
                cartaoForecast(dados, cartaoListagem, visao[0].DT_INICIO, visao[0].DT_FIM),
                tipo)
        }
    };

    return rs
}


function groupByCategoria(ArrayCategoria, tipo) {
    vet = 0;
    let GroupFinal = []
    if (tipo === 'REAL') {

        GroupFinal = ArrayCategoria.reduce((acum, gaveta, i, dados) => {
            let novoArray = acum
            if (novoArray.filter((ary) => ary.Categoria === gaveta.Categoria).length === 0) {
                const Categoria = gaveta.Categoria
                const Saldo = dados.filter((ary) =>
                    ary.Categoria === gaveta.Categoria).reduce((acum, valores) => acum + valores.ValorReal, 0)
                novoArray[vet] = { Categoria: Categoria, Valor: Saldo }
                vet = vet + 1
            }
            return novoArray
        }, []);

    } else if (tipo === 'PREVISTO') {
        GroupFinal = ArrayCategoria.reduce((acum, gaveta, i, dados) => {
            let novoArray = acum
            if (novoArray.filter((ary) => ary.Categoria === gaveta.Categoria).length === 0) {
                const Categoria = gaveta.Categoria
                const Saldo = dados.filter((ary) =>
                    ary.Categoria === gaveta.Categoria).reduce((acum, valores) => acum + valores.ValorPrevisto, 0)
                novoArray[vet] = { Categoria: Categoria, Valor: Saldo }
                vet = vet + 1
            }
            return novoArray
        }, []);


    } else if (tipo === 'FORECAST') {

        GroupFinal = ArrayCategoria.reduce((acum, gaveta, i, dados) => {
            let novoArray = acum
            if (novoArray.filter((ary) => ary.Categoria === gaveta.Categoria).length === 0) {

                const Categoria = gaveta.Categoria

                const Saldo = dados.filter((ary) =>
                    ary.Categoria === gaveta.Categoria).reduce((acum, valores) =>
                        acum + (valores.ValorReal ? valores.ValorReal : valores.ValorPrevisto), 0)

                novoArray[vet] = { Categoria: Categoria, Valor: Saldo }
                vet = vet + 1
            }
            return novoArray
        }, []);
    }

    return GroupFinal
}


function previsto(array, dtInicio, dtFim) {
    return array.filter((dados) =>
        (dados.Status === 'Esperando Pagamento' ||
            dados.Status === 'Pagamento Realizado') &&
        (dados.DataPrevisto >= dtInicio &&
            dados.DataPrevisto <= dtFim))
}

function cartaoPrevisto(dados, cartoes, dtInicio, dtFim) {

    const conta = previsto(dados.filter((filtro) => filtro.Cartao === null), dtInicio, dtFim)

    /*Adiciona o dia da Melhor Compra com o dia do Vencimento do Cartão*/
    const cartao = dados.filter((filtro) =>
        filtro.Cartao !== null).map((novoObjeto) => {
            return {
                Conta: novoObjeto.Conta,
                IdCartao: novoObjeto.IdCartao,
                Cartao: novoObjeto.Cartao,
                Categoria: novoObjeto.Categoria,
                ValorReal: novoObjeto.ValorReal,
                DataReal: novoObjeto.DataReal,
                ValorPrevisto: novoObjeto.ValorPrevisto,
                DataPrevisto: novoObjeto.DataPrevisto,
                Status: novoObjeto.Status,
                melhorDiaCompra: cartoes.filter((listaCartao) =>
                    listaCartao.ID === novoObjeto.IdCartao).map((diacompra) => {

                        const modelaData = novoObjeto.DataPrevisto ?
                            novoObjeto.DataReal ?
                                moment(novoObjeto.DataReal) :
                                moment(novoObjeto.DataPrevisto) :
                            moment(novoObjeto.DataPrevisto)

                        const MM = modelaData.get("month")
                        const YY = modelaData.get("year")

                        const dataMelhorCompra = moment()
                        dataMelhorCompra.set("date", diacompra.DIA_COMPRA)
                        dataMelhorCompra.set("month", MM)
                        dataMelhorCompra.set("year", YY)

                        return dataMelhorCompra
                    })[0],
                VencimentoCartao: cartoes.filter((listaCartao) =>
                    listaCartao.ID === novoObjeto.IdCartao).map((diacompra) => {


                        const modelaData = novoObjeto.DataPrevisto ?
                            novoObjeto.DataReal ?
                                moment(novoObjeto.DataReal) :
                                moment(novoObjeto.DataPrevisto) :
                            moment(novoObjeto.DataPrevisto)


                        const MM = modelaData.get("month")
                        const YY = modelaData.get("year")

                        const dataVencimento = moment()
                        dataVencimento.set("date", diacompra.DT_VENCIMENTO)
                        dataVencimento.set("month", MM)
                        dataVencimento.set("year", YY)
                        if (diacompra.DT_VENCIMENTO < diacompra.DIA_COMPRA)
                            dataVencimento.add(1, 'month')

                        const dataMelhorCompra = moment()
                        dataMelhorCompra.set("date", diacompra.DIA_COMPRA)
                        dataMelhorCompra.set("month", MM)
                        dataMelhorCompra.set("year", YY)

                        if (modelaData > dataMelhorCompra)
                            dataVencimento.add(1, 'month')

                        return dataVencimento
                    })[0]
            }
        })

    const cartaoFinal = cartao.filter((dados) =>
        (moment(dados.VencimentoCartao) >= moment(dtInicio) &&
            moment(dados.VencimentoCartao) <= moment(dtFim)))

    return [...conta, ...cartaoFinal]
}

function real(array, dtInicio, dtFim) {
    return array.filter((dados) =>
        (dados.Status === 'Esperando Pagamento' ||
            dados.Status === 'Pagamento Realizado') &&
        (dados.DataReal >= dtInicio &&
            dados.DataReal <= dtFim))
}

function cartaoReal(dados, cartoes, dtInicio, dtFim) {

    const conta = real(dados.filter((filtro) => filtro.Cartao === null), dtInicio, dtFim)

    /*Adiciona o dia da Melhor Compra com o dia do Vencimento do Cartão*/
    const cartao = dados.filter((filtro) =>
        filtro.Cartao !== null &&
        filtro.Status === 'Fatura Paga').map((novoObjeto) => {
            return {
                Conta: novoObjeto.Conta,
                IdCartao: novoObjeto.IdCartao,
                Cartao: novoObjeto.Cartao,
                Categoria: novoObjeto.Categoria,
                ValorReal: novoObjeto.ValorReal,
                DataReal: novoObjeto.DataReal,
                ValorPrevisto: novoObjeto.ValorPrevisto,
                DataPrevisto: novoObjeto.DataPrevisto,
                Status: novoObjeto.Status,
                melhorDiaCompra: cartoes.filter((listaCartao) =>
                    listaCartao.ID === novoObjeto.IdCartao).map((diacompra) => {

                        const modelaData = moment(novoObjeto.DataReal)

                        const MM = modelaData.get("month")
                        const YY = modelaData.get("year")

                        const dataMelhorCompra = moment()
                        dataMelhorCompra.set("date", diacompra.DIA_COMPRA)
                        dataMelhorCompra.set("month", MM)
                        dataMelhorCompra.set("year", YY)

                        return dataMelhorCompra
                    })[0],
                VencimentoCartao: cartoes.filter((listaCartao) =>
                    listaCartao.ID === novoObjeto.IdCartao).map((diacompra) => {


                        const modelaData = moment(novoObjeto.DataReal)

                        const MM = modelaData.get("month")
                        const YY = modelaData.get("year")

                        const dataVencimento = moment()
                        dataVencimento.set("date", diacompra.DT_VENCIMENTO)
                        dataVencimento.set("month", MM)
                        dataVencimento.set("year", YY)
                        if (diacompra.DT_VENCIMENTO < diacompra.DIA_COMPRA)
                            dataVencimento.add(1, 'month')

                        const dataMelhorCompra = moment()
                        dataMelhorCompra.set("date", diacompra.DIA_COMPRA)
                        dataMelhorCompra.set("month", MM)
                        dataMelhorCompra.set("year", YY)

                        if (modelaData > dataMelhorCompra)
                            dataVencimento.add(1, 'month')

                        return dataVencimento
                    })[0]
            }
        })

    const cartaoFinal = cartao.filter((dados) =>
        (moment(dados.VencimentoCartao) >= moment(dtInicio) &&
            moment(dados.VencimentoCartao) <= moment(dtFim)))

    return [...conta, ...cartaoFinal]
}

function forecast(array, dtInicio, dtFim) {
    return array.filter((dados) =>
        ((dados.Status === 'Esperando Pagamento' ||
            dados.Status === 'Pagamento Realizado') &&
            ((dados.DataPrevisto >= dtInicio &&
                dados.DataPrevisto <= dtFim) ||
                (dados.DataReal >= dtInicio &&
                    dados.DataReal <= dtFim)))
    )
}

function cartaoForecast(dados, cartoes, dtInicio, dtFim) {

    const conta = forecast(dados.filter((filtro) => filtro.Cartao === null), dtInicio, dtFim)

    const cartao = dados.filter((filtro) =>
        filtro.Cartao !== null).map((novoObjeto) => {
            return {
                Conta: novoObjeto.Conta,
                IdCartao: novoObjeto.IdCartao,
                Cartao: novoObjeto.Cartao,
                Categoria: novoObjeto.Categoria,
                ValorReal: novoObjeto.ValorReal,
                DataReal: novoObjeto.DataReal,
                ValorPrevisto: novoObjeto.ValorPrevisto,
                DataPrevisto: novoObjeto.DataPrevisto,
                Status: novoObjeto.Status,
                melhorDiaCompra: cartoes.filter((listaCartao) =>
                    listaCartao.ID === novoObjeto.IdCartao).map((diacompra) => {

                        const modelaData = novoObjeto.DataReal ?
                            moment(novoObjeto.DataReal) :
                            moment(novoObjeto.DataPrevisto)

                        const MM = modelaData.get("month")
                        const YY = modelaData.get("year")

                        const dataMelhorCompra = moment()
                        dataMelhorCompra.set("date", diacompra.DIA_COMPRA)
                        dataMelhorCompra.set("month", MM)
                        dataMelhorCompra.set("year", YY)

                        return dataMelhorCompra
                    })[0],
                VencimentoCartao: cartoes.filter((listaCartao) =>
                    listaCartao.ID === novoObjeto.IdCartao).map((diacompra) => {

                        const modelaData = novoObjeto.DataReal ?
                            moment(novoObjeto.DataReal) :
                            moment(novoObjeto.DataPrevisto)

                        const MM = modelaData.get("month")
                        const YY = modelaData.get("year")

                        const dataVencimento = moment()
                        dataVencimento.set("date", diacompra.DT_VENCIMENTO)
                        dataVencimento.set("month", MM)
                        dataVencimento.set("year", YY)
                        if (diacompra.DT_VENCIMENTO < diacompra.DIA_COMPRA)
                            dataVencimento.add(1, 'month')

                        const dataMelhorCompra = moment()
                        dataMelhorCompra.set("date", diacompra.DIA_COMPRA)
                        dataMelhorCompra.set("month", MM)
                        dataMelhorCompra.set("year", YY)

                        if (modelaData > dataMelhorCompra)
                            dataVencimento.add(1, 'month')

                        return dataVencimento
                    })[0]
            }
        })

    const cartaoFinal = cartao.filter((dados) =>
        (moment(dados.VencimentoCartao) >= moment(dtInicio) &&
            moment(dados.VencimentoCartao) <= moment(dtFim)))

    return [...conta, ...cartaoFinal]
}

export { SaldoCategoria }