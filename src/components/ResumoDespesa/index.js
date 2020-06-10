import moment from 'moment';
import { filtroData } from '../ResumoFiltroData'

function GeraDespesas(despesas, cartaoListagem, visaoSetada, itens) {

    const cartaoReal = cartaoRealizado(despesas, cartaoListagem, visaoSetada);
    const cartaoPrev = cartaoPrevisto(despesas, cartaoListagem, visaoSetada);
    const real = realizadas(despesas, visaoSetada);
    const prev = previstas(despesas, visaoSetada);

    const listGeradaReal = [...cartaoReal, ...real].map((geraId) => {
        return {
            ...geraId,

            DT_REAL: geraId.DT_REAL ?
                moment(geraId.DT_REAL).format("DD/MM/YYYY") : undefined,

            DT_PREVISTO: geraId.DT_PREVISTO ?
                moment(geraId.DT_PREVISTO).format("DD/MM/YYYY") : undefined,

            VL_REAL: geraId.VL_REAL ?
                geraId.VL_REAL.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }) : undefined,

            VL_REAL_NUMBER: geraId.VL_REAL ?
                geraId.VL_REAL : 0,


            VL_PREVISTO: geraId.VL_PREVISTO ?
                geraId.VL_PREVISTO.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }) : undefined,

            VL_PREVISTO_NUMBER: geraId.VL_PREVISTO ?
                geraId.VL_PREVISTO : 0,

            VL_FORECAST_NUMBER: geraId.CARTAO ? geraId.VL_FORECAST_NUMBER :
                geraId.VL_REAL ? geraId.VL_REAL : geraId.VL_PREVISTO,

            ROLID: Math.random().toString(10).substr(3, 5)
        }
    })

    const listGeradaPrev = [...cartaoPrev, ...prev].map((geraId) => {
        return {
            ...geraId,

            DT_REAL: geraId.DT_REAL ?
                moment(geraId.DT_REAL).format("DD/MM/YYYY") : undefined,

            DT_PREVISTO: geraId.DT_PREVISTO ?
                moment(geraId.DT_PREVISTO).format("DD/MM/YYYY") : undefined,

            VL_REAL: geraId.VL_REAL ?
                geraId.VL_REAL.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }) : undefined,

            VL_REAL_NUMBER: geraId.VL_REAL ?
                geraId.VL_REAL : 0,

            VL_PREVISTO: geraId.VL_PREVISTO ?
                geraId.VL_PREVISTO.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }) : undefined,

            VL_PREVISTO_NUMBER: geraId.VL_PREVISTO ?
                geraId.VL_PREVISTO : 0,

            VL_FORECAST_NUMBER: geraId.CARTAO ? geraId.VL_FORECAST_NUMBER :
                geraId.VL_REAL ? geraId.VL_REAL : geraId.VL_PREVISTO,

            ROLID: Math.random().toString(10).substr(3, 5)
        }
    })

    return itens === true ? listGeradaReal.sort(function (a, b) {
        if (a.DT_REAL > b.DT_REAL) return -1;
        if (a.DT_REAL < b.DT_REAL) return 1;
        return 0;
    }) : listGeradaPrev.sort(function (a, b) {
        if (a.DT_PREVISTO > b.DT_PREVISTO) return -1;
        if (a.DT_PREVISTO < b.DT_PREVISTO) return 1;
        return 0;
    })
}


function cartaoRealizado(despesas, listagemCartao, visao) {
    let rs =
        visao.length > 0 ?
            despesas.filter((filtroCartao) =>
                filtroCartao.STATUS === 'Fatura Paga' ||
                filtroCartao.STATUS === 'Fatura Economizada').reduce((acum, dataCartao, i) => {
                    const modelaData = moment(dataCartao.DT_CREDITO)

                    const MM = modelaData.get("month")

                    const YY = modelaData.get("year")

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

                    if (diaVencimento[0] < diaCompra[0])
                        dataVencimento.add(1, 'month')

                    const dataProxVencimento = moment()
                    dataProxVencimento.set("date", diaVencimento[0])
                    dataProxVencimento.set("month", MM)
                    dataProxVencimento.set("year", YY)
                    dataProxVencimento.add(1, 'months')

                    if (diaVencimento[0] < diaCompra[0])
                        dataProxVencimento.add(1, 'month')

                    const dataCompra = moment(dataCartao.DT_CREDITO)

                    const dataFatura = dataCartao.DT_REAL ? moment(dataCartao.DT_REAL) : moment(dataCompra).format("YYYY-MM-DD") >=
                        moment(dataMelhorCompra).format("YYYY-MM-DD") ?
                        dataProxVencimento : dataVencimento

                    let novoArray = acum
                    listagemCartao.filter((listCartao) =>
                        dataCartao.ID_CARTAO === listCartao.ID).map((listCartao) =>
                            novoArray[i] = { ...dataCartao, ...listCartao, dataMelhorCompra, dataVencimento, dataProxVencimento, dataFatura }
                        )
                    return novoArray
                }, [])
            : [];

    rs = rs.length > 0 ? filtroData(rs, 'cartaoRealizado', visao[0].DT_INICIO, visao[0].DT_FIM) : rs

    return IdentificaCartao(rs)
}

