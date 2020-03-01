import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Icon, Modal, Input } from 'antd'
import { listAcounts } from '../../../store/actions/generalAcountAction'
import 'antd/dist/antd.css';
import './styles.scss'

class ModalAcount extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            descrConta: this.props.data.DESCR_CONTA
        }
        console.log('teste', this.props.data)

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

        const endpointAPI = `http://localhost:8082/api/contas'${this.props.data.ID}`

        const body = {
            idUser: localStorage.getItem('userId'),
            descrConta: this.state.descrConta,
            status: "Ativo"
        }

        await axios.put(endpointAPI, body)

        const userID = localStorage.getItem('userId')
        const endpoint = `http://localhost:8082/api/contas/${userID}`

        const result = await axios.get(endpoint)
        const acounts = result.data

        this.props.listAcounts(acounts)

        // this.setState({ ...this.state, descrConta: '' })
        this.setState({ ...this.state, visible: false })
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