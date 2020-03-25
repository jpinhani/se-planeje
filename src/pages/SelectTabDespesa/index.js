import React from 'react'
import { Card } from 'antd'
import Pagamentos from '../SelectDespesaRealizada'
import Metas from '../SelectDespesaPagar'

import 'antd/dist/antd.css';
import './styles.scss'

const tabList = [
    {
        key: 'tab1',
        tab: 'Metas Previstas',
    },
    {
        key: 'tab2',
        tab: 'Lançamentos Realizados',
    },
];

const contentList = {
    tab1: <Metas />,
    tab2: <Pagamentos />,
};

class SelectTabDespesa extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            key: 'tab1'
        }
    }

    onTabChange = (key, type) => {
        console.log(key, type);
        this.setState({ [type]: key });
    };

    render() {
        return (<div>
            <Card
                // style={{ width: '100%' }}
                // title="SePlaneje - Contabilizar Despesas"
                // extra={<a href="#">More</a>}
                tabList={tabList}
                activeTabKey={this.state.key}
                onTabChange={key => {
                    this.onTabChange(key, 'key');
                }}
            >
                {contentList[this.state.key]}
            </Card>
        </div>
        )
    }
}

export default SelectTabDespesa