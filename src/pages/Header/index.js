import React from 'react'
import './style.scss'
import { Layout } from 'antd'

const { Header } = Layout;

function PrincipalHeader() {
    return (
        <Header className='cabecalho'>
            <h1 className='logoheader1'><span className='logoheader2'>Se</span>Planeje</h1>
        </Header>

    );
}


export default PrincipalHeader
