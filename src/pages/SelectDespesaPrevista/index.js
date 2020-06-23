import React from 'react'
import { connect } from 'react-redux'

import { listExpenses } from '../../store/actions/generalExpenseAction'
import DespesaPrevista from '../../components/Modal/DespesaPrevista'
import Menu from '../../components/MenuDespesaPrevista'
import EditDespesa from '../../components/Modal/DespesaPrevistaEdit'

import SearchFilter from '../../components/searchFilterTable'
import { Table, Icon, Popover, Input, notification } from 'antd'

import { GetRequest } from '../../components/crudSendAxios/crud'

import 'antd/dist/antd.css';
import './styles.scss'

class SelectDespesaPrevista extends React.Component {
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
                    <div className="DetalhesBotoes">
                        <span className="DetalhesBotoesGrid">
                            <EditDespesa data={expense} />

                            <Popover
                                placement="left"
                                title='Excluir Despesa'
                                content={<Menu data={expense} />} trigger="click">
                                <Icon type="delete" title='Excluir Despesa' style={{ fontSize: '18px', color: '#08c' }} />
                            </Popover>
                        </span>
                    </div>
                ),
            }
        ]
    }


    async requestAPI() {

        const despesa = await GetRequest('api/despesas')
        if (despesa.status === 402)
            return notification.open({
                message: 'SePlaneje - Problemas Pagamento',
                duration: 20,
                description:
                    `Poxa!!! 
                        Foram identificados problemas com o pagamento da sua assinatura, acesse a página de Pagamento ou entre em contato conosco...`,
                style: {
                    width: '100%',
                    marginLeft: 335 - 600,
                },
            });
        this.props.listExpenses(despesa)
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
                    <DespesaPrevista />
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
)(SelectDespesaPrevista)