import moment from 'moment';
let vet = 0;
const SaldoConta = (listaArray, tipo, dataLimite) => {
    return groupByConta(listaArray.filter((dados) =>
        (dados.STATUS === 'Pagamento Realizado' ||
            dados.STATUS === 'Fatura Paga') &&
        moment(dados.DT_REAL) <= moment(dataLimite)).reduce((acum, atual, i) => {
            let objeto = acum
            objeto[i] = {
                Conta: atual.DESCR_CONTA,
                Categoria: atual.DESCR_CATEGORIA,
                Valor: atual.VL_REAL,
                Status: atual.STATUS,
                Data: atual.DT_REAL
            }
            return objeto
        }, []), tipo)
}

function groupByConta(ArrayConta, tipo) {
    vet = 0;
    return ArrayConta.reduce((acum, gaveta, i, dados) => {
        let novoArray = acum
        if (novoArray.filter((ary) => ary.Conta === gaveta.Conta).length === 0) {
            const Conta = gaveta.Conta
            const Saldo = dados.filter((ary) =>
                ary.Conta === gaveta.Conta).reduce((acum, valores) => acum + valores.Valor, 0)
            novoArray[vet] = { Conta: Conta, Valor: tipo === 'Despesa' ? Saldo * (-1) : Saldo }
            vet = vet + 1
        }
        return novoArray
    }, []);
}

export { SaldoConta, groupByConta }