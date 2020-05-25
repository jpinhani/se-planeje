import { groupByConta } from '../SaldoConta';

const SaldoTransferencia = (listaArray, tipo) => {
    return groupByConta(listaArray.reduce((acum, atual, i) => {
        let objeto = acum
        objeto[i] = {
            Conta: tipo === 'Receita' ? atual.CONTA_CREDITO : atual.CONTA_DEBITO,
            Valor: atual.VALOR
        }
        return objeto
    }, []), tipo)
}

export { SaldoTransferencia }