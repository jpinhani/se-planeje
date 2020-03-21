import React from 'react'
import { connect } from 'react-redux'
import AddAcount from '../../components/Modal/Conta/index'
import EditaAcount from '../../components/Modal/ContaEdit/index'
import { listAcounts } from '../../store/actions/generalAcountAction'
import { Table, Icon, Input, Popconfirm, message } from 'antd'
import axios from 'axios'


import 'antd/dist/antd.css';
import './styles.scss'

class SelectConta extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      search: ''
    }

    this.searchAcount = this.searchAcount.bind(this)
  }

  async deleteAcount(acountId) {
    const endpoint = `http://seplaneje-com.umbler.net/api/contas/${acountId}`
    const resultStatus = await axios.delete(endpoint)
    if (resultStatus.status === 200) {
      message.success('   Conta Excluida com Sucesso', 5)
      this.requestAPI()
    } else {
      message.erro('   A Conta não pode ser Excluida, Error ' + resultStatus.status, 5)
    }


  }

  columns() {
    return [
      {
        title: 'CONTA',
        dataIndex: 'DESCR_CONTA',
        key: 'DESCR_CONTA'
      },
      {
        title: 'STATUS',
        dataIndex: 'STATUS',
        key: 'STATUS'
      },
      {
        title: 'AÇÃO',
        key: 'AÇÃO',

        render: acount => (
          <div className='ModeloBotoesGrid'>
            <span className='ModeloBotoesGridDetalhes' >
              <EditaAcount data={acount} />
              <Popconfirm title="Excluir Conta?" onConfirm={() => this.deleteAcount(acount.ID)}>
                <Icon type="delete" title='Excluir Conta' style={{ fontSize: '18px', color: '#08c' }} />
              </Popconfirm>
            </span>
          </div>
        ),
      }
    ]
  }


  async requestAPI() {
    const userID = localStorage.getItem('userId')
    const endpointAPI = `http://seplaneje-com.umbler.net/api/contas/${userID}`
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
    this.updateList(event.target.value)
    // console.log(this.state.search)
  }

  async updateList(evento) {
    // console.log('Valor:', this.state.search)
    const userID = localStorage.getItem('userId')
    if (evento !== '' && evento.length > 1) {
      const endpoint = `http://seplaneje-com.umbler.net/api/contas/search/${evento}/${userID}`
      const result = await axios.get(endpoint)
      const conta = result.data
      this.props.listAcounts(conta)
    } else {
      const endpoint = `http://seplaneje-com.umbler.net/api/contas/${userID}`
      const result = await axios.get(endpoint)
      const conta = result.data
      this.props.listAcounts(conta)
    }
  }



  render() {
    return (
      <div>
        <div className='headerConta'>
          <AddAcount />
          <Input name='conta' value={this.state.search} onChange={this.searchAcount} placeholder="Procure aqui a conta especifica" />
        </div>
        <div className='headerTable'>
          <Table columns={this.columns()} dataSource={this.props.acount} rowKey='ID' />
        </div>

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