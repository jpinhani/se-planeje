import React, { useState, useEffect, useCallback } from 'react';

import { SomarPeriodo } from '../../components/ResumoComponente';

import { GeraDespesas } from '../../components/ResumoDespesa';
import { GeraReceitas } from '../../components/ResumoReceita';

import './style.scss';

export default (props) => {

    const [contaSaldoAtual, setContaSaldoAtual] = useState([]);
    const [resumo, setResumo] = useState([]);

    const requestApi = useCallback(async () => {

        const saldoTransacoes = props.saldo;

        setContaSaldoAtual(saldoTransacoes)

    }, [props.saldo])

    useEffect(() => {
        requestApi();
    }, [requestApi])

    const ResumoSePlaneje = useCallback(async () => {

        const visaoSetada = props.visao;
        const despesas = props.despesa;
        const cartaoListagem = props.cartao;

        const despesaReal = SomarPeriodo(GeraDespesas(despesas, cartaoListagem, visaoSetada, true));
        const despesaPrevista = SomarPeriodo(GeraDespesas(despesas, cartaoListagem, visaoSetada, false));


        const ACUM_DESPESA_PREVISTA =
            (despesaPrevista.VL_PREVISTO_NUMBER ? despesaPrevista.VL_PREVISTO_NUMBER : 0) +
            (despesaReal.VL_PREVISTO_NUMBER ? despesaReal.VL_PREVISTO_NUMBER : 0)

        const ACUM_DESPESA_REAL =
            (despesaReal.VL_REAL_NUMBER ? despesaReal.VL_REAL_NUMBER : 0)

        const ACUM_DESPESA_FORECAST =
            (despesaReal.VL_FORECAST_NUMBER ? despesaReal.VL_FORECAST_NUMBER : 0) +
            (despesaPrevista.VL_FORECAST_NUMBER ? despesaPrevista.VL_FORECAST_NUMBER : 0)


        const receitas = props.receita;

        const receitaReal = SomarPeriodo(GeraReceitas(receitas, visaoSetada, true));
        const receitaPrevista = SomarPeriodo(GeraReceitas(receitas, visaoSetada, false));

        const ACUM_RECEITA_PREVISTA =
            (receitaPrevista.VL_PREVISTO_NUMBER ? receitaPrevista.VL_PREVISTO_NUMBER : 0) +
            (receitaReal.VL_PREVISTO_NUMBER ? receitaReal.VL_PREVISTO_NUMBER : 0)

        const ACUM_RECEITA_REAL =
            (receitaReal.VL_REAL_NUMBER ? receitaReal.VL_REAL_NUMBER : 0)

        const ACUM_RECEITA_FORECAST =
            (receitaReal.VL_FORECAST_NUMBER ? receitaReal.VL_FORECAST_NUMBER : 0) +
            (receitaPrevista.VL_FORECAST_NUMBER ? receitaPrevista.VL_FORECAST_NUMBER : 0)

        const ResumoFinal = {
            D_PREVISTO: ACUM_DESPESA_PREVISTA * (-1),
            D_REAL: ACUM_DESPESA_REAL * (-1),
            D_FORECAST: ACUM_DESPESA_FORECAST * (-1),
            R_PREVISTO: ACUM_RECEITA_PREVISTA,
            R_REAL: ACUM_RECEITA_REAL,
            R_FORECAST: ACUM_RECEITA_FORECAST,
            L_PREVISTO: ACUM_RECEITA_PREVISTA - ACUM_DESPESA_PREVISTA,
            L_REAL: ACUM_RECEITA_REAL - ACUM_DESPESA_REAL,
            L_FORECAST: ACUM_RECEITA_FORECAST - ACUM_DESPESA_FORECAST,
            S_DESPESA: ACUM_DESPESA_FORECAST - ACUM_DESPESA_REAL,
            S_RECEITA: ACUM_RECEITA_FORECAST - ACUM_RECEITA_REAL
        }

        setResumo(ResumoFinal)

    }, [props.visao, props.despesa, props.cartao, props.receita])


    useEffect(() => {
        ResumoSePlaneje();
    }, [ResumoSePlaneje])

    return (
        <div>
            <ul className='homeLayoutFlex'>
                <div className='containerDiv1'>
                    <div className='containerDivData'>
                        <center><h1>Saldo até:</h1></center>
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
                    <div className='containerDivData'>
                        <center><h1>Resumo SePlaneje</h1></center>
                        <div className='containerDivDataTabResumo'>
                            <div>
                                <center><h1 style={{ background: 'Salmon' }}>Despesas</h1></center>
                                <strong>Meta: </strong>
                                <li>{resumo.D_PREVISTO ?
                                    resumo.D_PREVISTO.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }) : 'R$ 0,00'}</li>
                                <strong>Realizadas:</strong>
                                <li>{resumo.D_REAL ?
                                    resumo.D_REAL.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }) : 'R$ 0,00'}</li>
                                <strong>Aguardando:</strong>
                                <li>{resumo.S_DESPESA ?
                                    resumo.S_DESPESA.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }) : 'R$ 0,00'}</li>
                            </div>
                            <div>
                                <center><h1 style={{ background: 'LightSkyBlue' }}>Receitas</h1></center>
                                <strong>Meta:</strong>
                                <li>{resumo.R_PREVISTO ?
                                    resumo.R_PREVISTO.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }) : 'R$ 0,00'}</li>
                                <strong>Realizadas:</strong>
                                <li>{resumo.R_REAL ? resumo.R_REAL.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }) : 'R$ 0,00'}</li>
                                <strong>Aguardando:</strong>
                                <li>{resumo.S_RECEITA ?
                                    resumo.S_RECEITA.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }) : 'R$ 0,00'}</li>
                            </div>
                            <div>
                                <center><h1 style={{ background: 'grey21' }}>Lucro</h1></center>
                                <strong>Meta:</strong>
                                <li>{resumo.L_PREVISTO ?
                                    resumo.L_PREVISTO.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }) : 'R$ 0,00'}</li>
                                <strong>Real:</strong>
                                <li>{resumo.L_REAL ?
                                    resumo.L_REAL.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }) : 'R$ 0,00'}</li>
                                <strong>Forecast:</strong>
                                <li>{resumo.L_FORECAST ?
                                    resumo.L_FORECAST.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }) : 'R$ 0,00'}</li>
                            </div>
                        </div>
                    </div>
                </div>
            </ul>
        </div>
    )
}