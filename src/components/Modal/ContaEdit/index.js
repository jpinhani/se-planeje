import React from 'react'
import { connect } from 'react-redux'

import moment from 'moment';
import { Icon, Modal, Input, Form, InputNumber, DatePicker, Spin } from 'antd'
import { listAcounts } from '../../../store/actions/generalAcountAction'
import { userID } from '../../../services/urlBackEnd'

import { GetRequest, UpdateRequest } from '../../crudSendAxios/crud'
import { verifySend } from '../../verifySendAxios/index.js'

import 'antd/dist/antd.css';
import './styles.scss'

const dateFormat = 'DD/MM/YYYY'

class ModalAcount extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            descrConta: this.props.data.DESCR_CONTA,
            dataSaldo: this.props.data.DTSALDO ? moment(this.props.data.DTSALDO) : '',
            saldo: this.props.data.SALDO,
            spin: false
        }

        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleData = this.handleData.bind(this)
        this.handleDescrConta = this.handleDescrConta.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    showModal() {
        this.setState({ ...this.state, visible: true })
    };

    handleCancel() {
        this.setState({ ...this.state, visible: false })
    };

    handleDescrConta(event) {
        this.setState({ ...this.state, descrConta: event.target.value })
    }

    handleData(date, dateString) {
        this.setState({ ...this.state, dataSaldo: dateString })

    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err) => { /* !err */

            if (!err) this.handleSubmitok()
        });
    }

    async handleSubmitok() {
        this.setState({ ...this.state, spin: true })

        const body = {
            id: this.props.data.ID,
            idUser: userID(),
            descrConta: this.state.descrConta,
            data: this.state.dataSaldo,
            saldo: this.state.saldo,
            status: "Ativo"
        }


        const data = moment(body.data, "DD/MM/YYYY").format("YYYY-MM-DD");
        body.data = data

        const resultStatus = await UpdateRequest(body, 'api/contas')

        verifySend(resultStatus, 'UPDATE', body.descrConta)

        const Data = resultStatus === 200 ? await GetRequest('api/contas') : {}

        this.setState({ ...this.state, spin: false })
        this.props.listAcounts(Data)

        this.handleCancel()
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Icon type="edit" style={{ fontSize: '18px', color: '#08c' }} title='Editar Conta/ Fonte de Entrada e Saída' theme="twoTone" onClick={this.showModal} />
                <Modal
                    title="Editar Conta"
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                    className="ModalCadastro"
                >
                    <Form>
                        <Form.Item
                            name='conta'
                            value={this.state.descrConta}
                            onChange={this.handleDescrConta}
                        >
                            {getFieldDecorator('conta', {
                                rules: [{ required: true, message: 'Por Favor, Informe a Conta!' }],
                                initialValue: this.state.descrConta
                            })(
                                <Input autoFocus placeholder="Informe o nome da Conta ou Fonte de Entrada e Saída" />)}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('saldo', {
                                rules: [{ required: true, message: 'Saldo Inicial, caso não tenha informe 0' }],
                                initialValue: this.state.saldo
                            })(
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Informe o Saldo Inicial da Conta, positivo ou negativo"
                                    decimalSeparator=','
                                    precision={2}
                                    onChange={valor => this.setState({ ...this.state, saldo: valor })}
                                />)}
                        </Form.Item>
                        <Form.Item style={{ width: '50%' }}
                            onChange={this.handleData}
                        >{getFieldDecorator('dtSaldo', {
                            rules: [{ required: true, message: 'Por Favor, Informe a Data do Saldo!' }],
                            initialValue: this.state.dataSaldo
                        })(
                            <DatePicker
                                style={{ width: '100%' }}
                                onChange={this.handleData}
                                placeholder="Data Prevista"
                                format={dateFormat}
                            />)}
                        </Form.Item>

                    </Form>
                    <Spin size="large" spinning={this.state.spin} />
                </Modal>
            </div >
        )
    }
}
const WrappedApp = Form.create({ name: 'coordinated' })(ModalAcount);

const mapStateToProps = (state /*, ownProps*/) => {
    return {
        acount: state.acount
    }
}

const mapDispatchToProps = { listAcounts }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedApp)