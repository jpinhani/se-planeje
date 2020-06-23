import React from 'react'
import { connect } from 'react-redux'

import moment from 'moment';
import { Icon, Modal, Input, Form, InputNumber, DatePicker, notification, Spin } from 'antd'
import { listAcounts } from '../../../store/actions/generalAcountAction'
import { userID } from '../../../services/urlBackEnd'

import { GetRequest, InsertRequest } from '../../crudSendAxios/crud'
// import { useHistory, Redirect, Link, withRouter } from 'react-router-dom'
import { verifySend } from '../../verifySendAxios/index.js'

import 'antd/dist/antd.css';
import './styles.scss'


const dateFormat = 'DD/MM/YYYY'

class ModalAcount extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            descrConta: '',
            dataSaldo: moment(new Date(), dateFormat),
            saldo: 0,
            spin: false
        }

        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleData = this.handleData.bind(this)
        this.handleDescrConta = this.handleDescrConta.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    /* -------------------------------------  Comandos para Funcionamento do Modal*/
    showModal() {
        this.setState({ ...this.state, visible: true })
    };

    handleCancel() {
        this.setState({
            ...this.state,
            descrConta: '',
            visible: false
        })
    };
    /* -------------------------------------  Comandos para Funcionamento do Modal*/

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
            idUser: userID(),
            descrConta: this.state.descrConta,
            saldo: this.state.saldo,
            data: this.state.dataSaldo,
            status: "Ativo"
        }

        const data = moment(body.data, "DD/MM/YYYY").format("YYYY-MM-DD");
        body.data = data

        const resultStatus = await InsertRequest(body, 'api/contas')

        if (resultStatus.status === 402)
            return notification.open({
                message: 'SePlaneje - Problemas Pagamento',
                duration: 20,
                description:
                    `Poxa!!! 
                        Foram identificados problemas com o pagamento da sua assinatura, acesse a página de Pagamento ou entre em contato conosco...`,
                style: {
                    width: '100%',
                    marginLeft: 335 - 600,
                },
            });

        verifySend(resultStatus, 'INSERT', body.descrConta)

        const Data = resultStatus === 200 ? await GetRequest('api/contas') : {}

        this.setState({ ...this.state, spin: false })
        this.props.listAcounts(Data)
        this.handleCancel()
        this.props.form.resetFields()
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Icon type="plus-circle" style={{ fontSize: '36px', color: '#08c' }} title='Adicionar nova Conta / Fonte de Entrada e Saída' theme="twoTone" onClick={this.showModal} />

                <Modal
                    title="Cadastrar Nova Conta"
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                    className="ModalCadastro"
                >
                    <Form >

                        <Form.Item
                            name='conta'
                            value={this.state.descrConta}
                            onChange={this.handleDescrConta}
                        >
                            {getFieldDecorator('conta', {
                                rules: [{ required: true, message: 'Por Favor, Informe a Conta!' }],
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

const mapStateToProps = (state) => {
    return {
        acount: state.acount
    }
}

const mapDispatchToProps = { listAcounts }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedApp)