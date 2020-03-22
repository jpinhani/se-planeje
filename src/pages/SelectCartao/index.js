import React from 'react'
import { connect } from 'react-redux'
import AddCartao from '../../components/Modal/Cartao/index'
import EditCartao from '../../components/Modal/CartaoEdit/index'
import SearchFilter from '../../components/searchFilterTable'
import { listCards } from '../../store/actions/generalCardAction.js'
import { Table, Divider, Icon, Input, Popconfirm, message } from 'antd'
import axios from 'axios'

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

  async deleteCard(cardId) {
    const endpoint = `http://seplaneje-com.umbler.net/api/cartoes/${cardId}`
    const resultStatus = await axios.delete(endpoint)
    if (resultStatus.status === 200) {
      message.success('Cartão Excluido com sucesso', 5)
      this.requestAPI()
    } else {
      message.error('Não foi possivel excluir o cartão especifico, Error ' + resultStatus.status, 5)
    }
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
              <Popconfirm title="Deletar o Cartão?" onConfirm={() => this.deleteCard(card.ID)}>
                <Icon type="delete" title='Excluir Cartão' style={{ fontSize: '18px', color: '#08c' }} />
              </Popconfirm>
            </span>
          </div>
        ),
      }
    ]
  }



  async requestAPI() {
    const userID = localStorage.getItem('userId')
    const endpointAPI = `http://seplaneje-com.umbler.net/api/cartoes/${userID}`
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
        <Table columns={this.columns()}
          dataSource={SearchFilter(this.props.card, ['CARTAO'], this.state.search)}
          rowKey='ID' />
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