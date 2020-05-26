import moment from 'moment';
import { filtroData } from '../ResumoFiltroData'

function GeraTransferencias(transf_recebida, visaoSetada) {

    const transf = transferencias(transf_recebida, visaoSetada);


    const listGeradaTransf = [...transf].map((geraId) => {
        return {
            ...geraId,

            DATA_TRANSFERENCIA: geraId.DATA_TRANSFERENCIA ?
                moment(geraId.DATA_TRANSFERENCIA).format("DD/MM/YYYY") : undefined,

            VALOR: geraId.VALOR ?
                geraId.VALOR.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }) : undefined,

            ROLID: Math.random().toString(10).substr(3, 5)
        }
    })

    return listGeradaTransf
}


function transferencias(transf_recebida, visao) {
    const rs =
        visao.length > 0 ?
            filtroData(transf_recebida.filter((filtroRealizadas) =>
                filtroRealizadas.STATUS === 'ATIVO'), 'transferencias', visao[0].DT_INICIO, visao[0].DT_FIM)
            : []
    return rs
}



export { transferencias, GeraTransferencias }