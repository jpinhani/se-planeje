import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { Icon, Modal, Form, Input, InputNumber, DatePicker, Select } from 'antd';
import moment from 'moment';

import { loadConta, loadCategoriaReceita } from '../../ListagemCombo'

import { GetRequest, InsertRequest } from '../../crudSendAxios/crud'
import { verifySend } from '../../verifySendAxios/index'
import { userID } from '../../../services/urlBackEnd'

const dateFormat = 'DD/MM/YYYY'
const { TextArea } = Input;

function NovaReceita(props) {
    const [visibleModal, setVisibleModal] = useState(false);
    const [valorRealInput, setValorRealInput] = useState('');
    const [dataReal, setDataReal] = useState(moment(new Date(), dateFormat))
    const [categoria, setCategoria] = useState([]);
    const [contas, setcontas] = useState([]);
    const [contaInput, setContaInput] = useState([]);
    const [categoriaInput, setCategoriaInput] = useState([]);
    const [descricao, setDescricao] = useState('');

    const dispatch = useDispatch();

    const { getFieldDecorator } = props.form;

    async function showModal() {

        const rs = await loadConta();
        const cat = await loadCategoriaReceita();

        setcontas(rs)
        setVisibleModal(true)
        setCategoria(cat)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        props.form.validateFields((err) => { /* !err */

            if (!err)
                handleSubmitok()
        });
    }

    async function handleSubmitok() {

        const ID = () => '_' + Math.random().toString(36).substr(2, 9);

        const body = {
            idGrupo: ID(),
            idUser: userID(),
            categoria: categoriaInput,
            parcela: '1',
            descrDespesa: descricao,
            conta: contaInput,
            valorReal: valorRealInput,
            dataReal: dataReal,
            status: 'Pagamento Realizado',
        }


        const data = moment(body.dataReal, "DD/MM/YYYY");
        body.dataReal = data.format("YYYY-MM-DD")

        const resulStatus = await InsertRequest(body, 'api/receitas/real')

        verifySend(resulStatus, 'INSERT', body.descrDespesa)


        if (resulStatus === 200) {
            const receitas = await GetRequest('api/receitas/paga')

            setVisibleModal(false)

            dispatch({
                type: 'LIST_REVENUE_REAL',
                payload: receitas
            })
        }

    }

    return (
        <div>
            <Icon
                type="plus-circle"
                style={{ fontSize: '36px', color: '#08c' }}
                title='Adicionar nova Receita'
                theme="twoTone" onClick={showModal} />
            <Form>
                <Modal
                    title='Inserir Nova Receita'
                    visible={visibleModal}
                    onOk={handleSubmit}
                    onCancel={() => setVisibleModal(false)}
                    className="ModalReceita">

                    <div style={{ width: '100%', display: 'flex' }}>
                        <Form.Item style={{ width: '50%' }}>
                            {getFieldDecorator('vlexecutado', {
                                rules: [{ required: true, message: 'Por Favor, informe o Valor Recebido' }],
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
                                initialValue: dataReal
                            })(
                                <DatePicker style={{ width: '100%' }}
                                    onChange={data => setDataReal(moment(data, dateFormat))}
                                    placeholder="Data Executada"
                                    format={dateFormat}
                                />)}
                        </Form.Item>
                    </div>

                    <div style={{ width: '100%', display: 'flex' }}>
                        <Form.Item style={{ width: '100%' }}>
                            {getFieldDecorator('conta', {
                                rules: [{ required: true, message: 'Informe a Conta de Recebimento!' }],
                                initialValue: contaInput
                            })(
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="Informe o Conta"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (
                                        option.props.children.toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    )}
                                    onSelect={conta => setContaInput(conta)}
                                >
                                    {contas}
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
                                onSelect={categ => setCategoriaInput(categ)}
                            >
                                {categoria}
                            </Select>)}
                    </Form.Item>

                    <Form.Item style={{ width: '100%' }}>
                        {getFieldDecorator('description', {
                            rules: [{ required: true, message: 'Descreva a Despesa' }],
                            initialValue: descricao
                        })(
                            <TextArea
                                placeholder="Descreva a Despesa"
                                style={{ width: '100%' }}
                                rows={3}
                                onChange={(event) => setDescricao(event.target.value)}
                            />)}
                    </Form.Item>
                </Modal>
            </Form>
        </div>
    )
}

const ContabilizaReceita = Form.create({ name: 'NovaReceita' })(NovaReceita);

export default ContabilizaReceita