import React from 'react'
import { connect } from 'react-redux'

import { Icon, Modal, Input, notification } from 'antd'
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


    async handleSubmit(event) {
        event.preventDefault()

        const body = {
            idUser: userID(),
            descrConta: this.state.descrConta,
            status: "Ativo"
        }

        if (body.descrConta !== '') {
            try {

                const resultStatus = await InsertRequest(body, 'api/contas')

                verifySend(resultStatus, 'INSERT', body.descrConta)
                const Data = resultStatus === 200 ? await GetRequest('api/contas') : {}

                this.props.listAcounts(Data)
                this.handleCancel()

            } catch (error) {

            }
        } else {
            const args = {
                message: 'Preencha todos os dados do Formulário',

                description:
                    'Para Inserir uma conta é necessário que seja informado todos os campos',
                duration: 5,
            };
            notification.open(args);
        }
    }

    render() {
        return (
            <div>
                <Icon type="plus-circle" style={{ fontSize: '36px', color: '#08c' }} title='Adicionar nova Conta / Fonte de Entrada e Saída' theme="twoTone" onClick={this.showModal} />
                <form onSubmit={this.handleSubmit}>
                    <Modal
                        title="Cadastrar Nova Conta"
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

const mapStateToProps = (state) => {
    return {
        acount: state.acount
    }
}

const mapDispatchToProps = { listAcounts }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalAcount)