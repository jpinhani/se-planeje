import React from 'react'

import Nature from '../Nature/index.js'

import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb, Icon } from 'antd'

const { Header, Content, Footer, Sider } = Layout;
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
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            {/* <Menu.Item key="1">
              <Icon type="pie-chart" />
              <span>Option 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="desktop" />
              <span>Option 2</span>
            </Menu.Item> */}
            <SubMenu
              key="sub1"
              title={
                <span>
                  {/* <Icon type="cadastros" /> */}
                  <span>Cadastros</span>
                </span>
              }
            >
              <Menu.Item key="3">Categorias</Menu.Item>
              <Menu.Item key="4">Contas</Menu.Item>
              <Menu.Item key="5">Cartões</Menu.Item>
              <Menu.Item key="6">Visões</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <span>
                  {/* <Icon type="team" /> */}
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
                  {/* <Icon type="team" /> */}
                  <span>Real</span>
                </span>
              }
            >
              <Menu.Item key="9">Despesas</Menu.Item>
              <Menu.Item key="10">Faturas</Menu.Item>
              <Menu.Item key="11">Receitas</Menu.Item>
              <Menu.Item key="12">Transferências</Menu.Item>
            </SubMenu>
            <Menu.Item key="13">
              <Icon type="file" />
              <span>Manual (Ajuda)</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              {/* <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>  */}
              <Nature />
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>Bill is a cat.</div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default SiderDemo