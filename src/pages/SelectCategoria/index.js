import React from 'react'
import { connect } from 'react-redux'
// import AddAcount from '../../components/Modal/Conta/index'
// import EditaAcount from '../../components/Modal/ContaEdit/index'
import { listCategorys } from '../../store/actions/generalCategoryAction'
import { Table/* , Icon, Input, Popconfirm */ } from 'antd'
import axios from 'axios'


import 'antd/dist/antd.css';
import './styles.scss'

class SelectCategoria extends React.Component {

    columns() {
        return [
            {
                title: 'Dependencia',
                dataIndex: 'PAI',
                key: 'PAI'
            },
            {
                title: 'Categoria',
                dataIndex: 'DESCR_CATEGORIA',
                key: 'DESCR_CATEGORIA'
            },
            {
                title: 'Nivel',
                dataIndex: 'NIVEL',
                key: 'NIVEL'
            },
            {
                title: 'Tipo',
                dataIndex: 'TIPO',
                key: 'TIPO'
            },
            {
                title: 'Agregação',
                dataIndex: 'AGREGACAO',
                key: 'AGREGACAO'
            },
            {
                title: 'Entrada',
                dataIndex: 'ENTRADA',
                key: 'ENTRADA'
            }
        ]
    }


    async requestAPI() {
        const userID = localStorage.getItem('userId')
        const endpointAPI = `http://localhost:8082/api/categorias/${userID}`
        const result = await axios.get(endpointAPI)


        const novosDados = result.data.map((objetoAtual) => {
            if (objetoAtual.ENTRADA === 0) {
                objetoAtual.ENTRADA = 'Conta de Input'

            } else {
                objetoAtual.ENTRADA = 'Conta de Consolidação'
            }

            if (objetoAtual.TIPO === 1) {
                objetoAtual.TIPO = 'Despesa'

            } else if (objetoAtual.TIPO === null) {

                objetoAtual.TIPO = null
            } else {
                objetoAtual.TIPO = 'Receita'
            }

            return objetoAtual

        })
        console.log('log', novosDados)

        const categoria = novosDados
        this.props.listCategorys(categoria)
    }

    componentDidMount() {
        this.requestAPI()
    }


    render() {
        return (
            <Table columns={this.columns()} dataSource={this.props.category} />
        )
    }
}


const mapStateToProps = (state /*, ownProps*/) => {
    return {
        category: state.category
    }
}

const mapDispatchToProps = { listCategorys }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectCategoria)