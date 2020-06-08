import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import DespesaRealizada from '../../components/Modal/DespesaRealizada'

import EditDespesa from '../../components/Modal/DespesaRealizadaEdit'
import SearchFilter from '../../components/searchFilterTable'

import { Table, Icon, Popconfirm, Input, Select, Button } from 'antd'

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
                <div>
                    <span >
                        <EditDespesa data={expenseReal} />

                        <Popconfirm title="Excluir Lançamento Realizado?" onConfirm={() => deleteReal(expenseReal)}>
                            <Icon type="delete" title='Excluir Despesa' style={{ fontSize: '18px', color: '#08c' }} />
                        </Popconfirm>
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

        const options = resultVision.map((desc, i) =>
            <Option key={i} value={desc.VISAO}>
                {desc.VISAO}
            </Option>
        )

        options.push(<Option key='all' value='ALL'>TODAS VISÕES</Option>)

        setVisions(options)
        const receitas = await GetRequest('api/despesas/paga')

        dispatch({
            type: 'LIST_EXPENSEREAL',
            payload: receitas
        })

        setMapVision(resultVision)
    }, [getvision, dispatch])

    useEffect(() => {
        listaVisao();
    }, [listaVisao]);

    return (
        <div>
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
            <div>
                <Table name='Despesa' className='table table-action'
                    columns={columns}
                    dataSource={SearchFilter(
                        visionSerch(mapvision, expenseReal, visionControler),
                        ['DESCR_CATEGORIA', 'DESCR_DESPESA'], search)}
                    rowKey='ID'
                />
            </div>
        </div>
    )
}
