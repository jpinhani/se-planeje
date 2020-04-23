import React from 'react'
import { connect } from 'react-redux'

import ListCard from '../../components/Modal/ListFaturaContabilizada'

import { listFaturaPaga } from '../../store/actions/generalFaturaAction'
import SearchFilter from '../../components/searchFilterTable'
import { GetRequest } from '../../components/crudSendAxios/crud'

import { Table, Input, Popconfirm, Icon } from 'antd';

import 'antd/dist/antd.css';
//import './styles.scss'

class FaturaContabilizada extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            search: '',
            filter: ''
        }
        this.searchExpense = this.searchExpense.bind(this)
    }

    deleteAcount(faturaId) {
        console.log(faturaId)
    }

    columns() {
        return [
            {
                title: 'FATURA',
                dataIndex: 'ID_FATURA',
                key: 'ID_FATURA',
            },
            {
                title: 'VENCIMENTO',
                dataIndex: 'DT_VENCIMENTO2',
                key: 'DT_VENCIMENTO2',
            },
            {
                title: 'PAGAMENTO',
                dataIndex: 'DT_PAGAMENTO2',
                key: 'DT_PAGAMENTO2',
            },
            {
                title: 'VALOR PAGO',
                dataIndex: 'VL_REAL2',
                key: 'VL_REAL2'
            },
            {
                title: 'AÇÃO',
                key: 'action',
                render: fatura => (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div>
                            <ListCard data={fatura} />
                        </div>
                        <div style={{ padding: '10px' }}>
                            <Popconfirm title="Deseja Realmente Reabrir essa Fatura?" onConfirm={() => this.deleteAcount(fatura.ID_FATURA)}>
                                <Icon type="delete" title='Excluir Fatura' style={{ fontSize: '18px', color: '#08c' }} />
                            </Popconfirm>
                        </div>
                    </div>
                ),
            }
        ]
    }


    async requestAPI() {
        const faturas = await GetRequest('api/fatura')
        this.props.listFaturaPaga(faturas)
    }

    componentDidMount() {
        this.requestAPI()
    }

    searchExpense(event) {
        this.setState({ ...this.state, search: event.target.value, filter: event.target.value })
    }
    render() {
        return (
            <div>
                <div>
                    <Input name='despesa' value={this.state.search} onChange={this.searchExpense} placeholder="Procure aqui a fatura especifica" />
                </div>
                <div>
                    <Table className='table table-action'
                        columns={this.columns()}
                        dataSource={SearchFilter(this.props.fatura, ['ID_FATURA'], this.state.filter)}
                        rowKey='ID_FATURA' />


                </div>
            </div>
        )
    }
}

const mapStateToProps = (state /*, ownProps*/) => {
    return {
        fatura: state.fatura
    }
}

const mapDispatchToProps = { listFaturaPaga }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FaturaContabilizada)
