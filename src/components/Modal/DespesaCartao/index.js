import React from 'react'
// import { connect } from 'react-redux'

// import axios from 'axios'
import { Modal, Select, DatePicker } from 'antd'
import { CreditCardOutlined } from '@ant-design/icons';
import moment from 'moment';

// import { urlBackend, config, userID } from '../../../routes/urlBackEnd'
import { loadConta } from '../../ListagemCombo'

import 'antd/dist/antd.css';
import './styles.scss'


const dateFormat = 'DD/MM/YYYY'


class ModalExpense extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            conta: [],
            valorRealInput: this.props.data.VL_REAL,
            dataRealInput: null,
            contaInput: this.props.data.DESCR_CONTA === null ? [] : this.props.data.ID_CONTA,
        }

        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDataReal = this.handleDataReal.bind(this)
        this.handleConta = this.handleConta.bind(this)
    }

    async showModal() {
        const resultConta = await loadConta()

        this.setState({
            ...this.state,
            conta: resultConta,
            visible: true
        })
    };

    handleCancel() {
        this.setState({
            ...this.state,
            visible: false
        })
    };

    handleDataReal(date, dateString) {
        this.setState({ ...this.state, dataRealInput: dateString })
    }

    handleConta(acount) {
        this.setState({ ...this.state, contaInput: acount })
    }

    async handleSubmit(event) {
        event.preventDefault()

    }

    render() {

        return (
            <div>
                <CreditCardOutlined style={{ fontSize: '38px', color: '#08c' }} title='Pagar Cartão' theme="twoTone" onClick={this.showModal} />
                <form onSubmit={this.handleSubmit}>
                    <Modal
                        title={`FATURA ${this.props.data.ID}`}
                        visible={this.state.visible}
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                        <div>
                            <label style={{ width: '99%', fontSize: '18px' }}>
                                <strong>Total da Fatura:</strong> R$ {this.state.valorRealInput}
                            </label>
                        </div>
                        <DatePicker style={{ width: '49%' }}
                            onChange={this.handleDataReal}
                            placeholder="Data Executada"
                            defaultValue={moment(this.props.data.FATURA, "YYYY/MM/DD")}
                            format={dateFormat}
                        />
                        <Select
                            showSearch
                            style={{ width: '49%' }}
                            placeholder="Informe o Conta"
                            optionFilterProp="children"
                            filterOption={(input, option) => (
                                option.props.children.toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            )}
                            onSelect={this.handleConta}
                            value={this.state.contaInput}
                        >
                            {this.state.conta}
                        </Select>

                    </Modal>
                </form>
            </div >
        )
    }
}


export default ModalExpense