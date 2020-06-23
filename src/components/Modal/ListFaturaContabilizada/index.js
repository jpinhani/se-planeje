import React from 'react'
import { GetRequest } from '../../crudSendAxios/crud'

import { Timeline, Modal, notification } from 'antd';

import { OrderedListOutlined } from '@ant-design/icons';

import 'antd/dist/antd.css';
import './styles.scss'

class listCard extends React.Component {
    _isMounted = false
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            lancamentos: [],
            fatura: this.props.data.ID_FATURA
        }
        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
    }

    showModal() {

        this.setState({ ...this.state, visible: true })
        if (this._isMounted === true)
            this.requestApi()
    };

    handleCancel() {
        this.setState({ ...this.state, visible: false })
    };

    async requestApi() {
        const list = await GetRequest('api/fatura/detalhe')
        if (list.status === 402)
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
        const listNova = list.filter((data) => data.ID_FATURA === this.state.fatura)

        const timeline = listNova.map((data, i) =>
            <Timeline.Item key={i} >{data.DT_CREDITO2 + ' - ' + data.DESCR_DESPESA + ' - ' + data.VL_REAL2}</Timeline.Item>
            // <Timeline.Item key={i} style={{
            //     padding: '10px'
            // }}>{data.DT_PAGAMENTO2 + ' - ' + data.VL_REAL2}</Timeline.Item>
        )

        this.setState({ ...this.state, lancamentos: timeline })
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {
        return (
            <div>
                <div style={{ padding: '10px' }}>
                    <OrderedListOutlined style={{ fontSize: '18px', color: '#08c' }} onClick={this.showModal} />
                </div>
                <Modal className='ant-modal_Personalizado'
                    title={`Detalhes do cartão: ${this.props.data.ID_FATURA}`}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                >
                    <Timeline mode="alternate">
                        {this.state.lancamentos}
                    </Timeline>
                    <div style={{ width: '100%', justifyContent: 'left' }}><h1>Total de {this.props.data.VL_REAL2}</h1></div>

                </Modal>
            </div>
        )
    }
}

export default listCard