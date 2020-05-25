import React, { useState, useEffect, useCallback } from 'react';

import Despesas from '../ResumoDespesa'

import { loadVisions } from '../../components/ListagemCombo';
import { GetRequest } from '../../components/crudSendAxios/crud';
import { Tabs, Select, DatePicker } from 'antd';

import './style.scss';

const { TabPane } = Tabs;

export default () => {
    const [mode] = useState('top');

    const [visions, setVisions] = useState([]);

    const [listVision, setListVision] = useState([]);
    const [listCartao, setListCartao] = useState([]);

    const [visionInput, setVisionInput] = useState([]);
    const [visaoSetada, setVisaoSetada] = useState([]);

    const [dtInicial, setDtInicial] = useState('');
    const [dtFinal, setDtFinal] = useState('');
    const [listDespesas, setListDespesas] = useState([]);

    const getvision = useCallback(async () => await GetRequest('api/visions'), [])
    const getcartao = useCallback(async () => await GetRequest('api/cartoes'), [])


    const requestApi = useCallback(async () => {
        const loadVision = await loadVisions();
        const despesas = await GetRequest('api/chartDespesa');
        const listavisao = await getvision()
        const listacartao = await getcartao();

        setVisions(loadVision);
        setListDespesas(despesas)
        setListVision(listavisao)
        setListCartao(listacartao)
    }, [getvision, getcartao])

    useEffect(() => {
        requestApi();
    }, [requestApi])

    function filtroVisao(visao) {
        const visaoData = listVision.filter((filtroVisao) => filtroVisao.VISAO === visao);
        setVisionInput(visao);
        setVisaoSetada(visaoData);
    }

    return (
        <div className='ContainerResumo'>
            <div className='FilterVision'>
                <Select
                    style={{ width: '100%' }}
                    placeholder="Filtrar por Visão"
                    value={visionInput}
                    onSelect={(valor) => filtroVisao(valor)}>
                    {visions}
                </Select>
            </div>
            <div className='FilterData'>
                <DatePicker
                    onChange={(data) => setDtInicial(data)}
                    placeholder='Data Inicial' />
                <DatePicker
                    onChange={(data) => setDtFinal(data)}
                    placeholder='Data Final' />
            </div>
            <Tabs className='ContainerTabs'
                defaultActiveKey="1"
                tabPosition={mode}>
                <TabPane tab='Resumo' key='1'>
                    Teste 1
                </TabPane>

                <TabPane tab='Despesas' key='2'>
                    <Despesas data={listDespesas} visao={visaoSetada} cartao={listCartao} />
                </TabPane>

                <TabPane tab='Receitas' key='3'>
                    Teste 3
                </TabPane>

                <TabPane tab='Transferências' key='4'>
                    Teste 4
                </TabPane>

                <TabPane tab='Plano de Categorias' key='5'>
                    Teste 5
                </TabPane>
            </Tabs>
        </div>
    )
}