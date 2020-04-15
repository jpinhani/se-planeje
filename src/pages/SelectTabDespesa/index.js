import React from 'react'
import { Card } from 'antd'

import Pagamentos from '../SelectDespesaRealizada'
import Metas from '../SelectDespesaPagar'
import Faturas from '../SelectFaturaPagar'

import 'antd/dist/antd.css';
import './styles.scss'

const tabList = [
    {
        key: 'tab1',
        tab: 'Metas',
    },
    {
        key: 'tab2',
        tab: 'Lançamentos',
    },
    {
        key: 'tab3',
        tab: 'Faturas',
    }
];

const contentList = {
    tab1: <Metas />,
    tab2: <Pagamentos />,
    tab3: <Faturas />
};

class SelectTabDespesa extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            key: 'tab1'
        }
    }

    onTabChange = (key, type) => {
        console.log(key, [type]);
        this.setState({...this.state, key:key});
    };

    render() {
        return (<div>
            <Card
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