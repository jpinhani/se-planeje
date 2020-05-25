import moment from 'moment';



function cartaoRealizado(despesas, listagemCartao, visao) {
    const rs =
        visao.length > 0 ?
            filtroData(despesas.filter((filtroCartao) =>
                filtroCartao.STATUS === 'Fatura Paga').reduce((acum, dataCartao, i) => {
                    const modelaData = moment(dataCartao.DT_CREDITO)

                    const MM = modelaData.get("month")

                    const YY = modelaData.get("year")

                    console.log('MM', MM, '-', 'YY', YY)
                    const dataMelhorCompra = moment()
                    const diaCompra = listagemCartao.filter((listCartao) =>
                        dataCartao.ID_CARTAO === listCartao.ID).map((data) => data.DIA_COMPRA)

                    dataMelhorCompra.set("date", diaCompra[0])
                    dataMelhorCompra.set("month", MM)
                    dataMelhorCompra.set("year", YY)

                    const dataVencimento = moment()
                    const diaVencimento = listagemCartao.filter((listCartao) =>
                        dataCartao.ID_CARTAO === listCartao.ID).map((data) => data.DT_VENCIMENTO)

                    dataVencimento.set("date", diaVencimento[0])
                    dataVencimento.set("month", MM)
                    dataVencimento.set("year", YY)

                    const dataProxVencimento = moment()
                    dataProxVencimento.set("date", diaVencimento[0])
                    dataProxVencimento.set("month", MM)
                    dataProxVencimento.set("year", YY)
                    dataProxVencimento.add(1, 'months')

                    const dataCompra = moment(dataCartao.DT_CREDITO)
                    const dataFatura = dataCompra >= dataMelhorCompra ? dataProxVencimento : dataVencimento
                    let novoArray = acum
                    listagemCartao.filter((listCartao) =>
                        dataCartao.ID_CARTAO === listCartao.ID).map((listCartao) =>
                            novoArray[i] = { ...dataCartao, ...listCartao, dataMelhorCompra, dataVencimento, dataProxVencimento, dataFatura }
                        )
                    console.log(novoArray)
                    return novoArray
                }, []), 'cartaoRealizado', visao[0].DT_INICIO, visao[0].DT_FIM)
            : [];
    return rs
}


function cartaoPrevisto(despesas, listagemCartao, visao) {
    const rs =
        visao.length > 0 ?
            filtroData(despesas.filter((filtroCartao) =>
                filtroCartao.STATUS === 'Fatura Pronta Para Pagamento' ||
                filtroCartao.STATUS === 'Fatura Pendente').reduce((acum, dataCartao, i) => {
                    const modelaData = moment(dataCartao.DT_REAL ?
                        dataCartao.DT_REAL :
                        dataCartao.DT_PREVISTO)

                    const MM = modelaData.get("month")

                    const YY = modelaData.get("year")

                    console.log('MM', MM, '-', 'YY', YY)
                    const dataMelhorCompra = moment()
                    const diaCompra = listagemCartao.filter((listCartao) =>
                        dataCartao.ID_CARTAO === listCartao.ID).map((data) => data.DIA_COMPRA)

                    dataMelhorCompra.set("date", diaCompra[0])
                    dataMelhorCompra.set("month", MM)
                    dataMelhorCompra.set("year", YY)

                    const dataVencimento = moment()
                    const diaVencimento = listagemCartao.filter((listCartao) =>
                        dataCartao.ID_CARTAO === listCartao.ID).map((data) => data.DT_VENCIMENTO)

                    dataVencimento.set("date", diaVencimento[0])
                    dataVencimento.set("month", MM)
                    dataVencimento.set("year", YY)

                    const dataProxVencimento = moment()
                    dataProxVencimento.set("date", diaVencimento[0])
                    dataProxVencimento.set("month", MM)
                    dataProxVencimento.set("year", YY)
                    dataProxVencimento.add(1, 'months')

                    const dataCompra = dataCartao.DT_REAL !== undefined ? moment(dataCartao.DT_REAL) : moment(dataCartao.DT_PREVISTO)
                    const dataFatura = dataCompra >= dataMelhorCompra ? dataProxVencimento : dataVencimento
                    let novoArray = acum
                    listagemCartao.filter((listCartao) =>
                        dataCartao.ID_CARTAO === listCartao.ID).map((listCartao) =>
                            novoArray[i] = { ...dataCartao, ...listCartao, dataMelhorCompra, dataVencimento, dataProxVencimento, dataFatura }
                        )
                    console.log(novoArray)
                    return novoArray
                }, []), 'cartaoPrevisto', visao[0].DT_INICIO, visao[0].DT_FIM)
            : [];
    return rs
}

function realizadas(despesas, visao) {
    const rs =
        visao.length > 0 ?
            filtroData(despesas.filter((filtroRealizadas) =>
                filtroRealizadas.STATUS === 'Pagamento Realizado'), 'realizadas', visao[0].DT_INICIO, visao[0].DT_FIM)
            : []
    return rs
}

function previstas(despesas, visao) {
    const rs =
        visao.length > 0 ?
            filtroData(despesas.filter((filtroPrevistas) =>
                filtroPrevistas.STATUS === 'Esperando Pagamento'), 'previstas', visao[0].DT_INICIO, visao[0].DT_FIM)
            : []
    return rs
}

function filtroData(despesas, tipo, dtInicio, dtFim) {

    const filtro = despesas.filter((filtroData) => {
        let rs = [];
        switch (tipo) {
            case 'realizadas':
                rs = filtroData.DT_REAL >= dtInicio &&
                    filtroData.DT_REAL <= dtFim
                break;
            case 'previstas':
                rs = filtroData.DT_PREVISTO >= dtInicio &&
                    filtroData.DT_PREVISTO <= dtFim
                break;
            case 'cartaoRealizado':
                rs = filtroData.dataFatura >= moment(dtInicio) &&
                    filtroData.dataFatura <= moment(dtFim)
                break;
            case 'cartaoPrevisto':
                rs = filtroData.dataFatura >= moment(dtInicio) &&
                    filtroData.dataFatura <= moment(dtFim)
                break;

            default:
                break;
        }
        return rs
    })
    return filtro
}


export { cartaoRealizado, cartaoPrevisto, realizadas, previstas }