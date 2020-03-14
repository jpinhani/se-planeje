import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Icon, Modal, Input } from 'antd'
import { listVisions } from '../../../store/actions/visionAction'
import 'antd/dist/antd.css';
import './styles.scss'

class ModalAcount extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.data.ID,
            visible: false,
            vision: this.props.data.VISAO,
            startDate: this.props.data.DT_INICIO,
            finalDate: this.props.data.DT_FIM,
            status: this.props.data.STATUS
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
        this.setState({ ...this.state, vision: event.target.value })
    }


    async handleSubmit(event) {
        event.preventDefault()

        const endpointAPI = 'http://localhost:8082/api/visions'

        const body = {
            ID: this.state.id,
            ID_USER: localStorage.getItem('userId'),
            VISAO: this.state.vision,
            STATUS: "Ativo",
            DT_INICIO: this.state.startDate,
            DT_FIM: this.state.finalDate
        }

        console.log('body', body)

        await axios.put(endpointAPI, body)

        const userID = localStorage.getItem('userId')
        const endpoint = `http://localhost:8082/api/visions/${userID}`

        const result = await axios.get(endpoint)
        const visions = result.data

        this.props.listVisions(visions)

        this.setState({ ...this.state, vision: '' })
        this.setState({ ...this.state, visible: false })
    }

    render() {
        return (
            <div>
                <Icon type="edit" style={{ fontSize: '18px', color: '#08c' }} title='Editar Conta/ Fonte de Entrada e Saída' theme="twoTone" onClick={this.showModal} />
                <form onSubmit={this.handleSubmit}>
                    <Modal
                        title="Editar Visao"
                        visible={this.state.visible}
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                        <Input name='vision' value={this.state.vision} onChange={e => this.setState({...this.state, vision: e.target.value})} placeholder="Visao" />
                        <Input name='startDate' value={this.state.startDate} onChange={e => this.setState({...this.state, startDate: e.target.value})} placeholder="Inicio" />
                        <Input name='finalDate' value={this.state.finalDate} onChange={e => this.setState({...this.state, finalDate: e.target.value})} placeholder="Fim" />
                    </Modal>
                </form>
            </div >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        vision: state.vision
    }
}

const mapDispatchToProps = { listVisions }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalAcount)