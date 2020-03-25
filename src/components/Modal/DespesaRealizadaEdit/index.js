import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Icon, Modal, Input, Select, DatePicker, InputNumber, notification, message, Switch, Radio } from 'antd'
import moment from 'moment';
import { listExpensesPaga } from '../../../store/actions/generalExpenseRealAction'
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
            tipoParcela: true,
            dayValue: null,
            visibleEdit: 'Apenas essa parcela será alterada',
            categoria: this.props.data.ID_CATEGORIA,
            cartao: this.props.data.ID_CARTAO,
            valorPrevistoInput: this.props.data.VL_PREVISTO2,
            dataPrevistaInput: this.props.data.DATANOVA,
            cartaoInput: this.props.data.ID_CARTAO,
            parcelasInput: this.props.data.NUM_PARCELA,
            categoriaInput: this.props.data.ID_CATEGORIA,
            descrDespesaInput: this.props.data.DESCR_DESPESA,
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
        this.handleEdit = this.handleEdit.bind(this)
        this.handleValue = this.handleValue.bind(this)
        this.handleDayValue = this.handleDayValue.bind(this)
    }

    showModal() { this.setState({ ...this.state, visible: true }) };


    handleCancel() {
        this.setState({ ...this.state, visible: false })
    };

    handleEdit(valor) {
        if (valor === true) {
            this.setState({ ...this.state, tipoParcela: false, visibleEdit: `Todas as despesas a partir da ${this.state.parcelasInput}º parcela serão alteradas` })
        } else {
            this.setState({ ...this.state, dayValue: null, dayVisible: true, tipoParcela: true, visibleEdit: 'Apenas essa parcela será alterada' })
        }
    }

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



    componentDidMount() {
        this.loadCategoria()
        this.loadCartao()
        if (this.props.data.ID_CARTAO === 0)
            this.setState({ ...this.state, cartaoInput: 'DÉBITO OU DINHEIRO' })
    }

    async loadCategoria() {
        const userID = localStorage.getItem('userId')
        const endpoint = `http://seplaneje-com.umbler.net/api/despesas/category/${userID}`

        const result = await axios.get(endpoint)

        const options = result.data.map((desc, i) =>
            <Option key={i} value={desc.ID}>
                {desc.DESCR_CATEGORIA}
            </Option>
        )
        this.setState({ ...this.state, categoria: options })
    }

    async loadCartao() {
        const userID = localStorage.getItem('userId')
        const endpoint = `http://seplaneje-com.umbler.net/api/despesas/cartao/${userID}`

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
        const endpointAPI = `http://seplaneje-com.umbler.net/api/despesas/real/${this.props.data.ID}`

        const body = {
            idUser: localStorage.getItem('userId'),
            dataPrevista: this.state.dataPrevistaInput,
            valorPrevisto: this.state.valorPrevistoInput,
            cartao: this.state.cartaoInput,
            categoria: this.state.categoriaInput,
            parcela: this.state.parcelasInput,
            descrDespesa: this.state.descrDespesaInput,
            valueEdit: this.state.visibleEdit,
            idGrupo: this.props.data.ID_GRUPO,
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
                    'Para editar uma despesa é necessário que seja informado todos os campos',
                duration: 5,
            };
            notification.open(args);
        } else {

            const resulStatus = await axios.put(endpointAPI, body)
            if (resulStatus.status === 200) {
                message.success('Despesa Editada com Sucesso', 7)
                const userID = localStorage.getItem('userId')
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
                <Icon type="edit" style={{ fontSize: '18px', color: '#08c' }} title='Editar Despesa Prevista' theme="twoTone" onClick={this.showModal} />


                <form onSubmit={this.handleSubmit}>
                    <Modal
                        title="Editar Despesa Prevista"
                        visible={this.state.visible}
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                        <div className='SwitchAjust'>
                            <Switch
                                style={{ width: '10%' }}
                                title='Habilite para Editar Todas as Despesas'
                                onChange={this.handleEdit} />

                            <label>{this.state.visibleEdit}</label>
                        </div>

                        <Radio.Group
                            style={{ width: '73%' }}
                            onChange={this.handleValue}
                            value={this.state.value}
                            disabled={this.state.tipoParcela}>
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
                            onChange={this.handleValorPrevisto}
                            value={this.state.valorPrevistoInput}
                        />

                        <DatePicker style={{ width: '49%' }}
                            onChange={this.handleDataPrevisto}
                            placeholder="Data Prevista"
                            defaultValue={moment(this.state.dataPrevistaInput, dateFormat)}
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