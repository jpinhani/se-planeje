import React from 'react'

import { connect } from 'react-redux'
import axios from 'axios'

import { Modal, Input, Select, DatePicker, InputNumber, notification, message, Switch, Divider } from 'antd'
import { LikeTwoTone } from '@ant-design/icons';
import moment from 'moment';

import { listExpenses } from '../../../store/actions/generalExpenseAction'
import { listExpensesPaga } from '../../../store/actions/generalExpenseRealAction'
import { urlBackend, config, userID } from '../../../routes/urlBackEnd'
import { loadCategoria, loadCartao, loadConta } from '../../ListagemCombo'


import 'antd/dist/antd.css';
import './styles.scss'

const { TextArea } = Input;

const dateFormat = 'DD/MM/YYYY'

class ModalExpense extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false, //Controla a visibilidade do formulário
            visibleConta: true, //Se for despesa de cartão bloqueia conta se não desbloqueia
            visibleEdit: 'Essa Despesa Esta Sendo Contabilizada', //State Para saber se é Amortização ou não
            categoria: this.props.data.ID_CATEGORIA, //Listagem de Categoria
            cartao: this.props.data.ID_CARTAO, //Listagem de Cartão
            conta: [],
            valorPrevistoInput: this.props.data.VL_PREVISTO2,
            dataPrevistaInput: this.props.data.DATANOVA,
            cartaoInput: this.props.data.ID_CARTAO, //Cartão Selecionado no Click
            parcelasInput: this.props.data.NUM_PARCELA,
            categoriaInput: this.props.data.ID_CATEGORIA, //Categoria Selecionada no Click
            descrDespesaInput: this.props.data.DESCR_DESPESA,
            contaInput: null,
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
    }

    async showModal() {
        const resultCategoria = await loadCategoria()
        const resultCartao = await loadCartao()
        const resultConta = await loadConta()

        this.setState({
            ...this.state,
            categoria: resultCategoria,
            cartao: resultCartao,
            conta: resultConta,
            visible: true
        })

        if (this.props.data.ID_CARTAO === 0)
            this.setState({ ...this.state, visibleConta: false, cartaoInput: 'DÉBITO OU DINHEIRO' })

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


    async handleSubmit(event) {
        event.preventDefault()
        const endpointAPI = `${urlBackend}api/despesas/pagar/${this.props.data.ID}`

        const valueStatus = this.state.cartaoInput === 'DÉBITO OU DINHEIRO' ? 'Pagamento Realizado' : 'Fatura Pronta Para Pagamento'
        const valueData = this.state.dataRealInput ? this.state.dataRealInput : moment(new Date(), dateFormat)
        const valueCartao = this.state.cartaoInput === 'DÉBITO OU DINHEIRO' ? null : this.state.cartaoInput

        const body = {
            idUser: userID(),
            valueEdit: this.state.visibleEdit,
            idGrupo: this.props.data.ID_GRUPO,
            categoria: this.state.categoriaInput,
            cartao: valueCartao,
            parcela: this.state.parcelasInput,
            valorPrevisto: this.state.valorPrevistoInput,
            dataPrevista: this.state.dataPrevistaInput,
            descrDespesa: this.state.descrDespesaInput,
            idConta: this.state.contaInput,
            valorReal: this.state.valorRealizadoInput,
            dataReal: valueData,
            status: valueStatus,
        }

        const data = moment(body.dataReal, "DD/MM/YYYY");
        body.dataReal = data.format("YYYY-MM-DD")

        const dataPrev = moment(body.dataPrevista, "DD/MM/YYYY");
        body.dataPrevista = dataPrev.format("YYYY-MM-DD")

        if (body.dataReal === null | body.valorReal === null | body.descrDespesa.length === 0 |
            (body.idConta === null && valueStatus === 'Pagamento Realizado')) {

            const args = {
                message: 'Preencha todos os dados do Formulário',
                description:
                    'Para editar uma despesa é necessário que seja informado todos os campos',
                duration: 5,
            };

            notification.open(args);

        } else {
            const resulStatus = await axios.put(endpointAPI, body, config)

            if (resulStatus.status === 200) {
                message.success('Despesa contabilizada com Sucesso', 7)


                const endpointAPIAll = `${urlBackend}api/despesas/${userID()}`

                const result = await axios.get(endpointAPIAll)
                const despesa = result.data

                const endpointAPIAllPaga = `${urlBackend}api/despesas/paga/${userID()}`
                const resultPaga = await axios.get(endpointAPIAllPaga)
                const despesaPaga = resultPaga.data

                this.handleCancel()
                this.props.listExpensesPaga(despesaPaga)
                this.props.listExpenses(despesa)

            } else {
                message.error(`Não foi possivel contabilizar a Despesa, Erro: ${resulStatus.status}`, 7)
            }

        }

    }

    render() {

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
                        <div className='SwitchAjust'>
                            <Switch
                                style={{ width: '10%' }}
                                title='Habilite para Amortizações'
                                onChange={this.handleEdit} />

                            <label>{this.state.visibleEdit}</label>
                        </div>

                        <InputNumber
                            style={{ width: '49%' }}
                            placeholder="Valor Real"
                            decimalSeparator=','
                            precision={2}
                            min={0}
                            value={this.state.valorRealizadoInput}
                            onChange={this.handleValorReal}
                            required={true}
                        />

                        <DatePicker style={{ width: '49%' }}
                            onChange={this.handleDataReal}
                            placeholder="Data Real"
                            defaultValue={moment(new Date(), dateFormat)}
                            format={dateFormat}
                        />

                        <Select
                            showSearch
                            style={{ width: '99%' }}
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
                        </Select>

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

                        <Select
                            showSearch
                            style={{ width: '65%' }}
                            placeholder="Informe o Cartão"
                            optionFilterProp="children"
                            filterOption={(input, option) => (
                                option.props.children.toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            )}
                            disabled
                            value={this.state.cartaoInput}
                        >
                            {this.state.cartao}
                        </Select>

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
                            style={{ width: '99%' }}
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

const mapStateToProps = (state) => {
    return {
        expense: state.expense,
        expenseReal: state.expenseReal,
    }
}

const mapDispatchToProps = { listExpenses, listExpensesPaga }


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalExpense)