import React from 'react'
import { connect } from 'react-redux'

import { listExpensesPaga } from '../../store/actions/generalExpenseRealAction'

import { listVisionsControler } from '../../store/actions/controlerVisionAction'
import { listExpenseControlerPaga } from '../../store/actions/controlerExpenseRealAction'

import DespesaRealizada from '../../components/Modal/DespesaRealizada'

import { Link } from 'react-router-dom'

import EditDespesa from '../../components/Modal/DespesaRealizadaEdit'
import SearchFilter from '../../components/searchFilterTable'

import { Table, Icon, Popconfirm, Input, Select, Button } from 'antd'

import { GetRequest, UpdateRequest, visionSerch } from '../../components/crudSendAxios/crud'
import { verifySend } from '../../components/verifySendAxios/index'

import 'antd/dist/antd.css';
import './styles.scss'


const { Option } = Select;
class SelectDespesaReal extends React.Component {
    _isMounted = false
    constructor(props) {
        super(props)

        this.state = {
            search: '',
            filter: '',
            visions: [],
            visionInput: [],
            dataVision: [],
            despesaList: []
        }
        this.searchExpense = this.searchExpense.bind(this)
    }

    async deleteReal(expenseReal) {
        if (this._isMounted === true) {
            const body = expenseReal
            body.id = expenseReal.ID

            const resultStatus = await UpdateRequest(body, 'api/despesas/delete/real')
            verifySend(resultStatus, 'DELETEDESPESAREAL', body.DESCR_DESPESA)

            if (resultStatus === 200) {

                const despesa = await GetRequest('api/despesas/paga')
                this.props.listExpenseControlerPaga(despesa)
                this.searchExpenses(this.props.visionControler)
            }
        }
    }


    columns_teste() {
        return [
            {
                title: 'CATEGORIA',
                dataIndex: 'DESCR_CATEGORIA',
                key: 'DESCR_CATEGORIA'
            },
            {
                title: 'R$ PREVISTO',
                dataIndex: 'VL_PREVISTO',
                key: 'VL_PREVISTOR'
            },
            {
                title: 'R$ REAL',
                dataIndex: 'VL_REAL',
                key: 'VL_REALR'
            },
            {
                title: 'DATA PREVISTA',
                dataIndex: 'DATANOVA',
                key: 'DATANOVAR'
            },
            {
                title: 'DATA REALIZADA',
                dataIndex: 'DATANOVAREAL',
                key: 'DATANOVAREALR'
            },
            {
                title: 'DESPESA',
                dataIndex: 'DESCR_DESPESA',
                key: 'DESCR_DESPESAR'
            },
            {
                title: 'PARCELA',
                dataIndex: 'NUM_PARCELA',
                key: 'NUM_PARCELAR'
            },
            {
                title: 'CARTAO',
                dataIndex: 'CARTAO',
                key: 'CARTAOR'
            },
            {
                title: 'ACÃO',
                key: 'ACÃOR',

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

    async getdespesa() {
        const despesa = await GetRequest('api/despesas/paga')

        return despesa
    }

    async getvision() {
        const resultVision = await GetRequest('api/visions')

        return resultVision
    }

    async requestAPI() {
        if (this._isMounted === true) {

            const resultVision = await this.getvision()
            // const despesa = await this.getdespesa()

            // this.props.listExpenseControlerPaga(despesa)

            const options = resultVision.map((desc, i) =>
                <Option key={i} value={desc.VISAO}>
                    {desc.VISAO}
                </Option>
            )
            options.push(<Option key='all' value='ALL'>TODAS VISÕES</Option>)

            this.setState({
                ...this.state, visions: options,
                dataVision: resultVision,
                // despesaList: despesa
            })

            if (this.props.visionControler.length > 0)
                this.searchExpenses(this.props.visionControler)
        }
    }

    async  searchExpenses(selectVisao) {
        if (this._isMounted === true) {
            const despesa = await this.getdespesa()
            const novaVisao = visionSerch(this.state.dataVision, despesa, selectVisao)

            this.props.listExpensesPaga(selectVisao !== 'ALL' ?
                novaVisao[0] !== undefined ? novaVisao[0] : [] :
                despesa)

            this.setState({ ...this.state, visionInput: selectVisao })
            this.props.listVisionsControler(selectVisao)
        }
    }

    searchExpense(event) {
        this.setState({ ...this.state, search: event.target.value, filter: event.target.value })
    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted === true)
            this.requestAPI()
    }

    componentWillUnmount() {
        this._isMounted = false
    }


    render() {
        return (
            <div>
                < div style={{ margin: '16px 0', background: '#DCDCDC' }}>
                    <Link to='selectPagarMeta'><Button key='Met'> Metas</Button></Link>
                    <Link to='SelectFaturaPagar'><Button key='fatu'>Faturas</Button></Link>
                </div >
                <div style={{ padding: '15px', fontSize: '16px', background: '#87CEFA' }}>
                    Novas Despesas - Imprevistos
                </div>
                <div className='ViewExpense'>
                    <DespesaRealizada />
                    <Input name='despesa' value={this.state.search} onChange={this.searchExpense} placeholder="Procure aqui a despesa especifica" />
                    <Select style={{ width: '50%' }}
                        placeholder="Filtrar por Visão"
                        value={this.state.visionInput}
                        onSelect={(visao) => this.searchExpenses(visao)}
                    >
                        {this.state.visions}
                    </Select>
                </div>
                <div>
                    <Table name='Despesa' className='table table-action'
                        columns={this._isMounted === true ? this.columns_teste() : []}
                        dataSource={SearchFilter(this._isMounted === true ? this.props.expenseReal : [], ['DESCR_CATEGORIA', 'DESCR_DESPESA'], this.state.filter)}
                        rowKey={'ID'} />
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state /*, ownProps*/) => {
    return {
        expenseReal: state.expenseReal,
        visionControler: state.visionControler,
        controlerExpenseReal: state.controlerExpenseReal
    }
}

const mapDispatchToProps = { listExpensesPaga, listVisionsControler, listExpenseControlerPaga }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectDespesaReal)