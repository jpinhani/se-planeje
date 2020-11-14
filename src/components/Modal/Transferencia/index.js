import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userID } from '../../../services/urlBackEnd'

import { Modal, Icon, Select, InputNumber, DatePicker, Input, Form, notification, Spin } from 'antd';
import { loadConta } from '../../ListagemCombo/index';
import { GetRequest, InsertRequest } from '../../crudSendAxios/crud';
import { verifySend } from '../../verifySendAxios';

import moment from 'moment';

const { TextArea } = Input;
const dateFormat = 'DD/MM/YYYY';

function NewTransferencia(props) {

    const dispatch = useDispatch();
    const home = useSelector(state => state.home)
    const [spin, setSpin] = useState(false);
    const [visible, setVisible] = useState(false);
    const [listDebito, setlistDebito] = useState([]);
    const [contaDebito, setContaDebito] = useState([]);
    const [listCredito, setlistCredito] = useState([]);
    const [contaCredito, setContaCredito] = useState([]);
    const [valor, setValor] = useState('');
    const [dataTransferencia, setData] = useState(moment(new Date(), dateFormat));
    const [descricao, setDescricao] = useState('');

    async function showModal() {
        const credito = await loadConta();
        const debito = await loadConta();

        setlistDebito(debito);
        setlistCredito(credito);
        setVisible(true);
    }

    async function handleSubmitOk() {
        setSpin(true);
        console.log(dataTransferencia)
        const body = {
            idUser: userID(),
            idContaDebito: contaDebito,
            idContaCredito: contaCredito,
            descrTransferencia: descricao,
            dataTransferencia: dataTransferencia,
            valor: valor,
            status: 'ATIVO'
        }

        const novaTransf = await InsertRequest(body, 'api/transferencia');

        if (novaTransf.status === 402)
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

        verifySend(novaTransf, 'INSERT', body.descrTransferencia)

        setSpin(false);
        if (novaTransf === 200) {
            const transferencias = await GetRequest('api/transferencia')

            dispatch({
                type: 'LIST_TRANSFERENCIA',
                payload: transferencias
            })
            dispatch({
                type: 'LIST_HOME',
                payload: 1 + home
            })
            setVisible(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        props.form.validateFields((err) => {
            if (!err)
                handleSubmitOk()
        })
    }

    const { getFieldDecorator } = props.form;

    return (
        <div>
            <Icon
                type="plus-circle"
                style={{ fontSize: '36px', color: 'black' }}
                title='Adicionar nova Transferência'
                onClick={showModal} />

            <Modal
                title='Nova Transação'
                onOk={handleSubmit}
                onCancel={() => setVisible(false)}
                visible={visible}
                className="ModalCadastro"
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <Form.Item
                        style={{ width: '50%' }}>
                        {getFieldDecorator('comboDebito', {
                            rules: [{ required: true, message: 'Informe a conta a ser Debitada' }],
                            initialValue: contaDebito
                        })(
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Informe a Conta ou fonte a Ser Debitada"
                                onSelect={valor => {
                                    if (valor === contaCredito) {
                                        props.form.resetFields('contadebito')
                                        alert('Conta Debito deve ser diferente da Conta Crèdito')
                                    } else
                                        setContaDebito(valor)
                                }}>
                                {listDebito}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item
                        style={{ width: '50%' }}>
                        {getFieldDecorator('contacredito', {
                            rules: [{ required: true, message: 'Informe a conta a ser creditada' }],
                            initialValue: contaCredito
                        })(
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Informe a Conta ou fonte a Ser Creditada"
                                onSelect={valor => {
                                    if (valor === contaDebito) {
                                        props.form.resetFields('contacredito')
                                        alert('Conta Debito deve ser diferente da Conta Crèdito')
                                    } else setContaCredito(valor)
                                }}>
                                {listCredito}
                            </Select>
                        )}
                    </Form.Item>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <Form.Item style={{ width: '50%' }}>
                        {getFieldDecorator('valor', {
                            rules: [{ required: true, message: 'Informe o valor da transferência' }],
                            initialValue: valor
                        })(
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="Valor"
                                onChange={e => setValor(e)}
                                decimalSeparator=','
                                precision={2}
                                // value={valor}
                                min={0}
                            />)}
                    </Form.Item>
                    <Form.Item style={{ width: '50%' }}>
                        {getFieldDecorator('datatransf', {
                            rules: [{ required: true, message: 'Informe a Data da Transferência' }],
                            initialValue: dataTransferencia
                        })(
                            <DatePicker
                                style={{ width: '100%' }}
                                // value={dataTransferencia}
                                onChange={data => setData(moment(data, dateFormat))}
                                placeholder="Data"
                                format={dateFormat}
                            />)}
                    </Form.Item>
                </div>
                <Form.Item style={{ width: '100%' }}>
                    {getFieldDecorator('description', {
                        rules: [{ required: true, message: 'Descreva a Transferência' }],
                        initialValue: descricao
                    })(
                        <TextArea
                            placeholder="Descreva a Transferência"
                            style={{ width: '100%' }}
                            rows={3}
                            onChange={(event) => setDescricao(event.target.value)}
                        />)}
                </Form.Item>
                <Spin size="large" spinning={spin} />
            </Modal>
        </div >
    )
}
const TransferenciaNova = Form.create({ name: 'transferencia' })(NewTransferencia);

export default TransferenciaNova;