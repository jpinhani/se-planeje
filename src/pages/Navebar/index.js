import React from 'react'
import { connect } from 'react-redux'

import { Link } from 'react-router-dom'

import { colapseMenu } from '../../store/actions/generalSiderAction'

import 'antd/dist/antd.css';
import './style.scss'

import { Layout, Menu, Icon } from 'antd'

// import { Icon } from '@iconify/react';


const { Sider } = Layout;
const { SubMenu } = Menu;

class SiderDemo extends React.Component {
    state = {
        collapsed: false,
        visible: false,
    };

    onCollapse = collapsed => {
        this.setState({ collapsed });
        this.props.colapseMenu(collapsed)
    };

    componentDidMount() {
        this.props.colapseMenu(this.state.collapsed)

    }

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };


    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    render() {
        return (
            <div>
                {/* <Button type="primary" onClick={this.showDrawer}>
                    Open
        </Button> */}
                {/* <Drawer
                    title="SePlaneje"
                    width='235px'
                    placement='left'
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    getContainer={false}
                    style={{ position: 'absolute' }}
                > */}
                <Sider
                    collapsedWidth='0'
                    collapsible
                    collapsed={this.props.siderMenu}
                    onCollapse={this.onCollapse}
                    breakpoint='md'
                >

                    <div />
                    <Menu defaultSelectedKeys={['1']} mode="inline">
                        <SubMenu
                            key="sub1"
                            title={
                                <span>
                                    <Icon type="tool" theme="twoTone" style={{ fontSize: '28px' }} />
                                    <span style={{ paddingLeft: '10px' }}>Cadastros</span>
                                </span>
                            }
                        >
                            <Menu.Item key="3" >
                                <Link to='/selectcategoria'>
                                    <Icon type="schedule" twoToneColor='red' theme="twoTone" style={{ paddingLeft: '0', fontSize: '22px' }} />
                                    Categorias</Link></Menu.Item>
                            <Menu.Item key="4"><Link to='/selectconta'>Contas</Link></Menu.Item>
                            <Menu.Item key="5"><Link to='/selectcartao'>Cartões</Link></Menu.Item>
                            <Menu.Item key="6"><Link to='/visao'>Visões</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={
                                <span>
                                    <Icon type="schedule" theme="twoTone" style={{ fontSize: '28px' }} />
                                    <span style={{ paddingLeft: '10px' }} title='Registre nesse modulo suas Metas'>Metas</span>
                                </span>
                            }
                        >
                            <Menu.Item key="7"><Link to='/selectdespesaprevista'>
                                <Icon type="schedule" theme="twoTone" style={{ paddingLeft: '0', fontSize: '22px' }} />
                            Planejar Despesas
                            </Link></Menu.Item>

                            <Menu.Item key="8"><Link to='/selectreceitaprevista'>Planejar Receitas</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub3"
                            title={
                                <span>
                                    <Icon type="check-square" theme="twoTone" style={{ fontSize: '28px' }} />
                                    <span style={{ paddingLeft: '10px' }}>Real</span>
                                </span>
                            }
                        >

                            <Menu.Item key="9"><Link to='/selectPagarMeta'>Despesas</Link></Menu.Item>
                            <Menu.Item key="10"><Link to='/SelectFaturaContabilizada'>Faturas</Link></Menu.Item>
                            <Menu.Item key="11"><Link to='/teste'>Receitas</Link></Menu.Item>
                            <Menu.Item key="12">Transferências</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub4"
                            title={
                                <span>
                                    <Icon type="pie-chart" theme="twoTone" style={{ fontSize: '28px' }} />
                                    <span style={{ paddingLeft: '10px' }}>Resumo</span>
                                </span>
                            }
                        >
                            <Menu.Item key="13">Fluxo de Caixa</Menu.Item>
                            <Menu.Item key="14">Real x Previsto</Menu.Item>
                            <Menu.Item key="15">Forecast</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub5"
                            title={
                                <span>
                                    <Icon type="file" theme="twoTone" style={{ fontSize: '28px' }} />
                                    <span style={{ paddingLeft: '10px' }}>Manual</span>
                                </span>
                            }
                        >
                        </SubMenu>
                    </Menu>
                </Sider >
                {/* </Drawer> */}
            </div>
        );
    }
}


const mapStateToProps = (state /*, ownProps*/) => {
    return {
        siderMenu: state.siderMenu
    }
}

const mapDispatchToProps = { colapseMenu }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SiderDemo)

