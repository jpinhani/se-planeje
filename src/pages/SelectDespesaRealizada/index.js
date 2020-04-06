import React from 'react'
import { connect } from 'react-redux'

import { listExpensesPaga } from '../../store/actions/generalExpenseRealAction'
import { listExpenses } from '../../store/actions/generalExpenseAction'

import DespesaRealizada from '../../components/Modal/DespesaRealizada'

import EditDespesa from '../../components/Modal/DespesaRealizadaEdit'
import SearchFilter from '../../components/searchFilterTable'

import { Table, Icon, Popconfirm, Input } from 'antd'

import { GetRequest, UpdateRequest } from '../../components/crudSendAxios/crud'
import { verifySend } from '../../components/verifySendAxios/index'

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
        body.id = expenseReal.ID

        const resultStatus = await UpdateRequest(body, 'api/despesas/delete/real')
        verifySend(resultStatus, 'DELETEDESPESAREAL', body.DESCR_DESPESA)

        const metaList = resultStatus === 200 ? await GetRequest('api/despesas') : {}

        this.props.listExpenses(metaList)

        this.requestAPI()
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

        const despesa = await GetRequest('api/despesas/paga')
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
        expenseReal: state.expenseReal,
        expense: state.expense
    }
}

const mapDispatchToProps = { listExpensesPaga, listExpenses }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectDespesaReal)