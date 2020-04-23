import React from 'react'
import { connect } from 'react-redux'

import FaturaPagar from '../../components/Modal/DespesaCartao';
import { Tabs, Table, Button } from 'antd';
import { urlBackend, userID } from '../../routes/urlBackEnd'

import { Link } from 'react-router-dom'

import { listFaturaPaga } from '../../store/actions/generalFaturaAction'
import { listFaturadetalhe } from '../../store/actions/generalFaturaDetalheAction'
import { colapseMenu } from '../../store/actions/generalSiderAction'

// import { Card } from 'antd';
import axios from 'axios'

import 'antd/dist/antd.css';
import './styles.scss'

const { TabPane } = Tabs;

// const gridStyle = {
//     width: '25%',
//     textAlign: 'center',
// };

class SelectFaturaPagar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            mode: 'right',
            detalheFaturaList: '',
            seletorCard: [],
            dados: null
        };

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
                            {console.log(ID)}
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
        const result = await axios.get(endpointAPI)
        const fatura = result.data

        const endpointAPIDetalhe = `${urlBackend}api/despesas/faturadetalhe/${userID()}`
        const resultDetalhe = await axios.get(endpointAPIDetalhe)
        const detalhe = resultDetalhe.data

        const unique = new Set(fatura.map((DATA) => DATA.CARTAO))
        const cardNew = Array.from(unique).map((DATA, i) => <Button value={i}
            key={i}
            ghost
            type='primary'
            onClick={() => this.listCardItens(fatura.filter((DADOS) => DADOS.CARTAO === DATA), detalhe)} > {DATA}</Button>)

        // this.setState({ ...this.state, seletorCard: cardNew })
        this.props.listFaturaPaga(cardNew)
        this.props.listFaturadetalhe([])

    }

    componentDidMount() {
        this.requestAPI()
        this.props.colapseMenu(true)
    }


    componentWillUnmount() {
        this.props.colapseMenu(false)
    }

    render() {

        return (
            <div>
                < div style={{ margin: '16px 0', background: '#DCDCDC' }}>
                    <Link to='selectPagarMeta'><Button key='Met'> Metas</Button></Link>
                    <Link to='selectdespesarealizada'><Button key='Lnc'> Lançamentos</Button></Link>
                </div >
                <div style={{ padding: '15px', fontSize: '16px', background: '#87CEFA' }}>Resumo de Lançamentos no Cartão</div>
                <div className='cards'>
                    {this.props.fatura}
                </div>
                <Tabs className='tabs__list'
                    defaultActiveKey="1"
                    tabPosition={this.state.mode}
                    style={{ height: '100%', width: '100%', diplay: 'flex' }}>
                    {this.props.detalheFatura}
                </Tabs>

            </div >
        )
    }
}

const mapStateToProps = (state /*, ownProps*/) => {
    return {
        fatura: state.fatura,
        detalheFatura: state.detalheFatura,
        siderMenu: state.siderMenu,
    }
}

const mapDispatchToProps = { listFaturaPaga, listFaturadetalhe, colapseMenu }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectFaturaPagar)
