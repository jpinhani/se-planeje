import React from 'react'
import { connect } from 'react-redux'

import FaturaPagar from '../../components/Modal/DespesaCartao';
import { Tabs, Table } from 'antd';
import { urlBackend, userID } from '../../routes/urlBackEnd'

import { listFaturaPaga } from '../../store/actions/generalFaturaAction'
import { listFaturadetalhe } from '../../store/actions/generalFaturaDetalheAction'

import axios from 'axios'

import 'antd/dist/antd.css';
import './styles.scss'

const { TabPane } = Tabs;

class SelectFaturaPagar extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props)

        this.state = {
            mode: 'right',
            detalheFaturaList: '',
            isLoading: true
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


    async requestAPI() {

        const endpointAPI = `${urlBackend}api/despesas/fatura/${userID()}`
        const result = await axios.get(endpointAPI)
        const fatura = result.data

        const endpointAPIDetalhe = `${urlBackend}api/despesas/faturadetalhe/${userID()}`
        const resultDetalhe = await axios.get(endpointAPIDetalhe)
        const detalhe = resultDetalhe.data

        this.props.listFaturaPaga(fatura)
        this.props.listFaturadetalhe(detalhe)

        const dadosFatura = this.props.fatura.map((ID, a) => (

            < TabPane tab={`${ID.ID}`} key={a} >
                <Table className='table table-action'
                    title={() => <div style={{ display: 'flex' }}>
                        <div style={{ width: '100%', color: 'blue', fontSize: '14px' }}><h2>Fatura Atual:</h2> R$ {ID.VL_REAL} </div>
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
                    dataSource={this.props.detalheFatura.filter((DATA) => (
                        DATA.ID === ID.ID
                    ))}
                    rowKey={ID => ID.ID_DESPESA}
                />
            </TabPane >
        )
        )

        this.setState({ ...this.state, detalheFaturaList: dadosFatura })
    }

    componentDidMount() {
        
        this._isMounted = true
        
        callAPI_or_DB(this.requestAPI()).then(result => {
          if (this._isMounted) {
            this.setState({isLoading: false})
          }
        });

        
    }

    componentWillUnmount() {
        this._isMounted = false;
      }

    // componentWillUnmount() {
    //     // fix Warning: Can't perform a React state update on an unmounted component
    //     this.setState = (state, callback) => {
    //         return;
    //     };
    // }

    render() {

        return (
            <div>
                <Tabs className='tabs__list'
                    defaultActiveKey="1"
                    tabPosition={this.state.mode}
                    style={{ height: '100%' }}>

                    {this.state.detalheFaturaList}
                </Tabs>
            </div >
        )
    }
}

const mapStateToProps = (state /*, ownProps*/) => {
    return {
        fatura: state.fatura,
        detalheFatura: state.detalheFatura
    }
}

const mapDispatchToProps = { listFaturaPaga, listFaturadetalhe }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectFaturaPagar)
