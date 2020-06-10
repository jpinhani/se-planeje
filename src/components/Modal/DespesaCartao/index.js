import React from 'react'
import { connect } from 'react-redux'

import { Modal, Select, DatePicker, Form, Tabs, Table, Button } from 'antd'
import { CreditCardOutlined } from '@ant-design/icons';

import FaturaPagar from '../../../components/Modal/DespesaCartao'
import { InsertRequest } from '../../crudSendAxios/crud'
import { verifySend } from '../../verifySendAxios/index'
import { userID, urlBackend, config } from '../../../services/urlBackEnd'

import { listFaturaPaga } from '../../../store/actions/generalFaturaAction'
import { listFaturadetalhe } from '../../../store/actions/generalFaturaDetalheAction'

import axios from 'axios'

import moment from 'moment';

import { loadConta } from '../../ListagemCombo'

import 'antd/dist/antd.css';
import './styles.scss'

const dateFormat = 'DD/MM/YYYY'
const { TabPane } = Tabs;

class ModalExpense extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            conta: [],
            valorRealInput: this.props.data.VL_REAL,
            dataRealInput: moment(this.props.data.FATURA, "YYYY/MM/DD"),
            contaInput: this.props.data.DESCR_CONTA === null ? [] : this.props.data.ID_CONTA,
        }

        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDataReal = this.handleDataReal.bind(this)
        this.handleConta = this.handleConta.bind(this)
    }


    columns() {
        return [
            {
                title: 'REF',
                dataIndex: 'ID',
                key: 'ID2',
            },
            {
                title: 'DETALHE',
                dataIndex: 'DESCR_DESPESA',
                key: 'DESCR_DESPESA',
            },
            {
                title: 'CARD',
                dataIndex: 'CARTAO',
                key: 'CARTAO',
            },
            {
                title: 'VENCIMENTO',
                dataIndex: 'FATURA',
                key: 'FATURA',
            },
            {
                title: 'R$ PREVISTO',
                dataIndex: 'VL_PREVISTO',
                key: 'VL_PREVISTO',
            },
            {
                title: 'R$ REAL',
                dataIndex: 'VL_REAL',
                key: 'VL_REAL',
            },
            {
                title: 'ST',
                dataIndex: 'STATUS',
                key: 'STATUS',
            }
        ]
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

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err) => {
            if (!err) this.handleSubmitok()
        });
    }
    async handleSubmitok() {
        const body = {
            idUser: userID(),
            id: this.props.data.ID,
            conta: this.state.contaInput,
            dataReal: this.state.dataRealInput
        }

        const data = moment(body.dataReal, "DD/MM/YYYY");
        body.dataReal = data.format("YYYY-MM-DD")


        const result = await InsertRequest(body, 'api/despesas/fatura')
        verifySend(result, 'INSERT', `Pagamento de Fatura ${body.id}`)

        if (result === 200) {
            // const listCard = await GetRequest('api/despesas/fatura')
            // this.props.listFaturaPaga(listCard)
            this.requestAPI()
            this.handleCancel()

        }

    }

    async listCardItens(fatura, detalhe) {

        const dadosFatura = fatura.map((ID, a) => (

            < TabPane tab={`${ID.ID}`} key={a} >
                <Table className='table table-action'
                    title={() => <div style={{ display: 'flex' }}>
                        <div style={{ width: '100%', color: 'blue', fontSize: '14px' }}><h2>Fatura Atual:</h2> R$ {ID.VL_REAL !== null ? ID.VL_REAL : 0.00} </div>
                        <br />
                        <div style={{ width: '100%', color: 'red', fontSize: '14px' }}><h2>Fatura Estimada: </h2> R$ {ID.VL_FORECAST}</div>
                        <br />
                        <div style={{ width: '100%', color: 'red', fontSize: '14px' }}>
                            <FaturaPagar data={ID} />
                        </div>
                    </div>}

                    style={{ height: '100%' }}
                    columns={this.columns()}
                    dataSource={detalhe.filter((DATA) => (
                        DATA.ID === ID.ID
                    ))}
                    rowKey={ID => ID.ID_DESPESA}
                />
            </TabPane >

        )
        )
        // this.setState({ ...this.state, detalheFaturaList: dadosFatura })
        this.props.listFaturadetalhe(dadosFatura)
    }

    async requestAPI() {

        const endpointAPI = `${urlBackend}api/despesas/fatura/${userID()}`
        const result = await axios.get(endpointAPI, config())
        const fatura = result.data

        const endpointAPIDetalhe = `${urlBackend}api/despesas/faturadetalhe/${userID()}`
        const resultDetalhe = await axios.get(endpointAPIDetalhe, config())
        const detalhe = resultDetalhe.data

        const unique = new Set(fatura.map((DATA) => DATA.CARTAO))

        const cardNew = Array.from(unique).map((DATA, i) =>
            <Button value={i}
                key={i}
                ghost
                type='primary'
                onClick={() => this.listCardItens(fatura.filter((DADOS) => DADOS.CARTAO === DATA), detalhe)} > {DATA}</Button>
        )

        // this.setState({ ...this.state, seletorCard: cardNew })
        this.props.listFaturaPaga(cardNew)
        this.props.listFaturadetalhe([])


    }

    render() {
        const { getFieldDecorator } = this.props.form;
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
                                <strong>Total da Fatura:</strong> R$ {this.state.valorRealInput !== null ? this.state.valorRealInput : 0}
                            </label>
                        </div>
                        <div style={{ width: '100%', display: 'flex' }}>
                            <Form.Item style={{ width: '50%' }}>
                                {getFieldDecorator('dtreal', {
                                    rules: [{ required: true, message: 'informe a Data de Pagamento da Fatura!' }],
                                    initialValue: moment(this.props.data.FATURA, "YYYY/MM/DD")
                                })(
                                    <DatePicker style={{ width: '100%' }}
                                        onChange={this.handleDataReal}
                                        placeholder="Data Executada"
                                        format={dateFormat}
                                    />)}
                            </Form.Item>
                            <Form.Item style={{ width: '50%' }}>
                                {getFieldDecorator('conta', {
                                    rules: [{ required: true, message: 'Informe a Conta!' }],
                                    initialValue: this.state.contaInput
                                })(
                                    <Select
                                        showSearch
                                        style={{ width: '100%' }}
                                        placeholder="Informe o Conta"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => (
                                            option.props.children.toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        )}
                                        onSelect={this.handleConta}
                                    >
                                        {this.state.conta}
                                    </Select>)}
                            </Form.Item>
                        </div>
                    </Modal>
                </form>
            </div >
        )
    }
}

const WrappedApp = Form.create({ name: 'coordinated' })(ModalExpense);

const mapStateToProps = (state /*, ownProps*/) => {
    return {
        fatura: state.fatura,
        detalheFatura: state.detalheFatura,
    }
}

const mapDispatchToProps = { listFaturaPaga, listFaturadetalhe }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedApp)