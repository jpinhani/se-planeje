import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment';
import axios from 'axios'
import { Icon, Modal, Input, message, Spin } from 'antd'
import { listVisions } from '../../../store/actions/visionAction'
import { urlBackend, config } from '../../../services/urlBackEnd'
import 'antd/dist/antd.css';
import './styles.scss'

class ModalAcount extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.data.ID,
            visible: false,
            vision: this.props.data.VISAO,
            startDate: moment(this.props.data.DT_INICIO).format("YYYY-MM-DD"), //.format("YYYY-DD-MM"),
            finalDate: moment(this.props.data.DT_FIM).format("YYYY-MM-DD"), //.format("YYYY-DD-MM"),
            status: this.props.data.STATUS,
            spin: false
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

        this.setState({ ...this.state, spin: true });
        const endpointAPI = `${urlBackend}api/visions`

        const body = {
            ID: this.state.id,
            ID_USER: localStorage.getItem('userId'),
            VISAO: this.state.vision,
            STATUS: "Ativo",
            DT_INICIO: this.state.startDate,
            DT_FIM: this.state.finalDate
        }


        if (moment(body.DT_INICIO) < moment(body.DT_FIM)) {
            await axios.put(endpointAPI, body, config())

            const userID = localStorage.getItem('userId')
            const endpoint = `${urlBackend}api/visions/${userID}`

            const result = await axios.get(endpoint, config())
            const visions = result.data

            this.props.listVisions(visions)

            message.success('Visao editada com sucesso')

            this.setState({ ...this.state, spin: false });
            this.handleCancel()
        } else {
            message.error('Data Inicio não pode ser maior que Data Fim')
            this.setState({ ...this.state, spin: false });
        }
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
                        className="ModalCadastro"
                    >
                        <Input name='vision' value={this.state.vision} onChange={e => this.setState({ ...this.state, vision: e.target.value })} placeholder="Visao" />
                        <Input type="date" name='startDate' value={this.state.startDate} onChange={e => this.setState({ ...this.state, startDate: e.target.value })} placeholder="Inicio" />
                        <Input type="date" name='finalDate' value={this.state.finalDate} onChange={e => this.setState({ ...this.state, finalDate: e.target.value })} placeholder="Fim" />
                        <Spin size="large" spinning={this.state.spin} />
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