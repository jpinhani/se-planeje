import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Icon, Modal, Input, message, DatePicker, notification, Spin } from 'antd'
import moment from 'moment'
import { listVisions } from '../../../store/actions/visionAction'
import { urlBackend, config } from '../../../services/urlBackEnd'
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
            finalDate: '',
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
            ID_USER: localStorage.getItem('userId'),
            VISAO: this.state.vision,
            STATUS: "Ativo",
            DT_INICIO: this.state.startDate,
            DT_FIM: this.state.finalDate
        }

        var data_1 = moment(body.DT_INICIO).format("YYYY-MM-DD");
        var data_2 = moment(body.DT_FIM).format("YYYY-MM-DD");

        const dataInicio = moment(body.DT_INICIO, "DD/MM/YYYY");
        body.DT_INICIO = dataInicio.format("YYYY-MM-DD")

        const dataFim = moment(body.DT_FIM, "DD/MM/YYYY");
        body.DT_FIM = dataFim.format("YYYY-MM-DD")

        if (moment(data_1) < moment(data_2)) {
            const resulStatus = await axios.post(endpointAPI, body, config())
            if (resulStatus.status === 402)
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


            const userID = localStorage.getItem('userId')
            const endpoint = `${urlBackend}api/visions/${userID}`

            const result = await axios.get(endpoint, config())
            const visions = result.data

            this.setState({ ...this.state, spin: false });
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
                        className="ModalCadastro"
                    >
                        <Input name='vision' value={this.state.vision} onChange={e => this.setState({ ...this.state, vision: e.target.value })} placeholder="Visao" />
                        <DatePicker style={{ width: '100%' }}
                            onChange={(date) => this.setState({ ...this.state, startDate: date })}
                            placeholder="Data Executada"
                            defaultValue={moment(new Date(), dateFormat)}
                            format={dateFormat}
                        />
                        <DatePicker style={{ width: '100%' }}
                            onChange={(date) => this.setState({ ...this.state, finalDate: date })}
                            placeholder="Data Executada"
                            defaultValue={moment(new Date(), dateFormat)}
                            format={dateFormat}
                        />
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