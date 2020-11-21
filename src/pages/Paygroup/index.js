import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { GetRequest, visionSerchMeta } from '../../components/crudSendAxios/crud';
import { loadCartaoReal, loadConta } from '../../components/ListagemCombo';
import SearchFilter from '../../components/searchFilterTable';
import moment from 'moment';
import { Input, DatePicker, Checkbox, Select, Button } from 'antd';

const dateFormat = 'DD/MM/YYYY'
const { Option } = Select;

export default () => {

    const dispatch = useDispatch();
    const visionControler = useSelector(state => state.visionControler)
    const [data, setdata] = useState();
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
                Check: dados.Check,
                Id: dados.Id,
                Tipo: dados.Tipo,
                Categoria: dados.Categoria,
                Descricao: dados.Descricao,
                DataPrevista: dados.DataPrevista,
                DataReal: dados.DataReal,
                DataRealValue: dados.DataRealValue,
                VlPrevisto: dados.VlPrevisto,
                VlReal: dados.Id === Id ? e.target.value : dados.VlReal,
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

            return {
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


    function submitGroup() {

        const ItensMarcados = data.filter(filtro => filtro.Check === true)

        console.table(ItensMarcados)
    }


    return (
        <div style={{ width: '100%' }}>
            <Button type="primary "
                onClick={() => submitGroup()}> Enviar Pagamentos</Button>
            <div className='ViewExpense'>
                <Input
                    name='despesa'
                    value={search}
                    onChange={valor => setSearch(valor.target.value)}
                    placeholder="Procure aqui a despesa especifica" />
                <Select style={{ width: '50%' }}
                    placeholder="Filtrar por Visão"
                    value={visionControler}
                    onSelect={(visao) => filterVision(visao)}
                >
                    {visions}
                </Select>
            </div>

            <div style={{ display: 'flex', width: '100%' }}>
                <div style={{ display: 'flex', width: '30px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>Flag</div>
                <div style={{ display: 'flex', width: '80px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>Tipo</div>
                <div style={{ display: 'flex', width: '150px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>Categoria</div>
                <div style={{ display: 'flex', width: '180px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>Descricao</div>
                <div style={{ display: 'flex', width: '130px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>DT Prevista</div>
                <div style={{ display: 'flex', width: '130px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>DT Real</div>
                <div style={{ display: 'flex', width: '130px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>Vl Previsto</div>
                <div style={{ display: 'flex', width: '130px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>Vl Real</div>
                <div style={{ display: 'flex', width: '130px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>Crédito?</div>
                <div style={{ display: 'flex', width: '130px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>Amortizar?</div>
                <div style={{ display: 'flex', width: '130px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>Cartao/Conta</div>
            </div>
            {data ? SearchFilter(
                visionSerchMeta(mapvision, data, visionControler),
                ['Decricao', 'Categoria'], search).sort(function (a, b) {
                    if (a.DT_PREVISTO < b.DT_PREVISTO) return -1;
                    if (a.DT_PREVISTO > b.DT_PREVISTO) return 1;
                    return 0;
                }).map((dados) =>

                    <div key={dados.Id} style={{ display: 'flex', alignItems: 'center', width: '100%', borderBottom: '1px solid', borderColor: 'grey' }}>
                        <div
                            style={{
                                display: 'flex',
                                width: '30px',
                                justifyContent: 'center',
                                fontSize: '10px'
                            }}>
                            <Checkbox
                                checked={dados.Check}
                                onChange={e => itemSelected(e, dados)} />
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                width: '80px',
                                justifyContent: 'center',
                                fontSize: '10px'
                            }}>
                            {dados.Tipo}
                        </div>

                        <div style={{
                            display: 'flex',
                            width: '150px',
                            justifyContent: 'left',
                            fontSize: '10px'
                        }}>
                            {dados.Categoria}
                        </div>
                        <div style={{
                            display: 'flex',
                            width: '180px',
                            justifyContent: 'left',
                            fontSize: '10px'
                        }}>
                            {dados.Descricao}
                        </div>

                        <div style={{
                            display: 'flex',
                            width: '130px',
                            justifyContent: 'center',
                            fontSize: '10px'
                        }}>
                            {dados.DataPrevista}
                        </div>

                        <div style={{
                            display: 'flex',
                            width: '130px',
                            justifyContent: 'center',
                            fontSize: '10px'
                        }}>
                            <DatePicker
                                placeholder="Data Real"
                                value={dados.DataReal}
                                disabled={dados.Check === true ? false : true}
                                onChange={data => handleDataReal(dados.Id, data)}
                                format={dateFormat}
                            /></div>

                        <div style={{
                            display: 'flex',
                            width: '130px',
                            justifyContent: 'center',
                            fontSize: '10px'
                        }}>
                            {dados.VlPrevisto}
                        </div>

                        <div style={{
                            display: 'flex',
                            width: '130px',
                            justifyContent: 'center',
                            fontSize: '10px'
                        }}>
                            <Input
                                value={dados.VlReal}
                                disabled={dados.Check === true ? false : true}
                                onChange={e => inputVlReal(e, dados.Id)} />
                        </div>

                        <div style={{
                            display: 'flex',
                            width: '130px',
                            justifyContent: 'center',
                            fontSize: '10px'
                        }}>
                            <Checkbox
                                disabled={dados.Check === true ? dados.Tipo === "DESPESA" ? false : true : true}
                                onChange={e => inputCredito(e, dados.Id)}
                                checked={dados.IsCartaoForm} />
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                width: '130px',
                                justifyContent: 'center',
                                fontSize: '10px'
                            }}>
                            <Checkbox
                                disabled={dados.Check === true ? false : true} />
                        </div>

                        <div style={{
                            display: 'flex',
                            width: '130px',
                            justifyContent: 'center',
                            fontSize: '10px'
                        }}>
                            <Select
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => (
                                    option.props.children.toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                )}
                                style={{ width: '130px' }}
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
    )
}