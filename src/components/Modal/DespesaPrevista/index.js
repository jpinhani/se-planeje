import React from 'react'
import { connect } from 'react-redux'

import { Icon, Modal, Input, Select, DatePicker, InputNumber, Radio, Form, notification } from 'antd'
import moment from 'moment';

import { listExpenses } from '../../../store/actions/generalExpenseAction'
import { userID } from '../../../services/urlBackEnd'
import { loadCartao, loadCategoria } from '../../ListagemCombo'

import { GetRequest, InsertRequest } from '../../crudSendAxios/crud'
import { verifySend } from '../../verifySendAxios/index.js'

import 'antd/dist/antd.css';
import './styles.scss'

const { TextArea } = Input;

const dateFormat = 'DD/MM/YYYY'

class ModalExpense extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            value: 1,
            dayVisible: true,
            dayValue: null,
            categoria: [],
            cartao: [],
            valorPrevistoInput: null,
            dataPrevistaInput: moment(new Date(), dateFormat),
            cartaoInput: 'DÉBITO OU DINHEIRO',
            parcelasInput: 1,
            categoriaInput: [],
            descrDespesaInput: '',
        }

        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleValorPrevisto = this.handleValorPrevisto.bind(this)
        this.handleDataPrevisto = this.handleDataPrevisto.bind(this)
        this.handleCartao = this.handleCartao.bind(this)
        this.handleParcelas = this.handleParcelas.bind(this)
        this.handleCategoria = this.handleCategoria.bind(this)
        this.handledescricaoDespesa = this.handledescricaoDespesa.bind(this)
        this.handleValue = this.handleValue.bind(this)
        this.handleDayValue = this.handleDayValue.bind(this)
    }

    async showModal() {
        const resultCategoria = await loadCategoria()
        const resultCartao = await loadCartao()

        this.setState({ ...this.state, categoria: resultCategoria, cartao: resultCartao, visible: true })
    };

    handleCancel() {
        this.setState({
            ...this.state, parcelasInput: 1, value: 1, dayVisible: true, dayValue: null, valorPrevistoInput: null, dataPrevistaInput: null,
            categoriaInput: [], descrDespesaInput: '', cartaoInput: 'DÉBITO OU DINHEIRO', visible: false
        })
    };

    handleValorPrevisto(valor) {
        this.setState({ ...this.state, valorPrevistoInput: valor })
    }

    handleDataPrevisto(date, dateString) {
        this.setState({ ...this.state, dataPrevistaInput: dateString })

    }

    handleCartao(card) {
        this.setState({ ...this.state, cartaoInput: card })
    }

    handleParcelas(num) {
        this.setState({ ...this.state, parcelasInput: num })
    }

    handleCategoria(Categorys) {
        this.setState({ ...this.state, categoriaInput: Categorys })
    }

    handledescricaoDespesa(despesa) {
        this.setState({ ...this.state, descrDespesaInput: despesa.toUpperCase() })
    }

    handleValue = e => {
        if (e.target.value === 3) {
            this.setState({ ...this.state, dayVisible: false, value: e.target.value });
        } else {
            this.setState({ ...this.state, dayValue: null, dayVisible: true, value: e.target.value });
        }
    };

    handleDayValue(dias) {
        this.setState({ ...this.state, dayValue: dias })
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err) => { /* !err */

            if (!err) this.handleSubmitok()
        });
    }

    async handleSubmitok() {

        const ID = () => '_' + Math.random().toString(36).substr(2, 9);

        const dataPrevistaNova = this.state.dataPrevistaInput ? this.state.dataPrevistaInput : moment(new Date(), dateFormat)

        const body = {
            // id: this.props.data.ID,
            idGrupo: ID(),
            idUser: userID(),
            dataPrevista: dataPrevistaNova,
            valorPrevisto: this.state.valorPrevistoInput,
            cartao: this.state.cartaoInput,
            categoria: this.state.categoriaInput,
            parcela: this.state.parcelasInput,
            descrDespesa: this.state.descrDespesaInput,
            tipoParcela: this.state.value,
            dayValue: this.state.dayValue,
            status: "Ativo",
        }

        if (body.cartao === 'DÉBITO OU DINHEIRO') {
            body.cartao = null
            body.status = 'Esperando Pagamento'
        } else {
            body.status = 'Fatura Pendente'
        }

        const data = moment(body.dataPrevista, "DD/MM/YYYY");
        body.dataPrevista = data.format("YYYY-MM-DD")

        const resultStatus = await InsertRequest(body, 'api/despesas')

        if (resultStatus.status === 402)
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

        verifySend(resultStatus, 'INSERT', body.descrDespesa)

        const Data = resultStatus === 200 ? await GetRequest('api/despesas') : {}

        this.props.listExpenses(Data)
        this.handleCancel()
        this.props.form.resetFields()

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="despesatipo">
                <Icon type="plus-circle" style={{ fontSize: '36px', color: '#08c' }} title='Adicionar nova Despesa Prevista' theme="twoTone" onClick={this.showModal} />


                <Modal
                    title="Cadastrar Despesa Prevista"
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                    className="ModalDespesa"
                >
                    <Form>
                        <Radio.Group
                            style={{ width: '73%' }}
                            onChange={this.handleValue}
                            value={this.state.value}>
                            <Radio value={1}>Mensalmente</Radio>
                            <Radio value={2}>Quinzenalmente</Radio>
                            <Radio value={3}>Outro</Radio>
                        </Radio.Group>

                        <InputNumber
                            style={{ width: '25%' }}
                            placeholder="Dias"
                            min={1}
                            onChange={this.handleDayValue}
                            value={this.state.dayValue}
                            disabled={this.state.dayVisible}
                        />
                        <div style={{ width: '100%', display: 'flex' }}>
                            <Form.Item
                                style={{ width: '50%' }}
                            >
                                {getFieldDecorator('vlPrevisto', {
                                    rules: [{ required: true, message: 'Por Favor, Informe o Valor da Despesa!' }],
                                    initialValue: this.state.valorPrevistoInput
                                })(
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        placeholder="Valor Previsto"
                                        onChange={this.handleValorPrevisto}
                                        decimalSeparator=','
                                        precision={2}
                                        min={0}
                                        autoFocus
                                    />
                                )}
                            </Form.Item >

                            <Form.Item style={{ width: '50%' }}
                                onChange={this.handleDataPrevisto}
                            >{getFieldDecorator('dtPrevisto', {
                                rules: [{ required: true, message: 'Por Favor, Informe a Data Prevista!' }],
                                initialValue: moment(new Date(), dateFormat)
                            })(
                                <DatePicker
                                    style={{ width: '100%' }}
                                    onChange={this.handleDataPrevisto}
                                    placeholder="Data Prevista"
                                    format={dateFormat}
                                />)}
                            </Form.Item>
                        </div>
                        <div style={{ width: '100%', display: 'flex' }}>
                            <Form.Item style={{ width: '80%' }}>
                                {getFieldDecorator('cartao', {
                                    rules: [{ required: true, message: 'Por Favor, Informe como sera o pagamento!' }],
                                    initialValue: this.state.cartaoInput
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
                                        onSelect={this.handleCartao}
                                    >
                                        {this.state.cartao}
                                    </Select>)}
                            </Form.Item>

                            <Form.Item style={{ width: '20%' }}>
                                {getFieldDecorator('parcela', {
                                    rules: [{ required: true, message: 'Por Favor, Informe a quantidade de parcelas!' }],
                                    initialValue: this.state.parcelasInput
                                })(<InputNumber
                                    style={{ width: '100%' }}
                                    placeholder='N Parcelas'
                                    min={1}
                                    onChange={this.handleParcelas}
                                />)}
                            </Form.Item>
                        </div>

                        <Form.Item style={{ width: '100%' }}>
                            {getFieldDecorator('categoria', {
                                rules: [{ required: true, message: 'Por Favor, Informe a Categoria!' }],
                                initialValue: this.state.categoriaInput
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
                                    onSelect={this.handleCategoria}
                                >
                                    {this.state.categoria}
                                </Select>)}
                        </Form.Item>

                        <Form.Item style={{ width: '100%' }}>
                            {getFieldDecorator('descricao', {
                                rules: [{ required: true, message: 'Por Favor, Informe a Descrição!' }],
                                initialValue: this.state.descrDespesaInput
                            })(
                                <TextArea
                                    placeholder="Descreva a Despesa"
                                    style={{ width: '100%' }}
                                    rows={6}
                                    onChange={(event) => this.handledescricaoDespesa(event.target.value)}
                                />)}
                        </Form.Item>
                    </Form>
                </Modal>

            </div >
        )
    }
}

const WrappedApp = Form.create({ name: 'coordinated' })(ModalExpense);

const mapStateToProps = (state/*, ownProps*/) => {
    return {
        expense: state.expense,
    }
}

const mapDispatchToProps = { listExpenses }


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedApp)