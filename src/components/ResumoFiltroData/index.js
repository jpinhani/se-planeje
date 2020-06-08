import moment from 'moment';

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
                // console.log('filtroData.dataFatura', filtroData.dataFatura)
                rs = moment(filtroData.dataFatura) >= moment(dtInicio) &&
                    moment(filtroData.dataFatura) <= moment(dtFim)
                break;
            case 'cartaoPrevisto':
                // console.log('filtroData.dataFatura', filtroData.dataFatura)
                rs = moment(filtroData.dataFatura).format("YYYY-MM-DD") >= moment(dtInicio).format("YYYY-MM-DD") &&
                    moment(filtroData.dataFatura).format("YYYY-MM-DD") <= moment(dtFim).format("YYYY-MM-DD")
                break;
            case 'transferencias':
                rs = filtroData.DATA_TRANSFERENCIA >= dtInicio &&
                    filtroData.DATA_TRANSFERENCIA <= dtFim
                break;

            default:
                break;
        }
        return rs
    })
    return filtro
}
export { filtroData }