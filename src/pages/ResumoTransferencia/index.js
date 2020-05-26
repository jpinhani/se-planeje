import React, { useEffect, useCallback, useState } from 'react';
import { GeraTransferencias } from '../../components/ResumoTransferencia'
import { Table } from 'antd';

export default (props) => {

    const [tabTransferencia, setTabTransferencia] = useState([]);

    const columns = [
        {
            title: 'DESCRIÇÃO',
            dataIndex: 'DESCR_TRANSFERENCIA',
            key: 'DESCR_TRANSFERENCIA'
        },
        {
            title: 'CONTA DEBITO',
            dataIndex: 'CONTA_DEBITO',
            key: 'CONTA_DEBITO'
        },
        {
            title: 'CONTA CREDITO',
            dataIndex: 'CONTA_CREDITO',
            key: 'CONTA_CREDITO'
        },
        {
            title: 'DATA',
            dataIndex: 'DATA_TRANSFERENCIA',
            key: 'DATA_TRANSFERENCIA'
        },
        {
            title: 'R$ VALOR',
            dataIndex: 'VALOR',
            key: 'VALOR'
        }];

    const ResumoTransferencia = useCallback(() => {
        const transferencias = props.data;
        const visaoSetada = props.visao;

        setTabTransferencia(GeraTransferencias(transferencias, visaoSetada));

    }, [props.data, props.visao])

    useEffect(() => {
        ResumoTransferencia()
    }, [ResumoTransferencia])

    return (
        <div>
            <Table name='Transferencia' className='table table-action'
                columns={columns}
                dataSource={tabTransferencia}
                rowKey="ROLID"
            />
        </div>
    )
}