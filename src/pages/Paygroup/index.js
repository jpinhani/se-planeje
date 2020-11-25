import React, { useEffect, useState, useCallback } from 'react';

import PayGroupResult from '../PaygroupResult';

import { useDispatch, useSelector } from 'react-redux'
import { GetRequest, visionSerchMeta, InsertRequest } from '../../components/crudSendAxios/crud';
import { loadCartaoReal, loadConta } from '../../components/ListagemCombo';

import { verifySend } from '../../components/verifySendAxios/index';

import SearchFilter from '../../components/searchFilterTable';
import moment from 'moment';
import { InputNumber, Input, DatePicker, Checkbox, Select, Button } from 'antd';

import {
    DislikeOutlined,
    LikeTwoTone,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    DollarOutlined
} from '@ant-design/icons'



import './style.scss'



const dateFormat = 'DD/MM/YYYY'
const { Option } = Select;

export default () => {

    const dispatch = useDispatch();
    const visionControler = useSelector(state => state.visionControler)

    const [data, setdata] = useState();
    const [oldData, setOldData] = useState();
    const [oldVision, setOldVision] = useState();

    const [rs, setRs] = useState(false)

    const [isEnvio, setIsEnvio] = useState(false);

    const [listCartao, setListCartao] = useState([]);
    const [listConta, setListConta] = useState([]);
    const [search, setSearch] = useState('');
    const [visions, setVisions] = useState([]);
    const [mapvision, setMapVision] = useState([]);

    async function requestApi() {

        const resultCartao = await loadCartaoReal()
        const resultConta = await loadConta()

        setListCartao(resultCartao);
        setListConta(resultConta);

        const despesas = await GetRequest('api/despesas');
        const receitas = await GetRequest('api/receitas');

        const newExpense = despesas.map((data) => {
            return {
                idUser: data.ID_USER,
                Check: false,
                Id: data.ID,
                Tipo: "DESPESA",
                Categoria: data.DESCR_CATEGORIA,
                Descricao: data.DESCR_DESPESA,
                DataPrevista: data.DATANOVA,
                DataReal: null,
                DataRealValue: moment(),
                VlPrevisto: data.VL_PREVISTO,
                VlReal: " ",
                VlRealNumber: data.VL_PREVISTO2,
                PagamentoEm: 0,
                CartaoConta: " ",
                CartaoContaValue: data.CARTAO,
                IsCartaoForm: false,
                IsCartao: data.CARTAO ? true : false,
                IdCartaoForm: [],
                IdCartao: data.ID_CARTAO,
                Status: data.STATUS,
                DT_PREVISTO: data.DT_PREVISTO
            }
        })

        const newRevenue = receitas.map((data) => {
            return {
                idUser: data.ID_USER,
                Check: false,
                Id: data.ID,
                Tipo: "RECEITA",
                Categoria: data.DESCR_CATEGORIA,
                Descricao: data.DESCR_RECEITA,
                DataPrevista: data.DATANOVA,
                DataReal: null,
                DataRealValue: moment(),
                VlPrevisto: data.VL_PREVISTO,
                VlReal: " ",
                VlRealNumber: data.VL_PREVISTO2,
                PagamentoEm: false,
                CartaoConta: " ",
                CartaoContaValue: " ",
                IsCartaoForm: false,
                IsCartao: false,
                IdCartaoForm: [],
                IdCartao: [],
                Status: data.STATUS,
                DT_PREVISTO: data.DT_PREVISTO
            }
        })

        const dadosFinal = [...newExpense, ...newRevenue]

        setdata(dadosFinal)

    }

    useEffect(() => {
        requestApi();
    }, [])

    function itemSelected(e, dados) {
        if (e.target.checked === true) {

            const dataDemais = data.map((dadosMap) => {

                return {
                    idUser: dadosMap.idUser,
                    Check: dadosMap.Id === dados.Id ? true : dadosMap.Check,
                    Id: dadosMap.Id,
                    Tipo: dadosMap.Tipo,
                    Categoria: dadosMap.Categoria,
                    Descricao: dadosMap.Descricao,
                    DataPrevista: dadosMap.DataPrevista,
                    DataReal: dadosMap.Id === dados.Id ? dadosMap.DataRealValue : dadosMap.DataReal,
                    DataRealValue: dadosMap.DataRealValue,
                    VlPrevisto: dadosMap.VlPrevisto,
                    VlReal: dadosMap.Id === dados.Id ? dadosMap.VlRealNumber : dadosMap.VlReal,
                    VlRealNumber: dadosMap.VlRealNumber,
                    PagamentoEm: dadosMap.PagamentoEm,
                    CartaoConta: dadosMap.Id === dados.Id ? dadosMap.CartaoContaValue : dadosMap.CartaoConta,
                    CartaoContaValue: dadosMap.CartaoContaValue,
                    IsCartaoForm: dadosMap.Id === dados.Id ? dadosMap.IsCartao : dadosMap.IsCartaoForm,
                    IsCartao: dadosMap.IsCartao,
                    IdCartaoForm: dadosMap.Id === dados.Id ? dadosMap.IdCartao : dadosMap.IdCartaoForm,
                    IdCartao: dadosMap.IdCartao,
                    Status: dadosMap.Status,
                    DT_PREVISTO: dadosMap.DT_PREVISTO
                }
            })

            setdata(dataDemais)
        }
        else {

            const dataDemais = data.map((dadosMap) => {

                return {
                    idUser: dadosMap.idUser,
                    Check: dadosMap.Id === dados.Id ? false : dadosMap.Check,
                    Id: dadosMap.Id,
                    Tipo: dadosMap.Tipo,
                    Categoria: dadosMap.Categoria,
                    Descricao: dadosMap.Descricao,
                    DataPrevista: dadosMap.DataPrevista,
                    DataReal: dadosMap.Id === dados.Id ? null : dadosMap.DataReal,
                    DataRealValue: dadosMap.DataRealValue,
                    VlPrevisto: dadosMap.VlPrevisto,
                    VlReal: dadosMap.Id === dados.Id ? " " : dadosMap.VlReal,
                    VlRealNumber: dadosMap.VlRealNumber,
                    PagamentoEm: dadosMap.PagamentoEm,
                    CartaoConta: dadosMap.Id === dados.Id ? " " : dadosMap.CartaoConta,
                    CartaoContaValue: dadosMap.CartaoContaValue,
                    IsCartaoForm: dadosMap.Id === dados.Id ? false : dadosMap.IsCartaoForm,
                    IsCartao: dadosMap.IsCartao,
                    IdCartaoForm: dadosMap.Id === dados.Id ? [] : dadosMap.IdCartaoForm,
                    IdCartao: dadosMap.IdCartao,
                    Status: dadosMap.Status,
                    DT_PREVISTO: dadosMap.DT_PREVISTO
                }
            })

            setdata(dataDemais)

        }

    }

    function inputVlReal(e, Id) {

        const dataDemais = data.map((dados) => {

            return {
                idUser: dados.idUser,
                Check: dados.Check,
                Id: dados.Id,
                Tipo: dados.Tipo,
                Categoria: dados.Categoria,
                Descricao: dados.Descricao,
                DataPrevista: dados.DataPrevista,
                DataReal: dados.DataReal,
                DataRealValue: dados.DataRealValue,
                VlPrevisto: dados.VlPrevisto,
                VlReal: dados.Id === Id ? e : dados.VlReal,
                VlRealNumber: dados.VlRealNumber,
                PagamentoEm: dados.PagamentoEm,
                CartaoConta: dados.CartaoConta,
                CartaoContaValue: dados.CartaoContaValue,
                IsCartaoForm: dados.IsCartaoForm,
                IsCartao: dados.IsCartao,
                IdCartaoForm: dados.IdCartaoForm,
                IdCartao: dados.IdCartao,
                Status: dados.Status,
                DT_PREVISTO: dados.DT_PREVISTO
            }
        })

        setdata(dataDemais)

    }

    function inputCredito(e, Id) {
        const dataDemais = data.map((dados) => {

            return {
                idUser: dados.idUser,
                Check: dados.Check,
                Id: dados.Id,
                Tipo: dados.Tipo,
                Categoria: dados.Categoria,
                Descricao: dados.Descricao,
                DataPrevista: dados.DataPrevista,
                DataReal: dados.DataReal,
                DataRealValue: dados.DataRealValue,
                VlPrevisto: dados.VlPrevisto,
                VlReal: dados.VlReal,
                VlRealNumber: dados.VlRealNumber,
                PagamentoEm: dados.PagamentoEm,
                CartaoConta: dados.CartaoConta,
                CartaoContaValue: dados.CartaoContaValue,
                IsCartaoForm: dados.Id === Id ? e.target.checked === true ? true : false : dados.IsCartaoForm,
                IsCartao: dados.Id === Id ? e.target.checked === true ? true : false : dados.IsCartao,
                IdCartaoForm: dados.Id === Id ? e.target.checked === true ? dados.IdCartao : [] : dados.IdCartaoForm,
                IdCartao: dados.Id === Id ? e.target.checked === true ? dados.IdCartao : [] : dados.IdCartao,
                Status: dados.Status,
                DT_PREVISTO: dados.DT_PREVISTO
            }
        })

        setdata(dataDemais)

    }

    function handleCartao(e, Id) {
        const dataDemais = data.map((dados) => {

            console.log(e, "Valor de E")
            return {
                idUser: dados.idUser,
                Check: dados.Check,
                Id: dados.Id,
                Tipo: dados.Tipo,
                Categoria: dados.Categoria,
                Descricao: dados.Descricao,
                DataPrevista: dados.DataPrevista,
                DataReal: dados.DataReal,
                DataRealValue: dados.DataRealValue,
                VlPrevisto: dados.VlPrevisto,
                VlReal: dados.VlReal,
                VlRealNumber: dados.VlRealNumber,
                PagamentoEm: dados.PagamentoEm,
                CartaoConta: dados.CartaoConta,
                CartaoContaValue: dados.CartaoContaValue,
                IsCartaoForm: dados.IsCartaoForm,
                IsCartao: dados.IsCartao,
                IdCartaoForm: dados.Id === Id ? e : dados.IdCartaoForm,
                IdCartao: dados.Id === Id ? e : dados.IdCartao,
                Status: dados.Status,
                DT_PREVISTO: dados.DT_PREVISTO
            }
        })

        setdata(dataDemais)

    }

    function handleDataReal(Id, date) {

        const dataDemais = data.map((dados) => {

            return {
                idUser: dados.idUser,
                Check: dados.Check,
                Id: dados.Id,
                Tipo: dados.Tipo,
                Categoria: dados.Categoria,
                Descricao: dados.Descricao,
                DataPrevista: dados.DataPrevista,
                DataReal: dados.Id === Id ? date : dados.DataReal,
                DataRealValue: dados.DataRealValue,
                VlPrevisto: dados.VlPrevisto,
                VlReal: dados.VlReal,
                VlRealNumber: dados.VlRealNumber,
                PagamentoEm: dados.PagamentoEm,
                CartaoConta: dados.CartaoConta,
                CartaoContaValue: dados.CartaoContaValue,
                IsCartaoForm: dados.IsCartaoForm,
                IsCartao: dados.IsCartao,
                IdCartaoForm: dados.IdCartaoForm,
                IdCartao: dados.IdCartao,
                Status: dados.Status,
                DT_PREVISTO: dados.DT_PREVISTO
            }
        })

        setdata(dataDemais)

    }


    const getvision = useCallback(async () => await GetRequest('api/visions'), [])

    const filterVision = async (selectVisao) => {
        dispatch({ type: 'LIST_VISIONCONTROLER', payload: selectVisao })
    }

    const listaVisao = useCallback(async () => {
        const resultVision = await getvision();

        const options = resultVision.map((desc, i) =>
            <Option key={i} value={desc.VISAO}>
                {desc.VISAO}
            </Option>
        )

        options.push(<Option key='all' value='ALL'>TODAS VISÕES</Option>)

        setVisions(options)

        setMapVision(resultVision)
    }, [getvision])

    useEffect(() => {
        listaVisao();
    }, [listaVisao]);

    function submitGroupRolback() {

        setOldData([])
        setdata(oldData)

        setOldVision([])
        filterVision(oldVision)

        setIsEnvio(false);
    }

    function submitGroup() {

        const ItensMarcados = data.filter(filtro => filtro.Check === true)

        setOldData(data)
        setdata(ItensMarcados)

        setOldVision(visionControler)
        filterVision('ALL')

        setIsEnvio(true);
    }

    async function submitGroupFinal() {


        const resulStatus = await InsertRequest(data, 'api/paygroup')
        verifySend(resulStatus, 'INSERT', 'ITENS EM LOTE')


        if (resulStatus)
            setRs(true)

    }


    return (
        <div>

            {rs === true ? <PayGroupResult /> :




                <div style={{ width: '100%' }}>
                    {isEnvio === true ?
                        <Button type="link"
                            onClick={() => submitGroupRolback()}><ArrowLeftOutlined style={{ paddingRight: '10px' }} />  Voltar  </Button> : ""}
                    {isEnvio === true ?
                        <Button type="danger"
                            onClick={() => submitGroupFinal()}> <DollarOutlined style={{ paddingRight: '10px' }} /> Enviar Pagamentos </Button> :
                        <Button type="primary "
                            onClick={() => submitGroup()}> <ArrowRightOutlined style={{ paddingRight: '10px' }} /> Próximo </Button>
                    }
                    <div className='ViewExpense'>
                        <Input
                            name='despesa'
                            value={search}
                            onChange={valor => setSearch(valor.target.value)}
                            placeholder="Procure aqui a despesa especifica" />
                        <Select style={{ width: '50%' }}
                            placeholder="Filtrar por Visão"
                            value={visionControler}
                            disabled={isEnvio}
                            onSelect={(visao) => filterVision(visao)}
                        >
                            {visions}
                        </Select>
                    </div>

                    <div style={{ display: 'flex', width: '100%' }}>
                        {/* <div className="paygroupHeader"></div> */}
                        {/* <div className="paygroupHeader"></div>
                <div className="paygroupHeader">Categoria</div>
                <div className="paygroupHeader">Descrição</div>
                <div className="paygroupHeader">DT Prev</div>
                <div className="paygroupHeader">DT Real</div>
                <div className="paygroupHeader">R$ Prev</div>
                <div className="paygroupHeader">R$ Real</div>
                <div className="paygroupHeader">Crédito?</div>
                <div className="paygroupHeader">Amortizar?</div> */}
                        {/* <div className="paygroupHeader">Pagamento</div> */}
                    </div>
                    {
                        data ? SearchFilter(
                            visionSerchMeta(mapvision, data, visionControler),
                            ['Decricao', 'Categoria'], search).sort(function (a, b) {
                                if (a.DT_PREVISTO < b.DT_PREVISTO) return -1;
                                if (a.DT_PREVISTO > b.DT_PREVISTO) return 1;
                                return 0;
                            }).map((dados) =>

                                <div key={dados.Id}
                                    className="groupPaymentLine">
                                    <div
                                        className="groupCheck">
                                        <Checkbox
                                            checked={dados.Check}
                                            onChange={e => itemSelected(e, dados)} />
                                    </div>

                                    <div className="paygroupIcon">
                                        <h3 className="optionalHeader">{dados.Tipo}</h3>
                                        {dados.Tipo === "DESPESA" ?
                                            <DislikeOutlined
                                                title={dados.Tipo}
                                                style={{
                                                    fontSize: '18px', color: 'red'
                                                }}
                                            /> :
                                            <LikeTwoTone
                                                title={dados.Tipo}
                                                style={{
                                                    fontSize: '18px', color: '#08c'
                                                }}
                                            />
                                        }
                                    </div>

                                    <div className="paygroupCategoria">
                                        <h3 className="optionalHeader">CATEGORIA</h3>
                                        {dados.Categoria}
                                    </div>
                                    <div className="paygroupCategoria">
                                        <h3 className="optionalHeader">DESCRIÇÃO</h3>
                                        {dados.Descricao}
                                    </div>

                                    <div className="paygroupData">
                                        <h3 className="optionalHeader">DATA PREVISTA</h3>
                                        {dados.DataPrevista}
                                    </div>

                                    <div className="paygroupData">
                                        <DatePicker
                                            style={{ width: "100%" }}
                                            placeholder="Data Real"
                                            value={dados.DataReal}
                                            disabled={dados.Check === true ? false : true}
                                            onChange={data => handleDataReal(dados.Id, data)}
                                            format={dateFormat}
                                        /></div>

                                    <div className="paygroupValor">
                                        <h3 className="optionalHeader">R$ PREVISTO</h3>
                                        {dados.VlPrevisto}
                                    </div>

                                    <div className="paygroupValor">
                                        <InputNumber
                                            style={{ width: "100%" }}
                                            value={dados.VlReal}
                                            disabled={dados.Check === true ? false : true}
                                            onChange={e => inputVlReal(e, dados.Id)}
                                            decimalSeparator=','
                                            precision={2}
                                            min={0}
                                        />
                                    </div>

                                    <div
                                        className="groupCheckOutros">
                                        <h3 className="optionalHeader">CRÉDITO ?</h3>
                                        <Checkbox
                                            disabled={dados.Check === true ? dados.Tipo === "DESPESA" ? false : true : true}
                                            onChange={e => inputCredito(e, dados.Id)}
                                            checked={dados.IsCartaoForm} />
                                    </div>

                                    <div
                                        className="groupCheckOutros">
                                        <h3 className="optionalHeader">AMORTIZAR ?</h3>

                                        <Checkbox
                                            disabled={dados.Check === true ? false : true} />
                                    </div>

                                    <div className="groupCartao">
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (
                                                option.props.children.toLowerCase()
                                                    .indexOf(input.toLowerCase()) >= 0
                                            )}
                                            style={{ width: '100%' }}
                                            placeholder="Informe a Cartão ou Conta"
                                            disabled={dados.Check === true ? false : true}
                                            value={dados.IdCartaoForm}
                                            onSelect={e => handleCartao(e, dados.Id)}

                                        >
                                            {dados.IsCartao === true ? listCartao : listConta}
                                        </Select>
                                    </div>
                                </div>
                            ) : "Busque por itens para serem transacionados em Grupo"
                    }

                </div >
            }
        </div>
    )
}