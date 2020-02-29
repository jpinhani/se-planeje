import React from 'react'
import { connect } from 'react-redux'
import AddCartao from '../../components/Modal/Cartao/index'
// import EditCartao from '../../components/Modal/CartaoEdit/index'
import { listCards } from '../../store/actions/generalCardAction.js'
import { Table, Divider, Icon, Input } from 'antd'
import axios from 'axios'

import 'antd/dist/antd.css';
import './style.scss'

const columns = [
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
    // width: '40%',
    render: () => (
      <div className='ModeloBotoesGrid'>
        < span className='ModeloBotoesGridDetalhes' >
          <Icon type="edit" style={{ fontSize: '18px', color: '#08c' }}/>
          {/* <Link to='/selectconta'><Icon type="edit" style={{ fontSize: '18px', color: '#08c' }} /></Link> */}
        </span>
        <Divider type="vertical" />
        < span className='ModeloBotoesGridDetalhes' >
          <Icon type="delete" style={{ fontSize: '18px', color: '#08c' }} />
        </span >
      </div>
    ),
  }
]

class SelectCartao extends React.Component {

  async requestAPI() {
    const endpointAPI = 'http://localhost:8082/api/cartoes/'
    const result = await axios.get(endpointAPI)
    const cartao = result.data

    this.props.listCards(cartao)
  }

  componentDidMount() {
    this.requestAPI()
  }

  render() {
    return (
      <div>
        {/* <EditCartao /> */}
        <div className='ViewCartao'>
          <AddCartao />
          {/* <Input onChange={SearchCartao} name='cartao' placeholder="Procure aqui o cartão especifico" /> */}
          <Input name='cartao' placeholder="Procure aqui o cartão especifico" />
        </div>
        <Divider type="horizontal" />
        <Table columns={columns} dataSource={this.props.card} />
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