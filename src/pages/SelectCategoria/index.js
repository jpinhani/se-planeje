import React from 'react'
import { connect } from 'react-redux'
import AddCategory from '../../components/Modal/Categoria/index'
// import AddAcount from '../../components/Modal/Conta/index'
// import EditaAcount from '../../components/Modal/ContaEdit/index'
import { listCategorys } from '../../store/actions/generalCategoryAction'
import {
    Table, /* Icon, */ Input,/* , Popconfirm */
} from 'antd'
import axios from 'axios'


import 'antd/dist/antd.css';
import './styles.scss'

class SelectCategoria extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            search: ''
        }

        this.searchCategory = this.searchCategory.bind(this)
    }

    columns() {
        return [
            {
                title: 'Dependencia',
                dataIndex: 'PAI',
                key: '1'
            },
            {
                title: 'Categoria',
                dataIndex: 'DESCR_CATEGORIA',
                key: '2'
            },
            {
                title: 'Nivel',
                dataIndex: 'NIVEL',
                key: '3'
            },
            {
                title: 'Tipo',
                dataIndex: 'TIPO',
                key: '4'
            },
            {
                title: 'Agregação',
                dataIndex: 'AGREGACAO',
                key: '5'
            },
            {
                title: 'Entrada',
                dataIndex: 'ENTRADA',
                key: '6'
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

        const categoria = novosDados
        this.props.listCategorys(categoria)

    }

    componentDidMount() {
        this.requestAPI()
    }


    searchCategory(event) {
        this.setState({ ...this.state, search: event.target.value })
        this.updateList(event.target.value)
    }

    async updateList(evento) {
        const userID = localStorage.getItem('userId')
        console.log('Evento valor:', evento)
        switch (evento) {
            case '':
                console.log('Entrou aquii')
                const x = 1
                const endpointall = `http://localhost:8082/api/categorias/search/${x}/${userID}`
                const resultall = await axios.get(endpointall)
                const categoriaall = resultall.data
                this.props.listCategorys(categoriaall)
                break;

            default:
                const endpoint = `http://localhost:8082/api/categorias/search/${evento}/${userID}`
                const result = await axios.get(endpoint)
                const categoria = result.data
                this.props.listCategorys(categoria)
                break;
        }
        // const userID = localStorage.getItem('userId')
        // const endpoint = `http://localhost:8082/api/categorias/search/${evento}/${userID}`
        // const result = await axios.get(endpoint)
        // const categoria = result.data
        // this.props.listCategorys(categoria)
    }


    render() {
        return (<div>
            <AddCategory />
            <Input name='categoria' value={this.state.search} onChange={this.searchCategory} placeholder='Procure Aqui a Categoria Especifica' />
            <Table columns={this.columns()} dataSource={this.props.category} rowKey='ID' />

        </div>
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