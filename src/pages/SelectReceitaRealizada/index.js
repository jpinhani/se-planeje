import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { GetRequest, visionSerchReceita, UpdateRequest } from '../../components/crudSendAxios/crud'
import SearchFilter from '../../components/searchFilterTable/index'
import NewRevenue from '../../components/Modal/ReceitaRealizada'
import ReceitaEdit from '../../components/Modal/ReceitaRealizadaEdit'

import { Table, Button, Input, Select, Popconfirm, Icon, notification, Spin } from 'antd';

import { verifySend } from '../../components/verifySendAxios/index'

const { Option } = Select;

function ReceitaRealizada() {

    const receitaReal = useSelector(state => state.revenueReal);
    const visionControler = useSelector(state => state.visionControler)

    const dispatch = useDispatch();

    const [search, setSearch] = useState('');
    const [visions, setVisions] = useState([]);
    const [mapvision, setMapVision] = useState([]);
    const [spin, setSpin] = useState(true)

    async function deleteReal(receitaReal) {

        const body = receitaReal
        body.id = receitaReal.ID

        const resultStatus = await UpdateRequest(body, 'api/receitas/delete/real')
        verifySend(resultStatus, 'DELETEDESPESAREAL', body.DESCR_RECEITA)

        if (resultStatus === 200) {

            const receita = await GetRequest('api/receitas/paga')
            dispatch({
                type: 'LIST_REVENUE_REAL',
                payload: receita
            })
        }
    }


    const Collumns = [
        {
            title: 'CATEGORIA',
            dataIndex: 'DESCR_CATEGORIA',
            key: 'DESCR_CATEGORIA'
        },
        {
            title: 'R$ PREVISTO',
            dataIndex: 'VL_PREVISTO',
            key: 'VL_PREVISTO'
        },
        {
            title: 'R$ REAL',
            dataIndex: 'VL_REAL',
            key: 'VL_REAL'
        },
        {
            title: 'DATA PREVISTA',
            dataIndex: 'DATANOVA',
            key: 'DATANOVA'
        },
        {
            title: 'DATA REAL',
            dataIndex: 'DATANOVAREAL',
            key: 'DATANOVAREAL'
        },
        {
            title: 'RECEITA',
            dataIndex: 'DESCR_RECEITA',
            key: 'DESCR_RECEITA'
        },
        {
            title: 'PARCELA',
            dataIndex: 'NUM_PARCELA',
            key: 'NUM_PARCELA'
        },
        {
            title: 'Action',
            key: 'action',
            render: receitaReal => (
                <div className="DetalhesBotoes">
                    <span className="DetalhesBotoesGrid">
                        <ReceitaEdit data={receitaReal} />
                        <Popconfirm
                            title="Excluir Lançamento Realizado?"
                            onConfirm={() => deleteReal(receitaReal)}>
                            <Icon
                                type="delete"
                                title='Excluir Receita'
                                style={{ fontSize: '18px', color: '#08c' }} />
                        </Popconfirm>
                    </span>
                </div>
            )
        }
    ]

    const getvision = useCallback(async () => await GetRequest('api/visions'), [])

    const filterVision = async (selectVisao) => {

        dispatch({ type: 'LIST_VISIONCONTROLER', payload: selectVisao })

    }


    const listaVisao = useCallback(async () => {
        const resultVision = await getvision();
        if (resultVision.status === 402)
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

        const options = resultVision.map((desc, i) =>
            <Option key={i} value={desc.VISAO}>
                {desc.VISAO}
            </Option>
        )

        options.push(<Option key='all' value='ALL'>TODAS VISÕES</Option>)

        setVisions(options)
        const receitas = await GetRequest('api/receitas/paga')
        // const novaVisao = visionSerchReceita(resultVision, receitas, visionControler)

        dispatch({
            type: 'LIST_REVENUE_REAL',
            payload: receitas
        })

        // setVision(visionControler)
        setSpin(false)
        setMapVision(resultVision)
    }, [getvision, dispatch])


    useEffect(() => {
        listaVisao();
    }, [listaVisao]);


    return (
        <div>
            <Spin size="large" spinning={spin} />
            < div style={{ margin: '16px 0', background: '#DCDCDC' }}>
                <Link to='SelectReceitaMeta'><Button key='Lnc'>Metas - Receitas</Button></Link>
                <Link to='SelectReceitaReal'><Button type='primary' key='Lnc'>Lançamentos</Button></Link>
            </div >
            {/* <div style={{ padding: '15px', fontSize: '16px', background: '#87CEFA' }}>
                Lançamentos de Receita - Não Previstos
            </div> */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <NewRevenue />
                <Input name='receita'
                    style={{ width: '49%' }}
                    value={search}
                    onChange={valor => setSearch(valor.target.value)}
                    placeholder="Procure aqui a receita especifica" />

                <Select style={{ width: '49%' }}
                    placeholder="Filtrar por Visão"
                    value={visionControler}
                    onSelect={(valor) => filterVision(valor)}
                >
                    {visions}
                </Select>
            </div >
            <div style={{ padding: '10px' }}>
                <strong>Total Recebido: </strong>
                {SearchFilter(
                    visionSerchReceita(mapvision, receitaReal, visionControler),
                    ['DESCR_CATEGORIA', 'DESCR_RECEITA'], search).reduce((acum, atual) => acum + atual.VL_REAL2, 0).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })}
            </div>
            <Table
                className='table table-action'
                columns={Collumns}
                dataSource={SearchFilter(
                    visionSerchReceita(mapvision, receitaReal, visionControler),
                    ['DESCR_CATEGORIA', 'DESCR_RECEITA'], search).sort(function (a, b) {
                        if (a.DT_REAL > b.DT_REAL) return -1;
                        if (a.DT_REAL < b.DT_REAL) return 1;
                        return 0;
                    })}
                rowKey='ID'
                pagination={{ pageSize: 100 }}
            />
        </div>

    )
}

export default ReceitaRealizada