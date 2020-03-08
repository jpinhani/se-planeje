import React from 'react'
import { connect } from 'react-redux'
import AddCategory from '../../components/Modal/Categoria/index'
import EditCategory from '../../components/Modal/CategoriaEdit/index'
import { listCategorys } from '../../store/actions/generalCategoryAction'
import { Table, Input, Popconfirm, Icon, message, notification } from 'antd'
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
        const verify = await axios.delete(endpoint)
        if (verify.data.error === true) {
            message.error('   ' + verify.data.message, 5);
        } else {
            message.success(" Categoria Excluida Com Sucesso", 5);
            this.requestAPI()
        }
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
                            <Popconfirm title="Deseja Realmente Excluir esse Registro?" onConfirm={() => this.deleteAcount(category.ID)}>
                                <Icon type="delete" title='Excluir Categoria' style={{ fontSize: '18px', color: '#08c' }} />
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

        const categoria = novosDados.data
        this.props.listCategorys(categoria)

    }

    async ImportCategoryDefault() {
        const userID = localStorage.getItem('userId')
        const endpointAPI = `http://localhost:8082/api/categorias/${userID}`
        const novosDados = await axios.get(endpointAPI)

        if (novosDados.data.length > 3) {
            const args = {
                message: 'Não é possivel importar o Plano de Categorias do SePlaneje',
                description:
                    `Não é possivel importar o Plano de Categorias do SePlaneje após ter criado categorias personalizadas ou ter categorias ja com valores lançados.`,
                duration: 6,
            };
            notification.open(args);
        } else {

            const body = {
                idUser: userID
            }
            const endpointAPIDefault = `http://localhost:8082/api/categorias/default/`
            await axios.post(endpointAPIDefault, body)
            this.requestAPI()
        }
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
            <div className='headerCategory'>
                <AddCategory />
                <Popconfirm title="Deseja Importar o Plano de Categorias do SePlaneje?" onConfirm={() => this.ImportCategoryDefault()}>
                    <Icon type="copy" style={{ fontSize: '36px', color: '#08c' }} title='Importar Plano de Categorias Default do SePlaneje' theme="twoTone" />
                </Popconfirm>
                <Input name='categoria' value={this.state.search} onChange={this.searchCategory} placeholder='Procure Aqui a Categoria Especifica' />
            </div>
            <Table columns={this.columns()} dataSource={this.props.category} rowKey='ID' />
        </div >
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