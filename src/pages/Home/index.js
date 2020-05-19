import React, { useEffect, useCallback } from 'react';
import { GetRequest } from '../../components/crudSendAxios/crud';
// import { Input } from 'antd';
let vet = 0;
export default () => {

    const SaldoTransferencia = useCallback((listaArray, tipo) => {
        return groupByConta(listaArray.reduce((acum, atual, i) => {
            let objeto = acum
            objeto[i] = {
                Conta: tipo === 'Receita' ? atual.CONTA_CREDITO : atual.CONTA_DEBITO,
                Valor: atual.VALOR
            }
            return objeto
        }, []), tipo)
    }, [])

    const SaldoConta = useCallback((listaArray, tipo) => {
        return groupByConta(listaArray.reduce((acum, atual, i) => {
            let objeto = acum
            objeto[i] = { Conta: atual.DESCR_CONTA, Valor: atual.VL_REAL2, Status: atual.STATUS }
            return objeto
        }, []).filter((dados) =>
            dados.Status === 'Pagamento Realizado'), tipo)
    }, [])

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


    const requestApi = useCallback(async () => {
        const despesas = await GetRequest('api/despesas/paga');
        const receitas = await GetRequest('api/receitas/paga');
        const transferencias = await GetRequest('api/transferencia');

        const SaldoDespesa = SaldoConta(despesas, 'Despesa')
        const SaldoReceita = SaldoConta(receitas, 'Receita')
        const SaldoTransfCredito = SaldoTransferencia(transferencias, 'Receita')
        const SaldoTransfDebito = SaldoTransferencia(transferencias, 'Despesa')
        const SaldoFinal = groupByConta([...SaldoDespesa,
        ...SaldoTransfDebito,
        ...SaldoReceita,
        ...SaldoTransfCredito], 'Outro')

        console.log('Despesa', SaldoDespesa)
        console.log('Receita', SaldoReceita)
        console.log('SaldoTransfCredito', SaldoTransfCredito)
        console.log('SaldoTransfDebito', SaldoTransfDebito)
        console.log('Resultado', SaldoFinal)

        console.log('transferencias', transferencias)

    }, [SaldoConta, SaldoTransferencia])

    useEffect(() => {
        requestApi()
    }, [requestApi])

    return (
        <div>
            <div>Ultimas Despesas</div>
            <div>Ultimas Receitas</div>
            <div> Saldo Atual
             <li>
                    <ul>teste 1</ul>
                    <ul>teste 2</ul>
                </li>
            </div>
        </div>
    )
}

