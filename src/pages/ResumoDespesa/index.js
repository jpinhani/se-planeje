import React, { useEffect, useCallback, useState } from 'react';
import { GeraDespesas } from '../../components/ResumoDespesa'
import { Table, Switch } from 'antd';

export default (props) => {

    const [tabDespesa, setTabDespesa] = useState([]);
    const [itens, setItens] = useState(true)

    const columns = [

        {
            title: 'CARTAO',
            dataIndex: 'CARTAO',
            key: 'CARTAO'
        },
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
            dataIndex: 'DT_PREVISTO',
            key: 'DT_PREVISTO'
        },
        {
            title: 'DATA REAL',
            dataIndex: 'DT_REAL',
            key: 'DT_REAL'
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
        }];

    const ResumoDespesa = useCallback(() => {
        const despesas = props.data;
        const visaoSetada = props.visao;
        const cartaoListagem = props.cartao;

        setTabDespesa(GeraDespesas(despesas, cartaoListagem, visaoSetada, itens));

    }, [props.data, props.visao, props.cartao, itens])

    useEffect(() => {
        ResumoDespesa()
    }, [ResumoDespesa])

    return (
        <div>
            <div>
                <Switch
                    checked={itens}
                    onChange={(valor) => valor === true ?
                        setItens(true) : setItens(false)} />
                {itens === true ? ' Despesas Contabilizadas' : ' Despesas Previstas'}
            </div>
            <Table name='Despesa' className='table table-action'
                columns={columns}
                dataSource={tabDespesa}
                rowKey="ROLID"
            />
        </div>
    )
}