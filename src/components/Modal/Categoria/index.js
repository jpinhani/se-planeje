import React from 'react'
import { connect } from 'react-redux'

import axios from 'axios'
import { Icon, Modal, Input, Select, notification, message, Spin } from 'antd'

import { listCategorys } from '../../../store/actions/generalCategoryAction'
import { InsertRequest, GetRequest } from '../../crudSendAxios/crud'

import { urlBackend, userID, config } from '../../../services/urlBackEnd'

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
            spin: false
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
            this.setState({ ...this.state, spin: false })
        } else if (body.entrada === '1' && body.NIVEL === '6') {
            const args = {
                message: 'Erro de Entrada de Dados',
                description:
                    'Ao escolher o nivel 6 o campo entrada passa a ser obrigatório ser de Input',
                duration: 10,
            };
            notification.open(args);
            this.setState({ ...this.state, spin: false })
        } else {
            const insertCategoria = await InsertRequest(body, 'api/categorias/')

            if (insertCategoria.status === 402)
                return notification.open({
                    message: 'SePlaneje - Problemas Pagamento',
                    duration: 20,
                    description:
                        `Poxa!!! 
                        Foram identificados problemas com o pagamento da sua assinatura, acesse a página de Pagamento ou entre em contato conosco...`,
                    style: {
                        width: '100%',
                        marginLeft: 335 - 600,
                    },
                });
            const novosDados = await GetRequest('api/categorias')

            if (insertCategoria === 200) {
                message.success("   Cadastro Efetuado Com Sucesso", 5);

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

                this.setState({ ...this.state, spin: false })
                this.props.listCategorys(nivel)

                this.handleCancel()
            } else {
                message.error(" Erro ao tentar efetuar cadastro " + novosDados.status, 5);
                this.setState({ ...this.state, spin: false })
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
                            <Option value="disabled" disabled> Disabled </Option>
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