import React from 'react'
import { connect } from 'react-redux'

import { listExpensesPaga } from '../../store/actions/generalExpenseRealAction'
import { listExpenses } from '../../store/actions/generalExpenseAction'

import DespesaRealizada from '../../components/Modal/DespesaRealizada'

import EditDespesa from '../../components/Modal/DespesaRealizadaEdit'
import SearchFilter from '../../components/searchFilterTable'

import { Table, Icon, Popconfirm, Input, Select } from 'antd'

import { GetRequest, UpdateRequest } from '../../components/crudSendAxios/crud'
import { verifySend } from '../../components/verifySendAxios/index'

import 'antd/dist/antd.css';
import './styles.scss'


const { Option } = Select;
class SelectDespesaReal extends React.Component {
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

        const body = expenseReal
        body.id = expenseReal.ID

        const resultStatus = await UpdateRequest(body, 'api/despesas/delete/real')
        verifySend(resultStatus, 'DELETEDESPESAREAL', body.DESCR_DESPESA)

        const metaList = resultStatus === 200 ? await GetRequest('api/despesas') : {}

        this.props.listExpenses(metaList)

        this.requestAPI()
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


    async requestAPI() {

        const resultVision = await GetRequest('api/visions')
        const despesa = await GetRequest('api/despesas/paga')

        const options = resultVision.map((desc, i) =>
            <Option key={i} value={desc.VISAO}>
                {desc.VISAO}
            </Option>
        )
        options.push(<Option key='all' value='ALL'>TODAS METAS</Option>)

        this.setState({ ...this.state, visions: options, dataVision: resultVision, despesaList: despesa })
    }

    searchExpense(event) {
        this.setState({ ...this.state, search: event.target.value, filter: event.target.value })
    }

    async searchExpenses(selectVisao) {

        const novaVisao = this.state.dataVision.map((FIL) =>
            this.state.despesaList.filter((DATA) =>
                FIL.DT_FIM >= DATA.DT_VISAO &&
                FIL.DT_INICIO <= DATA.DT_VISAO &&
                FIL.VISAO === selectVisao
            )).filter((data) => data.length > 0)


        // console.log(novaVisao[0])
        this.props.listExpensesPaga(selectVisao !== 'ALL' ?
            novaVisao[0] !== undefined ? novaVisao[0] : [] :
            this.state.despesaList)

        this.setState({ ...this.state, visionInput: selectVisao })
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
                    <Select style={{ width: '50%' }}
                        placeholder="Filtrar por Visão"
                        value={this.state.visionInput}
                        onSelect={(teste) => this.searchExpenses(teste)}
                    // value={this.state.nivelInput}
                    >
                        {this.state.visions}
                    </Select>
                </div>
                <div>
                    <Table name='Despesa' className='table table-action'
                        columns={this.columns_teste()}
                        dataSource={SearchFilter(this.props.expenseReal, ['DESCR_CATEGORIA', 'DESCR_DESPESA'], this.state.filter)}
                        rowKey={'ID'} />
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