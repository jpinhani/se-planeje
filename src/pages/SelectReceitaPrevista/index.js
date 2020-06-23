import React from 'react'
import { connect } from 'react-redux'

import { listRevenues } from '../../store/actions/generalRevenueAction'
import ReceitaPrevista from '../../components/Modal/ReceitaPrevista'
import Menu from '../../components/MenuReceitaPrevista'


import EditReceita from '../../components/Modal/ReceitaPrevistaEdit'
import SearchFilter from '../../components/searchFilterTable'

import { GetRequest } from '../../components/crudSendAxios/crud'

import { Table, Icon, Popover, Input, notification, Spin } from 'antd'

import 'antd/dist/antd.css';
import './styles.scss'

class SelectReceitaPrevista extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            search: '',
            filter: '',
            spin: true
        }
        this.searchRevenue = this.searchRevenue.bind(this)
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
                title: 'RECEITA',
                dataIndex: 'DESCR_RECEITA',
                key: 'DESCR_RECEITA'
            },
            {
                title: 'PARCELA',
                dataIndex: 'NUM_PARCELA',
                key: 'NUM_PARCELA'
            },
            {
                title: 'ACÃO',
                key: 'ACÃO',

                render: revenue => (
                    <div className="DetalhesBotoes">
                        <span className="DetalhesBotoesGrid">
                            <EditReceita data={revenue} />

                            <Popover
                                placement="left"
                                title='Excluir Receita'
                                content={<Menu data={revenue} />} trigger="click">
                                <Icon type="delete" title='Excluir Receita' style={{ fontSize: '18px', color: '#08c' }} />
                            </Popover>
                        </span>
                    </div>
                ),
            }
        ]
    }


    async requestAPI() {

        const Data = await GetRequest('api/receitas')
        if (Data.status === 402)
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

        this.setState({ ...this.state, spin: false })
        this.props.listRevenues(Data)
    }

    searchRevenue(event) {
        this.setState({ ...this.state, search: event.target.value, filter: event.target.value })
    }

    componentDidMount() {
        this.requestAPI()
    }

    render() {
        return (
            <div>
                <Spin size="large" spinning={this.state.spin} />
                <div className='ViewExpense'>
                    <ReceitaPrevista />
                    <Input name='receita' value={this.state.search} onChange={this.searchRevenue} placeholder="Procure aqui a receita especifica" />
                </div>
                <div>
                    <Table className='table table-action'
                        columns={this.columns()}
                        dataSource={SearchFilter(this.props.revenue, ['DESCR_RECEITA', 'DESCR_RECEITA'], this.state.filter)}
                        rowKey='ID' />
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        revenue: state.revenue
    }
}

const mapDispatchToProps = { listRevenues }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectReceitaPrevista)