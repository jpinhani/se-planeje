import React from 'react'
import { connect } from 'react-redux'

import { Link } from 'react-router-dom'

import { listExpenseControlerMeta } from '../../store/actions/controlerExpenseAction'
import { listVisionsControler } from '../../store/actions/controlerVisionAction'

import SearchFilter from '../../components/searchFilterTable/index'

import { Table, Input, Select, Button } from 'antd'
import DespesaPagar from '../../components/Modal/DespesaPagar'
import { GetRequest, visionSerchMeta } from '../../components/crudSendAxios/crud'

import 'antd/dist/antd.css';
import './styles.scss'



const { Option } = Select;
class SelectDespesaPagar extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props)

        this.searchExpense = this.searchExpense.bind(this)

        this.state = {
            search: '',
            filter: '',
            visions: [],
            visionInput: [],
            dataVision: [],
            despesaList: []
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

    searchExpense(event) {
        this.setState({ ...this.state, search: event.target.value, filter: event.target.value })
    }

    async getdespesa() {
        const despesa = await GetRequest('api/despesas')
        return despesa
    }

    async getvision() {
        const resultVision = await GetRequest('api/visions')
        return resultVision
    }

    async requestAPI() {

        if (this._isMounted === true) {
            // const despesa = await this.getdespesa()
            const resultVision = await this.getvision()

            const options = resultVision.map((desc, i) =>
                <Option key={i} value={desc.VISAO}>
                    {desc.VISAO}
                </Option>
            )
            options.push(<Option key='all' value='ALL'>TODAS VISÕES</Option>)

            this.setState({
                ...this.state, visions: options,
                dataVision: resultVision,
            })

            if (this.props.visionControler.length > 0)
                this.searchExpenses(this.props.visionControler)
        }
    }

    async  searchExpenses(selectVisao) {

        if (this._isMounted === true) {
            const despesa = await this.getdespesa()
            const novaVisao = visionSerchMeta(this.state.dataVision, despesa, selectVisao)

            this.props.listExpenseControlerMeta((selectVisao !== 'ALL') ?
                novaVisao[0] !== undefined ? novaVisao[0] : [] :
                despesa)

            this.props.listVisionsControler(selectVisao)

            this.setState({ ...this.state, visionInput: selectVisao })

        }
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted === true)
            this.requestAPI()
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div>
                < div style={{ margin: '16px 0', background: '#DCDCDC' }}>
                    <Link to='selectdespesarealizada'><Button key='Lnc'>Lançamentos</Button></Link>
                    <Link to='SelectFaturaPagar'><Button key='fatu'>Faturas</Button></Link>
                </div >
                <div style={{ padding: '15px', fontSize: '16px', background: '#87CEFA' }}>
                    Metas Cadastradas
                </div>

                <div className='ViewExpense'>
                    <Input name='despesa'
                        style={{ width: '50%' }}
                        value={this.state.search}
                        onChange={this.searchExpense}
                        placeholder="Procure aqui a despesa especifica" />

                    <Select style={{ width: '50%' }}
                        placeholder="Filtrar por Visão"
                        value={this.state.visionInput}
                        onSelect={(vision) => this.searchExpenses(vision)}
                    >
                        {this.state.visions}
                    </Select>
                </div >

                <div>
                    <Table className='table table-action'
                        columns={this._isMounted === true ? this.columns() : []}
                        dataSource={SearchFilter(this._isMounted === true ? this.props.controlerexpenseMeta : [],
                            ['DESCR_CATEGORIA', 'DESCR_DESPESA', 'DATANOVA'],
                            this.state.filter)}
                        rowKey='ID' />
                </div>

            </div >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        controlerexpenseMeta: state.controlerexpenseMeta,
        visionControler: state.visionControler
    }
}

const mapDispatchToProps = { listExpenseControlerMeta, listVisionsControler }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectDespesaPagar) 