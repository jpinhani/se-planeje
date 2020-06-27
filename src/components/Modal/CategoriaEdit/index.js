import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Icon, Modal, Input, Select, notification, message, Spin } from 'antd'
import { listCategorys } from '../../../store/actions/generalCategoryAction'
import { urlBackend, config, userID } from '../../../services/urlBackEnd'
import 'antd/dist/antd.css';
import './styles.scss'

const { Option } = Select;

class ModalCategory extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            visible: false, //Controla a Visibilidade do Formulário
            spin: false,

            dependenciaInput: this.props.data.PAI,// Controla o Input da Combo quando Seleciona manualmente pelo usuário
            dependencia: [],//Controla o estado de carregamento da combo => recebe <Option>,

            descrCategoria: this.props.data.DESCR_CATEGORIA, //Controla o Estado de Descrição ou nome da Categoria a ser enviada

            nivelInput: this.props.data.NIVEL, //Controla o Input de Nivel
            nivel: this.props.data.NIVEL,

            tipo: this.props.data.TIPODESCR,

            entrada: this.props.data.ENTRADADESCR,// this.props.data.ENTRADADESCR,
            entradaInput: this.props.data.ENTRADADESCR,// this.props.data.ENTRADADESCR,

            alterTipo: this.props.data.TIPO,
            alterEntrada: this.props.data.ENTRADA,
            alterDependencia: this.props.data.IDPAI,
            alterId: this.props.data.ID
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
            ...this.state, visible: false
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
        const tipoSelecionado = () => this.state.tipo === 'DESPESA' ? 1 : 2
        const nivelSelecionado = evento


        if ((tipoSelecionado() === 1) | (tipoSelecionado() === 2)) {
            this.ComboDependencia(tipoSelecionado(), nivelSelecionado)
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

        const result = await axios.get(endpoint, config())

        const options = result.data.map((desc, i) =>
            <Option key={i} value={desc.ID}>
                {desc.DESCR_CATEGORIA}
            </Option>
        )
        this.setState({ ...this.state, dependencia: options })
    }

    async handleSubmit(event) {
        event.preventDefault()

        this.setState({ ...this.state, spin: true })
        const endpointAPI = `${urlBackend}api/categorias/`


        const updateTipoValue = () => this.state.tipo === 'DESPESA' | this.state.tipo === 'RECEITA' ? this.state.alterTipo : this.state.tipo
        const updateEntradaValue = () => this.state.entradaInput.length > 2 ? this.state.alterEntrada : this.state.entradaInput
        const updateDepenciaValue = () => this.state.dependenciaInput.length > 2 ? this.state.alterDependencia : this.state.dependenciaInput

        const body = {
            id: this.state.alterId,
            idUser: userID(),
            dependencia: updateDepenciaValue(),
            descrCategoria: this.state.descrCategoria,
            nivel: this.state.nivelInput,
            tipo: updateTipoValue(),
            agregacao: "+",
            entrada: updateEntradaValue(),
            status: "Ativo"
        }

        if (body.dependencia.length === 0 | body.descrCategoria.length === 0 | body.nivel.length === 0 | body.tipo.length === 0 | body.entrada.length === 0) {

            const args = {
                message: 'Preencha todos os dados do Formulário',
                description:
                    'Para editar a categoria é necessário que seja informado todos os campos',
                duration: 5,
            };
            notification.open(args);
            this.setState({ ...this.state, spin: false })
        } else if (body.entrada === '1' && body.nivel === '6') {
            const args = {
                message: 'Erro de Entrada de Dados',
                description:
                    'Ao escolher o nivel 6 o campo entrada passa a ser obrigatório ser de Input',
                duration: 10,
            };
            notification.open(args);
            this.setState({ ...this.state, spin: false })
        } else {

            await axios.put(endpointAPI, body, config())

            const endpoint = `${urlBackend}api/categorias/${userID()}`

            const novosDados = await axios.get(endpoint, config())

            if (novosDados.status === 200) {
                message.success(" Categoria Editada Com Sucesso", 5);

                // console.log(novosDados)
                const nivel3 = novosDados.data.filter((DATA) => DATA.NIVEL === 3)
                const nivel4 = novosDados.data.filter((DATA) => DATA.NIVEL === 4)
                const nivel5 = novosDados.data.filter((DATA) => DATA.NIVEL === 5)
                const nivel6 = novosDados.data.filter((DATA) => DATA.NIVEL === 6)

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

                this.setState({ ...this.state, spin: false })
                this.props.listCategorys(nivel)

                this.handleCancel()
            } else {
                message.error(" Erro ao Editar Registo, Erro " + novosDados.status, 5);
                this.setState({ ...this.state, spin: false })
            }
        }
    }

    render() {
        return (
            <div>
                <Icon type="edit" style={{ fontSize: '18px', color: '#08c' }} title='Adicionar nova Categoria' theme="twoTone" onClick={this.showModal} />
                <form onSubmit={this.handleSubmit}>
                    <Modal
                        title="Cadastrar Nova Categoria"
                        visible={this.state.visible}
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                        className="ModalCadastro"
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
                        </Select>
                        <Spin size="large" spinning={this.state.spin} />
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