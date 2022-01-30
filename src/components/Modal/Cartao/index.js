import React from 'react'
import { connect } from 'react-redux'

import Cards from 'react-credit-cards';

import { Icon, Modal, Input, notification, Spin } from 'antd'

import { listCards } from '../../../store/actions/generalCardAction.js'
import { userID } from '../../../services/urlBackEnd'

import { GetRequest, InsertRequest } from '../../crudSendAxios/crud'
import { verifySend } from '../../verifySendAxios/index.js'

import 'antd/dist/antd.css'
import './styles.scss'

class ModalCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            cartao: '',
            dtVencimento: '',
            diacompra: '',
            spin: false
        }

        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleCartao = this.handleCartao.bind(this)
        this.handleDtVencimento = this.handleDtVencimento.bind(this)
        this.handleDiaCompra = this.handleDiaCompra.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleCancel() {
        this.setState({
            ...this.state, cartao: '',
            dtVencimento: '',
            diacompra: '',
            visible: false
        })
    };

    handleCartao(event) { this.setState({ ...this.state, cartao: event.target.value }) };

    handleDtVencimento(event) { this.setState({ ...this.state, dtVencimento: event.target.value }) };

    handleDiaCompra(event) {
        this.setState({ ...this.state, diacompra: event.target.value });
    }
    showModal() { this.setState({ ...this.state, visible: true }) };

    async handleSubmit(event) {
        event.preventDefault()
        this.setState({ ...this.state, spin: true })
        const body = {
            idUser: userID(),
            cartao: this.state.cartao,
            dtVencimento: this.state.dtVencimento,
            diaCompra: this.state.diacompra,
            status: "Ativo"
        }
        if (body.cartao.length > '' && body.dtVencimento.length > '' && body.diaCompra.length > '') {

            const resultStatus = await InsertRequest(body, 'api/cartoes')

            if (resultStatus.status === 402)
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

            verifySend(resultStatus, 'INSERT', body.cartao)

            const cardData = resultStatus === 200 ? await GetRequest('api/cartoes') : {}
            this.setState({ ...this.state, spin: false })
            this.props.listCards(cardData)
            this.handleCancel()
        } else {
            const args = {
                message: 'Preencha todo os dados do Formulário',
                description:
                    'Para cadastrar um novo cartão é necessário que seja informado todos os campos',
                duration: 5,
            };
            notification.open(args);
            this.setState({ ...this.state, spin: false })
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
                        className="ModalCadastro"
                    >


                        <Input name='cartao' value={this.state.cartao} onChange={this.handleCartao} placeholder="Informe o nome do Cartão de Crédito" />
                        <Input type='number' value={this.state.dtVencimento} onChange={this.handleDtVencimento} max='31' min='1' name='dtVencimento' placeholder="Informe o dia de Vencimento da Fatura " />
                        <Input type='number' value={this.state.diacompra} onChange={this.handleDiaCompra} max='31' min='1' name='diaCompra' placeholder="Informe o melhor dia de Compra" />
                        <Spin size="large" spinning={this.state.spin} />

                        <Cards
                            cvc={"000"}
                            expiry={this.state.dtVencimento}
                            focused={"focus"}
                            name={this.state.cartao}
                            number={"0000 0000 0000 0000"}
                        />
                    </Modal>
                </form>
            </div >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        card: state.card
    }
}

const mapDispatchToProps = { listCards }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalCard)