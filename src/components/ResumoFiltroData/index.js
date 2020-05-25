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
export { filtroData }