import React from 'react'
import { connect } from 'react-redux'

import { Icon, Modal, Input, notification, Spin } from 'antd'
import { listCards } from '../../../store/actions/generalCardAction.js'
import { userID } from '../../../services/urlBackEnd'

import { UpdateRequest, GetRequest } from '../../crudSendAxios/crud'
import { verifySend } from '../../verifySendAxios/index'

import 'antd/dist/antd.css';
import './styles.scss'

class ModalCard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            cartao: this.props.data.CARTAO,
            dtVencimento: this.props.data.DT_VENCIMENTO,
            diacompra: this.props.data.DIA_COMPRA,
            spin: false
        }


        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleCartao = this.handleCartao.bind(this)
        this.handleDtVencimento = this.handleDtVencimento.bind(this)
        this.handleDiaCompra = this.handleDiaCompra.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    showModal() {
        this.setState({ ...this.state, visible: true })
    };

    handleCancel() {
        this.setState({ ...this.state, visible: false })
    };

    handleCartao(event) {
        this.setState({ ...this.state, cartao: event.target.value })
    }

    handleDtVencimento(event) {
        this.setState({ ...this.state, dtVencimento: event.target.value })
    }

    handleDiaCompra(event) {
        this.setState({ ...this.state, diacompra: event.target.value })
    }

    async handleSubmit(event) {
        event.preventDefault()

        this.setState({ ...this.state, spin: true })
        const body = {
            id: this.props.data.ID,
            idUser: userID(),
            cartao: this.state.cartao,
            dtVencimento: this.state.dtVencimento,
            diaCompra: this.state.diacompra,
            status: "Ativo"
        }

        if (body.cartao !== '' && body.dtVencimento !== '' && body.diaCompra !== '') {

            const resultStatus = await UpdateRequest(body, 'api/cartoes')

            verifySend(resultStatus, 'UPDATE', body.cartao)

            const cardData = resultStatus === 200 ? await GetRequest('api/cartoes') : {}

            this.setState({ ...this.state, spin: false })
            this.props.listCards(cardData)

            this.handleCancel()

        }
        else {

            const args = {

                message: 'Preencha todos os dados do Formulário',
                description:
                    'Para editar o cartão é necessário que seja informado todos os campos',
                duration: 5,
            };
            notification.open(args);
            this.setState({ ...this.state, spin: false })
        }

    }

    render() {
        return (
            <div>
                <Icon type="edit" style={{ fontSize: '18px', color: '#08c' }} title='Editar cartão' theme="twoTone" onClick={this.showModal} />
                <form onSubmit={this.handleSubmit}>
                    <Modal
                        title="Editar Cartão de Crédito"
                        visible={this.state.visible}
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                        className="ModalCadastro"
                    >
                        <Input name='cartao' value={this.state.cartao} onChange={this.handleCartao} placeholder="Informe o nome do Cartão de Crédito" />
                        <Input type='number' value={this.state.dtVencimento} onChange={this.handleDtVencimento} max='31' min='1' name='dtVencimento' placeholder="Informe o dia de Vencimento da Fatura " />
                        <Input type='number' value={this.state.diacompra} onChange={this.handleDiaCompra} max='31' min='1' name='diaCompra' placeholder="Informe o melhor dia de Compra" />
                        <Spin size="large" spinning={this.state.spin} />
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