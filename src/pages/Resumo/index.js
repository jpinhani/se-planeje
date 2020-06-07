import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';

import Despesas from '../ResumoDespesa';
import Receitas from '../ResumoReceita';
import Transferencias from '../ResumoTransferencia';
import Resumo from '../ResumoComponente';
import Categorias from '../ResumoCategorias';

import { loadVisions } from '../../components/ListagemCombo';
import { GetRequest } from '../../components/crudSendAxios/crud';

import { SaldoConta, groupByConta } from '../../components/SaldoConta';
import { SaldoTransferencia } from '../../components/SaldoTransferencias';

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
    const [listTransferencias, setListTransferencias] = useState([]);

    const [contaSaldoAtual, setContaSaldoAtual] = useState([]);

    const getvision = useCallback(async () => await GetRequest('api/visions'), [])
    const getcartao = useCallback(async () => await GetRequest('api/cartoes'), [])

    const RequestGeneral = useCallback(async () => {
        const loadVision = await loadVisions();
        const despesas = await GetRequest('api/chartDespesa');
        const receitas = await GetRequest('api/chartReceita');
        const transferencias = await GetRequest('api/transferencia');
        const listavisao = await getvision()
        const listacartao = await getcartao();

        loadVision.pop();
        setVisions(loadVision);

        setListDespesas(despesas);
        setListReceitas(receitas);
        setListTransferencias(transferencias)

        setListVision(listavisao);
        setListCartao(listacartao);

    }, [getcartao, getvision])

    useEffect(() => {
        RequestGeneral();
    }, [RequestGeneral])

    const SaldoAtual = useCallback((despesas, receitas, transferencias) => {

        const SaldoDespesa = SaldoConta(despesas, 'Despesa', visaoSetada.length > 0 ? visaoSetada[0].DT_FIM : moment());
        const SaldoReceita = SaldoConta(receitas, 'Receita', visaoSetada.length > 0 ? visaoSetada[0].DT_FIM : moment());
        const SaldoTransfCredito = SaldoTransferencia(transferencias, 'Receita', visaoSetada.length > 0 ? visaoSetada[0].DT_FIM : moment());
        const SaldoTransfDebito = SaldoTransferencia(transferencias, 'Despesa', visaoSetada.length > 0 ? visaoSetada[0].DT_FIM : moment());

        const SaldoFinal = groupByConta([...SaldoDespesa,
        ...SaldoTransfDebito,
        ...SaldoReceita,
        ...SaldoTransfCredito], 'Outro')
        setContaSaldoAtual(SaldoFinal);

    }, [visaoSetada])

    const requestApi = useCallback(async () => {

        SaldoAtual(listDespesas, listReceitas, listTransferencias)

    }, [SaldoAtual, listDespesas, listReceitas, listTransferencias])

    useEffect(() => {
        requestApi();
    }, [requestApi])


    function filtroVisao(visao) {
        const visaoData = listVision.filter((filtroVisao) => filtroVisao.VISAO === visao);
        setVisionInput(visao);
        setVisaoSetada(visaoData);

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
            <span className='Label'>{check === true ? '  Analisar por período Personalizado' : ' Analisar por Visão'}</span>
            <div className='FilterVision'>
                <div className='containerVision'>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Filtrar por Visão"
                        disabled={check === false ? false : true}
                        value={visionInput}
                        onSelect={(valor) => filtroVisao(valor)}>
                        {visions}
                    </Select>
                </div>
                <div className='containerVision'>
                    <RangePicker
                        style={{ width: '100%' }}
                        onChange={(dataString) => filtroVisaoPersonalizado(dataString)}
                        format="DD/MM/YYYY"
                        placeholder='Periodo de Consulta'
                        disabled={check === false ? true : false}
                    />
                </div>
            </div>
            <Tabs className='ContainerTabs'
                defaultActiveKey="1"
                tabPosition={mode}>
                <TabPane tab='Resumo' key='1'>
                    <Resumo
                        saldo={contaSaldoAtual}
                        despesa={listDespesas}
                        cartao={listCartao}
                        visao={visaoSetada}
                        receita={listReceitas}
                        transferencia={listTransferencias} />
                </TabPane>

                <TabPane tab='Despesas' key='2'>
                    <Despesas
                        data={listDespesas}
                        visao={visaoSetada}
                        cartao={listCartao} />
                </TabPane>

                <TabPane tab='Receitas' key='3'>
                    <Receitas
                        data={listReceitas}
                        visao={visaoSetada} />
                </TabPane>

                <TabPane tab='Transferências' key='4'>
                    <Transferencias
                        data={listTransferencias}
                        visao={visaoSetada} />
                </TabPane>

                <TabPane tab='Plano de Categorias' key='5'>
                    <Categorias
                        data={listDespesas}
                        visao={visaoSetada}
                        cartao={listCartao} />
                </TabPane>
            </Tabs>
        </div>
    )
}