import React from 'react'
import { connect } from 'react-redux'
// import AddCartao from '../../components/Modal/Cartao/index'
import EditCartao from '../../components/Modal/CartaoEdit/index'
import { listAcounts } from '../../store/actions/generalAcountAction'
// import { Table, Divider, Icon, Input, Popconfirm } from 'antd'
import { Table, Icon, Input } from 'antd'
import axios from 'axios'


import 'antd/dist/antd.css';
import './styles.scss'

class SelectConta extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      search: ' '
    }

    this.searchAcount = this.searchAcount.bind(this)
  }

  columns() {
    return [
      {
        title: 'Descrição Conta',
        dataIndex: 'DESCR_CONTA',
        key: 'DESCR_CONTA'
      },
      {
        title: 'Status',
        dataIndex: 'STATUS',
        key: 'STATUS'
      },
      {
        title: 'Action',
        key: 'action',

        render: acount => (
          <div className='ModeloBotoesGrid'>
            <span className='ModeloBotoesGridDetalhes' >
              <EditCartao data={acount} />
              {/* <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteCard(card.ID)}> */}
              <Icon type="delete" style={{ fontSize: '18px', color: '#08c' }} />
              {/* </Popconfirm> */}
            </span>
          </div>
        ),
      }
    ]
  }


  async requestAPI() {
    const userID = localStorage.getItem('userId')
    const endpointAPI = `http://localhost:8082/api/contas/${userID}`
    // console.log(endpointAPI)
    const result = await axios.get(endpointAPI)
    const conta = result.data
    this.props.listAcounts(conta)
  }

  componentDidMount() {
    this.requestAPI()
  }

  searchAcount(event) {
    this.setState({ ...this.state, search: event.target.value })
    this.updateList()
    // console.log(this.state.search)
  }

  async updateList() {
    // console.log('Valor:', this.state.search)
    const userID = localStorage.getItem('userId')
    const endpoint = `http://localhost:8082/api/contas/search/${this.state.search}/${userID}`
    const result = await axios.get(endpoint)
    const conta = result.data
    this.props.listAcounts(conta)
  }



  render() {
    return (
      <div>
        <Input name='conta' value={this.state.search} onChange={this.searchAcount} placeholder="Procure aqui a conta especifica" />
        <Table columns={this.columns()} dataSource={this.props.acount} />
      </div>
    )
  }
}

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    acount: state.acount
  }
}

const mapDispatchToProps = { listAcounts }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectConta)