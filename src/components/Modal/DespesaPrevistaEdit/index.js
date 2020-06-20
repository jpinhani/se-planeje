import React from 'react'
import { connect } from 'react-redux'

import { Icon, Modal, Input, Select, DatePicker, InputNumber, Switch, Radio, Form } from 'antd'
import moment from 'moment';

import { listExpenses } from '../../../store/actions/generalExpenseAction'
import { userID } from '../../../services/urlBackEnd'
import { loadCartao, loadCategoria } from '../../ListagemCombo'

import { GetRequest, UpdateRequest } from '../../crudSendAxios/crud'
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

    async showModal() {

        const resultCategoria = await loadCategoria()
        const resultCartao = await loadCartao()

        this.setState({ ...this.state, cartao: resultCartao, categoria: resultCategoria, visible: true })

        if (this.props.data.ID_CARTAO === null)
            this.setState({ ...this.state, cartaoInput: 'DÉBITO OU DINHEIRO' })

    };


    handleCancel() {
        this.setState({
            ...this.state, visible: false
        })
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

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err) => { /* !err */

            if (!err) this.handleSubmitok()
        });
    }

    async handleSubmitok() {

        const body = {
            id: this.props.data.ID,
            idUser: userID(),
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
        }


        const resultStatus = await UpdateRequest(body, 'api/despesas')

        verifySend(resultStatus, 'UPDATE', body.descrDespesa)

        const Data = resultStatus === 200 ? await GetRequest('api/despesas') : {}

        this.props.listExpenses(Data)
        this.handleCancel()


    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Icon type="edit" style={{ fontSize: '18px', color: '#08c' }} title='Editar Despesa Prevista' theme="twoTone" onClick={this.showModal} />

                <Form onSubmit={this.handleSubmit}>
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

                        <div style={{ width: '100%', display: 'flex' }}>
                            <Form.Item style={{ width: '50%' }}  >
                                {getFieldDecorator('vlPrevisto', {
                                    rules: [{ required: true, message: 'Por Favor, informe o valor previsto!' }],
                                    initialValue: this.state.valorPrevistoInput
                                })(
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        placeholder="Valor Previsto"
                                        decimalSeparator=','
                                        precision={2}
                                        min={0}
                                        onChange={this.handleValorPrevisto}
                                    />)}

                            </Form.Item>
                            <Form.Item style={{ width: '50%' }}>
                                {getFieldDecorator('dtPrevista', {
                                    rules: [{ required: true, message: 'A data de Previsão é obrigatória!' }],
                                    initialValue: moment(this.state.dataPrevistaInput, dateFormat)
                                })(
                                    <DatePicker style={{ width: '100%' }}
                                        onChange={this.handleDataPrevisto}
                                        placeholder="Data Prevista"
                                        format={dateFormat}
                                    />)}
                            </Form.Item>
                        </div>

                        <div style={{ width: '100%', display: 'flex' }}>
                            <Form.Item style={{ width: '65%' }} >
                                {getFieldDecorator('cartao', {
                                    rules: [{ required: true, message: 'Por Favor, Informe o pagamento' }],
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

                            <Form.Item style={{ width: '35%' }} >
                                {getFieldDecorator('parcela', {
                                    rules: [{ required: true, message: 'Por favor informe o numero de parcelas!' }],
                                    initialValue: this.state.parcelasInput
                                })(
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        placeholder='N Parcelas'
                                        min={1}
                                        onChange={this.handleParcelas}
                                        disabled
                                    />)}
                            </Form.Item>
                        </div>

                        <Form.Item style={{ width: '100%' }}>
                            {getFieldDecorator('Categoria', {
                                rules: [{ required: true, message: 'Por favor informe a categoria!' }],
                                initialValue: this.state.categoriaInput
                            })(
                                < Select
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (
                                        option.props.children.toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    )}
                                    style={{ width: '99%' }}
                                    placeholder="Informe a Categoria"
                                    onSelect={this.handleCategoria}
                                >
                                    {this.state.categoria}
                                </Select>)}
                        </Form.Item>

                        <Form.Item style={{ width: '100%' }}>
                            {getFieldDecorator('description', {
                                rules: [{ required: true, message: 'Por favor, descreva a despesa' }],
                                initialValue: this.state.descrDespesaInput
                            })(
                                <TextArea
                                    placeholder="Descreva a Despesa"
                                    style={{ width: '99%' }}
                                    rows={6}
                                    onChange={(event) => this.handledescricaoDespesa(event.target.value)}

                                />)}
                        </Form.Item>
                    </Modal>
                </Form>
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