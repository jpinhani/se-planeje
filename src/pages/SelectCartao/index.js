import React from 'react'
import { connect } from 'react-redux'
import AddCartao from '../../components/Modal/Cartao/index'
import EditCartao from '../../components/Modal/CartaoEdit/index'
import { listCards } from '../../store/actions/generalCardAction.js'
import { Table, Divider, Icon, Input, Popconfirm } from 'antd'
import axios from 'axios'

import 'antd/dist/antd.css';
import './style.scss'

class SelectCartao extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      search: ' '
    }

    this.searchCard = this.searchCard.bind(this)
  }

  async deleteCard(cardId) {
    const endpoint = `http://localhost:8082/api/cartoes/${cardId}`
    await axios.delete(endpoint)
    this.requestAPI()

  }

  columns() {
    return [
      {
        title: 'Descrição do Cartão',
        dataIndex: 'CARTAO',
        key: 'CARTAO'
      },
      {
        title: 'Dia de Vencimento',
        dataIndex: 'DT_VENCIMENTO',
        key: 'DT_VENCIMENTO'
      },
      {
        title: 'Melhor dia de Compra',
        dataIndex: 'DIA_COMPRA',
        key: 'DIA_COMPRA'
      },
      {
        title: 'Action',
        key: 'action',

        render: card => (
          <div className='ModeloBotoesGrid'>
            <span className='ModeloBotoesGridDetalhes' >
              <EditCartao data={card} />
              <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteCard(card.ID)}>
                <Icon type="delete" style={{ fontSize: '18px', color: '#08c' }} />
              </Popconfirm>
            </span>
          </div>
        ),
      }
    ]
  }



  async requestAPI() {
    const userID = localStorage.getItem('userId')
    const endpointAPI = `http://localhost:8082/api/cartoes/${userID}`
    const result = await axios.get(endpointAPI)
    const cartao = result.data
    this.props.listCards(cartao)
  }

  componentDidMount() {
    this.requestAPI()
  }


  searchCard(event) {
    this.setState({ ...this.state, search: event.target.value })
    this.updatelist()
  }

  async updatelist() {
    // console.log('Valor:', this.state.search)
    const userID = localStorage.getItem('userId')
    const endpoint = `http://localhost:8082/api/cartoes/search/${this.state.search}/${userID}`
    const result = await axios.get(endpoint)
    const cartao = result.data
    this.props.listCards(cartao)
  }

  render() {
    return (
      <div>
        <div className='ViewCartao'>
          <AddCartao />
          <Input name='cartao' value={this.state.search} onChange={this.searchCard} placeholder="Procure aqui o cartão especifico" />
        </div>
        <Divider type="horizontal" />
        <Table columns={this.columns()} dataSource={this.props.card} />
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
)(SelectCartao)