import moment from 'moment';
let vet = 0;

const SaldoCategoria = (listaArray, visao, tipo, cartaoListagem, categorias) => {

    const dados = listaArray.reduce((acum, atual, i) => {
        let objeto = acum
        objeto[i] = {
            Conta: atual.DESCR_CONTA,
            IdCartao: atual.ID_CARTAO,
            Cartao: atual.DESCR_CARTAO,
            IdCategoria: atual.ID_CATEGORIA,
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



    return preparadados(rs, categorias)
}


function preparadados(arrayCategoria, categorias) {
    return arrayCategoria.map((dados) => {
        const rs = categorias.filter((filtro) => dados.IdCategoria === filtro.ID)
        if (rs.length > 0)
            return { ...dados, Idpai: rs[0].IDPAI }

        return { ...dados }
    })
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
                const idCategoria = gaveta.IdCategoria
                novoArray[vet] = {
                    IdCategoria: idCategoria,
                    Categoria: Categoria,
                    Valor: Saldo,
                    ValorPersonalizado: Saldo.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })
                }
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
                const idCategoria = gaveta.IdCategoria
                novoArray[vet] = {
                    IdCategoria: idCategoria,
                    Categoria: Categoria,
                    Valor: Saldo,
                    ValorPersonalizado: Saldo.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })
                }
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

                const idCategoria = gaveta.IdCategoria
                novoArray[vet] = {
                    IdCategoria: idCategoria,
                    Categoria: Categoria,
                    Valor: Saldo,
                    ValorPersonalizado: Saldo.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })
                }
                vet = vet + 1
            }
            return novoArray
        }, []);
    }

    return GroupFinal
}


function previsto(array, dtInicio, dtFim) {
    return array.filter((dados) =>
        (dados.Status === 'Esperando Pagamento') &&
        (moment(dados.DataPrevisto).format("YYYY/MM/DD") >= moment(dtInicio).format("YYYY/MM/DD") &&
            moment(dados.DataPrevisto).format("YYYY/MM/DD") <= moment(dtFim).format("YYYY/MM/DD")))
}

function cartaoPrevisto(dados, cartoes, dtInicio, dtFim) {

    const conta = previsto(dados.filter((filtro) => filtro.Cartao === null), dtInicio, dtFim)
    const contaReal = real(dados.filter((filtro) => filtro.Cartao === null), dtInicio, dtFim)

    /*Adiciona o dia da Melhor Compra com o dia do Vencimento do Cartão*/
    const cartao = dados.filter((filtro) =>
        filtro.Cartao !== null
    ).map((novoObjeto) => {
        return {
            Conta: novoObjeto.Conta,
            IdCartao: novoObjeto.IdCartao,
            Cartao: novoObjeto.Cartao,
            IdCategoria: novoObjeto.IdCategoria,
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

                    if (moment(modelaData).format("YYYY/MM/DD") >= moment(dataMelhorCompra).format("YYYY/MM/DD"))
                        dataVencimento.add(1, 'month')

                    return dataVencimento
                })[0]
        }
    })

    const cartaoFinalPrevisto = cartao.filter(filtro => filtro.Status !== 'Fatura Paga').filter((dados) =>
        (moment(dados.VencimentoCartao).format("YYYY/MM/DD") >= moment(dtInicio).format("YYYY/MM/DD") &&
            moment(dados.VencimentoCartao).format("YYYY/MM/DD") <= moment(dtFim).format("YYYY/MM/DD")))

    const cartaoFinalReal = cartao.filter(filtro => filtro.Status === 'Fatura Paga').filter((dados) =>
        (moment(dados.DataReal).format("YYYY/MM/DD") >= moment(dtInicio).format("YYYY/MM/DD") &&
            moment(dados.DataReal).format("YYYY/MM/DD") <= moment(dtFim).format("YYYY/MM/DD")))


    return [...conta, ...contaReal, ...cartaoFinalPrevisto, ...cartaoFinalReal]
}

function real(array, dtInicio, dtFim) {
    return array.filter((dados) =>
        (dados.Status === 'Pagamento Realizado') &&
        (moment(dados.DataReal).format("YYYY/MM/DD") >= moment(dtInicio).format("YYYY/MM/DD") &&
            moment(dados.DataReal).format("YYYY/MM/DD") <= moment(dtFim).format("YYYY/MM/DD")))
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
                IdCategoria: novoObjeto.IdCategoria,
                Categoria: novoObjeto.Categoria,
                ValorReal: novoObjeto.ValorReal,
                DataReal: novoObjeto.DataReal,
                ValorPrevisto: novoObjeto.ValorPrevisto,
                DataPrevisto: novoObjeto.DataPrevisto,
                Status: novoObjeto.Status
            }
        })

    const cartaoFinal = cartao.filter((dados) =>
        (moment(dados.DataReal) >= moment(dtInicio) &&
            moment(dados.DataReal) <= moment(dtFim)))

    return [...conta, ...cartaoFinal]
}


