import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GetRequest } from '../../components/crudSendAxios/crud';

import { Input, Table } from 'antd';
import SearchFilter from '../../components/searchFilterTable'

import 'antd/dist/antd.css';

export default () => {

    const dispatch = useDispatch();
    const transferencia = useSelector(state => state.transferencia);

    const [search, setSearch] = useState('');

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
        }
    ]

    const requestApi = useCallback(async () => {
        const transferencias = await GetRequest('api/transferencia')

        dispatch({
            type: 'LIST_TRANSFERENCIA',
            payload: transferencias
        })

    }, [dispatch])

    useEffect(() => {
        requestApi();
    }, [requestApi])

    return (
        <div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                {/* <NewRevenue /> */}
                <Input name='transferencia'
                    style={{ width: '49%' }}
                    value={search}
                    onChange={valor => setSearch(valor.target.value)}
                    placeholder="Procure aqui a Transferência Especifica" />

                {/* <Select style={{ width: '49%' }}
                    placeholder="Filtrar por Visão"
                    value={visionControler}
                    onSelect={(valor) => filterVision(valor)}
                >
                    {visions}
                </Select> */}
            </div >
            <Table
                className='table table-action'
                columns={Collumns}
                dataSource={SearchFilter(transferencia,
                    ['DESCR_TRANSFERENCIA', 'CONTA_CREDITO', 'CONTA_DEBITO'], search)}
                rowKey='ID'
            />
        </div>
    )
}
