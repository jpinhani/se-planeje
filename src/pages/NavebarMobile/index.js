import React from 'react';

import { Link } from 'react-router-dom'

import { Menu, Icon, Drawer, Button } from 'antd'

import {
    HomeOutlined,
    // DislikeOutlined,
    // LikeOutlined,
    CalendarOutlined,
    CreditCardOutlined,
    WalletOutlined,
    FlagOutlined,
    SyncOutlined,
    UploadOutlined,
    DownloadOutlined,
    MenuOutlined,
    PlaySquareOutlined,
    LineChartOutlined,
    AreaChartOutlined
} from '@ant-design/icons'

import 'antd/dist/antd.css';
import './style.scss'

const { SubMenu } = Menu;
class App extends React.Component {
    state = { visible: false };

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
            <div className="site-drawer-render-in-current-wrapper">
                <div style={{ marginTop: 16 }}>
                    <MenuOutlined onClick={this.showDrawer} type="tool" theme="twoTone" style={{
                        lineheight: 1,
                        position: 'fixed',
                        zIndex: '1',
                        paddingLeft: '15px',
                        paddingTop: '80px',
                        fontSize: '32px', color: 'blue'
                    }} />

                </div>
                <Drawer
                    title={<Link to='/home' onClick={this.onClose}>
                        <div
                            style={{
                                paddingTop: '10px',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>

                            <HomeOutlined type="tool" theme="twoTone" style={{
                                paddingLeft: '26px',
                                fontSize: '28px', color: 'blue'
                            }} />
                            <p style={{
                                color: 'white',
                                fontWeight: 'bold',
                                paddingLeft: '15px',
                                fontSize: '20px'
                            }}><span style={{
                                color: 'red',
                                fontSize: '28px'
                            }}>Se</span>Planeje</p>

                        </div>
                    </Link>}
                    placement="left"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    getContainer={true}
                    width='80%'
                    style={{ position: 'fixed', height: '100%' }}
                >

                    <Menu defaultSelectedKeys={['0']} mode="inline">
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
                                <FlagOutlined theme="twoTone" style={{ paddingRight: '20px', fontSize: '22px', color: 'black' }} />
                                <Link to='/selectcategoria' onClick={this.onClose}>  Categorias</Link></Menu.Item>

                            <Menu.Item key="4">
                                <WalletOutlined theme="twoTone" style={{ paddingRight: '20px', fontSize: '22px', color: 'black' }} />
                                <Link to='/selectconta' onClick={this.onClose}> Contas</Link></Menu.Item>

                            <Menu.Item key="5">
                                <CreditCardOutlined theme="twoTone" style={{ paddingRight: '20px', fontSize: '22px', color: 'black' }} />
                                <Link to='/selectcartao' onClick={this.onClose}>  Cartões</Link></Menu.Item>

                            <Menu.Item key="6">
                                <CalendarOutlined theme="twoTone" style={{ paddingRight: '20px', fontSize: '22px', color: 'black' }} />
                                <Link to='/visao' onClick={this.onClose}>   Visões</Link></Menu.Item>
                        </SubMenu>

                        {/* <SubMenu
                            key="sub2"
                            title={
                                <span>
                                    <Icon type="schedule" theme="twoTone" style={{ fontSize: '28px' }} />
                                    <span style={{ paddingLeft: '10px' }} title='Registre nesse modulo suas Metas'>Metas</span>
                                </span>
                            }
                        >
                            <Menu.Item key="7">
                                <DislikeOutlined theme="twoTone" style={{ paddingRight: '20px', fontSize: '22px', color: 'red' }} />
                                <Link to='/selectdespesaprevista' onClick={this.onClose}>  Planejar Despesas
                            </Link></Menu.Item>

                            <Menu.Item key="8">
                                <LikeOutlined theme="twoTone" style={{ paddingRight: '20px', fontSize: '22px', color: 'blue' }} />
                                <Link to='/selectreceitaprevista' onClick={this.onClose}>  Planejar Receitas</Link></Menu.Item>
                        </SubMenu> */}
                        <SubMenu
                            key="sub3"
                            title={
                                <span>
                                    <Icon type="check-square" theme="twoTone" style={{ fontSize: '22px' }} />
                                    <span style={{ paddingLeft: '10px' }}>Transação</span>
                                </span>
                            }
                        >

                            <Menu.Item key="9">
                                <DownloadOutlined theme="twoTone" style={{ paddingRight: '20px', fontSize: '22px', color: 'red' }} />
                                <Link to='/selectPagarMeta' onClick={this.onClose}> Despesas</Link></Menu.Item>

                            <Menu.Item key="10">
                                <CreditCardOutlined theme="twoTone" style={{ paddingRight: '20px', fontSize: '22px', color: 'red' }} />
                                <Link to='/SelectFaturaContabilizada' onClick={this.onClose}> Faturas</Link></Menu.Item>

                            <Menu.Item key="11">
                                <UploadOutlined theme="twoTone" style={{ paddingRight: '20px', fontSize: '22px', color: 'blue' }} />
                                <Link to='/SelectReceitaMeta' onClick={this.onClose}>Receitas</Link></Menu.Item>

                            <Menu.Item key="12">
                                <SyncOutlined theme="twoTone" style={{ paddingRight: '20px', fontSize: '22px', color: 'black' }} />
                                <Link to='/SelectTransferencia' onClick={this.onClose}>Transferências</Link></Menu.Item>
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
                            <Menu.Item key="13">
                                <LineChartOutlined theme="twoTone" style={{ paddingRight: '20px', fontSize: '22px', color: 'black' }} />
                                <Link to='/Resumo' onClick={this.onClose}>Fluxo de Caixa</Link></Menu.Item>
                            <Menu.Item key="16">
                                <AreaChartOutlined theme="twoTone" style={{ paddingRight: '20px', fontSize: '22px', color: 'black' }} />
                                <Link to='/Indicadores'>Indicadores</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub5"
                            title={
                                <span>
                                    <Icon type="file"
                                        theme="twoTone" style={{ fontSize: '28px' }}
                                    />
                                    <span style={{ paddingLeft: '10px' }}>
                                        Manual
                                    </span>
                                </span>}>
                            <Menu.Item key="14">
                                <DownloadOutlined theme="twoTone" style={{ paddingRight: '20px', fontSize: '22px', color: 'black' }} />
                                <Button type="link" style={{ color: "black", fontWeigh: "bold" }}
                                    onClick={() => window.open("https://f0ffb9f7-b449-47df-a56a-517da13c82dc.filesusr.com/ugd/dc5b01_82cb2bc2d31c48d180731e350c3f3dd4.pdf", '_blank')} >
                                    SePlaneje_Uso.PDF</Button></Menu.Item>
                            <Menu.Item key="15">
                                <PlaySquareOutlined theme="twoTone" style={{ paddingRight: '20px', fontSize: '22px', color: 'black' }} />
                                <Link to='/manualVisual'>Manual Visual</Link></Menu.Item>

                            {/* PlaySquareOutlined, */}
                            {/* DownloadOutlined */}

                        </SubMenu>
                    </Menu>
                </Drawer>
            </div>
        );
    }
}

export default App;