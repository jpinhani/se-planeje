import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import Despesas from '../ResumoDespesa'
import Receitas from '../ResumoReceita'

import { loadVisions } from '../../components/ListagemCombo';
import { GetRequest } from '../../components/crudSendAxios/crud';
import { Tabs, Select, DatePicker, Switch } from 'antd';

import './style.scss';

const { TabPane } = Tabs;

const { RangePicker } = DatePicker;

export default () => {
    const [mode] = useState('top');

    const [check, setCheck] = useState(false)
    const [visions, setVisions] = useState([]);

    const [listVision, setListVision] = useState([]);
    const [listCartao, setListCartao] = useState([]);

    const [visionInput, setVisionInput] = useState([]);
    const [visaoSetada, setVisaoSetada] = useState([]);

    const [listDespesas, setListDespesas] = useState([]);
    const [listReceitas, setListReceitas] = useState([]);

    const getvision = useCallback(async () => await GetRequest('api/visions'), [])
    const getcartao = useCallback(async () => await GetRequest('api/cartoes'), [])


    const requestApi = useCallback(async () => {
        const loadVision = await loadVisions();
        const despesas = await GetRequest('api/chartDespesa');
        const receitas = await GetRequest('api/chartReceita');
        const listavisao = await getvision()
        const listacartao = await getcartao();

        setVisions(loadVision);
        setListDespesas(despesas);
        setListReceitas(receitas);
        setListVision(listavisao);
        setListCartao(listacartao);

    }, [getvision, getcartao])

    useEffect(() => {
        requestApi();
    }, [requestApi])

    function filtroVisao(visao) {
        const visaoData = listVision.filter((filtroVisao) => filtroVisao.VISAO === visao);
        setVisionInput(visao);
        setVisaoSetada(visaoData);
        console.log(visaoData)
    }

    function Tratadata(dataImportada) {
        const data = moment(dataImportada)
        let mm = data.get("month") + 1;
        mm = mm < 10 ? '0' + mm : mm
        let dd = data.get("date");
        dd = dd < 10 ? '0' + dd : dd
        const yy = data.get("year");
        return yy + '-' + mm + '-' + dd + 'T03:00:00.000Z'
    }

    function filtroVisaoPersonalizado(data) {
        const Inicio = Tratadata(data[0])
        const Final = Tratadata(data[1])
        const visaoData = [{
            DT_INICIO: Inicio,
            DT_FIM: Final
        }]
        setVisaoSetada(visaoData);
    }

    return (
        <div className='ContainerResumo'>
            <Switch
                onChange={valor => {
                    if (valor === true)
                        setVisionInput([])

                    setCheck(valor)
                }}
                checked={check}
            />
            <div className='FilterVision'>
                <Select
                    style={{ width: '100%' }}
                    placeholder="Filtrar por Visão"
                    disabled={check === false ? false : true}
                    value={visionInput}
                    onSelect={(valor) => filtroVisao(valor)}>
                    {visions}
                </Select>
            </div>
            <div className='FilterData'>

                <RangePicker
                    onChange={(dataString) => filtroVisaoPersonalizado(dataString)}
                    format="DD/MM/YYYY"
                    placeholder='Periodo de Consulta'
                    disabled={check === false ? true : false} />
                />

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
                    <Receitas data={listReceitas} visao={visaoSetada} />
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