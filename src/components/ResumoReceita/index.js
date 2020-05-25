import moment from 'moment';
import { filtroData } from '../ResumoFiltroData'

function GeraReceitas(receitas, visaoSetada, itens) {

    const real = realizadas(receitas, visaoSetada);
    const prev = previstas(receitas, visaoSetada);

    const listGeradaReal = [...real].map((geraId) => {
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

            VL_PREVISTO: geraId.VL_PREVISTO ?
                geraId.VL_PREVISTO.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }) : undefined,

            ROLID: Math.random().toString(10).substr(3, 5)
        }
    })

    const listGeradaPrev = [...prev].map((geraId) => {
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

            VL_PREVISTO: geraId.VL_PREVISTO ?
                geraId.VL_PREVISTO.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }) : undefined,

            ROLID: Math.random().toString(10).substr(3, 5)
        }
    })

    return itens === true ? listGeradaReal : listGeradaPrev
}


function realizadas(receitas, visao) {
    const rs =
        visao.length > 0 ?
            filtroData(receitas.filter((filtroRealizadas) =>
                filtroRealizadas.STATUS === 'Pagamento Realizado'), 'realizadas', visao[0].DT_INICIO, visao[0].DT_FIM)
            : []
    return rs
}

function previstas(receitas, visao) {
    const rs =
        visao.length > 0 ?
            filtroData(receitas.filter((filtroPrevistas) =>
                filtroPrevistas.STATUS === 'Esperando Pagamento'), 'previstas', visao[0].DT_INICIO, visao[0].DT_FIM)
            : []
    return rs
}


export { realizadas, previstas, GeraReceitas }