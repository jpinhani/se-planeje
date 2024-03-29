import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Modal, Input, Select, DatePicker, InputNumber, Switch, Divider, Form, notification } from 'antd'
import { DislikeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { userID } from '../../../services/urlBackEnd'
import { loadCategoria, loadCartaoReal, loadConta } from '../../ListagemCombo'
import { GetRequest, UpdateRequest } from '../../crudSendAxios/crud'

import { verifySend } from '../../verifySendAxios/index'

import 'antd/dist/antd.css';
import './styles.scss'

const { TextArea } = Input;
const dateFormat = 'DD/MM/YYYY'

function DespesaPagar(props) {

    const dispatch = useDispatch();
    const home = useSelector(state => state.home)

    const [visible, setVisible] = useState(false);
    const [visibleConta, setVisibleConta] = useState((props.data.ID_CARTAO === 0 | props.data.ID_CARTAO === null) ? false : true);
    const [visibleCartao, setVisibleCartao] = useState((props.data.ID_CARTAO === 0 | props.data.ID_CARTAO === null) ? true : false);
    const [visibleTipoPagamento, setVisibleTipoPagamento] = useState((props.data.ID_CARTAO === 0 | props.data.ID_CARTAO === null) ? `A VISTA` : `CRÉDITO`);
    const [check, setCheck] = useState((props.data.ID_CARTAO === 0 | props.data.ID_CARTAO === null) ? false : true);
    const [visibleEdit, setVisibleEdit] = useState('Essa Despesa Esta Sendo Contabilizada');
    const [enableSaldo, setEnableSaldo] = useState(false);
    const [categoria, setCategoria] = useState(props.data.ID_CATEGORIA);
    const [cartao, setCartao] = useState(props.data.ID_CARTAO);
    const [conta, setConta] = useState([]);

    const [valorPrevistoInput] = useState(props.data.VL_PREVISTO2);
    const [dataPrevistaInput] = useState(props.data.DATANOVA);
    const [cartaoInput, setCartaoInput] = useState((props.data.ID_CARTAO === 0 | props.data.ID_CARTAO === null) ? 'DÉBITO OU DINHEIRO' : props.data.ID_CARTAO);
    const [parcelasInput] = useState(props.data.NUM_PARCELA);
    const [categoriaInput] = useState(props.data.ID_CATEGORIA);
    const [descrDespesaInput, setDescrDespesaInput] = useState(props.data.DESCR_DESPESA);
    const [contaInput, setContaInput] = useState([]);
    const [valorRealizadoInput, setValorRealizadoInput] = useState(null);
    const [dataRealInput, setDataRealInput] = useState('');

    async function showModal() {
        const resultCategoria = await loadCategoria()
        const resultCartao = await loadCartaoReal()
        const resultConta = await loadConta()

        setCategoria(resultCategoria);
        setCartao(resultCartao);
        setConta(resultConta);
        setVisible(true);
    };

    function handleEdit(valor) {

        setEnableSaldo(valor);
        if (valor === true)
            return setVisibleEdit(`Essa Despesa Esta Sendo Amortizada`);


        return setVisibleEdit(`Essa Despesa Esta Sendo Contabilizada`);

    }

    function handletipoPagamento(tipo) {
        if (tipo === true) {
            setVisibleTipoPagamento(`CRÉDITO`);
            setCheck(true);
            setContaInput([]);
            setVisibleConta(true);
            setCartaoInput((props.data.ID_CARTAO === 0 | props.data.ID_CARTAO === null) ? [] : props.data.ID_CARTAO);
            setVisibleCartao(false);
        } else {
            setVisibleTipoPagamento(`A VISTA`);
            setVisibleConta(false);
            setCheck(false);
            setCartaoInput('DÉBITO OU DINHEIRO');
            setVisibleCartao(true);
        }
        props.form.resetFields('contaid', 'cartao')
    }

    function handledescricaoDespesa(despesa) {
        setDescrDespesaInput(despesa.toUpperCase());
    }

    function handleValorReal(valor) {
        setValorRealizadoInput(valor);
    }

    function handleDataReal(date, dateString) {
        setDataRealInput(dateString);
    }

    function handleConta(valorConta) {
        setContaInput(valorConta);
    }

    function handleCartao(valorCartao) {
        setCartaoInput(valorCartao);
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        props.form.validateFields((err) => {
            if (!err) handleSubmitok()
        });
    }

    async function handleSubmitok() {

        const valueStatus = cartaoInput === 'DÉBITO OU DINHEIRO' ? 'Pagamento Realizado' : 'Fatura Pronta Para Pagamento';
        const valueData = dataRealInput ? dataRealInput : moment(new Date(), dateFormat);
        const valueCartao = cartaoInput === 'DÉBITO OU DINHEIRO' ? null : cartaoInput;
        const valueConta = cartaoInput === 'DÉBITO OU DINHEIRO' ? contaInput : null;

        console.log("enableSaldo", enableSaldo)

        const body = {
            id: props.data.ID,
            idUser: userID(),
            valueEdit: enableSaldo === true ? `Essa Despesa Esta Sendo Amortizada` : `Essa Despesa Esta Sendo Contabilizada`,
            idGrupo: props.data.ID_GRUPO,
            categoria: categoriaInput,
            cartao: valueCartao,
            parcela: parcelasInput,
            valorPrevisto: valorPrevistoInput !== props.data.VL_PREVISTO2 ? props.data.VL_PREVISTO2 : valorPrevistoInput,
            dataPrevista: dataPrevistaInput,
            descrDespesa: descrDespesaInput,
            idConta: valueConta,
            valorReal: valorRealizadoInput,
            dataReal: valueData,
            status: valueStatus,
        }

        const data = moment(body.dataReal, "DD/MM/YYYY");
        body.dataReal = data.format("YYYY-MM-DD")

        const dataPrev = moment(body.dataPrevista, "DD/MM/YYYY");
        body.dataPrevista = dataPrev.format("YYYY-MM-DD")

        const resulStatus = await UpdateRequest(body, 'api/despesas/pagar')
        if (resulStatus.status === 402)
            return notification.open({
                message: 'SePlaneje - Problemas Pagamento',
                duration: 20,
                description:
                    `Poxa!!! 
                        Foram identificados problemas com o pagamento da sua assinatura, acesse a página de Pagamento ou entre em contato conosco...`,
                style: {
                    width: '100%',
                    marginLeft: 335 - 600,
                },
            });
        verifySend(resulStatus, 'METAPAGA', body.descrDespesa)

        if (resulStatus === 200) {
            const despesa = await GetRequest('api/despesas')
            setVisible(false)

            dispatch({
                type: 'LIST_EXPENSE',
                payload: despesa
            })

            dispatch({
                type: 'LIST_HOME',
                payload: 1 + home
            })

        }
    }

    const { getFieldDecorator } = props.form;

    return (
        <div>
            <form>
                <Modal
                    title="Efetuar Pagamento Despesa Prevista"
                    visible={visible}
                    onOk={handleSubmit}
                    onCancel={() => setVisible(false)}
                    className="ModalDespesa"
                >

                    <div style={{ width: '99%', textAlign: 'initial' }}>
                        <Switch
                            title='Pagamento no Crédito ou no Dinheiro?'
                            onChange={valor => handletipoPagamento(valor)}
                            checked={check} />

                        <label style={{ padding: '10px' }}>
                            <strong>
                                {visibleTipoPagamento}
                            </strong>
                        </label>

                        <Switch
                            style={{ width: '10%' }}
                            title='Habilite para Amortizações'
                            onChange={valor => handleEdit(valor)} />

                        <label style={{ padding: '15px' }}> {visibleEdit}</label>

                    </div>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <Form.Item style={{ width: '50%' }}>
                            {getFieldDecorator('vlreal', {
                                rules: [{ required: true, message: 'Informe o valor Pago!' }],
                                initialValue: valorRealizadoInput
                            })(
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Valor Real"
                                    decimalSeparator=','
                                    precision={2}
                                    min={0}
                                    onChange={valor => handleValorReal(valor)}
                                />)}
                        </Form.Item>
                        <Form.Item style={{ width: '50%' }}>
                            {getFieldDecorator('dtteral', {
                                rules: [{ required: true, message: 'Por Favor, informe a Data Realizada!' }],
                                initialValue: moment(new Date(), dateFormat)
                            })(
                                <DatePicker style={{ width: '100%' }}
                                    onChange={data => handleDataReal(data)}
                                    placeholder="Data Real"
                                    format={dateFormat}
                                />)}
                        </Form.Item>
                    </div>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <Form.Item style={{ width: '50%' }}>
                            {getFieldDecorator('contaid', {
                                rules: [{
                                    required: visibleConta === true ? false : true,
                                    message: 'Por favor informe a conta de pagamento!'
                                }],
                                initialValue: contaInput
                            })(
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="Informe a Conta"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (
                                        option.props.children.toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    )}
                                    disabled={visibleConta}
                                    onSelect={valor => handleConta(valor)}
                                >
                                    {conta}
                                </Select>)}
                        </Form.Item>
                        <Form.Item style={{ width: '50%' }}>
                            {getFieldDecorator('cartao', {
                                rules: [{
                                    required: visibleCartao === true ? false : true,
                                    message: 'Por favor, informe o cartão de crédito!'
                                }],
                                initialValue: cartaoInput
                            })(
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="Informe o Cartão"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (
                                        option.props.children.toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    )}
                                    disabled={visibleCartao}
                                    onSelect={valor => handleCartao(valor)}
                                >
                                    {cartao}
                                </Select>)}
                        </Form.Item>
                    </div>
                    <TextArea
                        placeholder="Descreva a Despesa"
                        style={{ width: '99%' }}
                        rows={4}
                        onChange={(event) => handledescricaoDespesa(event.target.value)}
                        value={descrDespesaInput}
                    />

                    <Divider orientation="left">Detalhes da Despesa - Meta</Divider>

                    <InputNumber
                        style={{ width: '49%' }}
                        placeholder="Valor Previsto"
                        decimalSeparator=','
                        precision={2}
                        min={0}
                        disabled
                        value={valorPrevistoInput !== props.data.VL_PREVISTO2 ? props.data.VL_PREVISTO2 : valorPrevistoInput}
                    />

                    <DatePicker style={{ width: '49%' }}
                        placeholder="Data Prevista"
                        defaultValue={moment(dataPrevistaInput, dateFormat)}
                        format={dateFormat}
                        disabled
                    />

                    <InputNumber
                        style={{ width: '35%' }}
                        placeholder='N Parcelas'
                        min={1}
                        value={parcelasInput}
                        disabled
                    />

                    <Select
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => (
                            option.props.children.toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        )}
                        style={{ width: '64%' }}
                        placeholder="Informe a Categoria"
                        disabled
                        value={categoriaInput}
                    >
                        {categoria}
                    </Select>

                </Modal>
            </form>

            <DislikeOutlined
                title='Efetuar Contabilização'
                style={{
                    fontSize: '18px', color: 'red'
                }}
                onClick={showModal} />
        </div >
    )
}

const WrappedApp = Form.create({ name: 'coordinated' })(DespesaPagar);

export default WrappedApp