import React, { useState } from 'react';
import { useDispatch, } from 'react-redux';

import { Icon, Modal, Input, Select, DatePicker, InputNumber, Switch, Form, notification, Spin } from 'antd'
import moment from 'moment';

import { userID } from '../../../services/urlBackEnd'

import { loadCategoria, loadCartaoReal, loadConta } from '../../ListagemCombo'
import { InsertRequest, GetRequest } from '../../crudSendAxios/crud'
import { verifySend } from '../../verifySendAxios/index'

import 'antd/dist/antd.css';
import './styles.scss'

const { TextArea } = Input;
const dateFormat = 'DD/MM/YYYY';

function NovaDespesa(props) {

    const dispatch = useDispatch();

    const [spin, setSpin] = useState(false)
    const [visible, setVisible] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState("A VISTA");
    const [stateConta, setStateConta] = useState(false);
    const [stateCartao, setStateCartao] = useState(true);
    const [categoria, setCategoria] = useState([]);
    const [cartao, setCartao] = useState([]);
    const [conta, setConta] = useState([]);
    const [valorRealInput, setValorRealInput] = useState(null);
    const [dataRealInput, setDataRealInput] = useState(moment(new Date(), dateFormat));
    const [cartaoInput, setCartaoInput] = useState([]);
    const [categoriaInput, setCategoriaInput] = useState([]);
    const [contaInput, setContaInput] = useState([]);
    const [descrDespesaInput, setDescrDespesaInput] = useState('');

    async function showModal() {
        const resultCategoria = await loadCategoria()
        const resultCartao = await loadCartaoReal()
        const resultConta = await loadConta()

        setCategoria(resultCategoria);
        setCartao(resultCartao);
        setConta(resultConta);
        setVisible(true);
    };

    function handletipoPagamento(value) {

        if (value === true) {
            setVisibleEdit(`CRÉDITO`);
            setStateConta(true);
            setContaInput([]);
            setStateCartao(false);
        } else {
            setVisibleEdit(`A VISTA`);
            setStateConta(false);
            setStateCartao(true);
            setCartaoInput([]);
        }

        props.form.resetFields('cartao')
        props.form.resetFields('conta')
    }

    function handleCancel() {
        props.form.resetFields()
        setValorRealInput(null);
        setCategoriaInput([]);
        setDescrDespesaInput('');
        setCartaoInput([]);
        setContaInput([]);
        setDataRealInput(moment(new Date(), dateFormat));
        setVisible(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        props.form.validateFields((err) => { /* !err */

            if (!err) handleSubmitok()
        });
    }

    async function handleSubmitok() {
        setSpin(true)
        const ID = () => '_' + Math.random().toString(36).substr(2, 9);

        const body = {
            idGrupo: ID(),
            idUser: userID(),
            dataReal: moment(dataRealInput, "DD/MM/YYYY"),
            valorReal: valorRealInput,
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

        const resulStatus = await InsertRequest(body, 'api/despesas/real')

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
            const despesa = await GetRequest('api/despesas/paga')


            dispatch({
                type: 'LIST_EXPENSEREAL',
                payload: despesa
            })

            setSpin(false)
            handleCancel()
        }
    }

    const { getFieldDecorator } = props.form;

    return (
        <div>
            <Icon
                type="plus-circle"
                style={{ fontSize: '36px', color: '#08c' }}
                title='Adicionar nova Despesa Prevista'
                theme="twoTone"
                onClick={showModal} />

            <form>
                <Modal
                    title="Lançar Despesa Realizada"
                    visible={visible}
                    onOk={handleSubmit}
                    onCancel={() => handleCancel()}
                    className="ModalDespesa"
                >
                    <div style={{ width: '100%', textAlign: 'initial' }}>
                        <Switch
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
                                rules: [{ required: true, message: 'Por Favor, informe o Valor Pago' }],
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
                                rules: [{ required: true, message: 'Por Favor, informe a Data Realizada!' }],
                                initialValue: moment(new Date(), dateFormat)
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
                                rules: [{ required: stateCartao === true ? false : true, message: 'Informe o Cartão!' }],
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
                            rules: [{ required: true, message: 'Informe a Categoria!' }],
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
                            rules: [{ required: true, message: 'Descreva a Despesa' }],
                            initialValue: descrDespesaInput
                        })(
                            <TextArea
                                placeholder="Descreva a Despesa"
                                style={{ width: '100%' }}
                                rows={6}
                                onChange={(event) => setDescrDespesaInput(event.target.value)}
                            />)}
                    </Form.Item>
                    <Spin size="large" spinning={spin} />
                </Modal>
            </form>
        </div >
    )

}

const WrappedApp = Form.create({ name: 'coordinated' })(NovaDespesa);

export default WrappedApp