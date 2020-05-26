import React, { useState, useEffect, useCallback } from 'react';

import './style.scss';

export default (props) => {

    const [contaSaldoAtual, setContaSaldoAtual] = useState([]);

    const requestApi = useCallback(async () => {

        const saldoTransacoes = props.saldo;

        setContaSaldoAtual(saldoTransacoes)
        console.log('saldoTransacoes', saldoTransacoes)
    }, [props.saldo])

    useEffect(() => {
        requestApi();
    }, [requestApi])

    const ResumoSePlaneje = useCallback(async () => {

        const visaoSetada = props.visaoSetada;

        console.log('visaoSetada', visaoSetada)

    }, [props.visaoSetada])


    useEffect(() => {
        ResumoSePlaneje();
    }, [ResumoSePlaneje])

    return (
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
                    <div className='containerDivData'>
                        <center><h1>Resumo SePlaneje</h1></center>
                        <div className='containerDivDataTab'>
                            {}
                        </div>
                    </div>
                </div>
            </ul>
        </div>
    )
}