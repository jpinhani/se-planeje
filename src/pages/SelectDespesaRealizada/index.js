import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import DespesaRealizada from '../../components/Modal/DespesaRealizada'

import EditDespesa from '../../components/Modal/DespesaRealizadaEdit'
import SearchFilter from '../../components/searchFilterTable'

import { Table, Icon, Popconfirm, Input, Select, Button, notification, Spin } from 'antd'

import { GetRequest, UpdateRequest, visionSerch } from '../../components/crudSendAxios/crud'
import { verifySend } from '../../components/verifySendAxios/index'

import 'antd/dist/antd.css';
import './styles.scss'

const { Option } = Select;

export default () => {

    const dispatch = useDispatch();
    const expenseReal = useSelector(state => state.expenseReal);
    const visionControler = useSelector(state => state.visionControler)

    const [search, setSearch] = useState('');
    const [visions, setVisions] = useState([]);
    const [mapvision, setMapVision] = useState([]);

    const [spin, setSpin] = useState(true);

    async function deleteReal(expenseReal) {

        const body = expenseReal
        body.id = expenseReal.ID

        const resultStatus = await UpdateRequest(body, 'api/despesas/delete/real')
        verifySend(resultStatus, 'DELETEDESPESAREAL', body.DESCR_DESPESA)

        if (resultStatus === 200) {
            const despesa = await GetRequest('api/despesas/paga')
            dispatch({
                type: 'LIST_EXPENSEREAL',
                payload: despesa
            })
        }
    }

    const columns = [
        {
            title: 'CATEGORIA',
            dataIndex: 'DESCR_CATEGORIA',
            key: 'DESCR_CATEGORIA'
        },
        {
            title: 'R$ PREVISTO',
            dataIndex: 'VL_PREVISTO',
            key: 'VL_PREVISTOR'
        },
        {
            title: 'R$ REAL',
            dataIndex: 'VL_REAL',
            key: 'VL_REALR'
        },
        {
            title: 'DATA PREVISTA',
            dataIndex: 'DATANOVA',
            key: 'DATANOVAR'
        },
        {
            title: 'DATA REALIZADA',
            dataIndex: 'DATANOVAREAL',
            key: 'DATANOVAREALR'
        },
        {
            title: 'DESPESA',
            dataIndex: 'DESCR_DESPESA',
            key: 'DESCR_DESPESAR'
        },
        {
            title: 'PARCELA',
            dataIndex: 'NUM_PARCELA',
            key: 'NUM_PARCELAR'
        },
        {
            title: 'CARTAO',
            dataIndex: 'CARTAO',
            key: 'CARTAOR'
        },
        {
            title: 'ACÃO',
            key: 'ACÃOR',

            render: expenseReal => (
                <div className="DetalhesBotoes">
                    <span className="DetalhesBotoesGrid">
                        {expenseReal.STATUS !== 'Fatura Paga' ? <EditDespesa data={expenseReal} /> : <Icon
                            type="edit"
                            style={{ fontSize: '18px', color: 'grey' }}
                            title='Adicionar nova Despesa Prevista'
                        />}

                        {expenseReal.STATUS !== 'Fatura Paga' ?
                            <Popconfirm title="Excluir Lançamento Realizado?" onConfirm={() => deleteReal(expenseReal)}>
                                <Icon type="delete" title='Excluir Despesa' style={{ fontSize: '18px', color: '#08c' }} />
                            </Popconfirm> : <Icon type="delete" title='Excluir Despesa' style={{ fontSize: '18px', color: 'grey' }} />}
                    </span>
                </div>
            ),
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
        const despesas = await GetRequest('api/despesas/paga')

        const despesaAjust = despesas.map((dados) => {

            return { ...dados, DT_VISAO: (dados.STATUS === 'Fatura Paga') ? dados.DT_REAL : dados.DT_VISAO }
        })

        dispatch({
            type: 'LIST_EXPENSEREAL',
            payload: despesaAjust
        })

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
                <Link to='selectPagarMeta'><Button key='Met'> Metas </Button></Link>
                <Link to='selectdespesarealizada'><Button type='danger' key='rel'> Lançamentos </Button></Link>
                <Link to='SelectFaturaPagar'><Button key='fatu'>Faturas</Button></Link>
            </div >
            {/* <div style={{ padding: '15px', fontSize: '16px', background: '#FF6347' }}>
                Novas Despesas - Imprevistos
                </div> */}
            <div className='ViewExpense'>
                <DespesaRealizada />
                <Input
                    name='despesa'
                    value={search}
                    onChange={valor => setSearch(valor.target.value)}
                    placeholder="Procure aqui a despesa especifica" />
                <Select style={{ width: '50%' }}
                    placeholder="Filtrar por Visão"
                    value={visionControler}
                    onSelect={(visao) => filterVision(visao)}
                >
                    {visions}
                </Select>
            </div>
            <div style={{ padding: '10px' }}>
                <strong>Total Gasto: </strong>
                {SearchFilter(
                    visionSerch(mapvision, expenseReal, visionControler),
                    ['DESCR_CATEGORIA', 'DESCR_DESPESA'], search).reduce((acum, atual) => acum + atual.VL_REAL2, 0).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })}
            </div>
            <div>
                <Table name='Despesa' className='table table-action'
                    columns={columns}
                    dataSource={SearchFilter(
                        visionSerch(mapvision, expenseReal, visionControler),
                        ['DESCR_CATEGORIA', 'DESCR_DESPESA'], search).sort(function (a, b) {
                            if (a.DT_REAL > b.DT_REAL) return -1;
                            if (a.DT_REAL < b.DT_REAL) return 1;
                            return 0;
                        })}
                    rowKey='ID'
                    pagination={{ pageSize: 100 }}
                />
            </div>
        </div>
    )
}
