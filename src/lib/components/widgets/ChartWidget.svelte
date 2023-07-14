<script>
    import { userSession } from '$lib/stores.js';
    import { utils } from '$lib/utils.js';
    import { sgxdata } from '$lib/sgxdata.js';
    import { sgxhelper } from '$lib/sgxhelper.js';
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    import 'chartjs-adapter-moment';
    import { afterUpdate } from 'svelte';



    export let config
    export let filter

    let session;
    userSession.subscribe(value => {
        session = value;
    });
    let errorMessage = '';
    const apiUrl = utils.getBackendUrl(location) + '/api/provider/device/'

    let chartCanvas
    let ctx
    onMount(async () => {
        //console.log('onMount');
        ctx = chartCanvas.getContext('2d');
        show(ctx)
        /* var myChart
        try {
            const data = await getRequiredData();
            myChart = new Chart(ctx, data);
        } catch (error) {
            errorMessage = error.message;
            //console.log('error', errorMessage);
        } */
    });

    afterUpdate(() => {
        //console.log('afterUpdate');
        show(ctx)
    });
    var myChart
    async function show(ctx) {
        /* try {
            console.log('SHOW1')
            const data = await getRequiredData();
            console.log('SHOW2 data', data)
            if (myChart) myChart.destroy()
            myChart = new Chart(ctx, data);
        } catch (error) {
            errorMessage = error.message;
            console.log('error', errorMessage);
        } */
        try {
            let promise = await sgxdata.getData(dev, apiUrl, config, filter, session.token, transform)
                .then(function (data) {
                    //console.log('SHOW2 data', data)
                    if (myChart) myChart.destroy()
                    myChart = new Chart(ctx, data);
                    //console.log('SHOW3', myChart)
                })
        } catch (error) {
            errorMessage = error.message;
            console.log('error', errorMessage);
        }
        return null
    }

    /* async function getRequiredData() {
        if (dev) {
            return await transform(sgxdata.getDataExample(config.dev_id, config.channel, 7))
        }
        const headers = new Headers()
        headers.set('Accept', 'application/json');
        const endpoint = apiUrl + config.dev_id + "/" + config.channel + "?query=" + config.query + "&tid=" + session.token;
        const res = await fetch(endpoint, { mode: 'cors', headers: headers });
        const data2 = await transform(res.json());
        if (res.ok) {
            return data2;
        } else {
            throw new Error(text);
        }
    } */

    async function transform(rawData) {
        let jsonData = await rawData;
        //console.log('jsonData', jsonData)
        let multiLine = jsonData[0].length > 1 && jsonData[0][1]['name'] != jsonData[0][0]['name']
        let numberOfLines = multiLine ? jsonData[0].length : 1
        let chartData = {
            labels: [],
            datasets: []
        }

        let firstDate = ''
        let lastDate = ''
        let dFirst, dLast;
        let measures = []
        let labels = []
        let borders = []
        let colors = []

        let borderColors = [
            'rgb(54, 162, 235)', //blue
            'rgb(255, 99, 132)', //red
            'rgb(75, 192, 192)', //green
            'rgb(255, 159, 64)' //orange
        ]
        let areaColors = [
            'rgba(54, 162, 235, 0.2)', //blue
            'rgba(255, 99, 132, 0.2)', //red
            'rgba(75, 192, 192, 0.2)', //green
            'rgba(255, 159, 64, 0.2)' //orange
        ]
        let dTmp
        if (multiLine) {
            for (var j = 0; j < jsonData[0].length && j < 4; j++) {
                measures = []
                borders = []
                colors = []
                for (var i = 0; i < jsonData.length; i++) {
                    try {
                        dTmp = jsonData[i][j]['timestamp']
                        // measures.push(
                        //     { x: (new Date(dTmp).toISOString()), y: jsonData[i][j]['value'] }
                        // )
                        measures.push(jsonData[i][j]['value'])
                        labels.push(new Date(dTmp).toISOString())
                        if (i == 0 && dTmp < dFirst) { dFirst = dTmp }
                        if (dTmp > dLast) { dLast = dTmp }
                        colors.push('rgba(54, 162, 235, 0.2)')
                        borders.push('rgb(54, 162, 235)')
                    } catch (err) { }
                }
                chartData.datasets.push(
                    {
                        label: jsonData[0].length > 0 ? jsonData[0][j]['name'] : '',
                        borderWidth: 1,
                        data: measures,
                        backgroundColor: areaColors[j],
                        borderColor: borderColors[j]
                    }
                )
            }
        } else {
            for (var i = 0; i < jsonData[0].length; i++) {
                try {
                    dTmp = jsonData[0][i]['timestamp']
                    measures.push(
                        { x: (new Date(dTmp).toISOString()), y: jsonData[0][i]['value'] }
                    )
                    //measures.push(jsonData[0][i]['value'])
                    //labels.push(new Date(dTmp).toISOString())
                    labels.push(dTmp)
                    if (i == 0 && dTmp < dFirst) { dFirst = dTmp }
                    if (dTmp > dLast) { dLast = dTmp }
                    colors.push('rgba(54, 162, 235, 0.2)')
                    borders.push('rgb(54, 162, 235)')
                } catch (err) {
                    //console.log(err)
                }
            }

            chartData.datasets.push(
                {
                    label: jsonData[0].length > 0 ? jsonData[0][0]['name'] : '',
                    borderWidth: 1,
                    data: measures,
                    backgroundColor: colors[0],
                    borderColor: borders[0],
                    borderDash: [],
                    borderDashOffset: 0.0,
                    fill: true
                }
            )

        }
        //console.log('chartData', chartData)

        chartData.labels = labels
        if (toLocaleTimeStringSupportsLocales()) {
            firstDate = new Date(dFirst).toLocaleDateString('pl')
            lastDate = new Date(dLast).toLocaleDateString('pl')
        } else {
            firstDate = new Date(dFirst).toISOString().substring(0, 10)
            lastDate = new Date(dLast).toISOString().substring(0, 10)
        }
        let barChartOptions = {
            responsive: true,
            animation: false,
            maintainAspectRatio: false,
            scales: {
                y: {
                    suggestedMin: 0
                },
                x: {
                    //type: (config.format == 'timeseries' ? 'timeseries' : 'time'),
                    type: 'time',
                    time: {
                        //unit: sgxhelper.getChartUnit(dFirst, dLast, config.timeUnit),
                        unit: 'minute',
                        displayFormats: {
                            minute: 'HH:mm:ss',
                            hour: 'HH:mm:ss',
                            day: 'D-MM',
                            week: 'D-MM',
                            quarter: 'MMM-YYYY'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    title: {
                        display: true,
                        text: config.title,
                        font: { weight: 'bold' }
                    }
                }
            }
        }
        let barCharConfig = {
            type: config.chartType,
            data: chartData,
            options: barChartOptions
        }
        //console.log('barCharConfig', barCharConfig)
        return barCharConfig
    }

    function toLocaleTimeStringSupportsLocales() {
        try {
            new Date().toLocaleTimeString('i');
        } catch (e) {
            return e.name === 'RangeError';
        }
        return false;
    }

</script>
<div class="p-1 pt-2 w-100">
    <canvas bind:this={chartCanvas} class="w-100" />
</div>