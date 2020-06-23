import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { GetRequest, visionSerchMeta } from '../../components/crudSendAxios/crud'
import ReceitaMetaComponente from '../../components/Modal/ReceitaMeta'
import SearchFilter from '../../components/searchFilterTable/index'

import { Table, Button, Input, Select, notification, Spin } from 'antd'

const { Option } = Select;

export default (props) => {

    const dispatch = useDispatch()
    const receitaMeta = useSelector(state => state.revenue)
    const visionControler = useSelector(state => state.visionControler)

    const [search, setSearch] = useState('');
    // const [vision, setVision] = useState([]);
    const [mapvision, setMapVision] = useState([]);
    const [visions, setVisions] = useState([]);
    const [spin, setSpin] = useState(true);

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

        // setVision(selectVisao);

        dispatch({
            type: 'LIST_VISIONCONTROLER',
            payload: selectVisao
        })
    }

    const getvision = useCallback(async () => await GetRequest('api/visions'), [])

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

        const receitas = await GetRequest('api/receitas')

        dispatch({
            type: 'LIST_REVENUE',
            payload: receitas
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
                <Link to='SelectReceitaMeta'><Button type='primary' key='Lnc'>Metas - Receitas</Button></Link>
                <Link to='SelectReceitaReal'><Button key='Lnc'>Lançamentos</Button></Link>
            </div >
            {/* <div style={{ padding: '15px', fontSize: '16px', background: '#87CEFA' }}>
                Metas Cadastradas - Receitas
            </div> */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
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
            < Table className='table table-action'
                columns={Collumns}
                dataSource={SearchFilter(
                    visionSerchMeta(mapvision, receitaMeta, visionControler),
                    ['DESCR_CATEGORIA', 'DESCR_RECEITA'], search)}

                rowKey={receitaMeta => receitaMeta.ID} />
        </div>
    )

}

