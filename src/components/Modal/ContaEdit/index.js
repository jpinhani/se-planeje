import React from 'react'
import { connect } from 'react-redux'

import { Icon, Modal, Input, Form } from 'antd'
import { listAcounts } from '../../../store/actions/generalAcountAction'
import { userID } from '../../../services/urlBackEnd'

import { GetRequest, UpdateRequest } from '../../crudSendAxios/crud'
import { verifySend } from '../../verifySendAxios/index.js'

import 'antd/dist/antd.css';
import './styles.scss'

class ModalAcount extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            descrConta: this.props.data.DESCR_CONTA
        }

        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
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
            descrConta: this.state.descrConta,
            status: "Ativo"
        }

        const resultStatus = await UpdateRequest(body, 'api/contas')

        verifySend(resultStatus, 'UPDATE', body.descrConta)

        const Data = resultStatus === 200 ? await GetRequest('api/contas') : {}

        this.props.listAcounts(Data)

        this.handleCancel()
        // this.props.form.resetFields()
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
                                <Input placeholder="Informe o nome da Conta ou Fonte de Entrada e Saída" />)}
                        </Form.Item>
                    </Form>
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