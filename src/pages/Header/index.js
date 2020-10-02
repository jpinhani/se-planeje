import React from 'react'
import { Link } from 'react-router-dom'
import './style.scss'
import { Menu, Dropdown, Layout } from 'antd';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
import { logout } from '../../auth/index';
import DespesaRealizada from '../../components/Modal/DespesaRealizada';
import NewRevenue from '../../components/Modal/ReceitaRealizada';
// import {} from '../../docs/'

const { Header } = Layout;

// function handleMenuClick(e) {
//     message.info('Click on menu item.');
// }

const menu = (
    <Menu /* onClick={handleMenuClick}  */>
        <Menu.Item key="1">
            <Link to='/detailsUser'>
                <SettingOutlined />
                <i style={{ paddingLeft: '2px' }}>Pagamento</i>
            </Link>
        </Menu.Item>
        <Menu.Item key="2">
            <Link to='/detailsPlano'>
                <UserOutlined />
                <i style={{ paddingLeft: '2px' }}>Senha</i>
            </Link>
        </Menu.Item>
    </Menu>
);

function handleclik() {
    logout()
}


function PrincipalHeader() {
    return (
        <Header className='cabecalho'>
            <div style={{
                width: '50%',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    // background: 'green',
                    justifyContent: 'space-between'
                }}>
                    <h1 className='logoheader1'><span className='logoheader2'>Se</span>Planeje</h1>
                    <div style={{
                        width: '30%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        // background: 'green'
                    }}>
                        <DespesaRealizada />
                        <NewRevenue />
                    </div>
                </div>
            </div>


            <div >
                <Dropdown.Button className="MenuHeader"
                    onClick={handleclik}
                    overlay={menu}
                    icon={<UserOutlined />}>
                    <Link to='/'>Sair</Link>
                </Dropdown.Button>
            </div>
        </Header>
    );
}


export default PrincipalHeader
