import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ListCard from '../../components/Modal/ListFaturaContabilizada'
import { userID } from '../../services/urlBackEnd'

import SearchFilter from '../../components/searchFilterTable'
import { GetRequest, UpdateRequest } from '../../components/crudSendAxios/crud'
import { verifySend } from '../../components/verifySendAxios'

import { Table, Input, Popconfirm, Icon, notification, Spin } from 'antd';

import 'antd/dist/antd.css';

export default () => {

    const [spin, setSpin] = useState(true);
    const dispatch = useDispatch();
    const faturaPaga = useSelector(state => state.faturaPaga);

    const [search, setSearch] = useState('');

    async function deleteAcount(faturaId) {

        const body = {
            idUser: userID(),
            id: faturaId
        }

        const deleteFatura = await UpdateRequest(body, 'api/fatura/contabilizada')
        verifySend(deleteFatura, 'DELETE', body.id)

        if (deleteFatura === 200) {
            requestAPI()
        }
    }

    const columns = [
        {
            title: 'FATURA',
            dataIndex: 'ID_FATURA',
            key: 'ID_FATURA',
        },
        {
            title: 'VENCIMENTO',
            dataIndex: 'DT_VENCIMENTO2',
            key: 'DT_VENCIMENTO2',
        },
        {
            title: 'PAGAMENTO',
            dataIndex: 'DT_PAGAMENTO2',
            key: 'DT_PAGAMENTO2',
        },
        {
            title: 'VALOR PAGO',
            dataIndex: 'VL_REAL2',
            key: 'VL_REAL2'
        },
        {
            title: 'AÇÃO',
            key: 'action',
            render: faturaPaga => (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <div>
                        <ListCard data={faturaPaga} />
                    </div>
                    <div style={{ padding: '10px' }}>
                        <Popconfirm
                            title="Deseja Realmente Reabrir essa Fatura?"
                            onConfirm={() => deleteAcount(faturaPaga.ID_FATURA)}>
                            <Icon
                                type="delete"
                                title='Excluir Fatura'
                                style={{ fontSize: '18px', color: '#08c' }} />
                        </Popconfirm>
                    </div>
                </div>
            ),
        }
    ]


    const requestAPI = useCallback(async () => {
        const faturas = await GetRequest('api/fatura')
        if (faturas.status === 402)
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
        dispatch({
            type: 'LIST_FATURACONTABILIZADA',
            payload: faturas
        });
        setSpin(false)
    }, [dispatch])

    useEffect(() => {
        requestAPI();
    }, [requestAPI])

    return (
        <div>
            <Spin size="large" spinning={spin} />
            <div>
                <Input
                    name='despesa'
                    value={search}
                    onChange={valor => setSearch(valor.target.value)}
                    placeholder="Procure aqui a fatura especifica" />
            </div>
            <div>
                <Table className='table table-action'
                    columns={columns}
                    dataSource={SearchFilter(faturaPaga, ['ID_FATURA'], search)}
                    rowKey='ID_FATURA' />
            </div>
        </div>
    )
}
