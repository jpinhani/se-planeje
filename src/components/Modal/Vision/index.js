import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Icon, Modal, Input, message, DatePicker } from 'antd'
import moment from 'moment'
import { listVisions } from '../../../store/actions/visionAction'
import { urlBackend, config } from '../../../routes/urlBackEnd'
import 'antd/dist/antd.css';
import './styles.scss'

const dateFormat = 'DD/MM/YYYY'

class ModalAcount extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            vision: '',
            startDate: '',
            finalDate: ''
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

        const endpointAPI = `${urlBackend}api/visions`

        const body = {
            ID_USER: localStorage.getItem('userId'),
            VISAO: this.state.vision,
            STATUS: "Ativo",
            DT_INICIO: this.state.startDate,
            DT_FIM: this.state.finalDate
        }
        console.log('body.DT_INICIO', body.DT_INICIO)
        console.log('body.DT_FIM', body.DT_FIM)


        const dataInicio = moment(body.DT_INICIO, "DD/MM/YYYY");
        body.DT_INICIO = dataInicio.format("YYYY-MM-DD")

        const dataFim = moment(body.DT_FIM, "DD/MM/YYYY");
        body.DT_FIM = dataFim.format("YYYY-MM-DD")

        if (body.DT_INICIO > body.DT_FIM) {
            await axios.post(endpointAPI, body, config())

            const userID = localStorage.getItem('userId')
            const endpoint = `${urlBackend}api/visions/${userID}`

            const result = await axios.get(endpoint)
            const visions = result.data

            this.props.listVisions(visions)

            this.setState({ ...this.state, vision: '' })
            this.setState({ ...this.state, visible: false })

            message.success('Visao adicionada com sucesso')
        } else {
            message.error('A Data inicio nao pode ser maior que a data final')
        }
    }

    render() {
        return (
            <div>
                <Icon type="plus-circle" style={{ fontSize: '36px', color: '#08c' }} title='Adicionar nova Conta / Fonte de Entrada e Saída' theme="twoTone" onClick={this.showModal} />
                <form onSubmit={this.handleSubmit}>
                    <Modal
                        title="Cadastrar Nova Visao"
                        visible={this.state.visible}
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                        <Input name='vision' value={this.state.vision} onChange={e => this.setState({ ...this.state, vision: e.target.value })} placeholder="Visao" />
                        <DatePicker style={{ width: '100%' }}
                            onChange={(date, dateString) => this.setState({ ...this.state, startDate: dateString })}
                            placeholder="Data Executada"
                            defaultValue={moment(new Date(), dateFormat)}
                            format={dateFormat}
                        />
                        <DatePicker style={{ width: '100%' }}
                            onChange={(date, dateString) => this.setState({ ...this.state, finalDate: dateString })}
                            placeholder="Data Executada"
                            defaultValue={moment(new Date(), dateFormat)}
                            format={dateFormat}
                        />
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