import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Icon, Modal, Input, message, notification } from 'antd'
import { listAcounts } from '../../../store/actions/generalAcountAction'
import { urlBackend, config, userID } from '../../../routes/urlBackEnd'
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
        this.setState({ ...this.state, visible: false })
    };
    /* -------------------------------------  Comandos para Funcionamento do Modal*/

    handleDescrConta(event) {
        this.setState({ ...this.state, descrConta: event.target.value })
    }


    async handleSubmit(event) {
        event.preventDefault()

        const endpointAPI = `${urlBackend}api/contas`

        const body = {
            idUser: userID,
            descrConta: this.state.descrConta,
            status: "Ativo"
        }


        if (body.descrConta !== '') {
            const resultStatus = await axios.post(endpointAPI, body, config)
            console.log('resultStatus', resultStatus)
            try {
                if (resultStatus.status === 200) {
                    message.success('   Conta Registrada com Sucesso ', 5)
                    const endpoint = `${urlBackend}api/contas/${userID}`

                    const result = await axios.get(endpoint)
                    const acounts = result.data

                    this.props.listAcounts(acounts)

                    this.setState({ ...this.state, descrConta: '' })
                    this.setState({ ...this.state, visible: false })
                }
            } catch (error) {
                message.error('Conta Não pode ser Inserida, Error ' + resultStatus.status, 5)
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