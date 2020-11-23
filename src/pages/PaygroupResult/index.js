import React from 'react';
import { Result } from 'antd';

// import { Link } from 'react-router-dom';
// import {
//     DislikeOutlined,
//     LikeTwoTone,
//     ArrowLeftOutlined,
//     ArrowRightOutlined,
//     DollarOutlined
// } from '@ant-design/icons'

export default () => {



    return (
        <div style={{ width: '100%' }}>
            <Result
                status="success"
                title="Todos os Lançamentos foram contabilizados com sucesso"
                subTitle="Com o SePlaneje é facil, :)"
            // extra={[

            //     <Link to='home' style={{
            //         color: 'red',
            //         // border: '1px solid',
            //         // borderColor: "red",
            //         padding: '0 5px 0 5px',
            //         margin: '10px',
            //         borderRadius: '10px',
            //         background: 'red'
            //     }}>
            //         Home
            //     </Link>,


            //     <Link to='PayGroup' style={{
            //         color: 'blue',
            //         // border: '1px solid',
            //         // borderColor: "red",
            //         padding: '0 5px 0 5px',
            //         margin: '10px',
            //         borderRadius: '10px',
            //         background: 'red'
            //     }}>
            //         Novos Lançamentos em Grupo
            //     </Link>,

            // ]}
            />
        </div >
    )
}