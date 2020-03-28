import React from 'react'
import { connect } from 'react-redux'

import axios from 'axios'
import { Icon, Modal, Input, Select, DatePicker, InputNumber, notification, message, Radio } from 'antd'
import moment from 'moment';

import { listRevenues } from '../../../store/actions/generalRevenueAction'
import { urlBackend, config, userID } from '../../../routes/urlBackEnd'
import { loadCategoriaReceita } from '../../ListagemCombo'

import 'antd/dist/antd.css';
import './styles.scss'

const { TextArea } = Input;

const dateFormat = 'DD/MM/YYYY'

class ModalRevenue extends React.Component {
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
            parcelasInput: 1,
            categoriaInput: [],
            descrReceitaInput: '',
        }

        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleValorPrevisto = this.handleValorPrevisto.bind(this)
        this.handleDataPrevisto = this.handleDataPrevisto.bind(this)
        this.handleParcelas = this.handleParcelas.bind(this)
        this.handleCategoria = this.handleCategoria.bind(this)
        this.handledescricaoReceita = this.handledescricaoReceita.bind(this)
        this.handleValue = this.handleValue.bind(this)
        this.handleDayValue = this.handleDayValue.bind(this)
    }

    async showModal() {
        const resultCategoria = await loadCategoriaReceita()
        this.setState({ ...this.state, categoria: resultCategoria, visible: true })
    };

    handleCancel() {
        this.setState({
            ...this.state, parcelasInput: 1, value: 1, dayVisible: true, dayValue: null, valorPrevistoInput: null, dataPrevistaInput: null,
            categoriaInput: [], descrReceitaInput: '', visible: false
        })
    };

    handleValorPrevisto(valor) {
        this.setState({ ...this.state, valorPrevistoInput: valor })
    }

    handleDataPrevisto(date, dateString) {
        this.setState({ ...this.state, dataPrevistaInput: dateString })
        console.log(dateString)
    }

    handleParcelas(num) {
        this.setState({ ...this.state, parcelasInput: num })
        console.log('Parcela Inserida', num)
    }

    handleCategoria(Categorys) {
        this.setState({ ...this.state, categoriaInput: Categorys })
        console.log('Categoria Inserida', Categorys)
    }

    handledescricaoReceita(receita) {
        this.setState({ ...this.state, descrReceitaInput: receita.toUpperCase() })
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


    async handleSubmit(event) {
        event.preventDefault()

        const endpointAPI = `${urlBackend}/api/receitas`

        const ID = () => '_' + Math.random().toString(36).substr(2, 9);
        const body = {
            idGrupo: ID(),
            idUser: userID(),
            dataPrevista: this.state.dataPrevistaInput,
            valorPrevisto: this.state.valorPrevistoInput,
            categoria: this.state.categoriaInput,
            parcela: this.state.parcelasInput,
            descrReceita: this.state.descrReceitaInput,
            tipoParcela: this.state.value,
            dayValue: this.state.dayValue,
            status: "Esperando Pagamento",
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
        }

        if (body.dataPrevista === null | body.valorPrevisto === null |
            body.categoria.length === 0 | body.parcela.length === 0 | body.descrReceita.length === 0) {

            const args = {
                message: 'Preencha todos os dados do Formulário',
                description:
                    'Para cadastrar uma nova Receita é necessário que seja informado todos os campos',
                duration: 5,
            };

            notification.open(args);

        } else {

            const resulStatus = await axios.post(endpointAPI, body, config)

            if (resulStatus.status === 200) {

                message.success('Receita inserida com Sucesso', 7)

                const endpointAPIAll = `${urlBackend}api/receitas/${userID()}`

                const result = await axios.get(endpointAPIAll)

                const receita = result.data

                this.props.listRevenues(receita)
                this.handleCancel()

            } else {
                message.error(`Não foi possivel inserir a receita, Erro: ${resulStatus.status}`, 7)
            }
        }
    }

    render() {

        return (
            <div>
                <Icon type="plus-circle" style={{ fontSize: '36px', color: '#08c' }} title='Adicionar nova Receita Prevista' theme="twoTone" onClick={this.showModal} />

                <form onSubmit={this.handleSubmit}>
                    <Modal
                        title="Cadastrar Receita Prevista"
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
                            style={{ width: '64%' }}
                            placeholder="Informe a Categoria"
                            onSelect={this.handleCategoria}
                            value={this.state.categoriaInput}
                        >
                            {this.state.categoria}
                        </Select>

                        <TextArea
                            placeholder="Descreva a Receita"
                            style={{ width: '99%' }}
                            rows={6}
                            onChange={(event) => this.handledescricaoReceita(event.target.value)}
                            value={this.state.descrReceitaInput}
                        />

                    </Modal>
                </form>
            </div >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        revenue: state.revenue,
    }
}

const mapDispatchToProps = { listRevenues }


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalRevenue)