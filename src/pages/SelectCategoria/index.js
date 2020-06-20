import React from 'react'
import { connect } from 'react-redux'

import AddCategory from '../../components/Modal/Categoria/index'
import EditCategory from '../../components/Modal/CategoriaEdit/index'

import { urlBackend, userID } from '../../services/urlBackEnd'
import { InsertRequest, GetRequest, DeleteRequest } from '../../components/crudSendAxios/crud'
import { verifySend } from '../../components/verifySendAxios/index'

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
        const verify = await DeleteRequest(categoriaId, 'api/categorias')

        verifySend(verify, 'DELETE', 'Categoria')

        if (verify === 200)
            this.requestAPI()
    }

    columns() {
        return [
            {
                title: 'CATEGORIA',
                dataIndex: 'DESCR_CATEGORIA',
                key: '2'
            },
            {
                title: 'NIVEL',
                dataIndex: 'NIVEL',
                key: '3'
            },
            {
                title: 'TIPO',
                dataIndex: 'TIPODESCR',
                key: '4'
            },
            {
                title: 'ENTRADA',
                dataIndex: 'ENTRADADESCR',
                key: '5'
            },
            {
                title: 'AÇÃO',
                key: 'action',
                render: category => (
                    <div className='ModeloBotoesGrid'>
                        <span className='ModeloBotoesGridDetalhes' >
                            <EditCategory data={category} />
                            <Popconfirm title="Deseja Realmente Excluir essa Categoria?" onConfirm={() => this.deleteAcount(category.ID)}>
                                <Icon type="delete" title='Excluir Categoria' style={{ fontSize: '18px', color: '#08c' }} />
                            </Popconfirm>
                        </span>
                    </div>
                ),
            }
        ]
    }

    async requestAPI() {

        const novosDados = await GetRequest('api/categorias')

        const nivel3 = novosDados.filter((DATA) => DATA.NIVEL === 3)
        const nivel4 = novosDados.filter((DATA) => DATA.NIVEL === 4)
        const nivel5 = novosDados.filter((DATA) => DATA.NIVEL === 5)
        const nivel6 = novosDados.filter((DATA) => DATA.NIVEL === 6)

        const gera5 = nivel5.reduce((novo, n6, i) => {
            if (nivel6.filter((data) => n6.ID === data.IDPAI).length > 0)
                novo[i].children = nivel6.filter((data) => n6.ID === data.IDPAI)
            return novo
        }, nivel5)

        const gera4 = nivel4.reduce((novo, n5, i) => {
            if (gera5.filter((data) => n5.ID === data.IDPAI).length > 0)
                novo[i].children = gera5.filter((data) => n5.ID === data.IDPAI)
            return novo
        }, nivel4)

        const nivel = nivel3.reduce((novo, n4, i) => {
            if (gera4.filter((data) => n4.ID === data.IDPAI).length > 0)
                novo[i].children = gera4.filter((data) => n4.ID === data.IDPAI)
            return novo
        }, nivel3)

        this.props.listCategorys(nivel)
    }

    async ImportCategoryDefault() {

        const novosDados = await GetRequest('api/categorias')

        if (novosDados.length > 3) {
            const args = {
                message: 'Não é possivel importar o Plano de Categorias do SePlaneje',
                description:
                    `Não é possivel importar o Plano de Categorias do SePlaneje após ter criado categorias personalizadas ou ter categorias ja com valores lançados.`,
                duration: 6,
            };
            notification.open(args);
        } else {

            const body = {
                idUser: userID()
            }

            const resultStatus = await InsertRequest(body, 'api/categorias/default')

            if (resultStatus === 200) {

                message.success(' O Plano de categorias Padrão do SePlaneje foi importado com Sucesso', 10)
                this.requestAPI()

            } else {
                message.success(' O Plano de categorias Padrão do SePlaneje não pode ser importado, Error ' + resultStatus.status, 10)
            }
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

        switch (evento) {
            case '':

                this.requestAPI()
                break;

            default:
                const endpoint = `${urlBackend}api/categorias/search/${evento}/${userID()}`
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
            <div>
                <Table className='table table-action' columns={this.columns()} dataSource={this.props.category} rowKey='ID' />
            </div>
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
