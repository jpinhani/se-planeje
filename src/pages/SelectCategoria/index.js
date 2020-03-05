import React from 'react'
import { connect } from 'react-redux'
import AddCategory from '../../components/Modal/Categoria/index'
import EditCategory from '../../components/Modal/CategoriaEdit/index'
import { listCategorys } from '../../store/actions/generalCategoryAction'
import { Table, Input, Popconfirm, Icon } from 'antd'
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
    async deleteAcount(categoriaId) {
        const endpoint = `http://localhost:8082/api/categorias/${categoriaId}`
        await axios.delete(endpoint)
        this.requestAPI()
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
                dataIndex: 'TIPODESCR',
                key: '4'
            },
            {
                title: 'Entrada',
                dataIndex: 'ENTRADADESCR',
                key: '5'
            },
            {
                title: 'Action',
                key: 'action',
                render: category => (
                    <div className='ModeloBotoesGrid'>
                        <span className='ModeloBotoesGridDetalhes' >
                            <EditCategory data={category} />
                            <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteAcount(category.ID)}>
                                <Icon type="delete" style={{ fontSize: '18px', color: '#08c' }} />
                            </Popconfirm>
                        </span>
                    </div>
                ),
            }
        ]
    }

    async requestAPI() {
        const userID = localStorage.getItem('userId')
        const endpointAPI = `http://localhost:8082/api/categorias/${userID}`
        const novosDados = await axios.get(endpointAPI)

        // const novosDados = result.data.map((objetoAtual) => {
        //     if (objetoAtual.ENTRADA === 0) {
        //         objetoAtual.ENTRADA = 'Conta de Input'

        //     } else {
        //         objetoAtual.ENTRADA = 'Conta de Consolidação'
        //     }

        //     if (objetoAtual.TIPO === 1) {
        //         objetoAtual.TIPO = 'Despesa'

        //     } else if (objetoAtual.TIPO === null) {

        //         objetoAtual.TIPO = null
        //     } else {
        //         objetoAtual.TIPO = 'Receita'
        //     }

        //     return objetoAtual
        // })

        const categoria = novosDados.data
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
        switch (evento) {
            case '':

                this.requestAPI()
                break;

            default:
                const endpoint = `http://localhost:8082/api/categorias/search/${evento}/${userID}`
                const result = await axios.get(endpoint)
                const categoria = result.data
                this.props.listCategorys(categoria)
                break;
        }
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


const mapStateToProps = (state) => {
    return {
        category: state.category
    }
}

const mapDispatchToProps = { listCategorys }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectCategoria)