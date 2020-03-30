import React from 'react'
import { connect } from 'react-redux'

import { listExpensesPaga } from '../../store/actions/generalExpenseRealAction'
import DespesaRealizada from '../../components/Modal/DespesaRealizada'
// import Menu from '../../components/MenuDespesaPrevista'

import EditDespesa from '../../components/Modal/DespesaRealizadaEdit'
import SearchFilter from '../../components/searchFilterTable'

import { Table, Icon, Popconfirm, Input, message } from 'antd'
import { urlBackend, userID, config } from '../../routes/urlBackEnd'

import axios from 'axios'

import 'antd/dist/antd.css';
import './styles.scss'

class SelectDespesaReal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            search: '',
            filter: ''
        }
        this.searchExpense = this.searchExpense.bind(this)
    }

    async deleteReal(expenseReal) {

        const body = expenseReal
        // console.log(body)
        const endpoint = `${urlBackend}api/despesas/delete/real/${expenseReal.ID}`
        const resultStatus = await axios.put(endpoint, body, config())

        if (resultStatus.status === 200) {
            message.success('Despesa Excluida com Sucesso', 5)
            this.requestAPI()
        } else {
            message.erro('A Despesa não pode ser Excluida, Error ' + resultStatus.status, 5)
        }


    }


    columns() {
        return [
            {
                title: 'CATEGORIA',
                dataIndex: 'DESCR_CATEGORIA',
                key: 'DESCR_CATEGORIA'
            },
            {
                title: 'R$ PREVISTO',
                dataIndex: 'VL_PREVISTO',
                key: 'VL_PREVISTO'
            },
            {
                title: 'R$ REAL',
                dataIndex: 'VL_REAL',
                key: 'VL_REAL'
            },
            {
                title: 'DATA PREVISTA',
                dataIndex: 'DATANOVA',
                key: 'DATANOVA'
            },
            {
                title: 'DATA REALIZADA',
                dataIndex: 'DATANOVAREAL',
                key: 'DATANOVAREAL'
            },
            {
                title: 'DESPESA',
                dataIndex: 'DESCR_DESPESA',
                key: 'DESCR_DESPESA'
            },
            {
                title: 'PARCELA',
                dataIndex: 'NUM_PARCELA',
                key: 'NUM_PARCELA'
            },
            {
                title: 'CARTAO',
                dataIndex: 'CARTAO',
                key: 'CARTAO'
            },
            {
                title: 'ACÃO',
                key: 'ACÃO',

                render: expenseReal => (
                    <div>
                        <span >
                            <EditDespesa data={expenseReal} />

                            <Popconfirm title="Excluir Lançamento Realizado?" onConfirm={() => this.deleteReal(expenseReal)}>
                                <Icon type="delete" title='Excluir Despesa' style={{ fontSize: '18px', color: '#08c' }} />
                            </Popconfirm>
                        </span>
                    </div>
                ),
            }
        ]
    }


    async requestAPI() {
        const endpointAPI = `${urlBackend}api/despesas/paga/${userID()}`
        const result = await axios.get(endpointAPI)
        const despesa = result.data
        this.props.listExpensesPaga(despesa)
    }

    searchExpense(event) {
        this.setState({ ...this.state, search: event.target.value, filter: event.target.value })
    }

    componentDidMount() {
        this.requestAPI()
    }

    render() {
        return (
            <div>
                <div className='ViewExpense'>
                    <DespesaRealizada />
                    <Input name='despesa' value={this.state.search} onChange={this.searchExpense} placeholder="Procure aqui a despesa especifica" />
                </div>
                <div>
                    <Table className='table table-action'
                        columns={this.columns()}
                        dataSource={SearchFilter(this.props.expenseReal, ['DESCR_CATEGORIA', 'DESCR_DESPESA'], this.state.filter)}
                        rowKey='ID' />
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state /*, ownProps*/) => {
    return {
        expenseReal: state.expenseReal
    }
}

const mapDispatchToProps = { listExpensesPaga }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectDespesaReal)