import moment from 'moment';
let vet = 0;
const SaldoConta = (listaArray, tipo, dataLimite) => {
    return groupByConta(listaArray.filter((dados) =>
        (dados.STATUS === 'Pagamento Realizado' ||
            dados.STATUS === 'Fatura Paga') &&
        moment(dados.DT_REAL).format("YYYY-MM-DD") <= moment(dataLimite).format("YYYY-MM-DD")).reduce((acum, atual, i) => {
            let objeto = acum
            objeto[i] = {
                idConta: atual.ID_CONTA,
                Conta: atual.DESCR_CONTA,
                Categoria: atual.DESCR_CATEGORIA,
                Valor: atual.VL_REAL,
                Status: atual.STATUS,
                Data: atual.DT_REAL
            }
            return objeto
        }, []), tipo)
}


function SaldoInicial(conta, data) {
    return conta.filter(filtro =>
        moment(filtro.DTSALDO).format("YYYY-MM-DD") >= moment(data[0].DT_INICIO).format("YYYY-MM-DD") &&
        moment(filtro.DTSALDO).format("YYYY-MM-DD") <= moment(data[0].DT_FIM).format("YYYY-MM-DD")).map((dados) =>
            [{ idConta: dados.ID, Conta: dados.DESCR_CONTA, Valor: dados.SALDO }][0])
}


function groupByConta(ArrayConta, tipo) {
    vet = 0;
    return ArrayConta.reduce((acum, gaveta, i, dados) => {
        let novoArray = acum
        if (novoArray.filter((ary) => ary.idConta === gaveta.idConta).length === 0) {
            const idConta = gaveta.idConta
            const Conta = gaveta.Conta
            const Saldo = dados.filter((ary) =>
                ary.idConta === gaveta.idConta).reduce((acum, valores) => acum + valores.Valor, 0)
            novoArray[vet] = { idConta: idConta, Conta: Conta, Valor: tipo === 'Despesa' ? Saldo * (-1) : Saldo }
            vet = vet + 1
        }
        return novoArray
    }, []);
}

export { SaldoConta, groupByConta, SaldoInicial }