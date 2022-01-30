import React from 'react'
import { connect } from 'react-redux'

import { listExpenses } from '../../store/actions/generalExpenseAction'
import { listVisionsControler } from '../../store/actions/controlerVisionAction'

import DespesaPrevista from '../../components/Modal/DespesaPrevista'
import DespesaMeta from '../../components/Modal/DespesaPagar'
import Menu from '../../components/MenuDespesaPrevista'
import EditDespesa from '../../components/Modal/DespesaPrevistaEdit'

import SearchFilter from '../../components/searchFilterTable'
import { Table, Icon, Popover, Input, notification, Spin, Select } from 'antd'

import { GetRequest, visionSerchMeta } from '../../components/crudSendAxios/crud'

import 'antd/dist/antd.css';
import './styles.scss'


const { Option } = Select;
class SelectDespesaPrevista extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            search: '',
            filter: '',
            spin: true,
            visions: [],
            mapvision: []
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
                key: 'DATANOVA',
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

                            <DespesaMeta data={expense} />
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

        const visions = await GetRequest('api/visions')

        const options = visions.map((desc, i) =>
            <Option key={i} value={desc.VISAO}>
                {desc.VISAO}
            </Option>
        )

        options.push(<Option key='all' value='ALL'>TODAS VISÕES</Option>)

        this.setState({ ...this.state, visions: options, mapvision: visions })

        this.setState({ ...this.state, spin: false })
        this.props.listExpenses(despesa)
    }

    searchExpense(event) {
        this.setState({ ...this.state, search: event.target.value, filter: event.target.value })
    }

    filterVision(selectVisao) {

        this.props.listVisionsControler(selectVisao);
        // dispatch({ type: 'LIST_VISIONCONTROLER', payload: selectVisao })
    }


    componentDidMount() {
        this.requestAPI()
    }

    render() {
        return (
            <div>
                <Spin size="large" spinning={this.state.spin} />
                <div className='ViewExpense'>
                    <DespesaPrevista />
                    <Input name='despesa' value={this.state.search} onChange={this.searchExpense} placeholder="Procure aqui a despesa especifica" />
                    <Select style={{ width: '50%' }}
                        placeholder="Filtrar por Visão"
                        value={this.props.visionControler}
                        onSelect={(valor) => this.filterVision(valor)}
                    >
                        {this.state.visions}
                    </Select>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row'
                }}>
                    <div style={{ padding: '10px' }}>
                        <strong>Total Previsto (Meta): </strong>
                        {SearchFilter(
                            visionSerchMeta(this.state.mapvision, this.props.expense, this.props.visionControler),
                            ['DESCR_CATEGORIA', 'DESCR_DESPESA'], this.state.filter).reduce((acum, atual) => acum + atual.VL_PREVISTO2, 0).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })}
                    </div>

                    <div style={{ padding: '10px' }}>
                        <strong>Crédito: </strong>
                        {SearchFilter(
                            visionSerchMeta(this.state.mapvision, this.props.expense, this.props.visionControler),
                            ['DESCR_CATEGORIA', 'DESCR_DESPESA'], this.state.filter).filter(fil => fil.CARTAO).reduce((acum, atual) => acum + atual.VL_PREVISTO2, 0).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })}
                    </div>
                    <div style={{ padding: '10px' }}>
                        <strong>Débito/Dinheiro: </strong>
                        {SearchFilter(
                            visionSerchMeta(this.state.mapvision, this.props.expense, this.props.visionControler),
                            ['DESCR_CATEGORIA', 'DESCR_DESPESA'], this.state.filter).filter(fil => fil.CARTAO === null).reduce((acum, atual) => acum + atual.VL_PREVISTO2, 0).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })}
                    </div>
                </div>
                <div>
                    <Table className='table table-action'
                        columns={this.columns()}
                        dataSource={SearchFilter(
                            visionSerchMeta(this.state.mapvision, this.props.expense, this.props.visionControler),
                            ['DESCR_CATEGORIA', 'DESCR_DESPESA'], this.state.filter).sort(function (a, b) {
                                if (a.DT_PREVISTO < b.DT_PREVISTO) return -1;
                                if (a.DT_PREVISTO > b.DT_PREVISTO) return 1;
                                return 0;
                            })}
                        rowKey='ID'
                        pagination={{ pageSize: 100 }} />
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state /*, ownProps*/) => {
    return {
        expense: state.expense,
        visionControler: state.visionControler
    }
}

const mapDispatchToProps = { listExpenses, listVisionsControler }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectDespesaPrevista)