import React from 'react'
import { connect } from 'react-redux'
import { Table, Icon, Popconfirm } from 'antd'



import 'antd/dist/antd.css';
import './styles.scss'

class SelectDespesaPrevista extends React.Component {

    columns() {
        return [
            {
                title: 'Descrição Conta',
                dataIndex: 'DESCR_CONTA',
                key: 'DESCR_CONTA'
            },
            {
                title: 'Status',
                dataIndex: 'STATUS',
                key: 'STATUS'
            },
            {
                title: 'Action',
                key: 'action',

                render: despesaprevista => (
                    <div className='ModeloBotoesGrid'>
                        <span className='ModeloBotoesGridDetalhes' >
                            <Popconfirm title="Deletar Despesa?">
                                <Icon type="delete" title='Excluir Despesa' style={{ fontSize: '18px', color: '#08c' }} />
                            </Popconfirm>
                        </span>
                    </div>
                ),
            }
        ]
    }

    render() {
        return (
            <div>
                <div>

                </div>
                <div className='headerTable'>
                    <Table columns={this.columns()} dataSource={this.props.despesaprevista} rowKey='ID' />
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state /*, ownProps*/) => {
    return {
        despesaprevista: state.despesaprevista
    }
}

const mapDispatchToProps = { listAcounts }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectDespesaPrevista)