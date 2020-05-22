import React, { Component } from 'react'
import Chart from "chart.js";
// import classes from "./LineGraph.module.css";



export default class LineGraph extends Component {
    chartRef = React.createRef();

    // gera uma cor aleatória em hexadecimal
    gera_cor() {
        var hexadecimais = '0123456789ABCDEF';
        var cor = '#';

        // Pega um número aleatório no array acima
        for (var i = 0; i < 6; i++) {
            //E concatena à variável cor
            cor += hexadecimais[Math.floor(Math.random() * 16)];
        }
        return cor;
    }

    componentDidMount() {
        const myChartRef = this.chartRef.current.getContext("2d");

        new Chart(myChartRef, {
            type: 'bar',
            data: {
                datasets: [{
                    barPercentage: 0.3,
                    barThickness: 45,
                    maxBarThickness: 65,
                    minBarLength: 65,
                    data: [13500, 11250, 16000, 17500, 12500, 15000],
                    backgroundColor: [
                        this.gera_cor(),
                        this.gera_cor(),
                        this.gera_cor(),
                        this.gera_cor(),
                        this.gera_cor(),
                        this.gera_cor(),
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                    label: ['A'],

                    // This binds the dataset to the left y axis
                    // yAxisID: 'left-y-axis'
                }],
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            }
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