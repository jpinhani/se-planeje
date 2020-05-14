import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Modal, Icon, Input, Form, Select, InputNumber, DatePicker } from 'antd';
import { userID } from '../../../routes/urlBackEnd'
import moment from 'moment';
import { GetRequest, UpdateRequest } from '../../crudSendAxios/crud'
import { verifySend } from '../../verifySendAxios'

import { loadConta } from '../../ListagemCombo'



const { TextArea } = Input;
const dateFormat = 'DD/MM/YYYY';
function EditarTransferencia(props) {

    const dispatch = useDispatch();

    const [visible, setVisible] = useState(false);
    const [descricao, setDescricao] = useState(props.dados.DESCR_TRANSFERENCIA);
    const [listDebito, setlistDebito] = useState([]);
    const [listCredito, setlistCredito] = useState([]);

    const [contaDebito, setContaDebito] = useState(props.dados.ID_CONTADEBITO);
    const [contaCredito, setContaCredito] = useState(props.dados.ID_CONTACREDITO);
    const [valor, setValor] = useState(props.dados.VALOR);
    const [dataTransferencia, setData] = useState(moment(props.dados.DATA_TRANSFERENCIA2, dateFormat));


    async function showModal() {
        const cbcredito = await loadConta();
        const cbdebito = await loadConta();

        setlistDebito(cbdebito);
        setlistCredito(cbcredito);
        setVisible(true);
    }

    async function handleSubmitok() {
        const body = {
            id: props.dados.ID,
            idUser: userID(),
            idContaDebito: contaDebito,
            idContaCredito: contaCredito,
            descrTransferencia: descricao,
            dataTransferencia: dataTransferencia,
            valor: valor,
            status: 'ATIVO'
        }

        const resultado = await UpdateRequest(body, 'api/transferencia')
        verifySend(resultado, 'UPDATE', body.descrTransferencia)

        if (resultado === 200) {
            const transferencias = await GetRequest('api/transferencia')

            dispatch({
                type: 'LIST_TRANSFERENCIA',
                payload: transferencias
            })
            setVisible(false);
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        props.form.validateFields((err) => {
            if (!err)
                handleSubmitok();
        })
    }

    const { getFieldDecorator } = props.form;
    return (
        <div>
            <Icon
                type="edit"
                style={{ fontSize: '18px', color: '#08c' }}
                title='Editar Transferência'
                theme="twoTone"
                onClick={showModal} />
            <Modal
                title='Alterar Transferência'
                visible={visible}
                onOk={handleSubmit}
                onCancel={() => setVisible(false)}
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
                                // value={contaDebito}
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
                                // value={contaCredito}
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
                            // value={descricao}
                            rows={3}
                            onChange={(event) => setDescricao(event.target.value)}
                        />)}
                </Form.Item>
            </Modal>
        </div>
    )
}


const TransferenciaNova = Form.create({ name: 'transferenciaEdit' })(EditarTransferencia);

export default TransferenciaNova
