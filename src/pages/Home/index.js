import React, { useEffect, useCallback, useState, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { GetRequest } from '../../components/crudSendAxios/crud';
import { gera_cor } from '../../components/GeraCor'
import Chart from "chart.js";
import { Switch } from 'antd';
import moment from 'moment';
import PagarDespesa from '../../components/Modal/DespesaPagar'
import './styles.scss'


let vet = 0;

export default () => {

    // const dispatch = useDispatch();
    // const next = useSelector(state => state.home)
    const [contaSaldoAtual, setContaSaldoAtual] = useState([]);
    const [lastLanc, setLastLanc] = useState([]);
    const [nextLanc, setNextLanc] = useState([]);
    const [itens, setItens] = useState(false)

    const chartContainer = useRef(null);
    const chartContainer1 = useRef(null);
    const [grafico, setGrafico] = useState(null);

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
        return groupByConta(listaArray.filter((dados) =>
            dados.STATUS === 'Pagamento Realizado' ||
            dados.STATUS === 'Fatura Paga').reduce((acum, atual, i) => {
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

    function UltimosLancamentos(dados) {
        return dados.filter((dados, i) => {
            const data = new Date(dados.DT_REAL);
            const dataAtual = new Date();

            let timeDiff = Math.abs(data.getTime() - dataAtual.getTime());
            let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            return diffDays <= 5
        })
    }

    function ProximosLancamentos(dados) {
        return dados.filter((dados, i) => {
            const data = new Date(dados.DT_PREVISTO);
            const dataAtual = new Date();

            let timeDiff = data.getTime() - dataAtual.getTime()
            let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            return diffDays <= 5
        })
    }

    const SaldoCategoria = useCallback((listaArray) => {
        return groupByCategoria(listaArray.reduce((acum, atual, i) => {
            let objeto = acum
            objeto[i] = {
                Conta: atual.DESCR_CONTA,
                Categoria: atual.DESCR_CATEGORIA,
                Valor: atual.VL_REAL,
                Status: atual.STATUS,
                Data: atual.DT_REAL
            }
            return objeto
        }, []).filter((dados) =>
            dados.Status === 'Pagamento Realizado' ||
            dados.Status === 'Fatura Paga' ||
            dados.Status === 'Fatura Pronta Para Pagamento'))
    }, [])

    function groupByCategoria(ArrayCategoria) {
        vet = 0;
        return ArrayCategoria.reduce((acum, gaveta, i, dados) => {
            let novoArray = acum
            if (novoArray.filter((ary) => ary.Categoria === gaveta.Categoria).length === 0) {
                const Categoria = gaveta.Categoria
                const Saldo = dados.filter((ary) =>
                    ary.Categoria === gaveta.Categoria).reduce((acum, valores) => acum + valores.Valor, 0)
                novoArray[vet] = { Categoria: Categoria, Valor: Saldo }
                vet = vet + 1
            }
            return novoArray
        }, []);
    }


    const ChartConfig = useCallback((dadosGrafico) => {
        const valorTotal = dadosGrafico.reduce((acum, atual) => acum + atual.Valor, 0)
        const dataGrafico = dadosGrafico.map((valor) => {
            const rs = Math.round(valor.Valor / valorTotal * 100)
            return rs
        })
        const corGrafico = dadosGrafico.map((valor) => gera_cor())
        const labelsGrafico = dadosGrafico.map((valor) => valor.Categoria)
        const rs = {
            type: 'doughnut',
            data: {
                datasets: [{
                    barPercentage: 0.5,
                    data: dataGrafico,
                    backgroundColor: corGrafico,
                    borderColor: corGrafico,
                    borderWidth: 1,
                    label: ['Categorias'],
                }],
                labels: labelsGrafico
            }
        }
        return rs
    }, [])

    const ChartConfig1 = useCallback((dadosGrafico) => {
        // const valorTotal = dadosGrafico.reduce((acum, atual) => acum + atual.Valor, 0)
        console.log(dadosGrafico)
        const dataGrafico = dadosGrafico.map((valor) => valor.Valor)
        const corGrafico = dadosGrafico.map((valor) => gera_cor())
        const labelsGrafico = dadosGrafico.map((valor) => valor.Conta)
        const rs = {
            type: 'bar',
            data: {
                datasets: [{
                    barPercentage: 0.3,
                    data: dataGrafico,
                    backgroundColor: corGrafico,
                    borderColor: corGrafico,
                    borderWidth: 1,
                    label: ['Categorias'],
                }],
                labels: labelsGrafico
            }
        }
        return rs
    }, [])

    const requestApi = useCallback(async () => {
        const despesas = await GetRequest('api/chartDespesa');
        const receitas = await GetRequest('api/chartReceita');
        const transferencias = await GetRequest('api/transferencia');

        /* Saldo Atual das Contas */
        const SaldoDespesa = SaldoConta(despesas, 'Despesa');
        const SaldoReceita = SaldoConta(receitas, 'Receita');
        const SaldoTransfCredito = SaldoTransferencia(transferencias, 'Receita');
        const SaldoTransfDebito = SaldoTransferencia(transferencias, 'Despesa');

        const SaldoFinal = groupByConta([...SaldoDespesa,
        ...SaldoTransfDebito,
        ...SaldoReceita,
        ...SaldoTransfCredito], 'Outro').map((novo, i) => {
            return <li key={i} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
            }}>
                <div style={{ padding: '2px' }}>
                    <strong style={{ fontSize: '14px', fontWeight: 'bold' }}>Conta</strong>
                    <p style={{ fontSize: '14px' }}>{novo.Conta}</p>
                </div>
                <div style={{ padding: '2px', borderBottom: '2px' }}>
                    <strong style={{ fontSize: '14px', fontWeight: 'bold' }}>Saldo</strong>
                    <p style={{ fontSize: '14px' }}>{novo.Valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
            </li >
        });

        setContaSaldoAtual(SaldoFinal);

        /* Ultimos lançamentos com base nos ultimos 5 dias */
        const ultimasLançamentosDespesa = UltimosLancamentos(despesas).filter((filtro) =>
            filtro.STATUS === 'Pagamento Realizado' ||
            filtro.STATUS === 'Fatura Pronta Para Pagamento' ||
            filtro.STATUS === 'Fatura Paga'
        ).map((data) => {
            return {
                Descricao: data.DESCR_DESPESA,
                Categoria: data.DESCR_CATEGORIA,
                Valor: data.VL_REAL * (-1),
                Data: data.STATUS === 'Fatua Paga' ? data.DT_CREDITO : data.DT_REAL,
                Tipo: 'Despesa'
            }
        })

        const ultimasLançamentosReceita = UltimosLancamentos(receitas).filter((filtro) =>
            filtro.STATUS === 'Pagamento Realizado'
        ).map((data) => {
            return {
                Descricao: data.DESCR_RECEITA,
                Categoria: data.DESCR_CATEGORIA,
                Valor: data.VL_REAL * (1),
                Data: data.DT_REAL,
                Tipo: 'Receita'
            }
        })


        const LastLancamentos = [...ultimasLançamentosDespesa, ...ultimasLançamentosReceita].map((novo, i) =>
            <li key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div>
                    <strong style={{ fontSize: '12px' }}>Categoria</strong>
                    <p style={{ fontSize: '12px' }}>{novo.Categoria}</p>
                </div>
                <div>
                    <strong style={{ fontSize: '12px' }}>Data</strong>
                    <p style={{ fontSize: '12px' }}>{moment(novo.Data).format("DD/MM/YYYY")}</p>
                </div>
                <div>
                    <strong style={{ fontSize: '12px' }}>Valor</strong>
                    <p style={{ fontSize: '12px' }}>{novo.Valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
            </li>);

        setLastLanc(LastLancamentos);

        const proximosLancamentosDespesa = ProximosLancamentos(despesas).filter((filtro) =>
            filtro.STATUS === 'Esperando Pagamento' ||
            filtro.STATUS === 'Fatura Pendente'
        ).map((data) => {
            return {
                /* Campos Modal Pagar*/
                ID: data.ID,
                ID_CARTAO: data.ID_CARTAO,
                ID_CATEGORIA: data.ID_CATEGORIA,
                VL_PREVISTO2: data.VL_PREVISTO,
                DATANOVA: moment(data.DT_PREVISTO).format("DD/MM/YYYY"),
                NUM_PARCELA: data.NUM_PARCELA,
                DESCR_DESPESA: data.DESCR_DESPESA,
                ID_GRUPO: data.ID_GRUPO,
                /* Campos Home*/
                Descricao: data.DESCR_DESPESA,
                Categoria: data.DESCR_CATEGORIA,
                Valor: data.VL_PREVISTO * (-1),
                Data: data.DT_PREVISTO,
                Tipo: 'Despesa'
            }
        })

        const proximosLancamentosReceita = ProximosLancamentos(receitas).filter((filtro) =>
            filtro.STATUS === 'Esperando Pagamento'
        ).map((data) => {
            return {
                Descricao: data.DESCR_RECEITA,
                Categoria: data.DESCR_CATEGORIA,
                Valor: data.VL_PREVISTO * (1),
                Data: data.DT_PREVISTO,
                Tipo: 'Receita'
            }
        })

        const NextLancamentos = [...proximosLancamentosDespesa, ...proximosLancamentosReceita].map((novo, i) =>
            <li key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <div style={{ width: '50%' }}>
                    <strong style={{ fontSize: '12px' }}>Categoria</strong>
                    <p style={{ fontSize: '12px' }}>{novo.Categoria}</p>
                </div>
                <div>
                    <strong style={{ fontSize: '12px' }}>Data</strong>
                    <p style={{ fontSize: '12px' }}>{moment(novo.Data).format("DD/MM/YYYY")}</p>
                </div>
                <div>
                    <strong style={{ fontSize: '12px' }}>Valor</strong>
                    <p style={{ fontSize: '12px' }}>{novo.Valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '5%'
                }}>
                    <PagarDespesa data={novo} />
                </div>
            </li>);

        setNextLanc(NextLancamentos);
        // dispatch({
        //     type: 'LIST_HOME',
        //     payload: NextLancamentos
        // })

        const dadosGrafico = SaldoCategoria(despesas)

        if (chartContainer && chartContainer.current) {
            const newChartInstance = new Chart(chartContainer.current, ChartConfig(dadosGrafico));
            setGrafico(newChartInstance)
        }

        const dadosGraficoConta = groupByConta([...SaldoDespesa,
        ...SaldoTransfDebito,
        ...SaldoReceita,
        ...SaldoTransfCredito])

        if (chartContainer1 && chartContainer1.current) {
            const newChartInstance = new Chart(chartContainer1.current, ChartConfig1(dadosGraficoConta));
            setGrafico(newChartInstance)
        }



    }, [SaldoConta, SaldoTransferencia, chartContainer, SaldoCategoria, ChartConfig, ChartConfig1])

    useEffect(() => {
        requestApi()
    }, [requestApi])

    return (

        <div className='homeLayout'>
            <ul>
                <div style={{ width: '92%', display: 'flex', flexDirection: 'col', justifyContent: 'space-between' }}>
                    <div style={{ width: '100%' }}>
                        <h1>Saldo Atual</h1>
                        {contaSaldoAtual}
                        <br />
                        <canvas
                            style={{ paddingTop: '15px' }}
                            id={grafico}
                            ref={chartContainer1}
                        />
                    </div>
                </div>
                <div style={{ width: '92%', display: 'flex', flexDirection: 'col', justifyContent: 'space-between' }}>
                    <div style={{ width: '100%' }}>
                        <h1> <Switch
                            style={{ marginRight: '15px' }}
                            checked={itens}
                            onChange={(valor) => valor === true ?
                                setItens(true) : setItens(false)} />
                            {itens === true ? '  Ultimos Realizados' : '  Metas Próximas'}
                        </h1>
                        {itens === true ? lastLanc : nextLanc}
                        <br />
                        <h1>Comportamento de Gastos</h1>
                        <canvas
                            style={{ paddingTop: '15px' }}
                            id={grafico}
                            ref={chartContainer}
                        />
                    </div>
                </div>
            </ul>
        </div>

    )
}

