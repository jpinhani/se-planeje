import React, { useRef, useEffect, useCallback, useState } from 'react';
import Chart from "chart.js";
// import { gera_cor } from '../../components/GeraCor'

// import { Select } from 'antd';

import './styles.scss';

// const { Option } = Select;
// let count = 0;
let newChartInstance = null;
export default (props) => {

    const chartContainer = useRef(null);

    // let newChartInstance = useCallback(() => useRef(null), []);

    const [grafico, setGrafico] = useState(null);
    // const [tipoGrafico] = useState([])

    const ChartConfig = useCallback((valores) => {

        const dataNovo = [valores]

        const dataGrafico = dataNovo.map((novo) =>
            [parseFloat(novo.D_PREVISTO * -1).toFixed(2),
            parseFloat(novo.R_PREVISTO).toFixed(2),
            parseFloat(novo.L_PREVISTO).toFixed(2)]
        )

        const dataGrafico1 = dataNovo.map((novo) =>
            [parseFloat(novo.D_REAL * -1).toFixed(2),
            parseFloat(novo.R_REAL).toFixed(2),
            parseFloat(novo.L_REAL).toFixed(2)
            ]
        )

        const dataGrafico2 = dataNovo.map((novo) =>
            [parseFloat(novo.D_FORECAST * -1).toFixed(2),
            parseFloat(novo.R_FORECAST).toFixed(2),
            parseFloat(novo.L_FORECAST).toFixed(2)]
        )


        const labelsGrafico = ["DESPESA", "RECEITA", "LUCRO"]

        const rs = {
            // type: 'line',
            // type: 'doughnut',
            type: 'bar',

            data: {
                datasets: [{
                    // borderWidth: '100px',
                    lineTension: 0.5,
                    data: dataGrafico[0],
                    backgroundColor: ['#FFFF00', '#FFFF00', '#FFFF00'],
                    borderColor: ['YELLOW', 'YELLOW', 'YELLOW'],
                    borderWidth: 3,
                    label: 'Previsto',
                },
                {
                    lineTension: 0.5,
                    // borderWidth: 10,
                    data: dataGrafico1[0],
                    backgroundColor: ['#FA8072', '#FA8072', '#FA8072'],
                    borderColor: ['RED', 'RED', 'RED'],
                    // backgroundColor: ['#FFDAB9'],
                    borderWidth: 3,
                    label: 'Real',
                },
                {
                    lineTension: 0.5,
                    data: dataGrafico2[0],
                    // borderWidth: 10,
                    // backgroundColor: ['#E0FFFF'],
                    backgroundColor: ['#00FFFF', '#00FFFF', '#00FFFF'],
                    borderColor: ['BLUE', 'BLUE', 'BLUE'],
                    borderWidth: 3,
                    label: 'Forecast',
                }],
                labels: labelsGrafico
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,

                animation: {
                    duration: 0 // general animation time
                },
                hover: {
                    animationDuration: 0 // duration of animations when hovering an item
                },
                responsiveAnimationDuration: 0 // animation duration after a resize
            }
        }

        return rs
    }, [])



    const requestApi = useCallback(() => {

        if (chartContainer && chartContainer.current) {
            if (newChartInstance) newChartInstance.destroy()

            newChartInstance = new Chart(chartContainer.current, ChartConfig(props.data));


            setGrafico(newChartInstance)
        }


    }, [ChartConfig, props.data])

    useEffect(() => {
        requestApi();

    }, [requestApi])


    return (
        <div className='ContainerGraficoResumo'>
            <canvas
                id={grafico}
                ref={chartContainer}
            />
        </div>
    )
}