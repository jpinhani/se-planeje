import React from 'react'
import { connect } from 'react-redux'
import { listExpenses } from '../../store/actions/generalExpenseAction'
import { Table, Icon, Popconfirm } from 'antd'
import axios from 'axios'


import 'antd/dist/antd.css';
import './styles.scss'

class SelectDespesaPrevista extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            search: ''
        }

        // this.searchAcount = this.searchAcount.bind(this)
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
                title: 'ACÃO',
                key: 'ACÃO',

                render: expense => (
                    <div>
                        <span >
                            <Popconfirm title="Deletar Despesa?">
                                <Icon type="delete" title='Excluir Despesa' style={{ fontSize: '18px', color: '#08c' }} />
                            </Popconfirm>
                        </span>
                    </div>
                ),
            }
        ]
    }

    async requestAPI() {
        const userID = localStorage.getItem('userId')
        const endpointAPI = `http://localhost:8082/api/despesas/${userID}`
        const result = await axios.get(endpointAPI)
        console.log("RESULTADO", result)
        const despesa = result.data
        this.props.listExpenses(despesa)
    }

    componentDidMount() {
        this.requestAPI()
    }

    render() {
        return (
            <div>
                <div>

                </div>
                <div>
                    <Table columns={this.columns()} dataSource={this.props.expense} rowKey='ID' />
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
)(SelectDespesaPrevista)