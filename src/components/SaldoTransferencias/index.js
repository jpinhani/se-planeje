import moment from 'moment';
import { groupByConta } from '../SaldoConta';

const SaldoTransferencia = (listaArray, tipo, dataLimite) => {
    return groupByConta(listaArray.filter((filtro) =>
        moment(filtro.DATA_TRANSFERENCIA) <= moment(dataLimite)).reduce((acum, atual, i) => {
            let objeto = acum
            objeto[i] = {
                idConta: tipo === 'Receita' ? atual.ID_CONTACREDITO : atual.ID_CONTADEBITO,
                Conta: tipo === 'Receita' ? atual.CONTA_CREDITO : atual.CONTA_DEBITO,
                Valor: atual.VALOR
            }
            return objeto
        }, []), tipo)
}

export { SaldoTransferencia }