import React from 'react'
import { connect } from 'react-redux'

import { listExpenses } from '../../store/actions/generalExpenseAction'
import SearchFilter from '../../components/searchFilterTable'

import { Table, Input } from 'antd'
import DespesaPagar from '../../components/Modal/DespesaPagar'
import { GetRequest } from '../../components/crudSendAxios/crud'

import 'antd/dist/antd.css';
import './styles.scss'

class SelectDespesaPagar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            search: '',
            filter: ''
        }
        this.searchExpense = this.searchExpense.bind(this)
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
                title: 'DATA PREVISTA',
                dataIndex: 'DATANOVA',
                key: 'DATANOVA'
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

                render: expense => (
                    <div>
                        <span >
                            <DespesaPagar data={expense} />
                        </span>
                    </div>
                ),
            }
        ]
    }


    async requestAPI() {

        const despesa = await GetRequest('api/despesas')
        this.props.listExpenses(despesa)
    }

    searchExpense(event) {
        this.setState({ ...this.state, search: event.target.value, filter: event.target.value })
    }

    async componentDidMount() {
        await this.requestAPI()
    }

    render() {
        return (
            <div>
                <div className='ViewExpense'>
                    <Input name='despesa' value={this.state.search} onChange={this.searchExpense} placeholder="Procure aqui a despesa especifica" />
                </div>
                <div>
                    <Table className='table table-action'
                        columns={this.columns()}
                        dataSource={SearchFilter(this.props.expense, ['DESCR_CATEGORIA', 'DESCR_DESPESA'], this.state.filter)}
                        rowKey='ID' />
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state /*, ownProps*/) => {
    return {
        expense: state.expense
    }
}

const mapDispatchToProps = { listExpenses }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectDespesaPagar)