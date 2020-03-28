import React from 'react'
import { connect } from 'react-redux'

import AddCategory from '../../components/Modal/Categoria/index'
import EditCategory from '../../components/Modal/CategoriaEdit/index'

import { urlBackend, config, userID } from '../../routes/urlBackEnd'
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
        const endpoint = `${urlBackend}api/categorias/${categoriaId}`
        const verify = await axios.delete(endpoint, config)

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
        const endpointAPI = `${urlBackend}api/categorias/${userID()}`
        const novosDados = await axios.get(endpointAPI)

        let nivel = []
        let n3 = 0
        for (let x = 0; x < novosDados.data.length; x++) {
            if (novosDados.data[x].NIVEL === 3) {
                nivel[n3] = novosDados.data[x]

                let col = []
                for (let y = 0; y < novosDados.data.length; y++) {
                    if (novosDados.data[y].IDPAI === nivel[n3].ID
                        && novosDados.data[y].NIVEL === 4) {
                        col.push(novosDados.data[y])

                        // let n4 = 0

                        for (let n4 = 0; n4 < col.length; n4++) {
                            let col2 = []
                            for (let z = 0; z < novosDados.data.length; z++) {

                                if (novosDados.data[z].IDPAI === col[n4].ID
                                    && novosDados.data[z].NIVEL === 5) {
                                    col2.push(novosDados.data[z])


                                    // let n5 = 0

                                    for (let n5 = 0; n5 < col2.length; n5++) {
                                        let col3 = []
                                        for (let u = 0; u < novosDados.data.length; u++) {

                                            if (novosDados.data[u].IDPAI === col2[n5].ID
                                                && novosDados.data[u].NIVEL === 6) {

                                                col3.push(novosDados.data[u])
                                                col2[n5].children = col3
                                            }
                                        }
                                    }

                                    col[n4].children = col2
                                }

                            }
                        }

                        nivel[n3].children = col
                    }

                }
                n3 = n3 + 1
            }
        }

        // console.log('Forma Como os Dados estão vindo', nivel)
        this.props.listCategorys(nivel)
    }

    async ImportCategoryDefault() {

        const endpointAPI = `${urlBackend}api/categorias/${userID}`
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
            const endpointAPIDefault = `${urlBackend}api/categorias/default/`
            const resultStatus = await axios.post(endpointAPIDefault, body, config)

            if (resultStatus.status === 200) {

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
