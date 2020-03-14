import React from 'react'
import { connect } from 'react-redux'
// import axios from 'axios'
import { Icon, Modal, Input, Select, DatePicker, InputNumber } from 'antd'
import { listExpenses } from '../../../store/actions/generalExpenseAction'
import 'antd/dist/antd.css';
import './styles.scss'


const { Option } = Select;
const { TextArea } = Input;

class ModalExpense extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
        }

        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    showModal() { this.setState({ ...this.state, visible: true }) };

    handleCancel() {
        this.setState({ ...this.state, visible: false })
    };


    async handleSubmit(event) {
        event.preventDefault()

        // this.props.listCategorys(categorys)
        this.handleCancel()
    }

    onChange(date, dateString) {
        console.log(date, dateString);
    }


    render() {
        return (
            <div>
                <Icon type="plus-circle" style={{ fontSize: '36px', color: '#08c' }} title='Adicionar nova Despesa Prevista' theme="twoTone" onClick={this.showModal} />


                <form onSubmit={this.handleSubmit}>
                    <Modal
                        title="Cadastrar Despesa Prevista"
                        visible={this.state.visible}
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                        <Input style={{ width: '49%' }} placeholder="Valor Previsto" />
                        <DatePicker style={{ width: '49%' }} onChange={this.onChange} format="DD-MM-YYYY" placeholder="Data Prevista" />

                        <Select style={{ width: '65%' }} placeholder="Informe o Cartão" onSelect={this.handleTipo}>
                            <Option value="1">Despesa</Option>
                            <Option value="2">Receita</Option>
                        </Select>

                        <InputNumber style={{ width: '35%' }} placeholder='N Parcelas' min='1' defaultValue='1' />

                        <Select style={{ width: '99%' }} placeholder="Informe a Categoria" onSelect={this.handleTipo}>
                            <Option value="1">Despesa</Option>
                            <Option value="2">Receita</Option>
                        </Select>

                        <TextArea placeholder="Descreva a Despesa" style={{ width: '99%' }} rows={4} />

                    </Modal>
                </form>
            </div >
        )
    }
}

const mapStateToProps = (state/*, ownProps*/) => {
    return {
        expense: state.expense,
    }
}

const mapDispatchToProps = { listExpenses }


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalExpense)