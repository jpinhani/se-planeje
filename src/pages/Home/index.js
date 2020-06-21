import React, { useEffect, useCallback, useState, useRef } from 'react';
import Chart from "chart.js";
import { GetRequest } from '../../components/crudSendAxios/crud';
import { SaldoConta, groupByConta, SaldoInicial } from '../../components/SaldoConta';
import { SaldoCategoria, hierarquia } from '../../components/SaldoCategoria';

import { proximosLancamentosDespesa, proximosLancamentosReceita } from '../../components/ProximosLancamentos';

import { ultimasLançamentosDespesa, ultimasLançamentosReceita } from '../../components/UltimosLancamentos';
import { SaldoTransferencia } from '../../components/SaldoTransferencias';
import { gera_cor } from '../../components/GeraCor'

import { Switch } from 'antd';
import moment from 'moment';
import PagarDespesa from '../../components/Modal/DespesaPagar'
import PagarReceita from '../../components/Modal/ReceitaMeta'

import './styles.scss'

let newChartInstance = null;
let newChartInstance2 = null;
export default () => {

    const [contaSaldoAtual, setContaSaldoAtual] = useState([]);
    const [lastLanc, setLastLanc] = useState([]);
    const [nextLanc, setNextLanc] = useState([]);
    const [itens, setItens] = useState(false)

    const chartContainer = useRef(null);
    const [categorias, setCategoria] = useState([]);
    const [conta, setConta] = useState([]);
    const chartContainer1 = useRef(null);
    const [grafico, setGrafico] = useState(null);


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
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,

                animation: {
                    duration: 0 // general animation time
                },
                hover: {
                    animationDuration: 0 // duration of animations when hovering an item
                },
                responsiveAnimationDuration: 0 // animation duration after a resize
            }
        }
        return rs
    }, [])

    const ChartConfig1 = useCallback((dadosGrafico) => {

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
                    label: ['SALDO EM CONTAS'],
                }],
                labels: labelsGrafico
            }, options: {
                responsive: true,
                maintainAspectRatio: false,

                animation: {
                    duration: 0 // general animation time
                },
                hover: {
                    animationDuration: 0 // duration of animations when hovering an item
                },
                responsiveAnimationDuration: 0 // animation duration after a resize
            }
        }
        return rs
    }, [])

    const novosDados = useCallback(async () => {
        const cat = await GetRequest('api/categorias')
        setCategoria(cat);
    }, [])


    useEffect(() => {
        novosDados()
    }, [novosDados])

    const getcartao = useCallback(async () => await GetRequest('api/cartoes'), [])

    const getConta = useCallback(async () => {
        const acount = await GetRequest('api/contas')
        setConta(acount);
    }, [])


    useEffect(() => {
        getConta()
    }, [getConta])



    const requestApi = useCallback(async () => {
        const despesas = await GetRequest('api/chartDespesa');
        const receitas = await GetRequest('api/chartReceita');
        const transferencias = await GetRequest('api/transferencia');
        const cartao = await getcartao();

        // yy + '-' + mm + '-' + dd + 'T03:00:00.000Z'
        const visaoData = [{
            DT_INICIO: '2000-05-01T03:00:00.000Z',
            DT_FIM: moment(new Date())
        }]

        const dados1 = SaldoCategoria(despesas, visaoData, 'REAL', cartao, categorias);
        const nivel3 = categorias.filter(filtro => filtro.NIVEL === 3 &&
            filtro.ENTRADA === 1).map((data) => {
                return { ...data, Categoria: data.DESCR_CATEGORIA }
            })

        const nivel4 = categorias.filter(filtro => filtro.NIVEL === 4 &&
            filtro.ENTRADA === 1).map((data) => {
                return { ...data, Categoria: data.DESCR_CATEGORIA }
            })

        const nivel5 = categorias.filter(filtro => filtro.NIVEL === 5 &&
            filtro.ENTRADA === 1).map((data) => {
                return { ...data, Categoria: data.DESCR_CATEGORIA }
            })
        const dadosGrafico = hierarquia(dados1, nivel3, nivel4, nivel5)

        /* Saldo Atual das Contas */
        const SaldoDespesa = SaldoConta(despesas, 'Despesa', moment());
        const SaldoReceita = SaldoConta(receitas, 'Receita', moment());
        const SaldoTransfCredito = SaldoTransferencia(transferencias, 'Receita', moment());
        const SaldoTransfDebito = SaldoTransferencia(transferencias, 'Despesa', moment());
        const SaldoInicialConta = SaldoInicial(conta, visaoData);
        console.log(SaldoInicialConta)

        const SaldoFinal = groupByConta([...SaldoDespesa, ...SaldoTransfDebito, ...SaldoReceita, ...SaldoTransfCredito, ...SaldoInicialConta], 'Outro')
        setContaSaldoAtual(SaldoFinal);

        /* Ultimos lançamentos com base nos ultimos 5 dias */
        const lastDespesa = ultimasLançamentosDespesa(despesas)
        const lastReceita = ultimasLançamentosReceita(receitas)
        const LastLancamentos = [...lastDespesa, ...lastReceita]
        setLastLanc(LastLancamentos);

        /* Proximos lançamentos com base nos Proximos 5 dias */
        const nextDespesa = proximosLancamentosDespesa(despesas)
        const nextReceita = proximosLancamentosReceita(receitas)
        const NextLancamentos = [...nextDespesa, ...nextReceita]
        setNextLanc(NextLancamentos);

        // const dadosGrafico = SaldoCategoria(despesas)
        if (chartContainer && chartContainer.current) {
            if (newChartInstance) newChartInstance.destroy()
            newChartInstance = new Chart(chartContainer.current, ChartConfig(dadosGrafico));
            setGrafico(newChartInstance)
        }

        if (chartContainer1 && chartContainer1.current) {
            if (newChartInstance2) newChartInstance2.destroy()
            newChartInstance2 = new Chart(chartContainer1.current, ChartConfig1(SaldoFinal));
            setGrafico(newChartInstance2)
        }
    }, [chartContainer, ChartConfig, ChartConfig1, getcartao, categorias, conta])

    useEffect(() => {
        requestApi()
    }, [requestApi])

    const back = valor => {
        if (valor) {
            requestApi();
        }
    }

    return (
        <div className='homeLayout'>
            <div>
                <ul className='homeLayoutFlex'>

                    <div className='containerDiv1'>
                        <div className='containerDivData'>
                            <center><h1>Saldo Atual</h1></center>
                            <div className='containerDivDataTab'>
                                {contaSaldoAtual.map((novo, i) => {
                                    return <li key={i}>
                                        <div>
                                            <strong>Conta: </strong>
                                            <p>{novo.Conta}</p>
                                        </div>
                                        <div>
                                            <strong>Saldo: </strong>
                                            <p>{novo.Valor.toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            })}</p>
                                        </div>
                                    </li >
                                })}
                            </div>
                        </div>
                    </div>

                    <div className='containerDiv1'>
                        <div>
                            <canvas
                                id={grafico}
                                ref={chartContainer1}
                            />
                        </div>
                    </div>

                    <div className='containerDiv1'>
                        <div className='containerDivData'>
                            <center>
                                <h1> <Switch
                                    checked={itens}
                                    onChange={(valor) => valor === true ?
                                        setItens(true) : setItens(false)} />
                                    {itens === true ? '  Realizados (5 ultimos Dias)' : '  Metas (Próximos 5 dias)'}
                                </h1>
                            </center>
                            <div className='containerDivDataCategoria'>
                                {itens === true ? lastLanc.sort(function (a, b) {
                                    if (a.Data > b.Data) return -1;
                                    if (a.Data < b.Data) return 1;
                                    return 0;
                                }).map((novo, i) =>
                                    <li key={i}>
                                        <div className='resultData'>
                                            <strong>Data</strong>
                                            <p>{moment(novo.Data).format("DD/MM/YYYY")}</p>
                                        </div>
                                        <div className='resultValor'>
                                            <strong>Valor</strong>
                                            <p>{novo.Valor.toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            })}</p>
                                        </div>
                                        <div>
                                            <strong>Categoria</strong>
                                            <p>{novo.Categoria}</p>
                                        </div>
                                    </li>) : nextLanc.map((novo, i) =>
                                        <li key={i}>
                                            <div>
                                                <strong>Data</strong>
                                                <p>{moment(novo.Data).format("DD/MM/YYYY")}</p>
                                            </div>
                                            <div>
                                                <strong>Valor</strong>
                                                <p >{novo.Valor.toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                })}</p>
                                            </div>
                                            <div>
                                                <strong>Categoria</strong>
                                                <p>
                                                    {novo.Categoria}
                                                </p>
                                            </div>

                                            {novo.Tipo === 'Despesa' ?
                                                <PagarDespesa back={back.bind(this)} data={novo} /> :
                                                <PagarReceita back={back.bind(this)} data={novo} />}
                                        </li>)}
                            </div>
                        </div>
                    </div>

                    <div className='containerDiv1'>
                        <center> <h1 title='Exibe o valor % Realizado conforme utiliação do sistema'>% Comportamento de Gastos</h1></center>
                        <div>
                            <canvas
                                id={grafico}
                                ref={chartContainer}
                            />
                        </div>
                    </div>
                </ul>
            </div >
        </div >
    )
}

