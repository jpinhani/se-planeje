import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Icon, Modal, Input, Select, notification, message } from 'antd'
import { listCategorys } from '../../../store/actions/generalCategoryAction'
import { urlBackend, config, userID } from '../../../routes/urlBackEnd'
import 'antd/dist/antd.css';
import './styles.scss'

const { Option } = Select;

class ModalCategory extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            dependenciaInput: [],
            dependencia: [],
            descrCategoria: '',
            nivelInput: [],
            nivel: [],
            tipo: [],
            entrada: [],
            entradaInput: [],
        }

        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDependencia = this.handleDependencia.bind(this)
        this.handleDescrCategoria = this.handleDescrCategoria.bind(this)
        this.handleNivel = this.handleNivel.bind(this)
        this.handleTipo = this.handleTipo.bind(this)
        this.handleEntrada = this.handleEntrada.bind(this)
    }

    showModal() { this.setState({ ...this.state, visible: true }) };

    handleCancel() {
        this.setState({
            ...this.state, dependenciaInput: [], descrCategoria: '', nivelInput: [],
            nivel: [], tipo: [], entrada: [], entradaInput: [], visible: false
        })

    };

    handleDependencia(eventos) {
        this.setState({ ...this.state, dependenciaInput: eventos })
    }
    handleDescrCategoria(event) {
        this.setState({ ...this.state, descrCategoria: event.target.value })
    }
    handleNivel(evento) {
        this.setState({ ...this.state, nivelInput: evento, entradaInput: [], dependenciaInput: [] })
        const tipoSelecionado = this.state.tipo
        let nivelSelecionado = evento


        if ((tipoSelecionado === "1") | (tipoSelecionado === "2")) {
            this.ComboDependencia(tipoSelecionado, nivelSelecionado)
        }
    }
    handleTipo(evento) {
        this.setState({ ...this.state, entradaInput: [], dependenciaInput: [], tipo: evento })
        const tipoSelecionado = evento
        const nivelSelecionado = this.state.nivelInput

        if ((nivelSelecionado.length > 0)) {
            this.ComboDependencia(tipoSelecionado, nivelSelecionado)
        }
    }
    handleEntrada(evento) {
        this.setState({ ...this.state, entradaInput: evento })
    }

    async ComboDependencia(tipo, nivel) {

        const endpoint = `${urlBackend}api/categorias/comboDependencia/${userID()}/${tipo}/${nivel}`

        const result = await axios.get(endpoint)

        const options = result.data.map((desc, i) =>
            <Option key={i} value={desc.ID}>
                {desc.DESCR_CATEGORIA}
            </Option>
        )
        this.setState({ ...this.state, dependencia: options })
    }

    async handleSubmit(event) {
        event.preventDefault()

        const endpointAPI = `${urlBackend}api/categorias/`

        const body = {
            idUser: userID(),
            dependencia: this.state.dependenciaInput,
            descrCategoria: this.state.descrCategoria,
            nivel: this.state.nivelInput,
            tipo: this.state.tipo,
            agregacao: "+",
            entrada: this.state.entradaInput,
            status: "Ativo"
        }

        if (body.dependencia.length === 0 | body.descrCategoria.length === 0 | body.nivel.length === 0 | body.tipo.length === 0 | body.entrada.length === 0) {

            const args = {
                message: 'Preencha todos os dados do Formulário',
                description:
                    'Para cadastrar uma nova categoria é necessário que seja informado todos os campos',
                duration: 5,
            };
            notification.open(args);
        } else if (body.entrada === '1' && body.NIVEL === '6') {
            const args = {
                message: 'Erro de Entrada de Dados',
                description:
                    'Ao escolher o nivel 6 o campo entrada passa a ser obrigatório ser de Input',
                duration: 10,
            };
            notification.open(args);
        } else {

            await axios.post(endpointAPI, body, config)

            const endpoint = `http://seplaneje-com.umbler.net/api/categorias/${userID()}`

            const novosDados = await axios.get(endpoint)

            if (novosDados.status === 200) {
                message.success("   Cadastro Efetuado Com Sucesso", 5);

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

                this.props.listCategorys(nivel)

                this.handleCancel()
            } else {
                message.error(" Erro ao tentar efetuar cadastro " + novosDados.status, 5);
            }
        }
    }


    render() {
        return (
            <div>
                <Icon type="plus-circle" style={{ fontSize: '36px', color: '#08c' }} title='Adicionar nova Categoria' theme="twoTone" onClick={this.showModal} />


                <form onSubmit={this.handleSubmit}>
                    <Modal
                        title="Cadastrar Nova Categoria"
                        visible={this.state.visible}
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                        <Input name='categoria' value={this.state.descrCategoria} onChange={this.handleDescrCategoria} placeholder="Informe o nome da Categoria" />
                        <Select style={{ width: '80%' }} placeholder="Informe o Tipo de Categoria" onSelect={this.handleTipo} value={this.state.tipo}>
                            <Option value="1">Despesa</Option>
                            <Option value="2">Receita</Option>
                        </Select>

                        <Select style={{ width: '20%' }} placeholder="Informe o Nivel de Categoria" onSelect={this.handleNivel} value={this.state.nivelInput}>
                            <Option value="3">3</Option>
                            <Option value="4">4</Option>
                            <Option value="5">5</Option>
                            <Option value="6">6</Option>
                        </Select>

                        <Select style={{ width: '100%' }} placeholder="Esta Categoria devera agregar em qual?" value={this.state.dependenciaInput} onSelect={this.handleDependencia}>
                            {this.state.dependencia}
                        </Select>

                        <Select value={this.state.entradaInput} style={{ width: '100%' }} placeholder="Esta conta deverá ser de consolidação ou Input?" onSelect={this.handleEntrada}>
                            <Option value="1">Conta Consolidacao</Option>
                            <Option value="0">Conta Input</Option>
                            <Option value="disabled" disabled> Disabled </Option>
                        </Select>
                    </Modal>
                </form>
            </div >
        )
    }
}

const mapStateToProps = (state/*, ownProps*/) => {
    return {
        category: state.category,
    }
}

const mapDispatchToProps = { listCategorys }


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalCategory)