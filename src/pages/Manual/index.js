import React, { useState } from 'react';
import { Table, Input } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import SearchFilter from '../../components/searchFilterTable/index';


export default () => {

    const [search, setSearch] = useState('');

    const data = [
        {
            DESCRICAO: 'Importando Categorias',
            LINK: <CaretRightOutlined style={{ color: 'red', fontSize: '32px' }} onClick={() => window.open('https://youtu.be/AnXW4DOchmA', '_blank')} />
        },
        {
            DESCRICAO: 'Criando Uma Nova Categoria ',
            LINK: <CaretRightOutlined style={{ color: 'red', fontSize: '32px' }} onClick={() => window.open('https://youtu.be/gvQOw3GiwJI', '_blank')} />
        },
        {
            DESCRICAO: 'Editando Categorias',
            LINK: <CaretRightOutlined style={{ color: 'red', fontSize: '32px' }} onClick={() => window.open('https://youtu.be/-UMSyh2TPkg', '_blank')} />
        },
        {
            DESCRICAO: 'Excluindo Categorias',
            LINK: <CaretRightOutlined style={{ color: 'red', fontSize: '32px' }} onClick={() => window.open('https://youtu.be/mvzHZ227jOs', '_blank')} />
        },
        {
            DESCRICAO: 'Criando Contas',
            LINK: <CaretRightOutlined style={{ color: 'red', fontSize: '32px' }} onClick={() => window.open('https://youtu.be/OlhXMueLCoo', '_blank')} />
        },
        {
            DESCRICAO: 'Editando Contas',
            LINK: <CaretRightOutlined style={{ color: 'red', fontSize: '32px' }} onClick={() => window.open('https://youtu.be/okuWP4bzcgU', '_blank')} />
        },
        {
            DESCRICAO: 'Excluindo Contas',
            LINK: <CaretRightOutlined style={{ color: 'red', fontSize: '32px' }} onClick={() => window.open('https://youtu.be/bUtTbk4d_kw', '_blank')} />
        },
        {
            DESCRICAO: 'Criando Cartões de Crédito',
            LINK: <CaretRightOutlined style={{ color: 'red', fontSize: '32px' }} onClick={() => window.open('https://youtu.be/a8Op33zDXWM', '_blank')} />
        },
        {
            DESCRICAO: 'Editando Cartões de Crédito',
            LINK: <CaretRightOutlined style={{ color: 'red', fontSize: '32px' }} onClick={() => window.open('https://youtu.be/e-AJJlp6hk0', '_blank')} />
        },
        {
            DESCRICAO: 'Excluindo Cartões de Crédito',
            LINK: <CaretRightOutlined style={{ color: 'red', fontSize: '32px' }} onClick={() => window.open('https://youtu.be/Dx0k-pCNPl4', '_blank')} />
        },
        {
            DESCRICAO: 'Criando Nova Visão',
            LINK: <CaretRightOutlined style={{ color: 'red', fontSize: '32px' }} onClick={() => window.open('https://youtu.be/HoG6cu4kEZM', '_blank')} />
        },
        {
            DESCRICAO: 'Editando Visão',
            LINK: <CaretRightOutlined style={{ color: 'red', fontSize: '32px' }} onClick={() => window.open('https://youtu.be/j_lwZSnDxLg', '_blank')} />
        },
        {
            DESCRICAO: 'Excluindo Visões',
            LINK: <CaretRightOutlined style={{ color: 'red', fontSize: '32px' }} onClick={() => window.open('https://youtu.be/SKDbnCnZXJA', '_blank')} />
        }
    ]

    const columns = [
        {
            title: 'Descrição',
            dataIndex: 'DESCRICAO',
            key: 'DESCRICAO'
        },
        {
            title: 'Link',
            dataIndex: 'LINK',
            key: 'LINK'
        }
    ]

    return (
        <div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Input name='receita'
                    // style={{ width: '49%' }}
                    value={search}
                    onChange={valor => setSearch(valor.target.value)}
                    placeholder="Procure aqui um video manual" />
            </div>
            <Table
                className='table table-action'
                columns={columns}
                dataSource={
                    SearchFilter(
                        data,
                        ['DESCRICAO'], search)}
                rowKey='DESCRICAO'
                pagination={{ pageSize: 100 }}
            />
        </div>
    )
}