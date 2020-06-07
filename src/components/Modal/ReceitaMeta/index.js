import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { Input, Modal, Form, InputNumber, Select, DatePicker, Switch, Divider } from 'antd'
import { LikeTwoTone } from '@ant-design/icons';

import { loadConta, loadCategoriaReceita } from '../../ListagemCombo'
import { GetRequest, UpdateRequest } from '../../crudSendAxios/crud'
import { verifySend } from '../../verifySendAxios/index'

import { userID } from '../../../services/urlBackEnd'

import moment from 'moment';

const dateFormat = 'DD/MM/YYYY'
const { TextArea } = Input;

function ReceitaMeta(props) {

    const dispatch = useDispatch();

    const [visible, setVisible] = useState(false);

    const [categoria, setCategoria] = useState('');
    const [contas, setcontas] = useState([]);
    const [valorPrevistoInput] = useState(props.data.VL_PREVISTO2);

    const [dataReal, setDataReal] = useState(moment(new Date(), dateFormat))
    const [dataPrevista] = useState(props.data.DATANOVA)

    const [contaInput, setContaInput] = useState([]);
    const [valorRealInput, setValorRealInput] = useState('');
    const [categoriaInput, setCategoriaInput] = useState(props.data.ID_CATEGORIA);
    const [descricao, setDescricao] = useState(props.data.DESCR_RECEITA);
    const [visibleLabel, setVisibleLabel] = useState('Contabilizar Receita')
    const [parcelaInput] = useState(props.data.NUM_PARCELA)


    async function handleSubmit() {
        const body = {
            id: props.data.ID,
            idUser: userID(),
            valueEdit: visibleLabel,
            idGrupo: props.data.ID_GRUPO,
            categoria: categoriaInput,
            parcela: parcelaInput,
            valorPrevisto: props.data.VL_PREVISTO2,
            dataPrevista: props.data.DATANOVA,
            descrDespesa: descricao,
            idConta: contaInput,
            valorReal: valorRealInput,
            dataReal: dataReal,
            status: 'Pagamento Realizado',
        }

        const data = moment(body.dataReal, "DD/MM/YYYY");
        body.dataReal = data.format("YYYY-MM-DD")

        const dataPrev = moment(body.dataPrevista, "DD/MM/YYYY");
        body.dataPrevista = dataPrev.format("YYYY-MM-DD")

        const resulStatus = await UpdateRequest(body, 'api/receitas/pagar')

        verifySend(resulStatus, 'METAPAGA', body.descrDespesa)


        if (resulStatus === 200) {
            const receitas = await GetRequest('api/receitas')

            setVisible(false)

            dispatch({
                type: 'LIST_REVENUE',
                payload: receitas
            })

            props.back("OK")
        }
    }

    const { getFieldDecorator } = props.form;

    async function showModal() {
        const rs = await loadConta();
        const cat = await loadCategoriaReceita();

        setcontas(rs)
        setVisible(true)
        setCategoria(cat)

    }

    return (
        <div>
            <form>
                <Modal
                    title="Efetuar Pagamento Receita Prevista"
                    visible={visible}
                    onOk={() => handleSubmit()}
                    onCancel={() => setVisible(false)}
                >

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}>
                        <Switch
                            style={{ width: '10%' }}
                            title='Habilite para Amortizações'
                            onChange={tipo => {
                                tipo === true ?
                                    setVisibleLabel('Amortizar Saldo de Receita') :
                                    setVisibleLabel('Contabilizar Receita')
                            }} />

                        <label style={{ padding: '15px' }}> {visibleLabel}</label>

                    </div>

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
                        {getFieldDecorator('description', {
                            rules: [{ required: true, message: 'Descreva a Receita' }],
                            initialValue: descricao
                        })(
                            <TextArea
                                placeholder="Descreva a Receita"
                                style={{ width: '100%' }}
                                rows={3}
                                onChange={(event) => setDescricao(event.target.value)}
                            />)}
                    </Form.Item>

                    <div style={{ paddingTop: '10px' }}>
                        <Divider orientation="left">Detalhes da Receita - Meta</Divider>
                    </div>

                    <Form.Item style={{ width: '100%' }}>
                        {getFieldDecorator('categoria', {
                            rules: [{ required: true, message: 'Informe a Categoria!' }],
                            initialValue: categoriaInput
                        })(
                            <Select
                                showSearch
                                disabled
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

                    <div style={{ width: '100%', display: 'flex' }}>
                        <Form.Item style={{ width: '50%' }}>
                            {getFieldDecorator('vlPrevito', {
                                rules: [{ required: false, message: 'Por Favor, informe o Valor Recebido' }],
                                initialValue: valorPrevistoInput !== props.data.VL_PREVISTO2 ? props.data.VL_PREVISTO2 : valorPrevistoInput
                            })(
                                <InputNumber
                                    style={{ width: '100%' }}
                                    disabled
                                    placeholder="Valor Previsto"
                                    decimalSeparator=','
                                    precision={2}
                                    min={0}
                                    autoFocus
                                />)}
                        </Form.Item>

                        <Form.Item style={{ width: '50%' }}>
                            {getFieldDecorator('dtprevista', {
                                rules: [{ required: false, message: 'Por Favor, informe a Data Prevista!' }],
                                initialValue: moment(dataPrevista, dateFormat)
                            })(
                                <DatePicker style={{ width: '100%' }}
                                    placeholder="Prevista"
                                    format={dateFormat}
                                    disabled
                                />)}
                        </Form.Item>
                    </div>


                </Modal>
            </form>
            <LikeTwoTone
                title='Efetura Contabilização'
                style={{ fontSize: '18px', color: '#08c' }}
                onClick={() => showModal()} />
        </div>
    )
}

const ContabilizaMeta = Form.create({ name: 'MetaReceita' })(ReceitaMeta);

export default ContabilizaMeta