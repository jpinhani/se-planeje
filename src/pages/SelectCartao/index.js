import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import AddCartao from '../../components/Modal/Cartao/index'
import EditCartao from '../../components/Modal/CartaoEdit/index'
import SearchFilter from '../../components/searchFilterTable'

import { listCards } from '../../store/actions/generalCardAction.js'
import { urlBackend, userID } from '../../routes/urlBackEnd'
import { Table, Divider, Icon, Input, Popconfirm } from 'antd'

import { DeleteCard, GetCard } from '../../components/crudSendAxios/cartao'
import { verifySend } from '../../components/verifySendAxios/index'

import 'antd/dist/antd.css';
import './style.scss'

class SelectCartao extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      search: ''
    }

    this.searchCard = this.searchCard.bind(this)
  }

  async deleteCard(card) {

    const resultStatus = await DeleteCard(card.ID)

    verifySend(resultStatus, 'DELETE', card.CARTAO)

    const cardData = resultStatus === 200 ? await GetCard() : {}

    this.props.listCards(cardData)

  }

  columns() {
    return [
      {
        title: 'CARTÃO',
        dataIndex: 'CARTAO',
        key: 'CARTAO'
      },
      {
        title: 'DIA VENCIMENTO',
        dataIndex: 'DT_VENCIMENTO',
        key: 'DT_VENCIMENTO'
      },
      {
        title: 'MELHOR DIA COMPRA',
        dataIndex: 'DIA_COMPRA',
        key: 'DIA_COMPRA'
      },
      {
        title: 'AÇÃO',
        key: 'action',

        render: card => (
          <div className='ModeloBotoesGrid'>
            <span className='ModeloBotoesGridDetalhes' >
              <EditCartao data={card} />
              <Popconfirm title="Deletar o Cartão?" onConfirm={() => this.deleteCard(card)}>
                <Icon type="delete" title='Excluir Cartão' style={{ fontSize: '18px', color: '#08c' }} />
              </Popconfirm>
            </span>
          </div>
        ),
      }
    ]
  }



  async requestAPI() {

    const endpointAPI = `${urlBackend}api/cartoes/${userID()}`

    const result = await axios.get(endpointAPI)
    const cartao = result.data
    this.props.listCards(cartao)
  }

  componentDidMount() {
    this.requestAPI()
  }


  searchCard(event) {
    this.setState({ ...this.state, search: event.target.value })
  }

  render() {
    return (
      <div>
        <div className='ViewCartao'>
          <AddCartao />
          <Input name='cartao' value={this.state.search} onChange={this.searchCard} placeholder="Procure aqui o cartão especifico" />
        </div>
        <Divider type="horizontal" />
        <Table
          className='table table-action'
          columns={this.columns()}
          dataSource={SearchFilter(this.props.card, ['CARTAO'], this.state.search)}
          rowKey='ID' />
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
)(SelectCartao)