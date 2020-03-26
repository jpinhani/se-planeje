import React from 'react'
import { connect } from 'react-redux'

import axios from 'axios'
import { Icon, Modal, Input, Select, DatePicker, InputNumber, notification, message, Radio } from 'antd'
import moment from 'moment';

import { listExpensesPaga } from '../../../store/actions/generalExpenseRealAction'
import { urlBackend, config, userID } from '../../../routes/urlBackEnd'

import 'antd/dist/antd.css';
import './styles.scss'


const { Option } = Select;
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
            dataPrevistaInput: new Date().dateString,
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
        await this.loadCategoria()
        await this.loadCartao()
        await this.setState({ ...this.state, visible: true })
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
        console.log(dateString)
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

    async loadCategoria() {

        const endpoint = `${urlBackend}api/despesas/category/${userID}`

        const result = await axios.get(endpoint)

        const options = result.data.map((desc, i) =>
            <Option key={i} value={desc.ID}>
                {desc.DESCR_CATEGORIA}
            </Option>
        )

        this.setState({ ...this.state, categoria: options })
    }

    async loadCartao() {

        const endpoint = `${urlBackend}api/despesas/cartao/${userID}`

        const result = await axios.get(endpoint)

        const options = result.data.map((desc, i) =>
            <Option key={i} value={desc.ID}>
                {desc.CARTAO}
            </Option>
        )
        options.push(<Option key='nd' value='DÉBITO OU DINHEIRO'>DÉBITO OU DINHEIRO</Option>)
        this.setState({ ...this.state, cartao: options })
    }


    async handleSubmit(event) {
        event.preventDefault()

        const endpointAPI = `${urlBackend}api/despesas`
        const ID = () => '_' + Math.random().toString(36).substr(2, 9);

        const body = {
            idGrupo: ID(),
            idUser: userID,
            dataPrevista: this.state.dataPrevistaInput,
            valorPrevisto: this.state.valorPrevistoInput,
            cartao: this.state.cartaoInput,
            categoria: this.state.categoriaInput,
            parcela: this.state.parcelasInput,
            descrDespesa: this.state.descrDespesaInput,
            tipoParcela: this.state.value,
            dayValue: this.state.dayValue,
            status: "Ativo",
        }
        console.log(body)
        if (body.cartao === 'DÉBITO OU DINHEIRO') {
            body.cartao = null
            body.status = 'Esperando Pagamento'
        } else {
            body.status = 'Fatura Pendente'
        }

        if (body.dataPrevista === undefined) {
            let Hoje = new Date();
            const mm = Hoje.getMonth() + 1;
            const dd = Hoje.getDate();
            const yyyy = Hoje.getFullYear();
            const dataNova = yyyy + '/' + mm + '/' + dd;
            const dataAtual = dd + '/' + mm + '/' + yyyy;
            this.setState({ ...this.state, dataPrevistaInput: dataAtual })
            body.dataPrevista = dataNova;

        } else {
            const data = moment(body.dataPrevista, "DD/MM/YYYY");
            body.dataPrevista = data.format("YYYY-MM-DD")
            console.log('body.dataPrevista', body.dataPrevista)
        }

        if (body.dataPrevista === null | body.valorPrevisto === null |
            body.categoria.length === 0 | body.parcela.length === 0 | body.descrDespesa.length === 0) {

            const args = {
                message: 'Preencha todos os dados do Formulário',
                description:
                    'Para cadastrar uma nova despesa é necessário que seja informado todos os campos',
                duration: 5,
            };
            notification.open(args);

        } else {

            const resulStatus = await axios.post(endpointAPI, body, config)
            if (resulStatus.status === 200) {

                message.success('Despesa inserida com Sucesso', 7)

                const endpointAPIAll = `http://seplaneje-com.umbler.net/api/despesas/real/${userID}`
                const result = await axios.get(endpointAPIAll)

                const despesa = result.data

                this.props.listExpensesPaga(despesa)
                this.handleCancel()
            } else {
                message.error(`Não foi possivel inserir as Despesas, Erro: ${resulStatus.status}`, 7)
            }
        }
    }

    render() {

        return (
            <div>
                <Icon type="plus-circle" style={{ fontSize: '36px', color: '#08c' }} title='Adicionar nova Despesa Prevista' theme="twoTone" onClick={this.showModal} />

                <form onSubmit={this.handleSubmit}>
                    <Modal
                        title="Cadastrar Despesa Prevista"
                        visible={this.state.visible}
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >

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

                        <InputNumber
                            style={{ width: '49%' }}
                            placeholder="Valor Previsto"
                            decimalSeparator=','
                            precision={2}
                            min={0}
                            autoFocus
                            onChange={this.handleValorPrevisto}
                            value={this.state.valorPrevistoInput}
                        />

                        <DatePicker style={{ width: '49%' }}
                            onChange={this.handleDataPrevisto}
                            placeholder="Data Prevista"
                            defaultValue={moment(new Date(), dateFormat)}
                            format={dateFormat}
                        />

                        <Select
                            defaultValue='DÉBITO OU DINHEIRO'
                            showSearch
                            style={{ width: '65%' }}
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

                        <InputNumber
                            style={{ width: '35%' }}
                            placeholder='N Parcelas'
                            min={1}
                            onChange={this.handleParcelas}
                            value={this.state.parcelasInput}
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

const mapStateToProps = (state/*, ownProps*/) => {
    return {
        expenseReal: state.expenseReal,
    }
}

const mapDispatchToProps = { listExpensesPaga }


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalExpense)