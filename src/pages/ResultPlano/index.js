import React from 'react';
import { Result } from 'antd';

export default () => {


    return (
        <Result
            status="success"
            title="Sua Transação foi concluida com Sucesso!"
            subTitle="Em minutos você receberá detalhes da assinatura + credenciais para primeiro acesso"
        //         extra={[
        //             <Button type="primary" key="console">
        //                 Go Console
        //   </Button>,
        //             <Button key="buy">Buy Again</Button>,
        //         ]}
        />
    )
}