import React, { Component } from 'react'
import Chart from "chart.js";
// import classes from "./LineGraph.module.css";

export default class LineGraph extends Component {
    chartRef = React.createRef();

    componentDidMount() {
        const myChartRef = this.chartRef.current.getContext("2d");

        new Chart(myChartRef, {
            type: 'line',
            data: {
                datasets: [{
                    data: [13500, 11250, 16000, 17500, 12500, 15000],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                    label: 'Despesa',

                    // This binds the dataset to the left y axis
                    // yAxisID: 'left-y-axis'
                }, {
                    data: [13550, 12250, 16500, 17800, 12900, 15100],
                    backgroundColor: [
                        'rgba(50, 153, 204, 0.2)',
                        'rgba(50, 153, 204, 0.2)',
                        'rgba(50, 153, 204, 0.2)',
                        'rgba(50, 153, 204, 0.2)',
                        'rgba(50, 153, 204, 0.2)',
                        'rgba(50, 153, 204, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                    label: 'Receita',

                    // This binds the dataset to the right y axis
                    // yAxisID: 'right-y-axis'
                }],
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

            },
            // options: {
            //     scales: {
            //         yAxes: [{
            //             id: 'left-y-axis',
            //             type: 'linear',
            //             position: 'left'
            //         }, {
            //             id: 'right-y-axis',
            //             type: 'linear',
            //             position: 'right'
            //         }]
            //     }
            // }

        });
    }
    render() {
        return (
            <div >
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div >
        )
    }
}