function IdentificaCartao(dadosCartao) {
    let vet = 0;

    const modelaDados = dadosCartao.reduce((acum, atual, i) => {
        let novo = acum

        if (novo.filter((filtroNovo) =>
            filtroNovo.ID_CARTAO === atual.ID_CARTAO &&
            filtroNovo.IDFATURA === moment(atual.dataFatura).format("DD/MM/YYYY")).length === 0) {
            const itemCartao = atual.CARTAO

            novo[vet] = {
                CARTAO: itemCartao + '-' + moment(atual.dataFatura).format("DD/MM/YYYY"),
                VL_REAL: dadosCartao.filter((filtro) =>
                    filtro.ID_CARTAO === atual.ID_CARTAO &&
                    moment(atual.dataFatura).format("DD/MM/YYYY") === moment(filtro.dataFatura).format("DD/MM/YYYY")).reduce((acum, atual) => acum + atual.VL_REAL, 0),
                VL_PREVISTO: dadosCartao.filter((filtro) =>
                    filtro.ID_CARTAO === atual.ID_CARTAO &&
                    moment(atual.dataFatura).format("DD/MM/YYYY") === moment(filtro.dataFatura).format("DD/MM/YYYY")).reduce((acum, atual) => acum + atual.VL_PREVISTO, 0),

                VL_FORECAST_NUMBER: dadosCartao.filter((filtro) =>
                    filtro.ID_CARTAO === atual.ID_CARTAO &&
                    moment(atual.dataFatura).format("DD/MM/YYYY") === moment(filtro.dataFatura).format("DD/MM/YYYY")).reduce((acum, atual) => {
                        return atual.VL_REAL ? acum + atual.VL_REAL : acum + atual.VL_PREVISTO
                    }, 0),

                ID_CARTAO: atual.ID_CARTAO,
                IDFATURA: moment(atual.dataFatura).format("DD/MM/YYYY"),
                dataFaturaAux: atual.dataFatura
            }

            vet = vet + 1
        }
        return novo
    }, [])

    const agregaDados = modelaDados.map((cartao, i) => {

        const lancamentos = dadosCartao.filter((filterLancamento) =>
            filterLancamento.ID_CARTAO === cartao.ID_CARTAO &&
            moment(filterLancamento.dataFatura).format("DD/MM/YYYY") === cartao.IDFATURA)

        cartao.children = lancamentos.map((trataData) => {
            return {
                ...trataData,
                DT_REAL: trataData.DT_CREDITO ?
                    moment(trataData.DT_CREDITO).format("DD/MM/YYYY") :
                    trataData.DT_REAL ? moment(trataData.DT_REAL).format("DD/MM/YYYY") : undefined,

                DT_PREVISTO: trataData.DT_PREVISTO ?
                    moment(trataData.DT_PREVISTO).format("DD/MM/YYYY") : undefined,

                VL_REAL: trataData.VL_REAL ?
                    trataData.VL_REAL.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : undefined,

                VL_REAL_NUMBER: trataData.VL_REAL ?
                    trataData.VL_REAL : 0,

                VL_PREVISTO: trataData.VL_PREVISTO ?
                    trataData.VL_PREVISTO.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : undefined,

                VL_PREVISTO_NUMBER: trataData.VL_PREVISTO ?
                    trataData.VL_PREVISTO : 0,

                VL_FORECAST_NUMBER: trataData.VL_REAL ? trataData.VL_REAL : trataData.VL_PREVISTO,

                ROLID: Math.random().toString(10).substr(3, 5)
            }
        })
        return cartao
    })

    return agregaDados;
}

function cartaoPrevisto(despesas, listagemCartao, visao) {
    let rs =
        visao.length > 0 ?
            despesas.filter((filtroCartao) =>
                filtroCartao.STATUS === 'Fatura Pronta Para Pagamento' ||
                filtroCartao.STATUS === 'Fatura Pendente').reduce((acum, dataCartao, i) => {
                    const modelaData = dataCartao.DT_REAL ?
                        moment(dataCartao.DT_REAL) :
                        moment(dataCartao.DT_PREVISTO)

                    const MM = modelaData.get("month")

                    const YY = modelaData.get("year")

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

                    if (diaVencimento[0] < diaCompra[0])
                        dataVencimento.add(1, 'month')

                    const dataProxVencimento = moment()
                    dataProxVencimento.set("date", diaVencimento[0])
                    dataProxVencimento.set("month", MM)
                    dataProxVencimento.set("year", YY)
                    dataProxVencimento.add(1, 'months')

                    if (diaVencimento[0] < diaCompra[0])
                        dataProxVencimento.add(1, 'month')

                    const dataCompra = dataCartao.DT_REAL ? moment(dataCartao.DT_REAL) : moment(dataCartao.DT_PREVISTO)

                    const dataFatura = moment(dataCompra).format("YYYY-MM-DD") >=
                        moment(dataMelhorCompra).format("YYYY-MM-DD") ? dataProxVencimento : dataVencimento

                    let novoArray = acum
                    listagemCartao.filter((listCartao) =>
                        dataCartao.ID_CARTAO === listCartao.ID).map((listCartao) =>
                            novoArray[i] = { ...dataCartao, ...listCartao, dataMelhorCompra, dataVencimento, dataProxVencimento, dataFatura }
                        )

                    return novoArray
                }, [])
            : [];
    console.log(rs)
    rs = rs.length > 0 ? filtroData(rs, 'cartaoPrevisto', visao[0].DT_INICIO, visao[0].DT_FIM) : rs

    return IdentificaCartao(rs)
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


export { cartaoRealizado, cartaoPrevisto, realizadas, previstas, GeraDespesas }