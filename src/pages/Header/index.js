import React from 'react'
import { Link } from 'react-router-dom'
import './style.scss'
import { Menu, Dropdown, Layout } from 'antd';
import { UserOutlined, SettingOutlined, CommentOutlined } from '@ant-design/icons';
import { logout } from '../../auth/index'

const { Header } = Layout;

// function handleMenuClick(e) {
//     message.info('Click on menu item.');
// }

const menu = (
    <Menu /* onClick={handleMenuClick}  */>
        <Menu.Item key="1">
            <SettingOutlined />
            <i style={{ paddingLeft: '2px' }}>Pagamento</i>
        </Menu.Item>
        <Menu.Item key="2">
            <Link to='/detailsPlano'>
                <UserOutlined />
                <i style={{ paddingLeft: '2px' }}>Senha</i>
            </Link>
        </Menu.Item>
        <Menu.Item key="3">
            <CommentOutlined />
            <i style={{ paddingLeft: '2px' }}>Fale Conosco</i>
        </Menu.Item>
    </Menu>
);

function handleclik() {
    logout()
}


function PrincipalHeader() {
    return (
        <Header className='cabecalho'>
            <div >
                <h1 className='logoheader1'><span className='logoheader2'>Se</span>Planeje</h1>
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
