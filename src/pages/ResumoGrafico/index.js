import React, { useRef, useEffect, useCallback, useState } from 'react';
import Chart from "chart.js";
// import { gera_cor } from '../../components/GeraCor'

// import { Select } from 'antd';

import './styles.scss';

// const { Option } = Select;
export default (props) => {

    const chartContainer = useRef(null);
    const [grafico, setGrafico] = useState(null);
    // const [tipoGrafico] = useState([]);

    const ChartConfig = useCallback((valores) => {

        const dataNovo = [valores]

        const dataGrafico = dataNovo.map((novo) =>
            [novo.D_PREVISTO * -1, novo.R_PREVISTO, novo.L_PREVISTO]
        )

        const dataGrafico1 = dataNovo.map((novo) =>
            [novo.D_REAL * -1, novo.R_REAL, novo.L_REAL]
        )

        const dataGrafico2 = dataNovo.map((novo) =>
            [novo.D_FORECAST * -1, novo.R_FORECAST, novo.L_FORECAST]
        )


        const labelsGrafico = ["DESPESA", "RECEITA", "LUCRO"]
        const rs = {
            type: 'line',

            data: {
                datasets: [{
                    // borderWidth: '100px',
                    lineTension: 0.5,
                    data: dataGrafico[0],
                    borderColor: ['GREEN'],
                    backgroundColor: ['#F5F5DC'],
                    borderWidth: 5,
                    label: 'Previsto',
                },
                {
                    lineTension: 0.5,
                    // borderWidth: 10,
                    data: dataGrafico1[0],
                    borderColor: ['RED'],
                    backgroundColor: ['#FFDAB9'],
                    borderWidth: 5,
                    label: 'Real',
                },
                {
                    lineTension: 0.5,
                    data: dataGrafico2[0],
                    // borderWidth: 10,
                    backgroundColor: ['#E0FFFF'],
                    borderColor: ['BLUE'],
                    borderWidth: 5,
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
            const newChartInstance = new Chart(chartContainer.current, ChartConfig(props.data));
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