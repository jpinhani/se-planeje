import React from 'react'
import { connect } from 'react-redux'

import { Icon, Modal, Input, Form } from 'antd'
import { listAcounts } from '../../../store/actions/generalAcountAction'
import { userID } from '../../../routes/urlBackEnd'

import { GetRequest, InsertRequest } from '../../crudSendAxios/crud'
import { verifySend } from '../../verifySendAxios/index.js'

import 'antd/dist/antd.css';
import './styles.scss'



class ModalAcount extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            descrConta: '',
        }

        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
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



    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err) => { /* !err */

            if (!err) this.handleSubmitok()
        });
    }

    async handleSubmitok() {

        const body = {
            idUser: userID(),
            descrConta: this.state.descrConta,
            status: "Ativo"
        }

        const resultStatus = await InsertRequest(body, 'api/contas')

        verifySend(resultStatus, 'INSERT', body.descrConta)
        const Data = resultStatus === 200 ? await GetRequest('api/contas') : {}

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
                                <Input placeholder="Informe o nome da Conta ou Fonte de Entrada e Saída" />)}
                        </Form.Item>

                    </Form>
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