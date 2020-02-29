import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Icon, Modal, Input } from 'antd'
import { listCards } from '../../../store/actions/generalCardAction.js'
import 'antd/dist/antd.css';
import './styles.scss'

class ModalCard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            cartao: '',
            dtVencimento: '',
            diacompra: ''
        }

        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleCartao = this.handleCartao.bind(this)
        this.handleDtVencimento = this.handleDtVencimento.bind(this)
        this.handleDiaCompra = this.handleDiaCompra.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    /* -------------------------------------  Comandos para Funcionamento do Modal*/
    showModal() {
        this.setState({...this.state, visible: true })
    };

    handleCancel() {
        this.setState({...this.state, visible: false })
    };
    /* -------------------------------------  Comandos para Funcionamento do Modal*/

    handleCartao(event) {
        this.setState({...this.state, cartao: event.target.value })
    }

    handleDtVencimento(event) {
        this.setState({...this.state, dtVencimento: event.target.value })
    }

    handleDiaCompra(event) {
        this.setState({...this.state, diacompra: event.target.value })
    }

    async handleSubmit(event) {
        event.preventDefault()

        const endpointAPI = 'http://localhost:8082/api/cartoes'

        const body = {
            idUser: 2,
            cartao: this.state.cartao,
            dtVencimento: this.state.dtvencimento,
            diaCompra: this.state.diacompra,
            status: "Ativo"
        }

        await axios.post(endpointAPI, body)

        const result = await axios.get(endpointAPI)
        const cards = result.data

        this.props.listCards(cards)

        this.setState({...this.state, visible: false })
    }

    render() {
        return (
            <div>
                <Icon type="plus-circle" style={{ fontSize: '36px', color: '#08c' }} title='Adicionar novo Cartão' theme="twoTone" onClick={this.showModal} />
                <form onSubmit={this.handleSubmit}>
                    <Modal
                        title="Cadastrar Novo Cartão de Crédito"
                        visible={this.state.visible}
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                        <Input name='cartao' onChange={this.handleCartao} placeholder="Informe o nome do Cartão de Crédito" />
                        <Input type='number' onChange={this.handleDtVencimento} max='31' min='1' name='dtVencimento' placeholder="Informe o dia de Vencimento da Fatura " />
                        <Input type='number' onChange={this.handleDiaCompra} max='31' min='1' name='diaCompra' placeholder="Informe o melhor dia de Compra" />
                    </Modal>
                </form>
            </div >
        )
    }
}

const mapStateToProps = (state /*, ownProps*/) => {
    return {
        card: state.card
    }
}

const mapDispatchToProps = { listCards }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalCard)