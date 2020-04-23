import React from 'react'
import { connect } from 'react-redux'

import { Icon, Modal, Input, Select, DatePicker, InputNumber, Switch, Form } from 'antd'
import moment from 'moment';

import { listExpensesPaga } from '../../../store/actions/generalExpenseRealAction'
import { listVisionsControler } from '../../../store/actions/controlerVisionAction'
import { listExpenseControlerPaga } from '../../../store/actions/controlerExpenseRealAction'

import { userID } from '../../../routes/urlBackEnd'

import { loadCategoria, loadCartaoReal, loadConta } from '../../ListagemCombo'
import { InsertRequest, GetRequest, visionSerch } from '../../crudSendAxios/crud'
import { verifySend } from '../../verifySendAxios/index'

import 'antd/dist/antd.css';
import './styles.scss'

const { TextArea } = Input;

const dateFormat = 'DD/MM/YYYY'


class ModalExpense extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            visibleEdit: "A VISTA",
            stateConta: false,
            stateCartao: true,
            categoria: [],
            cartao: [],
            conta: [],
            valorRealInput: null,
            dataRealInput: moment(new Date(), dateFormat),
            cartaoInput: [],
            categoriaInput: [],
            contaInput: [],
            descrDespesaInput: '',
        }

        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleValorReal = this.handleValorReal.bind(this)
        this.handleDataReal = this.handleDataReal.bind(this)
        this.handleCartao = this.handleCartao.bind(this)
        this.handleCategoria = this.handleCategoria.bind(this)
        this.handledescricaoDespesa = this.handledescricaoDespesa.bind(this)
        this.handleConta = this.handleConta.bind(this)
        this.handletipoPagamento = this.handletipoPagamento.bind(this)
    }

    async showModal() {
        const resultCategoria = await loadCategoria()
        const resultCartao = await loadCartaoReal()
        const resultConta = await loadConta()

        this.setState({
            ...this.state,
            categoria: resultCategoria,
            cartao: resultCartao,
            conta: resultConta,
            visible: true
        })
    };

    handletipoPagamento(value) {

        value === true
            ? this.setState({
                ...this.state, visibleEdit: `CRÉDITO`,
                stateConta: true,
                contaInput: [],
                stateCartao: false
            })
            : this.setState({
                ...this.state, visibleEdit: `A VISTA`,
                stateConta: false,
                stateCartao: true,
                cartaoInput: []

            })

        this.props.form.resetFields('cartao')
        this.props.form.resetFields('conta')
    }

    handleCancel() {
        this.props.form.resetFields()
        this.setState({
            ...this.state,
            valorRealInput: null,
            categoriaInput: [],
            descrDespesaInput: '',
            cartaoInput: [],
            contaInput: [],
            dataRealInput: moment(new Date(), dateFormat),
            visible: false
        })

    };

    handleValorReal(valor) {
        this.setState({ ...this.state, valorRealInput: valor })
    }

    handleDataReal(date, dateString) {
        this.setState({ ...this.state, dataRealInput: dateString })
    }

    handleCartao(card) {
        this.setState({ ...this.state, cartaoInput: card })
    }

    handleConta(acount) {
        this.setState({ ...this.state, contaInput: acount })
    }

    handleCategoria(Categorys) {
        this.setState({ ...this.state, categoriaInput: Categorys })
    }

    handledescricaoDespesa(despesa) {
        this.setState({ ...this.state, descrDespesaInput: despesa.toUpperCase() })
    }


    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err) => { /* !err */

            if (!err) this.handleSubmitok()
        });
    }

    async handleSubmitok() {

        const ID = () => '_' + Math.random().toString(36).substr(2, 9);

        const body = {
            idGrupo: ID(),
            idUser: userID(),
            dataReal: this.state.dataRealInput,
            valorReal: this.state.valorRealInput,
            cartao: this.state.cartaoInput,
            conta: this.state.contaInput,
            categoria: this.state.categoriaInput,
            parcela: '1',
            descrDespesa: this.state.descrDespesaInput,
            status: this.state.visibleEdit === 'A VISTA'
                ? 'Pagamento Realizado'
                : 'Fatura Pronta Para Pagamento',
        }

        const data = moment(body.dataReal, "DD/MM/YYYY");
        body.dataReal = data.format("YYYY-MM-DD")


        const resulStatus = await InsertRequest(body, 'api/despesas/real')
        verifySend(resulStatus, 'METAPAGA', body.descrDespesa)

        if (resulStatus === 200) {
            const despesa = await GetRequest('api/despesas/paga')
            const resultVision = await GetRequest('api/visions')

            const novaVisaoReal = visionSerch(resultVision, despesa, this.props.visionControler)

            this.props.listExpensesPaga(this.props.visionControler !== 'ALL' ?
                novaVisaoReal[0] !== undefined ? novaVisaoReal[0] : [] :
                despesa)

            this.props.listExpenseControlerPaga(despesa)

            this.handleCancel()
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Icon type="plus-circle" style={{ fontSize: '36px', color: '#08c' }} title='Adicionar nova Despesa Prevista' theme="twoTone" onClick={this.showModal} />

                <form onSubmit={this.handleSubmit}>
                    <Modal
                        title="Lançar Despesa Realizada"
                        visible={this.state.visible}
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                        <div style={{ width: '100%', textAlign: 'initial' }}>
                            <Switch
                                title='Pagamento no Crédito ou no Dinheiro?'
                                onChange={this.handletipoPagamento} />

                            <label style={{ padding: '30px' }}>
                                <strong>
                                    {this.state.visibleEdit}
                                </strong>
                            </label>
                        </div>

                        <div style={{ width: '100%', display: 'flex' }}>
                            <Form.Item style={{ width: '50%' }}>
                                {getFieldDecorator('vlexecutado', {
                                    rules: [{ required: true, message: 'Por Favor, informe o Valor Pago' }],
                                    initialValue: this.state.valorRealInput
                                })(
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        placeholder="Valor Executado"
                                        decimalSeparator=','
                                        precision={2}
                                        min={0}
                                        autoFocus
                                        onChange={this.handleValorReal}
                                    />)}
                            </Form.Item>
                            <Form.Item style={{ width: '50%' }}>
                                {getFieldDecorator('dtexecutada', {
                                    rules: [{ required: true, message: 'Por Favor, informe a Data Realizada!' }],
                                    initialValue: moment(new Date(), dateFormat)
                                })(
                                    <DatePicker style={{ width: '100%' }}
                                        onChange={this.handleDataReal}
                                        placeholder="Data Executada"
                                        format={dateFormat}
                                    />)}
                            </Form.Item>
                        </div>
                        <div style={{ width: '100%', display: 'flex' }}>
                            <Form.Item style={{ width: '50%' }}>
                                {getFieldDecorator('conta', {
                                    rules: [{ required: this.state.stateConta === true ? false : true, message: 'Informe a Conta de Pagamento!' }],
                                    initialValue: this.state.contaInput
                                })(
                                    <Select
                                        showSearch
                                        disabled={this.state.stateConta}
                                        style={{ width: '100%' }}
                                        placeholder="Informe o Conta"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => (
                                            option.props.children.toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        )}
                                        onSelect={this.handleConta}
                                    >
                                        {this.state.conta}
                                    </Select>)}
                            </Form.Item>
                            <Form.Item style={{ width: '50%' }}>
                                {getFieldDecorator('cartao', {
                                    rules: [{ required: this.state.stateCartao === true ? false : true, message: 'Informe o Cartão!' }],
                                    initialValue: this.state.cartaoInput
                                })(
                                    <Select
                                        showSearch
                                        disabled={this.state.stateCartao}
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
                        </div>
                        <Form.Item style={{ width: '100%' }}>
                            {getFieldDecorator('categoria', {
                                rules: [{ required: true, message: 'Informe a Categoria!' }],
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
                            {getFieldDecorator('description', {
                                rules: [{ required: true, message: 'Descreva a Despesa' }],
                                initialValue: this.state.descrDespesaInput
                            })(
                                <TextArea
                                    placeholder="Descreva a Despesa"
                                    style={{ width: '100%' }}
                                    rows={6}
                                    onChange={(event) => this.handledescricaoDespesa(event.target.value)}
                                />)}
                        </Form.Item>
                    </Modal>
                </form>
            </div >
        )
    }
}

const WrappedApp = Form.create({ name: 'coordinated' })(ModalExpense);

const mapStateToProps = (state) => {
    return {
        expenseReal: state.expenseReal,
        visionControler: state.visionControler,
        controlerExpenseReal: state.controlerExpenseReal
    }
}

const mapDispatchToProps = { listExpensesPaga, listVisionsControler, listExpenseControlerPaga }


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedApp)