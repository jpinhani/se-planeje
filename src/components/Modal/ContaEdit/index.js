import React from 'react'
import { connect } from 'react-redux'

import { Icon, Modal, Input, notification } from 'antd'
import { listAcounts } from '../../../store/actions/generalAcountAction'
import { userID } from '../../../routes/urlBackEnd'

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

    async handleSubmit(event) {
        event.preventDefault()

        const body = {
            id: this.props.data.ID,
            idUser: userID(),
            descrConta: this.state.descrConta,
            status: "Ativo"
        }
        if (body.descrConta !== '') {

            const resultStatus = await UpdateRequest(body, 'api/contas')

            verifySend(resultStatus, 'UPDATE', body.cartao)

            const Data = resultStatus === 200 ? await GetRequest('api/contas') : {}

            this.props.listAcounts(Data)

            this.handleCancel()
        }
        else {
            const args = {
                message: 'Preencha todos os dados do Formulário',
                description:
                    'Para editar a conta é necessário que seja informado todos os campos',
                duration: 5,
            };
            notification.open(args);
        }
    }

    render() {
        return (
            <div>
                <Icon type="edit" style={{ fontSize: '18px', color: '#08c' }} title='Editar Conta/ Fonte de Entrada e Saída' theme="twoTone" onClick={this.showModal} />
                <form onSubmit={this.handleSubmit}>
                    <Modal
                        title="Editar Conta"
                        visible={this.state.visible}
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                        <Input name='conta' value={this.state.descrConta} onChange={this.handleDescrConta} placeholder="Informe o nome da Conta ou Fonte de Entrada e Saída" />
                    </Modal>
                </form>
            </div >
        )
    }
}

const mapStateToProps = (state /*, ownProps*/) => {
    return {
        acount: state.acount
    }
}

const mapDispatchToProps = { listAcounts }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalAcount)