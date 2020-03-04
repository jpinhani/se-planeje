import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Icon, Modal, Input, Select } from 'antd'
import { listCategorys } from '../../../store/actions/generalCategoryAction'
import 'antd/dist/antd.css';
import './styles.scss'

const { Option } = Select;
// const teste = []
class ModalCategory extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            options: [],
            dependencia: [],
            descrCategoria: '',
            nivel: '',
            tipo: '',
            agregacao: '',
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
        this.handleAgregacao = this.handleAgregacao.bind(this)
        this.handleEntrada = this.handleEntrada.bind(this)
    }

    /* -------------------------------------  Comandos para Funcionamento do Modal*/
    showModal() { this.setState({ ...this.state, visible: true }) };

    handleCancel() { this.setState({ ...this.state, visible: false }) };
    /* -------------------------------------  Comandos para Funcionamento do Modal*/


    /* -------------------------------------  Comandos para alteração de estado dos campos do Formulário*/
    handleDependencia(eventos) {
        this.setState({ ...this.state, options: eventos })
    }
    handleDescrCategoria(event) {
        this.setState({ ...this.state, descrCategoria: event.target.value })
    }
    handleNivel(evento) {
        this.setState({ ...this.state, nivel: evento })
        // this.setState({ ...this.state, dependencia: [] })
    }
    handleTipo() {
        // this.setState({ ...this.state, dependencia: [] })


        this.setState({ ...this.state, entrada: [], /* dependencia: [], */ options: [] })
    }
    handleAgregacao(event) {
        this.setState({ ...this.state, agregacao: event.target.value })
    }
    handleEntrada(evento) {
        this.setState({ ...this.state, entrada: evento })
    }
    /* -------------------------------------  Comandos para alteração de estado dos campos do Formulário*/

    componentDidMount() { this.teste() }

    async teste() {
        const userID = localStorage.getItem('userId')
        const endpoint = `http://localhost:8082/api/categorias/${userID}`

        const result = await axios.get(endpoint)


        const options = result.data.map((desc, i) =>
            <Option key={i} value={desc.DESCR_CATEGORIA}>
                {desc.DESCR_CATEGORIA}
            </Option>
        )
        this.setState({ ...this.state, dependencia: options })
        this.setState({ ...this.state, entrada: [] })
    }



    async handleSubmit(event) {
        event.preventDefault()

        const endpointAPI = 'http://localhost:8082/api/categorias/'

        const body = {
            idUser: localStorage.getItem('userId'),
            dependencia: this.state.dependencia,
            descrCategoria: this.state.descrCategoria,
            nivel: this.state.nivel,
            tipo: this.state.tipo,
            agregacao: this.state.agregacao,
            entrada: this.state.entrada,
            status: "Ativo"
        }

        await axios.post(endpointAPI, body)

        const userID = localStorage.getItem('userId')
        const endpoint = `http://localhost:8082/api/categorias/${userID}`

        const result = await axios.get(endpoint)
        const categorys = result.data

        this.props.listCategorys(categorys)

        this.setState({ ...this.state, visible: false })
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
                        <Select style={{ width: '80%' }} placeholder="Informe o Tipo de Categoria" onSelect={this.handleTipo}>
                            <Option value="despesa">Despesa</Option>
                            <Option value="receita">Receita</Option>
                        </Select>

                        <Select style={{ width: '20%' }} placeholder="Informe o Nivel de Categoria" onChange={this.onChangeNivel}>
                            <Option value="2">2</Option>
                            <Option value="3">3</Option>
                            <Option value="4">4</Option>
                            <Option value="5">5</Option>
                        </Select>

                        <Select style={{ width: '80%' }} placeholder="Esta Categoria devera agregar em qual?" value={this.state.options} onSelect={this.handleDependencia}>
                            {this.state.dependencia}
                        </Select>


                        <Select style={{ width: '20%' }} placeholder="Qual o Tipo de Agregação?" onChange={this.onChange}>
                            <Option value="mais">+</Option>
                            <Option value="menos">-</Option>
                        </Select>

                        <Select value={this.state.entrada} style={{ width: '100%' }} placeholder="Esta conta deverá ser de consolidação ou Input?" onSelect={this.handleEntrada}>
                            <Option value="consolidacao">Conta Consolidacao</Option>
                            <Option value="input">Conta Input</Option>
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

const VisibleTodoList = connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalCategory)



export default VisibleTodoList 