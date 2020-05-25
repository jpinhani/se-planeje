import React, { useEffect, useCallback, useState, useRef } from 'react';
import Chart from "chart.js";
// import { useDispatch, useSelector } from 'react-redux';
import { GetRequest } from '../../components/crudSendAxios/crud';
import { SaldoConta, groupByConta } from '../../components/SaldoConta';
import { SaldoCategoria } from '../../components/SaldoCategoria';

import { proximosLancamentosDespesa, proximosLancamentosReceita } from '../../components/ProximosLancamentos';

import { ultimasLançamentosDespesa, ultimasLançamentosReceita } from '../../components/UltimosLancamentos';
import { SaldoTransferencia } from '../../components/SaldoTransferencias';
import { gera_cor } from '../../components/GeraCor'

import { Switch } from 'antd';
import moment from 'moment';
import PagarDespesa from '../../components/Modal/DespesaPagar'
import PagarReceita from '../../components/Modal/ReceitaMeta'

import './styles.scss'


export default () => {

    const [contaSaldoAtual, setContaSaldoAtual] = useState([]);
    const [lastLanc, setLastLanc] = useState([]);
    const [nextLanc, setNextLanc] = useState([]);
    const [itens, setItens] = useState(false)

    const chartContainer = useRef(null);
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

    const requestApi = useCallback(async () => {
        const despesas = await GetRequest('api/chartDespesa');
        const receitas = await GetRequest('api/chartReceita');
        const transferencias = await GetRequest('api/transferencia');

        /* Saldo Atual das Contas */
        const SaldoDespesa = SaldoConta(despesas, 'Despesa');
        const SaldoReceita = SaldoConta(receitas, 'Receita');
        const SaldoTransfCredito = SaldoTransferencia(transferencias, 'Receita');
        const SaldoTransfDebito = SaldoTransferencia(transferencias, 'Despesa');
        const SaldoFinal = groupByConta([...SaldoDespesa, ...SaldoTransfDebito, ...SaldoReceita, ...SaldoTransfCredito], 'Outro')
        setContaSaldoAtual(SaldoFinal);

        /* Ultimos lançamentos com base nos ultimos 5 dias */
        const lastDespesa = ultimasLançamentosDespesa(despesas)
        const lastReceita = ultimasLançamentosReceita(receitas)
        const LastLancamentos = [...lastDespesa, ...lastReceita]
        setLastLanc(LastLancamentos);

        /* Proximos lançamentos com base nos ultimos 5 dias */
        const nextDespesa = proximosLancamentosDespesa(despesas)
        const nextReceita = proximosLancamentosReceita(receitas)
        const NextLancamentos = [...nextDespesa, ...nextReceita]
        setNextLanc(NextLancamentos);

        const dadosGrafico = SaldoCategoria(despesas)

        if (chartContainer && chartContainer.current) {
            const newChartInstance = new Chart(chartContainer.current, ChartConfig(dadosGrafico));
            setGrafico(newChartInstance)
        }

        if (chartContainer1 && chartContainer1.current) {
            const newChartInstance = new Chart(chartContainer1.current, ChartConfig1(SaldoFinal));
            setGrafico(newChartInstance)
        }
    }, [chartContainer, ChartConfig, ChartConfig1])

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
                                    {itens === true ? '  Ultimos Realizados' : '  Metas Próximas'}
                                </h1>
                            </center>
                            <div className='containerDivDataCategoria'>
                                {itens === true ? lastLanc.map((novo, i) =>
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
                                        <div className='resultCategoria'>
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
                                            <div>
                                                {novo.Tipo === 'Despesa' ?
                                                    < PagarDespesa back={back.bind(this)} data={novo} /> :
                                                    < PagarReceita back={back.bind(this)} data={novo} />}
                                            </div>
                                        </li>)}
                            </div>
                        </div>
                    </div>

                    <div className='containerDiv1'>
                        <center> <h1 title='Exibe o valor % Realizado conforme utiliação do sistema'>Comportamento de Gastos</h1></center>
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

