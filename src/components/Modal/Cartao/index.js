import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Icon, Modal, Input, message, notification } from 'antd'
import { listCards } from '../../../store/actions/generalCardAction.js'
import 'antd/dist/antd.css'
import './styles.scss'

class ModalCard extends React.Component {
    constructor(props) {
        super(props);

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



    handleCancel() { this.setState({ ...this.state, visible: false }) };


    handleCartao(event) { this.setState({ ...this.state, cartao: event.target.value }) };

    handleDtVencimento(event) { this.setState({ ...this.state, dtVencimento: event.target.value }) };

    handleDiaCompra(event) {
        this.setState({ ...this.state, diacompra: event.target.value });
    }
    showModal() { this.setState({ ...this.state, visible: true }) };
    async handleSubmit(event) {
        event.preventDefault()

        const endpointAPI = 'http://seplaneje-com.umbler.net/api/cartoes'

        const body = {
            idUser: localStorage.getItem('userId'),
            cartao: this.state.cartao,
            dtVencimento: this.state.dtVencimento,
            diaCompra: this.state.diacompra,
            status: "Ativo"
        }
        if (body.cartao.length > '' && body.dtVencimento.length > '' && body.diaCompra.length > '') {

            const ResultStatus = await axios.post(endpointAPI, body)

            if (ResultStatus.status === 200) {
                message.success('  Cartão Cadastrado com Sucesso', 5)
                const userID = localStorage.getItem('userId')
                const endpoint = `http://seplaneje-com.umbler.net/api/cartoes/${userID}`

                const result = await axios.get(endpoint)

                const cards = result.data

                this.props.listCards(cards)

                this.setState({ ...this.state, cartao: '', dtVencimento: '', diacompra: '', visible: false });

            } else {
                message.error('Não foi possivel efetuar o Cadastro do Cartão ' + ResultStatus.status, 5)
            }
        } else {
            const args = {
                message: 'Preencha todo os dados do Formulário',
                description:
                    'Para cadastrar um novo cartão é necessário que seja informado todos os campos',
                duration: 5,
            };
            notification.open(args);
        }
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
                        <Input name='cartao' value={this.state.cartao} onChange={this.handleCartao} placeholder="Informe o nome do Cartão de Crédito" />
                        <Input type='number' value={this.state.dtVencimento} onChange={this.handleDtVencimento} max='31' min='1' name='dtVencimento' placeholder="Informe o dia de Vencimento da Fatura " />
                        <Input type='number' value={this.state.diacompra} onChange={this.handleDiaCompra} max='31' min='1' name='diaCompra' placeholder="Informe o melhor dia de Compra" />
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