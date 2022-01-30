import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import SearchFilter from '../../components/searchFilterTable/index';

import { Table, Input, Select, Button, notification, Spin, Icon, Popover } from 'antd'
// import DespesaPagarMeta from '../../components/Modal/DespesaPrevista'
// import DespesaPrevista from '../../components/Modal/DespesaPrevista'

import DespesaPrevista from '../../components/Modal/DespesaPrevista'
import DespesaMeta from '../../components/Modal/DespesaPagar'
import Menu from '../../components/MenuDespesaPrevista'
import EditDespesa from '../../components/Modal/DespesaPrevistaEdit'

import { GetRequest, visionSerchMeta } from '../../components/crudSendAxios/crud'

import 'antd/dist/antd.css';
import './styles.scss'

const { Option } = Select;

export default () => {
    const dispatch = useDispatch();
    const expenseMeta = useSelector(state => state.expense);
    const visionControler = useSelector(state => state.visionControler)

    const [search, setSearch] = useState('');
    const [visions, setVisions] = useState([]);
    const [mapvision, setMapVision] = useState([]);
    const [spin, setSpin] = useState(true)

    const columns = [
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
            title: 'DESPESA',
            dataIndex: 'DESCR_DESPESA',
            key: 'DESCR_DESPESA'
        },
        {
            title: 'PARCELA',
            dataIndex: 'NUM_PARCELA',
            key: 'NUM_PARCELA'
        },
        {
            title: 'CARTAO',
            dataIndex: 'CARTAO',
            key: 'CARTAO'
        },
        {
            title: 'ACÃO',
            key: 'ACÃO',

            render: expense => (
                // <div>
                //     <span >
                //         <DespesaPrevista />
                //         <DespesaPagarMeta data={expense} />
                //     </span>
                // </div>
                <div className="DetalhesBotoes">
                    <span className="DetalhesBotoesGrid">

                        <DespesaMeta data={expense} />
                        <EditDespesa data={expense} />

                        <Popover
                            placement="left"
                            title='Excluir Despesa'
                            content={<Menu data={expense} />} trigger="click">
                            <Icon type="delete" title='Excluir Despesa' style={{ fontSize: '18px', color: '#08c' }} />
                        </Popover>
                    </span>
                </div>
            ),
        }
    ]

    const filterVision = async (selectVisao) => {
        dispatch({ type: 'LIST_VISIONCONTROLER', payload: selectVisao })
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
        const despesas = await GetRequest('api/despesas')

        dispatch({
            type: 'LIST_EXPENSE',
            payload: despesas
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
                <Link to='selectPagarMeta'><Button type='danger' key='rel'> Metas </Button></Link>
                <Link to='selectdespesarealizada'><Button key='Lnc'> Pagas </Button></Link>
                <Link to='SelectFaturaPagar'><Button key='fatu'>Faturas Cartão</Button></Link>
            </div >

            <div className='ViewExpense'>
                <DespesaPrevista />
                <Input name='despesa'
                    style={{ width: '50%' }}
                    value={search}
                    onChange={valor => setSearch(valor.target.value)}
                    placeholder="Procure aqui a despesa especifica" />

                <Select style={{ width: '50%' }}
                    placeholder="Filtrar por Visão"
                    value={visionControler}
                    onSelect={(valor) => filterVision(valor)}
                >
                    {visions}
                </Select>
            </div >
            <div style={{ padding: '2px' }}>
                <strong>Total Previsto (Meta): </strong>
                {SearchFilter(
                    visionSerchMeta(mapvision, expenseMeta, visionControler),
                    ['DESCR_CATEGORIA', 'DESCR_DESPESA'], search).reduce((acum, atual) => acum + atual.VL_PREVISTO2, 0).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })}
            </div>

            <div style={{ padding: '2px' }}>
                <strong>Crédito: </strong>
                {SearchFilter(
                    visionSerchMeta(mapvision, expenseMeta, visionControler),
                    ['DESCR_CATEGORIA', 'DESCR_DESPESA'], search).filter(fil => fil.CARTAO).reduce((acum, atual) => acum + atual.VL_PREVISTO2, 0).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })}
            </div>
            <div style={{ padding: '2px' }}>
                <strong>Débito/Dinheiro: </strong>
                {SearchFilter(
                    visionSerchMeta(mapvision, expenseMeta, visionControler),
                    ['DESCR_CATEGORIA', 'DESCR_DESPESA'], search).filter(fil => fil.CARTAO === null).reduce((acum, atual) => acum + atual.VL_PREVISTO2, 0).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })}
            </div>
            <div>
                <Table className='table table-action'
                    columns={columns}

                    dataSource={SearchFilter(
                        visionSerchMeta(mapvision, expenseMeta, visionControler),
                        ['DESCR_CATEGORIA', 'DESCR_DESPESA'], search).sort(function (a, b) {
                            if (a.DT_PREVISTO < b.DT_PREVISTO) return -1;
                            if (a.DT_PREVISTO > b.DT_PREVISTO) return 1;
                            return 0;
                        })}
                    rowKey='ID'
                    pagination={{ pageSize: 100 }}
                />
            </div>
        </div >
    )
}

