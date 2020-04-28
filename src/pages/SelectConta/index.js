import React from 'react'
import { connect } from 'react-redux'

import AddAcount from '../../components/Modal/Conta/index'
import EditaAcount from '../../components/Modal/ContaEdit/index'
import SearchFilter from '../../components/searchFilterTable'

import { listAcounts } from '../../store/actions/generalAcountAction'

import { GetRequest, DeleteRequest } from '../../components/crudSendAxios/crud'
import { verifySend } from '../../components/verifySendAxios'

import { Table, Icon, Input, Popconfirm } from 'antd'

import 'antd/dist/antd.css';
import '../SelectConta/styles.scss'

class SelectConta extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      search: ''
    }

    this.searchAcount = this.searchAcount.bind(this)
  }

  async deleteAcount(conta) {
    const resultStatus = await DeleteRequest(conta.ID, 'api/contas')

    verifySend(resultStatus, 'DELETE', conta.DESCR_CONTA)

    this.requestAPI()
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
            {/* <span className='ModeloBotoesGridDetalhes' > */}
            <EditaAcount data={acount} />
            <Popconfirm title="Excluir Conta?" onConfirm={() => this.deleteAcount(acount)}>
              <Icon type="delete" title='Excluir Conta' style={{ fontSize: '18px', color: '#08c' }} />
            </Popconfirm>
            {/* </span> */}
          </div>
        ),
      }
    ]
  }


  async requestAPI() {

    const Data = await GetRequest('api/contas')

    this.props.listAcounts(Data)
  }

  componentDidMount() {
    this.requestAPI()
  }

  searchAcount(event) {
    this.setState({ ...this.state, search: event.target.value })
  }

  render() {
    return (
      <div>
        <div className='headerConta'>
          <AddAcount />
          <Input name='conta' value={this.state.search} onChange={this.searchAcount} placeholder="Procure aqui a conta especifica" />
        </div>
        <div>
          <Table className='table table-action'
            columns={this.columns()}
            dataSource={SearchFilter(this.props.acount, ['DESCR_CONTA'], this.state.search)}
            rowKey='ID' />
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