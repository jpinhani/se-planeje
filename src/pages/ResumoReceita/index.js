import React, { useEffect, useCallback, useState } from 'react';
import { GeraReceitas } from '../../components/ResumoReceita';
import { Table, Switch } from 'antd';

export default (props) => {

    const [tabReceita, setTabReceita] = useState([]);
    const [itens, setItens] = useState(true)

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
            title: 'RECEITA',
            dataIndex: 'DESCR_RECEITA',
            key: 'DESCR_RECEITA'
        },
        {
            title: 'PARCELA',
            dataIndex: 'NUM_PARCELA',
            key: 'NUM_PARCELA'
        }];

    const ResumoReceita = useCallback(() => {
        const receitas = props.data;
        const visaoSetada = props.visao;

        setTabReceita(GeraReceitas(receitas, visaoSetada, itens));

    }, [props.data, props.visao, itens])

    useEffect(() => {
        ResumoReceita()
    }, [ResumoReceita])

    return (
        <div>
            <div>
                <Switch
                    checked={itens}
                    onChange={(valor) => valor === true ?
                        setItens(true) : setItens(false)} />
                {itens === true ? ' Receitas Contabilizadas' : ' Receitas Previstas'}
            </div>
            <Table name='Receita' className='table table-action'
                columns={columns}
                dataSource={tabReceita}
                rowKey="ROLID"
            />
        </div>
    )
}