import React, { useEffect, useCallback, useState } from 'react';
import { GeraDespesas } from '../../components/ResumoDespesa'
import { Table, Switch } from 'antd';

import './styles.scss';

export default (props) => {

    const [tabDespesa, setTabDespesa] = useState([]);
    const [itens, setItens] = useState(true)

    const columnsLancamentos = [

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
        }];

    const columnsCartao = [

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
            title: 'R$ GASTO ATÉ O MOMENTO',
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
            <div className="SelectOption">
                <Switch
                    checked={itens}
                    onChange={(valor) => valor === true ?
                        setItens(true) : setItens(false)} />
                {itens === true ? ' Despesas Contabilizadas' : ' Despesas Previstas'}
            </div>

            <Table name='CDespesa' className='table table-action'
                // onHeaderRow="Lançamentos no Cartão de Crédito"
                title={() => `Lançamentos no cartão de Crédito`}
                columns={columnsCartao}
                pagination={{ position: ["none", "none"] }}
                dataSource={tabDespesa.filter(filtro => filtro.CARTAO)}
                rowKey="ROLID"
            />

            <Table name='Despesa' className='table table-action'
                title={() => `Lançamentos no débito ou dinheiro`}
                columns={columnsLancamentos}
                dataSource={tabDespesa.filter(filtro => filtro.CARTAO === undefined)}
                pagination={{ pageSize: 100 }}
                rowKey="ROLID"
            />
        </div>
    )
}