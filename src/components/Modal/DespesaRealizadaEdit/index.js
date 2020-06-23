import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { Icon, Modal, Input, Select, DatePicker, InputNumber, Switch, Form, notification } from 'antd'
import moment from 'moment';

import { userID } from '../../../services/urlBackEnd'

import { loadCategoria, loadCartaoReal, loadConta } from '../../ListagemCombo'
import { GetRequest, UpdateRequest } from '../../crudSendAxios/crud'
import { verifySend } from '../../verifySendAxios/index'

import 'antd/dist/antd.css';
import './styles.scss'

const { TextArea } = Input;

const dateFormat = 'DD/MM/YYYY'

function ModalExpenseEdit(props) {

    const dispatch = useDispatch();

    const [visible, setVisible] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(props.data.DESCR_CONTA === null ? 'CRÉDITO' : 'A VISTA');
    const [check, setCheck] = useState(props.data.DESCR_CONTA === null ? true : false);
    const [stateConta, setStateConta] = useState(props.data.DESCR_CONTA === null ? true : false);
    const [stateCartao, setStateCartao] = useState(props.data.DESCR_CONTA === null ? false : true);
    const [categoria, setCategoria] = useState([]);
    const [cartao, setCartao] = useState([]);
    const [conta, setConta] = useState([]);
    const [valorRealInput, setValorRealInput] = useState(props.data.VL_REAL2);
    const [dataRealInput, setDataRealInput] = useState(props.data.DATANOVAREAL);
    const [cartaoInput, setCartaoInput] = useState(props.data.CARTAO === null ? [] : props.data.ID_CARTAO);
    const [categoriaInput, setCategoriaInput] = useState(props.data.ID_CATEGORIA);
    const [contaInput, setContaInput] = useState(props.data.DESCR_CONTA === null ? [] : props.data.ID_CONTA);
    const [descrDespesaInput, setDescrDespesaInput] = useState(props.data.DESCR_DESPESA);


    async function showModal() {
        const resultCategoria = await loadCategoria()
        const resultCartao = await loadCartaoReal()
        const resultConta = await loadConta()

        setCategoria(resultCategoria);
        setCartao(resultCartao);
        setConta(resultConta);
        setVisible(true);
    }

    function handletipoPagamento(value) {
        if (value === true) {
            setVisibleEdit(`CRÉDITO`);
            setStateConta(true);
            setContaInput([]);
            // setCartaoInput(props.data.ID_CARTAO);
            setCheck(true);
            setStateCartao(false);
        } else {
            setVisibleEdit(`A VISTA`);
            setStateConta(false);
            setCartaoInput([]);
            // setContaInput(props.data.ID_CONTA);
            setCheck(false);
            setStateCartao(true);
        }

        // props.form.resetFields('cartao')
        // props.form.resetFields('conta')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        props.form.validateFields((err) => { /* !err */

            if (!err) handleSubmitok()
        });
    }

    async function handleSubmitok() {

        const body = {
            id: props.data.ID,
            idGrupo: props.data.ID_GRUPO,
            idUser: userID(),
            dataPrevista: props.data.DT_PREVISTO,
            dataReal: moment(dataRealInput, "DD/MM/YYYY"),
            valorReal: valorRealInput,
            valorCorrigir: props.data.VL_REAL2 - valorRealInput,
            cartao: cartaoInput,
            conta: contaInput,
            categoria: categoriaInput,
            parcela: '1',
            descrDespesa: descrDespesaInput,
            status: visibleEdit === 'A VISTA'
                ? 'Pagamento Realizado'
                : 'Fatura Pronta Para Pagamento',
        }

        const data = moment(body.dataReal, "DD/MM/YYYY");
        body.dataReal = data.format("YYYY-MM-DD")

        const resulStatus = await UpdateRequest(body, 'api/despesas/real')
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
        verifySend(resulStatus, 'UPDATE', body.descrDespesa)


        if (resulStatus === 200) {
            const despesareal = await GetRequest('api/despesas/paga')

            dispatch({
                type: 'LIST_EXPENSEREAL',
                payload: despesareal
            })

            setVisible(false)
        }

    }

    const { getFieldDecorator } = props.form;
    return (
        <div>
            <Icon
                type="edit"
                style={{ fontSize: '18px', color: '#08c' }}
                title='Adicionar nova Despesa Prevista'
                theme="twoTone"
                onClick={showModal} />

            <form>
                <Modal
                    title="Editar Registro de Despesa Realizada"
                    visible={visible}
                    onOk={handleSubmit}
                    onCancel={() => setVisible(false)}
                    className="ModalDespesa"
                >
                    <div style={{ width: '100%', textAlign: 'initial' }}>
                        <Switch
                            checked={check}
                            title='Pagamento no Crédito ou no Dinheiro?'
                            onChange={valor => handletipoPagamento(valor)} />

                        <label style={{ padding: '30px' }}>
                            <strong>
                                {visibleEdit}
                            </strong>
                        </label>
                    </div>

                    <div style={{ width: '100%', display: 'flex' }}>
                        <Form.Item style={{ width: '50%' }}>
                            {getFieldDecorator('vlexecutado', {
                                rules: [{ required: true, message: 'Informe o valor Realizado!' }],
                                initialValue: valorRealInput
                            })(
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Valor Executado"
                                    decimalSeparator=','
                                    precision={2}
                                    min={0}
                                    autoFocus
                                    onChange={valor => setValorRealInput(valor)}
                                />)}
                        </Form.Item>
                        <Form.Item style={{ width: '50%' }}>
                            {getFieldDecorator('dtexecutada', {
                                rules: [{ required: true, message: 'Informe a Data do Pagamento!' }],
                                initialValue: moment(props.data.DATANOVAREAL, dateFormat)
                            })(
                                <DatePicker style={{ width: '100%' }}
                                    onChange={data => setDataRealInput(moment(data, dateFormat))}
                                    placeholder="Data Executada"
                                    format={dateFormat}
                                />)}
                        </Form.Item>
                    </div>

                    <div style={{ width: '100%', display: 'flex' }}>
                        <Form.Item style={{ width: '50%' }}>
                            {getFieldDecorator('conta', {
                                rules: [{ required: stateConta === true ? false : true, message: 'Informe a Conta de Pagamento!' }],
                                initialValue: contaInput
                            })(
                                <Select
                                    showSearch
                                    disabled={stateConta}
                                    style={{ width: '100%' }}
                                    placeholder="Informe o Conta"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (
                                        option.props.children.toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    )}
                                    onSelect={valor => setContaInput(valor)}
                                >
                                    {conta}
                                </Select>)}
                        </Form.Item>

                        <Form.Item style={{ width: '50%' }}>
                            {getFieldDecorator('cartao', {
                                rules: [{ required: stateCartao === true ? false : true, message: 'Informe o cartão!' }],
                                initialValue: cartaoInput
                            })(
                                <Select
                                    showSearch
                                    disabled={stateCartao}
                                    style={{ width: '100%' }}
                                    placeholder="Informe o Cartão"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (
                                        option.props.children.toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    )}
                                    onSelect={valor => setCartaoInput(valor)}
                                >
                                    {cartao}
                                </Select>)}
                        </Form.Item>
                    </div>

                    <Form.Item style={{ width: '100%' }}>
                        {getFieldDecorator('categoria', {
                            rules: [{ required: true, message: 'Informa a Categoria!' }],
                            initialValue: categoriaInput
                        })(
                            <Select
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => (
                                    option.props.children.toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                )}
                                style={{ width: '100%' }}
                                placeholder="Informe a Categoria"
                                onSelect={valor => setCategoriaInput(valor)}
                            >
                                {categoria}
                            </Select>)}

                    </Form.Item>

                    <Form.Item style={{ width: '100%' }}>
                        {getFieldDecorator('description', {
                            rules: [{ required: true, message: 'Descreva a Despesa!' }],
                            initialValue: descrDespesaInput
                        })(
                            <TextArea
                                placeholder="Descreva a Despesa"
                                style={{ width: '99%' }}
                                rows={6}
                                onChange={(event) => setDescrDespesaInput(event.target.value)}
                            />)}
                    </Form.Item>
                </Modal>
            </form>
        </div >
    )
}

const WrappedApp = Form.create({ name: 'coordinated' })(ModalExpenseEdit);

export default WrappedApp