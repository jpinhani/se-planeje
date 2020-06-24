import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { Icon, Modal, Form, Input, InputNumber, DatePicker, Select, Spin } from 'antd';
import moment from 'moment';

import { loadConta, loadCategoriaReceita } from '../../ListagemCombo'

import { GetRequest, UpdateRequest } from '../../crudSendAxios/crud'
import { verifySend } from '../../verifySendAxios/index'
import { userID } from '../../../services/urlBackEnd'

const dateFormat = 'DD/MM/YYYY'
const { TextArea } = Input;

function EditarReceita(props) {
    const [visibleModal, setVisibleModal] = useState(false);
    const [spin, setSpin] = useState(false);

    const [valorRealInput, setValorRealInput] = useState(props.data.VL_REAL2);
    const [dataReal, setDataReal] = useState(props.data.DATANOVAREAL)
    const [categoria, setCategoria] = useState([]);
    const [contas, setcontas] = useState([]);
    const [contaInput, setContaInput] = useState(props.data.ID_CONTA);
    const [categoriaInput, setCategoriaInput] = useState(props.data.ID_CATEGORIA);
    const [descricao, setDescricao] = useState(props.data.DESCR_RECEITA);

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
        setSpin(true);
        const body = {
            id: props.data.ID,
            idGrupo: props.data.ID_GRUPO,
            idUser: userID(),
            categoria: categoriaInput,
            parcela: '1',
            descrDespesa: descricao,
            conta: contaInput,
            valorReal: valorRealInput,
            dataPrevista: props.data.DT_PREVISTO,
            valorCorrigir: props.data.VL_REAL2 - valorRealInput,
            dataReal: dataReal,
            status: 'Pagamento Realizado',
        }


        const data = moment(body.dataReal, "DD/MM/YYYY");
        body.dataReal = data.format("YYYY-MM-DD")

        const resulStatus = await UpdateRequest(body, 'api/receitas/real')

        verifySend(resulStatus, 'UPDATE', body.descrDespesa)

        setSpin(false);
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
                type="edit"
                style={{ fontSize: '18px', color: '#08c' }}
                title='Editar Receita'
                theme="twoTone"
                onClick={showModal} />
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
                                initialValue: moment(dataReal, dateFormat)
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
                <Spin size="large" spinning={spin} />
            </Form>
        </div>
    )
}

const EditaReceita = Form.create({ name: 'NovaReceita' })(EditarReceita);

export default EditaReceita