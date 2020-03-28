import React from 'react'
import './style.scss'
import { Menu, Dropdown, message, Layout } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Header } = Layout;


function handleMenuClick(e) {
    message.info('Click on menu item.');
    console.log('click', e);
}

const menu = (
    <Menu onClick={handleMenuClick} >
        <Menu.Item key="1">
            <UserOutlined />
        Configurações
      </Menu.Item>
        <Menu.Item key="2">
            <UserOutlined />
        Plano
      </Menu.Item>
        <Menu.Item key="3">
            <UserOutlined />
        Perfil
      </Menu.Item>
        <Menu.Item key="4">
            <UserOutlined />
        Fale Conosco
      </Menu.Item>
    </Menu>
);

function PrincipalHeader() {
    return (
        <Header className='cabecalho'>
            <div style={{ width: '90%' }}>
                <h1 className='logoheader1'><span className='logoheader2'>Se</span>Planeje</h1>
            </div>
            <div style={{ width: '10%' }} >
                <Dropdown.Button style={{

                    alignSelf: 'right', opacity: 0.7,
                }}
                    overlay={menu}
                    icon={<UserOutlined />}>
                    Sair
              </Dropdown.Button>
            </div>
        </Header>
    );
}


export default PrincipalHeader
