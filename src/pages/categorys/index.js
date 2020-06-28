import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app

export default class Tree extends Component {
    constructor(props) {
        super(props);

        this.state = {
            treeData: [
                { title: 'Chicken', children: [{ title: 'Egg' }] },
                { title: 'Fish', children: [{ title: 'fingerline' }] }
            ],
        };
    }

    handlechange(treeData) {
        console.log(treeData)
        this.setState({ treeData })
    }

    render() {
        return (
            <div style={{ height: 400 }}>
                <SortableTree
                    treeData={this.state.treeData}
                    onChange={treeData => this.handlechange(treeData)}
                />
            </div>
        );
    }
}