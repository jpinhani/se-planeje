import React from 'react'
import { connect } from 'react-redux'

import { listExpenses } from '../../store/actions/generalExpenseAction'
import SearchFilter from '../../components/searchFilterTable/index'
// import SearchFilterVision from '../../components/searchFilterTableVision'

import { Table, Input, Select } from 'antd'
import DespesaPagar from '../../components/Modal/DespesaPagar'
import { GetRequest } from '../../components/crudSendAxios/crud'

// import { loadVisions } from '../../components/ListagemCombo/index'


import 'antd/dist/antd.css';
import './styles.scss'

const { Option } = Select;
class SelectDespesaPagar extends React.Component {
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

        const resultVision = await GetRequest('api/visions')
        const despesa = await GetRequest('api/despesas')

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
        this.props.listExpenses(selectVisao !== 'ALL' ?
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
                    <Input name='despesa'
                        style={{ width: '50%' }}
                        value={this.state.search}
                        onChange={this.searchExpense}
                        placeholder="Procure aqui a despesa especifica" />

                    <Select style={{ width: '50%' }}
                        placeholder="Filtrar por Visão"
                        value={this.state.visionInput}
                        onSelect={(teste) => this.searchExpenses(teste)}
                    // value={this.state.nivelInput}
                    >
                        {this.state.visions}
                    </Select>
                </div >

                <div>
                    <Table className='table table-action'
                        columns={this.columns()}
                        dataSource={SearchFilter(this.props.expense,
                            ['DESCR_CATEGORIA', 'DESCR_DESPESA', 'DATANOVA'],
                            this.state.filter)}
                        rowKey='ID' />
                </div>

            </div >
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