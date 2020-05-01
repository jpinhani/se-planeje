import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { GetRequest, visionSerchMeta } from '../../components/crudSendAxios/crud'
import ReceitaMetaComponente from '../../components/Modal/ReceitaMeta'
import SearchFilter from '../../components/searchFilterTable/index'

import { Table, Button, Input, Select } from 'antd'

const { Option } = Select;

export default (props) => {

    const dispatch = useDispatch()
    const receitaMeta = useSelector(state => state.revenue)

    const [search, setSearch] = useState('');
    const [vision, setVision] = useState([]);
    const [mapVision, setMapVision] = useState([]);

    const [visions, setVisions] = useState([]);


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
            title: 'DATA PREVISTA',
            dataIndex: 'DATANOVA',
            key: 'DATANOVA'
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
            render: receitaMeta => (
                <div>
                    <ReceitaMetaComponente data={receitaMeta} />
                </div>
            )
        }
    ]

    async function filterVision(selectVisao) {
        const receitas = await GetRequest('api/receitas')
        const novaVisao = visionSerchMeta(mapVision, receitas, selectVisao)

        dispatch({
            type: 'LIST_REVENUE',
            payload: selectVisao !== 'ALL' ?
                novaVisao[0] !== undefined ?
                    novaVisao[0] :
                    [] :
                receitas
        })

        setVision(selectVisao)
    }

    const getvision = useCallback(async () => await GetRequest('api/visions'), [])

    const listaVisao = useCallback(async () => {
        const resultVision = await getvision();

        const options = resultVision.map((desc, i) =>
            <Option key={i} value={desc.VISAO}>
                {desc.VISAO}
            </Option>
        )
        options.push(<Option key='all' value='ALL'>TODAS VISÕES</Option>)

        setVisions(options)
        setMapVision(resultVision)
    }, [getvision])

    useEffect(() => {
        GetRequest('api/receitas').then(result =>
            dispatch({
                type: 'LIST_REVENUE',
                payload: result
            }))
        listaVisao();
    }, [dispatch, listaVisao]);


    return (
        <div>
            < div style={{ margin: '16px 0', background: '#DCDCDC' }}>
                <Link to='selectdespesarealizada'><Button key='Lnc'>Novos Lançamentos</Button></Link>
            </div >
            <div style={{ padding: '15px', fontSize: '16px', background: '#87CEFA' }}>
                Metas Cadastradas - Receitas
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Input name='receita'
                    style={{ width: '49%' }}
                    value={search}
                    onChange={valor => setSearch(valor.target.value)}
                    placeholder="Procure aqui a receita especifica" />

                <Select style={{ width: '49%' }}
                    placeholder="Filtrar por Visão"
                    value={vision}
                    onSelect={(valor) => filterVision(valor)}
                >
                    {visions}
                </Select>
            </div >
            < Table className='table table-action'
                columns={Collumns}
                dataSource={SearchFilter(receitaMeta, ['DESCR_CATEGORIA', 'DESCR_RECEITA'], search)}
                rowKey={receitaMeta => receitaMeta.ID} />
        </div>
    )

}

