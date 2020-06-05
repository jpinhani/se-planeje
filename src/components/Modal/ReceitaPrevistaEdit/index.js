import React from 'react'
import { connect } from 'react-redux'

import { Icon, Modal, Input, Select, DatePicker, InputNumber, Switch, Radio, Form } from 'antd'
import moment from 'moment';

import { listRevenues } from '../../../store/actions/generalRevenueAction'
import { userID } from '../../../services/urlBackEnd'

import { UpdateRequest, GetRequest } from '../../crudSendAxios/crud'
import { verifySend } from '../../verifySendAxios/index'

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
            tipoParcela: true,
            dayValue: null,
            visibleEdit: 'Apenas essa parcela será alterada',
            categoria: this.props.data.ID_CATEGORIA,
            valorPrevistoInput: this.props.data.VL_PREVISTO2,
            dataPrevistaInput: this.props.data.DATANOVA,
            parcelasInput: this.props.data.NUM_PARCELA,
            categoriaInput: this.props.data.ID_CATEGORIA,
            descrReceitaInput: this.props.data.DESCR_RECEITA,
        }

        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleValorPrevisto = this.handleValorPrevisto.bind(this)
        this.handleDataPrevisto = this.handleDataPrevisto.bind(this)
        this.handleParcelas = this.handleParcelas.bind(this)
        this.handleCategoria = this.handleCategoria.bind(this)
        this.handledescricaoReceita = this.handledescricaoReceita.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleValue = this.handleValue.bind(this)
        this.handleDayValue = this.handleDayValue.bind(this)
    }

    async showModal() {
        const resultCategoria = await loadCategoriaReceita()
        this.setState({ ...this.state, categoria: resultCategoria, visible: true })
    };


    handleCancel() {
        this.setState({ ...this.state, visible: false })
    };

    handleEdit(valor) {
        if (valor === true) {
            this.setState({ ...this.state, tipoParcela: false, visibleEdit: `Todas as receitas do grupo a partir da ${this.state.parcelasInput}º parcela serão alteradas` })
        } else {
            this.setState({ ...this.state, dayValue: null, dayVisible: true, tipoParcela: true, visibleEdit: 'Apenas essa parcela será alterada' })
        }
    }

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
            categoria: this.state.categoriaInput,
            parcela: this.state.parcelasInput,
            descrReceita: this.state.descrReceitaInput,
            valueEdit: this.state.visibleEdit,
            idGrupo: this.props.data.ID_GRUPO,
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
            console.log('body.dataPrevista', body.dataPrevista)
        }


        const resultStatus = await UpdateRequest(body, 'api/receitas')
        verifySend(resultStatus, 'UPDATE', body.descrReceita)

        const Data = resultStatus === 200 ? await GetRequest('api/receitas') : {}

        this.handleCancel()
        this.props.listRevenues(Data)


    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Icon type="edit" style={{ fontSize: '18px', color: '#08c' }} title='Editar Receita Prevista' theme="twoTone" onClick={this.showModal} />

                <form onSubmit={this.handleSubmit}>
                    <Modal
                        title="Editar Receita Prevista"
                        visible={this.state.visible}
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                        <div className='SwitchAjust'>
                            <Switch
                                style={{ width: '10%' }}
                                title='Habilite para Editar Todas as Receitas'
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
                            <Form.Item style={{ width: '50%' }}>
                                {getFieldDecorator('vlprevisto', {
                                    rules: [{ required: true, message: 'Por Favor, informe o valor!' }],
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
                                {getFieldDecorator('dtprevista', {
                                    rules: [{ required: true, message: 'Por Favor, informe a data prevista!' }],
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
                            <Form.Item style={{ width: '30%' }}>
                                {getFieldDecorator('parcelas', {
                                    rules: [{ required: true, message: 'Por Favor, informe a qtd de parcelas' }],
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
                            <Form.Item style={{ width: '70%' }}>
                                {getFieldDecorator('categoria', {
                                    rules: [{ required: true, message: 'Por Favor, informe a categoria!' }],
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
                        </div>
                        <Form.Item style={{ width: '100%' }}>
                            {getFieldDecorator('description', {
                                rules: [{ required: true, message: 'Por favor, informe a descrição da despesa' }],
                                initialValue: this.state.descrReceitaInput
                            })(
                                <TextArea
                                    placeholder="Descreva a Receita"
                                    style={{ width: '100%' }}
                                    rows={6}
                                    onChange={(event) => this.handledescricaoReceita(event.target.value)}
                                />)}
                        </Form.Item>
                    </Modal>
                </form>
            </div >
        )
    }
}
const WrappedApp = Form.create({ name: 'coordinated' })(ModalRevenue);

const mapStateToProps = (state) => {
    return {
        revenue: state.revenue,
    }
}

const mapDispatchToProps = { listRevenues }


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedApp)