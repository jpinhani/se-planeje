import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GetRequest, DeleteRequest, visionSerchTransferencia } from '../../components/crudSendAxios/crud';
import NovaTransferencia from '../../components/Modal/Transferencia'

import { Input, Table, Popconfirm, Icon, Select, notification, Spin } from 'antd';
import SearchFilter from '../../components/searchFilterTable'
import EditTransferencia from '../../components/Modal/TransferenciaEdit'

import { verifySend } from '../../components/verifySendAxios/'

import 'antd/dist/antd.css';

const { Option } = Select;

export default () => {

    const dispatch = useDispatch();
    const visionControler = useSelector(state => state.visionControler);

    const transferencia = useSelector(state => state.transferencia);

    const [search, setSearch] = useState('');
    const [visions, setVisions] = useState([]);
    const [mapvision, setMapVision] = useState([]);
    const [spin, setSpin] = useState(true);

    async function deleteReal(transferencia) {
        const body = transferencia
        // body.id = receitaReal.ID

        const resultStatus = await DeleteRequest(body.ID, 'api/transferencia')
        verifySend(resultStatus.status, 'DELETE', body.DESCR_TRANSFERENCIA)

        if (resultStatus === 200) {

            const transf = await GetRequest('api/transferencia')
            dispatch({
                type: 'LIST_TRANSFERENCIA',
                payload: transf
            })
        }
    }

    const filterVision = async (selectVisao) => {

        dispatch({ type: 'LIST_VISIONCONTROLER', payload: selectVisao })

    }


    const Collumns = [
        {
            title: 'DATA',
            dataIndex: 'DATA_TRANSFERENCIA2',
            key: 'DATA_TRANSFERENCIA2',
        },
        {
            title: 'CONTA DEBITADA',
            dataIndex: 'CONTA_DEBITO',
            key: 'CONTA_DEBITO',
        },
        {
            title: 'VALOR',
            dataIndex: 'VALOR2',
            key: 'VALOR2',
        },
        {
            title: 'CONTA ENTRADA',
            dataIndex: 'CONTA_CREDITO',
            key: 'CONTA_CREDITO',
        },
        {
            title: 'DESCRIÇÃO',
            dataIndex: 'DESCR_TRANSFERENCIA',
            key: 'DESCR_TRANSFERENCIA',
        },
        {
            title: 'action',
            key: 'action',
            render: transferencia => (
                <div className="DetalhesBotoes">
                    <span className="DetalhesBotoesGrid">
                        <EditTransferencia dados={transferencia} />
                        <Popconfirm
                            title="Excluir Lançamento Realizado?"
                            onConfirm={() => deleteReal(transferencia)}>
                            <Icon
                                type="delete"
                                title='Excluir Transferência'
                                style={{ fontSize: '18px', color: '#08c' }} />
                        </Popconfirm>
                    </span>
                </div>
            )
        }
    ]

    const getvision = useCallback(async () => await GetRequest('api/visions'), [])

    const requestApi = useCallback(async () => {
        const transferencias = await GetRequest('api/transferencia')
        const resultVision = await getvision();

        if (resultVision.status === 402 || transferencias.status === 402)
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

        dispatch({
            type: 'LIST_TRANSFERENCIA',
            payload: transferencias
        })

        setSpin(false)
        setMapVision(resultVision)

    }, [dispatch, getvision])

    useEffect(() => {
        requestApi();
    }, [requestApi])

    return (
        <div>
            <Spin size="large" spinning={spin} />
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <NovaTransferencia />
                {/* <NewRevenue /> */}
                <Input name='transferencia'
                    style={{ width: '49%' }}
                    value={search}
                    onChange={valor => setSearch(valor.target.value)}
                    placeholder="Procure aqui a Transferência Especifica" />

                <Select style={{ width: '49%' }}
                    placeholder="Filtrar por Visão"
                    value={visionControler}
                    onSelect={(valor) => filterVision(valor)}
                >
                    {visions}
                </Select>
            </div >
            <Table
                className='table table-action'
                columns={Collumns}
                dataSource={SearchFilter(
                    visionSerchTransferencia(mapvision, transferencia, visionControler),
                    ['DESCR_TRANSFERENCIA',
                        'CONTA_CREDITO',
                        'CONTA_DEBITO'], search).sort(function (a, b) {
                            if (a.DATA_TRANSFERENCIA > b.DATA_TRANSFERENCIA) return -1;
                            if (a.DATA_TRANSFERENCIA < b.DATA_TRANSFERENCIA) return 1;
                            return 0;
                        })}
                rowKey='ID'
                pagination={{ pageSize: 100 }}
            />
        </div>
    )
}