function cartaoForecast(dados, cartoes, dtInicio, dtFim) {

    const conta = previsto(dados.filter((filtro) => filtro.Cartao === null), dtInicio, dtFim)
    const contaReal = real(dados.filter((filtro) => filtro.Cartao === null), dtInicio, dtFim)

    const cartao = dados.filter((filtro) =>
        filtro.Cartao !== null).map((novoObjeto) => {
            return {
                Conta: novoObjeto.Conta,
                IdCartao: novoObjeto.IdCartao,
                Cartao: novoObjeto.Cartao,
                IdCategoria: novoObjeto.IdCategoria,
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

                        if (moment(modelaData).format("YYYY/MM/DD") >= moment(dataMelhorCompra).format("YYYY/MM/DD"))
                            dataVencimento.add(1, 'month')

                        return dataVencimento
                    })[0]
            }
        })

    const cartaoFinalPrevisto = cartao.filter(filtro => filtro.Status !== 'Fatura Paga').filter((dados) =>
        (moment(dados.VencimentoCartao).format("YYYY/MM/DD") >= moment(dtInicio).format("YYYY/MM/DD") &&
            moment(dados.VencimentoCartao).format("YYYY/MM/DD") <= moment(dtFim).format("YYYY/MM/DD")))

    const cartaoFinalReal = cartao.filter(filtro => filtro.Status === 'Fatura Paga').filter((dados) =>
        (moment(dados.DataReal).format("YYYY/MM/DD") >= moment(dtInicio).format("YYYY/MM/DD") &&
            moment(dados.DataReal).format("YYYY/MM/DD") <= moment(dtFim).format("YYYY/MM/DD")))


    return [...conta, ...contaReal, ...cartaoFinalPrevisto, ...cartaoFinalReal]
}


/* ############################################################################################# */

function hierarquia(dados1, nivel3, nivel4, nivel5) {

    const prepNivel5 = nivel5.map((n5) => {
        const dadosnivel = dados1.filter(filtro => filtro.Idpai === n5.ID)
        const somanivel = dadosnivel.reduce((acum, atual) => acum + atual.Valor, 0)
        if (dadosnivel.length > 0)
            return {
                ...n5,
                Valor: somanivel,
                ValorPersonalizado: somanivel.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                children: dadosnivel
            }

        return { ...n5, Valor: 0 }
    })

    const prepNivel4 = nivel4.map((n4) => {
        const dadosnivel = dados1.filter(filtro => filtro.Idpai === n4.ID)
        const somanivel = dadosnivel.reduce((acum, atual) => acum + atual.Valor, 0)
        if (dadosnivel.length > 0)
            return {
                ...n4,
                Valor: somanivel,
                ValorPersonalizado: somanivel.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                children: dadosnivel
            }

        return { ...n4, Valor: 0 }
    })

    const prepNivel3 = nivel3.map((n3) => {
        const dadosnivel = dados1.filter(filtro => filtro.Idpai === n3.ID)
        const somanivel = dadosnivel.reduce((acum, atual) => acum + atual.Valor, 0)
        if (dadosnivel.length > 0)
            return {
                ...n3,
                Valor: somanivel,
                ValorPersonalizado: somanivel.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                children: dadosnivel
            }

        return { ...n3, Valor: 0 }
    })

    const agrupa4 = prepNivel4.map((prep4) => {
        const dadosnivel = prepNivel5.filter(filtro => filtro.IDPAI === prep4.ID)
        const somanivel = dadosnivel.reduce((acum, atual) => acum + atual.Valor, 0)
        if (dadosnivel.length > 0)
            return {
                ...prep4,
                Valor: somanivel,
                ValorPersonalizado: somanivel.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                children: [...dadosnivel, prep4.children]
            }

        return { ...prep4 }
    })

    const agrupa3 = prepNivel3.map((prep3) => {
        const dadosnivel = agrupa4.filter(filtro => filtro.IDPAI === prep3.ID)
        const somanivel = dadosnivel.reduce((acum, atual) => acum + atual.Valor, 0)
        if (dadosnivel.length > 0)
            return {
                ...prep3,
                Valor: somanivel,
                ValorPersonalizado: somanivel.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                children: [...dadosnivel, prep3.children]
            }

        return { ...prep3 }
    })

    const filtraValor = agrupa3.filter((filtro) => {
        return filtro.Valor > 0
    })

    const despesaInputNivel3 = dados1.filter(filtro => filtro.Idpai === 2)
    const somaInputNivel3 = despesaInputNivel3.reduce((acum, atual) => acum + atual.Valor, 0)
    const despesaInicial = [{
        Categoria: 'DESPESA',
        IdCategoria: 2,
        Idpai: 1,
        children: despesaInputNivel3,
        Valor: somaInputNivel3,
        ValorPersonalizado: somaInputNivel3.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
    }]

    const totalDespesa = despesaInicial.map((listExpense) => {
        const dadosnivel = filtraValor.filter(filtro => filtro.IDPAI === listExpense.IdCategoria)
        const somanivel = dadosnivel.reduce((acum, atual) => acum + atual.Valor, 0)
        if (dadosnivel.length > 0)
            return {
                ...listExpense,
                Valor: somanivel + listExpense.Valor,
                ValorPersonalizado: (somanivel + listExpense.Valor).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                children: [...dadosnivel, ...listExpense.children]
            }

        return { ...listExpense }
    })

    return totalDespesa
}

export { SaldoCategoria, hierarquia }