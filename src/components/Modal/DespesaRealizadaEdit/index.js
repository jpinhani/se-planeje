import React from 'react'
import { connect } from 'react-redux'

import axios from 'axios'
import { Icon, Modal, Input, Select, DatePicker, InputNumber, notification, message, Switch } from 'antd'
import moment from 'moment';

import { listExpensesPaga } from '../../../store/actions/generalExpenseRealAction'
import { urlBackend, config, userID } from '../../../routes/urlBackEnd'
import { loadCategoria, loadCartaoReal, loadConta } from '../../ListagemCombo'

import 'antd/dist/antd.css';
import './styles.scss'

const { TextArea } = Input;

const dateFormat = 'DD/MM/YYYY'


class ModalExpense extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            visibleEdit: this.props.data.DESCR_CONTA === null ? 'CRÉDITO' : 'A VISTA',
            check: this.props.data.DESCR_CONTA === null ? true : false,
            stateConta: this.props.data.DESCR_CONTA === null ? true : false,
            stateCartao: this.props.data.DESCR_CONTA === null ? false : true,
            categoria: [],
            cartao: [],
            conta: [],
            valorRealInput: this.props.data.VL_REAL2,
            dataRealInput: this.props.data.DATANOVAREAL,
            cartaoInput: this.props.data.CARTAO === null ? [] : this.props.data.ID_CARTAO,
            categoriaInput: this.props.data.ID_CATEGORIA,
            contaInput: this.props.data.DESCR_CONTA === null ? [] : this.props.data.ID_CONTA,
            descrDespesaInput: this.props.data.DESCR_DESPESA,
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
                check: true,
                stateCartao: false
            })
            : this.setState({
                ...this.state, visibleEdit: `A VISTA`,
                stateConta: false,
                cartaoInput: [],
                check: false,
                stateCartao: true
            })

    }

    handleCancel() {
        this.setState({
            ...this.state,
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

    async handleSubmit(event) {
        event.preventDefault()

        const endpointAPI = `${urlBackend}api/despesas/real/${userID()}`

        const ID = () => '_' + Math.random().toString(36).substr(2, 9);

        const body = {
            id: this.props.data.ID,
            idGrupo: ID(),
            idUser: userID(),
            dataReal: moment(this.state.dataRealInput, "DD/MM/YYYY"),
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

        console.log(body.dataReal)
        if (body.dataReal === null |
            body.valorReal === null |
            body.categoria.length === 0 |
            body.descrDespesa.length === 0 |
            (body.conta.length === 0 && body.cartao.length === 0)) {

            const args = {
                message: 'Preencha todos os dados do Formulário',
                description:
                    'Para alterar uma despesa é necessário que seja informado todos os campos',
                duration: 5,
            };
            notification.open(args);

        } else {

            const resulStatus = await axios.put(endpointAPI, body, config)
            if (resulStatus.status === 200) {

                message.success('Despesa Alterada com Sucesso', 7)

                const endpointAPIAll = `${urlBackend}api/despesas/paga/${userID()}`
                const result = await axios.get(endpointAPIAll)

                const despesa = result.data
                this.handleCancel()
                this.props.listExpensesPaga(despesa)

            } else {
                message.error(`Não foi possivel alterar a Despesa, Erro: ${resulStatus.status}`, 7)
            }
        }
    }

    render() {

        return (
            <div>
                <Icon type="edit" style={{ fontSize: '18px', color: '#08c' }} title='Adicionar nova Despesa Prevista' theme="twoTone" onClick={this.showModal} />

                <form onSubmit={this.handleSubmit}>
                    <Modal
                        title="Editar Registro de Despesa Realizada"
                        visible={this.state.visible}
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                        <div style={{ width: '100%', textAlign: 'initial' }}>
                            <Switch
                                checked={this.state.check}
                                title='Pagamento no Crédito ou no Dinheiro?'
                                onChange={this.handletipoPagamento} />

                            <label style={{ padding: '30px' }}>
                                <strong>
                                    {this.state.visibleEdit}
                                </strong>
                            </label>
                        </div>

                        <InputNumber
                            style={{ width: '49%' }}
                            placeholder="Valor Executado"
                            decimalSeparator=','
                            precision={2}
                            min={0}
                            autoFocus
                            onChange={this.handleValorReal}
                            value={this.state.valorRealInput}
                        />

                        <DatePicker style={{ width: '49%' }}
                            onChange={this.handleDataReal}
                            placeholder="Data Executada"
                            defaultValue={moment(this.props.data.DATANOVAREAL, dateFormat)}
                            format={dateFormat}
                        />
                        <Select
                            showSearch
                            disabled={this.state.stateConta}
                            style={{ width: '49%' }}
                            placeholder="Informe o Conta"
                            optionFilterProp="children"
                            filterOption={(input, option) => (
                                option.props.children.toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            )}
                            onSelect={this.handleConta}
                            value={this.state.contaInput}
                        >
                            {this.state.conta}
                        </Select>

                        <Select
                            showSearch
                            disabled={this.state.stateCartao}
                            style={{ width: '49%' }}
                            placeholder="Informe o Cartão"
                            optionFilterProp="children"
                            filterOption={(input, option) => (
                                option.props.children.toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            )}
                            onSelect={this.handleCartao}
                            value={this.state.cartaoInput}
                        >
                            {this.state.cartao}
                        </Select>

                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => (
                                option.props.children.toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            )}
                            style={{ width: '99%' }}
                            placeholder="Informe a Categoria"
                            onSelect={this.handleCategoria}
                            value={this.state.categoriaInput}
                        >
                            {this.state.categoria}
                        </Select>

                        <TextArea
                            placeholder="Descreva a Despesa"
                            style={{ width: '99%' }}
                            rows={6}
                            // value={descrDespesaInput}
                            onChange={(event) => this.handledescricaoDespesa(event.target.value)}
                            value={this.state.descrDespesaInput}
                        />

                    </Modal>
                </form>
            </div >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        expenseReal: state.expenseReal,
    }
}

const mapDispatchToProps = { listExpensesPaga }


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalExpense)