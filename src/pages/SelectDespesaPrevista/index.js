import React from 'react'
import { connect } from 'react-redux'
import { listExpenses } from '../../store/actions/generalExpenseAction'
import DespesaPrevista from '../../components/Modal/DespesaPrevista'
import EditDespesa from '../../components/Modal/DespesaPrevistaEdit'
import { Table, Icon, Popconfirm, message, Checkbox } from 'antd'
import axios from 'axios'


import 'antd/dist/antd.css';
import './styles.scss'

class SelectDespesaPrevista extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            search: '',
            deleteDespesa: 'Deletar Despesa Selecionada'
        }

        this.handleDespesaDelete = this.handleDespesaDelete.bind(this)
        // this.searchAcount = this.searchAcount.bind(this)
    }

    async deleteAcount(expense) {
        const body = {
            idUser: localStorage.getItem('userId'),
            dataPrevista: expense.DATANOVA,
            valorPrevisto: expense.VL_PREVISTO2,
            cartao: expense.ID_CARTAO,
            categoria: expense.ID_CATEGORIA,
            parcela: expense.NUM_PARCELA,
            descrDespesa: expense.DESCR_DESPESA,
            valueEdit: this.state.deleteDespesa,
            idGrupo: expense.ID_GRUPO,

        }
        const endpoint = `http://localhost:8082/api/despesas/${expense.ID}`
        const resultStatus = await axios.delete(endpoint, body)
        if (resultStatus.status === 200) {
            message.success('Despesa Excluida com Sucesso', 5)
            this.requestAPI()
        } else {
            message.erro('A despesa não pode ser Excluida, Error ' + resultStatus.status, 5)
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
                title: 'ACÃO',
                key: 'ACÃO',

                render: expense => (
                    <div>
                        <span >
                            <EditDespesa data={expense} />
                            <Popconfirm title={this.state.deleteDespesa} onConfirm={() => this.deleteAcount(expense)}>
                                <Icon type="delete" title='Excluir Despesa' style={{ fontSize: '18px', color: '#08c' }} />
                            </Popconfirm>
                            <Checkbox onChange={this.handleDespesaDelete} >Marcar demais parcelas</Checkbox>
                        </span>
                    </div>
                ),
            }
        ]
    }

    handleDespesaDelete(e) {
        if (e.target.checked === true) {
            this.setState({ ...this.state, deleteDespesa: 'Deletar Todas Despesas do grupo a partir da Selecionada' })
        } else {
            this.setState({ ...this.state, deleteDespesa: 'Deletar Despesa Selecionada' })
        }
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
                    <DespesaPrevista />
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