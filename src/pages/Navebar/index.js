import React from 'react'
import { Link } from 'react-router-dom'
import 'antd/dist/antd.css';
import './style.scss'

import { Layout, Menu, Icon } from 'antd'

const { Sider } = Layout;
const { SubMenu } = Menu;

class SiderDemo extends React.Component {
    state = {
        collapsed: false,
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    render() {
        return (
            // <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                {/* <div className="logo" /> */}
                <div />
                {/* <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline"> */}
                <Menu defaultSelectedKeys={['1']} mode="inline">
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                <Icon type="tool" theme="twoTone" />
                                <span>Cadastros</span>
                            </span>
                        }
                    >
                        <Menu.Item key="3"><Link to='/categoria'>Categorias</Link></Menu.Item>
                        <Menu.Item key="4"><Link to='/selectconta'>Contas</Link></Menu.Item>
                        <Menu.Item key="5"><Link to='/selectcartao'>Cartões</Link></Menu.Item>
                        <Menu.Item key="6"><Link to='/visao'>Visões</Link></Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub2"
                        title={
                            <span>
                                <Icon type="schedule" theme="twoTone" />
                                <span>Previsto</span>
                            </span>
                        }
                    >
                        <Menu.Item key="7">Planejar Despesas</Menu.Item>
                        <Menu.Item key="8">Planejar Receitas</Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub3"
                        title={
                            <span>
                                <Icon type="check-square" theme="twoTone" />
                                <span>Real</span>
                            </span>
                        }
                    >
                        <Menu.Item key="9">Despesas</Menu.Item>
                        <Menu.Item key="10">Faturas</Menu.Item>
                        <Menu.Item key="11">Receitas</Menu.Item>
                        <Menu.Item key="12">Transferências</Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub4"
                        title={
                            <span>
                                <Icon type="pie-chart" theme="twoTone" />
                                <span>Resumo</span>
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
                                <Icon type="file" />
                                <span>Manual (Ajuda)</span>
                            </span>
                        }
                    >
                    </SubMenu>
                    {/* <Menu.Item key="16">
                        <Icon type="file" />
                        <span>Manual (Ajuda)</span>
                    </Menu.Item> */}
                </Menu>
            </Sider>
            // </Layout>
        );
    }
}

export default SiderDemo
