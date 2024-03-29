import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import FaturaPagar from '../../components/Modal/DespesaCartao';

import { Tabs, Table, Button, notification, Spin } from 'antd';

import { Link } from 'react-router-dom'
import { GetRequest } from '../../components/crudSendAxios/crud';

import 'antd/dist/antd.css';
import './styles.scss'

const { TabPane } = Tabs;

export default (props) => {

    const dispatch = useDispatch();
    const fatura = useSelector(state => state.fatura);
    const detalheFatura = useSelector(state => state.detalheFatura);
    const [spin, setSpin] = useState(true)

    const [mode] = useState('top');

    const listCardItens = useCallback((fatura, detalhe) => {

        const columns = [
            {
                title: 'REF',
                dataIndex: 'ID',
                key: 'ID2',
            },
            {
                title: 'DETALHE',
                dataIndex: 'DESCR_DESPESA',
                key: 'DESCR_DESPESA',
            },
            {
                title: 'CARD',
                dataIndex: 'CARTAO',
                key: 'CARTAO',
            },
            {
                title: 'VENCIMENTO',
                dataIndex: 'FATURA',
                key: 'FATURA',
            },
            {
                title: 'R$ PREVISTO',
                dataIndex: 'VL_PREVISTO',
                key: 'VL_PREVISTO',
            },
            {
                title: 'R$ REAL',
                dataIndex: 'VL_REAL',
                key: 'VL_REAL',
            },
            {
                title: 'STATUS',
                dataIndex: 'STATUS',
                key: 'STATUS',
            }
        ]

        const dadosFatura = fatura.map((ID, a) => (

            < TabPane tab={`${ID.ID}`} key={a} >
                <Table className='table table-action'
                    title={() => <div style={{ display: 'flex' }}>
                        <div style={{ width: '100%', color: 'blue', fontSize: '14px' }}><h2>Fatura Atual:</h2> R$ {ID.VL_REAL !== null ? ID.VL_REAL : 0.00} </div>
                        <br />
                        <div style={{ width: '100%', color: 'red', fontSize: '14px' }}><h2>Fatura Estimada: </h2> R$ {ID.VL_FORECAST}</div>
                        <br />
                        <div style={{ width: '100%', color: 'red', fontSize: '14px' }}>
                            <FaturaPagar data={ID} />
                        </div>
                    </div>}

                    style={{ height: '100%' }}
                    columns={columns}
                    dataSource={detalhe.filter((DATA) => (
                        DATA.ID === ID.ID
                    ))}
                    rowKey={ID => ID.ID_DESPESA}
                    pagination={{ pageSize: 100 }}
                />
            </TabPane >
        ))

        dispatch({
            type: 'LIST_FATURADETALHE',
            payload: dadosFatura
        })
    }, [dispatch])

    const requestAPI = useCallback(async () => {

        const fatura = await GetRequest('api/despesas/fatura')
        const detalhe = await GetRequest('api/despesas/faturadetalhe');


        if (fatura.status === 402 || detalhe.status === 402)
            return notification.open({
                message: 'SePlaneje - Problemas Pagamento',
                duration: 20,
                description:
                    `Poxa!!! 
                        Foram identificados problemas com o pagamento da sua assinatura, acesse a página de Pagamento ou entre em contato conosco...`,
                style: {
                    width: '100%',
                    marginLeft: 335 - 600,
                },
            });


        const unique = new Set(fatura.map((DATA) => DATA.CARTAO))

        const cardNew = Array.from(unique).map((DATA, i) => <Button className="cartoesBT" value={i}
            key={i}
            ghost
            type='primary'
            onClick={() => listCardItens(fatura.filter((DADOS) => DADOS.CARTAO === DATA), detalhe)} > {DATA}</Button>)


        dispatch({
            type: 'LIST_FATURAREAL',
            payload: cardNew

        })

        dispatch({
            type: 'LIST_FATURADETALHE',
            payload: []
        })

        setSpin(false)
    }, [dispatch, listCardItens])

    useEffect(() => {
        requestAPI();
    }, [requestAPI])

    return (
        <div>
            <Spin size="large" spinning={spin} />
            < div style={{ margin: '16px 0', background: '#DCDCDC' }}>
                <Link to='selectPagarMeta'><Button key='Met'> Metas</Button></Link>
                <Link to='selectdespesarealizada'><Button key='Lnc'> Pagas </Button></Link>
                <Link to='SelectFaturaPagar'><Button type='danger' key='rel'> Faturas Cartão </Button></Link>
            </div >
            {/* <div
                style={{
                    padding: '15px',
                    fontSize: '16px',
                    background: '#FF6347'
                }}>Resumo de Lançamentos no Cartão
            </div> */}
            <div
                className='cards'>
                {fatura}
            </div>
            <Tabs
                className='tabs__list'
                defaultActiveKey="1"
                tabPosition={mode}
                style={{
                    height: '100%',
                    width: '100%',
                    diplay: 'flex'
                }}>
                {detalheFatura}
            </Tabs>
        </div >
    )
}


