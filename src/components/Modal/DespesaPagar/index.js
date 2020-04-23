import React from 'react'

import { connect } from 'react-redux'

import { Modal, Input, Select, DatePicker, InputNumber, Switch, Divider, Form } from 'antd'
import { LikeTwoTone } from '@ant-design/icons';
import moment from 'moment';

import { listExpenseControlerMeta } from '../../../store/actions/controlerExpenseAction'
import { listVisionsControler } from '../../../store/actions/controlerVisionAction'

import { userID } from '../../../routes/urlBackEnd'
import { loadCategoria, loadCartaoReal, loadConta } from '../../ListagemCombo'

import { GetRequest, UpdateRequest, visionSerchMeta } from '../../crudSendAxios/crud'
import { verifySend } from '../../verifySendAxios/index'


import 'antd/dist/antd.css';
import './styles.scss'

const { TextArea } = Input;

const dateFormat = 'DD/MM/YYYY'

class ModalExpense extends React.Component {
    _isMounted = false
    constructor(props) {
        super(props)

        this.state = {
            visible: false, //Controla a visibilidade do formulário
            visibleConta: (this.props.data.ID_CARTAO === 0 | this.props.data.ID_CARTAO === null) ? false : true,
            visibleCartao: (this.props.data.ID_CARTAO === 0 | this.props.data.ID_CARTAO === null) ? true : false,
            visibleTipoPagamento: (this.props.data.ID_CARTAO === 0 | this.props.data.ID_CARTAO === null) ? `A VISTA` : `CRÉDITO`,
            check: (this.props.data.ID_CARTAO === 0 | this.props.data.ID_CARTAO === null) ? false : true,
            visibleEdit: 'Essa Despesa Esta Sendo Contabilizada', //State Para saber se é Amortização ou não
            categoria: this.props.data.ID_CATEGORIA, //Listagem de Categoria
            cartao: this.props.data.ID_CARTAO, //Listagem de Cartão
            conta: [],

            valorPrevistoInput: this.props.data.VL_PREVISTO2,
            dataPrevistaInput: this.props.data.DATANOVA,
            cartaoInput: (this.props.data.ID_CARTAO === 0 | this.props.data.ID_CARTAO === null) ? 'DÉBITO OU DINHEIRO' : this.props.data.ID_CARTAO, //Cartão Selecionado no Click
            parcelasInput: this.props.data.NUM_PARCELA,
            categoriaInput: this.props.data.ID_CATEGORIA, //Categoria Selecionada no Click
            descrDespesaInput: this.props.data.DESCR_DESPESA,
            contaInput: [],
            valorRealizadoInput: null,
            dataRealInput: '',
        }

        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handledescricaoDespesa = this.handledescricaoDespesa.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleValorReal = this.handleValorReal.bind(this)
        this.handleDataReal = this.handleDataReal.bind(this)
        this.handleConta = this.handleConta.bind(this)
        this.handleCartao = this.handleCartao.bind(this)
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


    handleCancel() {
        this.setState({ ...this.state, visible: false })
    };

    handleEdit(valor) {
        if (valor === true) {
            this.setState({ ...this.state, visibleEdit: `Essa Despesa esta sendo Amortizada` })
        } else {
            this.setState({ ...this.state, visibleEdit: 'Essa Despesa Esta sendo Contabilizada' })
        }
    }

    handletipoPagamento(tipo) {

        tipo === true
            ? this.setState({
                ...this.state, visibleTipoPagamento: `CRÉDITO`,
                check: true,
                contaInput: [],
                visibleConta: true,
                cartaoInput: (this.props.data.ID_CARTAO === 0 | this.props.data.ID_CARTAO === null) ? [] : this.props.data.ID_CARTAO,
                visibleCartao: false

            })
            : this.setState({
                ...this.state, visibleTipoPagamento: `A VISTA`,
                visibleConta: false,
                check: false,
                cartaoInput: 'DÉBITO OU DINHEIRO',
                visibleCartao: true
            })
        this.props.form.resetFields('contaid', 'cartao')
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

    handleValorReal(valor) {
        this.setState({ ...this.state, valorRealizadoInput: valor })
    }

    handleDataReal(date, dateString) {
        this.setState({ ...this.state, dataRealInput: dateString })
    }

    handleConta(valorConta) {
        this.setState({ ...this.state, contaInput: valorConta })
    }

    handleCartao(valorCartao) {
        this.setState({ ...this.state, cartaoInput: valorCartao })
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err) => {
            if (!err) this.handleSubmitok()
        });
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    async handleSubmitok() {

        const valueStatus = this.state.cartaoInput === 'DÉBITO OU DINHEIRO' ? 'Pagamento Realizado' : 'Fatura Pronta Para Pagamento'
        const valueData = this.state.dataRealInput ? this.state.dataRealInput : moment(new Date(), dateFormat)
        const valueCartao = this.state.cartaoInput === 'DÉBITO OU DINHEIRO' ? null : this.state.cartaoInput
        const valueConta = this.state.cartaoInput === 'DÉBITO OU DINHEIRO' ? this.state.contaInput : null

        const body = {
            id: this.props.data.ID,
            idUser: userID(),
            valueEdit: this.state.visibleEdit,
            idGrupo: this.props.data.ID_GRUPO,
            categoria: this.state.categoriaInput,
            cartao: valueCartao,
            parcela: this.state.parcelasInput,
            valorPrevisto: this.state.valorPrevistoInput,
            dataPrevista: this.state.dataPrevistaInput,
            descrDespesa: this.state.descrDespesaInput,
            idConta: valueConta,
            valorReal: this.state.valorRealizadoInput,
            dataReal: valueData,
            status: valueStatus,
        }

        const data = moment(body.dataReal, "DD/MM/YYYY");
        body.dataReal = data.format("YYYY-MM-DD")

        const dataPrev = moment(body.dataPrevista, "DD/MM/YYYY");
        body.dataPrevista = dataPrev.format("YYYY-MM-DD")


        const resulStatus = await UpdateRequest(body, 'api/despesas/pagar')

        if (this._isMounted === true) {
            verifySend(resulStatus, 'METAPAGA', body.descrDespesa)


            if (resulStatus === 200) {
                const despesa = await GetRequest('api/despesas')
                const resultVision = await GetRequest('api/visions')

                const novaVisao = visionSerchMeta(resultVision, despesa, this.props.visionControler)

                this.handleCancel()
                this.props.listExpenseControlerMeta(this.props.visionControler !== 'ALL' ?
                    novaVisao[0] !== undefined ? novaVisao[0] : [] :
                    despesa)

                // this.props.listExpenseControlerMeta(despesa)
            }
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <LikeTwoTone title='Efetura Contabilização' style={{ fontSize: '18px', color: '#08c' }} onClick={this.showModal} />

                <form onSubmit={this.handleSubmit}>
                    <Modal
                        title="Efetuar Pagamento Despesa Prevista"
                        visible={this.state.visible}
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >

                        <div style={{ width: '99%', textAlign: 'initial' }}>
                            <Switch
                                title='Pagamento no Crédito ou no Dinheiro?'
                                onChange={this.handletipoPagamento}
                                checked={this.state.check} />

                            <label style={{ padding: '10px' }}>
                                <strong>
                                    {this.state.visibleTipoPagamento}
                                </strong>
                            </label>

                            <Switch
                                style={{ width: '10%' }}
                                title='Habilite para Amortizações'
                                onChange={this.handleEdit} />

                            <label style={{ padding: '15px' }}> {this.state.visibleEdit}</label>

                        </div>
                        <div style={{ width: '100%', display: 'flex' }}>
                            <Form.Item style={{ width: '50%' }}>
                                {getFieldDecorator('vlreal', {
                                    rules: [{ required: true, message: 'Informe o valor Pago!' }],
                                    initialValue: this.state.valorRealizadoInput
                                })(
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        placeholder="Valor Real"
                                        decimalSeparator=','
                                        precision={2}
                                        min={0}
                                        onChange={this.handleValorReal}
                                    />)}
                            </Form.Item>
                            <Form.Item style={{ width: '50%' }}>
                                {getFieldDecorator('dtteral', {
                                    rules: [{ required: true, message: 'Por Favor, informe a Data Realizada!' }],
                                    initialValue: moment(new Date(), dateFormat)
                                })(
                                    <DatePicker style={{ width: '100%' }}
                                        onChange={this.handleDataReal}
                                        placeholder="Data Real"
                                        format={dateFormat}
                                    />)}
                            </Form.Item>
                        </div>
                        <div style={{ width: '100%', display: 'flex' }}>
                            <Form.Item style={{ width: '50%' }}>
                                {getFieldDecorator('contaid', {
                                    rules: [{ required: this.state.visibleConta === true ? false : true, message: 'Por favor informe a conta de pagamento!' }],
                                    initialValue: this.state.contaInput
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
                                        disabled={this.state.visibleConta}
                                        onSelect={this.handleConta}
                                    >
                                        {this.state.conta}
                                    </Select>)}
                            </Form.Item>
                            <Form.Item style={{ width: '50%' }}>
                                {getFieldDecorator('cartao', {
                                    rules: [{ required: this.state.visibleCartao === true ? false : true, message: 'Por favor, informe o cartão de crédito!' }],
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
                                        disabled={this.state.visibleCartao}
                                        onSelect={this.handleCartao}
                                    >
                                        {this.state.cartao}
                                    </Select>)}
                            </Form.Item>
                        </div>
                        <TextArea
                            placeholder="Descreva a Despesa"
                            style={{ width: '99%' }}
                            rows={4}
                            onChange={(event) => this.handledescricaoDespesa(event.target.value)}
                            value={this.state.descrDespesaInput}
                        />

                        <Divider orientation="left">Detalhes da Despesa - Meta</Divider>

                        <InputNumber
                            style={{ width: '49%' }}
                            placeholder="Valor Previsto"
                            decimalSeparator=','
                            precision={2}
                            min={0}
                            disabled
                            value={this.state.valorPrevistoInput}
                        />

                        <DatePicker style={{ width: '49%' }}
                            placeholder="Data Prevista"
                            defaultValue={moment(this.state.dataPrevistaInput, dateFormat)}
                            format={dateFormat}
                            disabled
                        />


                        <InputNumber
                            style={{ width: '35%' }}
                            placeholder='N Parcelas'
                            min={1}
                            onChange={this.handleParcelas}
                            value={this.state.parcelasInput}
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
                            value={this.state.categoriaInput}
                        >
                            {this.state.categoria}
                        </Select>

                    </Modal>
                </form>
            </div >
        )
    }
}

const WrappedApp = Form.create({ name: 'coordinated' })(ModalExpense);

const mapStateToProps = (state) => {
    return {
        controlerexpenseMeta: state.controlerexpenseMeta,
        visionControler: state.visionControler
    }
}

const mapDispatchToProps = { listExpenseControlerMeta, listVisionsControler }


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedApp)