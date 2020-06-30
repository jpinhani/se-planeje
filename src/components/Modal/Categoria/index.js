import React from 'react'
import { connect } from 'react-redux'

import { Icon, Modal, Input, Select, notification, message, Spin } from 'antd'

import { listCategorys } from '../../../store/actions/generalCategoryAction'
import { InsertRequest, GetRequest } from '../../crudSendAxios/crud'

import { userID } from '../../../services/urlBackEnd'

import 'antd/dist/antd.css';
import './styles.scss'

const { Option } = Select;

class ModalCategory extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            dependenciaInput: this.props.data ? this.props.data.ID : [],
            dependencia: [],
            descrCategoria: '',
            nivelInput: this.props.data ? this.props.data.NIVEL + 1 : [],
            nivel: [],
            tipo: this.props.data ? this.props.data.TIPO : [],
            entrada: [],
            entradaInput: this.props.data ? ((this.props.data.NIVEL + 1) === 6) ? 'Categoria de Input' : [] : [],
            spin: false,
            disabled: this.props.data ? ((this.props.data.NIVEL + 1) === 6) ? true : false : false,
        }

        this.showModal = this.showModal.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDescrCategoria = this.handleDescrCategoria.bind(this)
        this.handleEntrada = this.handleEntrada.bind(this)
    }

    showModal() { this.setState({ ...this.state, visible: true }) };

    handleDescrCategoria(event) {
        this.setState({ ...this.state, descrCategoria: event.target.value })
    }

    handleEntrada(evento) {
        this.setState({ ...this.state, entradaInput: evento })
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

                const nivelMaxDespesa = [{
                    DESCR_CATEGORIA: 'DESPESA',
                    NIVEL: 2,
                    TIPO: 1,
                    TIPODESCR: 'DESPESA',
                    ENTRADA: 1,
                    ENTRADADESCR: 'Categoria de Consolidação',
                    AGREGACAO: "+",
                    DEPENDENCIA: 1,
                    ID: 2,
                    IDPAI: 1,
                    STATUS: "Ativo",
                    children: nivel.filter(filtro => filtro.TIPO === 1)
                }]

                const nivelMaxReceita = [{
                    DESCR_CATEGORIA: 'RECEITA',
                    NIVEL: 2,
                    TIPO: 2,
                    TIPODESCR: 'RECEITA',
                    ENTRADA: 1,
                    ENTRADADESCR: 'Categoria de Consolidação',
                    AGREGACAO: "+",
                    DEPENDENCIA: 1,
                    ID: 3,
                    IDPAI: 1,
                    STATUS: "Ativo",
                    children: nivel.filter(filtro => filtro.TIPO === 2)
                }]

                this.setState({ ...this.state, spin: false })

                this.props.listCategorys([...nivelMaxDespesa, ...nivelMaxReceita])

                this.setState({
                    ...this.state, visible: false
                })


            } else {
                message.error(" Erro ao tentar efetuar cadastro " + novosDados.status, 5);
                this.setState({ ...this.state, spin: false })
            }
        }
    }


    render() {
        return (
            <div>
                <Icon type="plus-circle" style={{ fontSize: '18px', color: '#08c' }} title='Adicionar nova Categoria' theme="twoTone" onClick={this.showModal} />


                <form onSubmit={this.handleSubmit}>
                    <Modal
                        title="Cadastrar Nova Categoria"
                        visible={this.state.visible}
                        onOk={this.handleSubmit}
                        onCancel={() => this.setState({ ...this.state, visible: false })}
                        className="ModalCadastro"
                    >
                        <Input name='categoria' value={this.state.descrCategoria} onChange={this.handleDescrCategoria} placeholder="Informe o nome da Categoria" />

                        <Select disabled={this.state.disabled} value={this.state.entradaInput} style={{ width: '100%' }} placeholder="Esta conta deverá ser de consolidação ou Input?" onSelect={this.handleEntrada}>
                            <Option value="1">Categoria de Consolidação</Option>
                            <Option value="0">Categoria de Input</Option>
                        </Select>
                        <Spin size="large" spinning={this.state.spin} />
                    </Modal>
                </form>
            </div >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        category: state.category,
    }
}

const mapDispatchToProps = { listCategorys }


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalCategory)