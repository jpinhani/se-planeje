import React from 'react'
import './style.scss'
import { Layout } from 'antd'

const { Header } = Layout;

function PrincipalHeader() {
    return (
        <Header className='cabecalho'>
            <h1>SePlaneje</h1>
        </Header>

    );
}


export default PrincipalHeader
