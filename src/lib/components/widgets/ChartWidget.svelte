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
    const apiUrl = utils.getBackendUrl(location) + '/api/provider/v2/device/'

    let chartCanvas
    let ctx
    let first = false
    onMount(async () => {
        ctx = chartCanvas.getContext('2d');
        show(ctx)
        first = true
    });

    afterUpdate(() => {
        if (!first) show(ctx)
        first = false
    });
    var myChart
    async function show(ctx) {
        try {
            let promise = await sgxdata.getData(dev, apiUrl, config, filter, session.token, transform)
                .then(function (data) {
                    if (myChart) myChart.destroy()
                    myChart = new Chart(ctx, data);
                })
        } catch (error) {
            errorMessage = error.message;
            console.log('error', errorMessage);
        }
        return null
    }

    async function transform(widgetConfig, rawData) {
        let jsonData = await rawData;
        console.log('jsonData', jsonData)
        let namesTranslated = []
        if (config.channel_translated !== null && config.channel_translated !== undefined) {
            namesTranslated = config.channel_translated.split(',')
        }
        let multiLine = jsonData[0].length > 1// && jsonData[0][1]['name'] != jsonData[0][0]['name']
        let chartData = {
            labels: [],
            datasets: []
        }

        let firstDate = ''
        let lastDate = ''
        let dFirst, dLast;
        let measures = []
        let labels = []

        let borderColors = [
            'rgb(54, 162, 235)', //blue
            'rgb(255, 99, 132)', //red
            'rgb(75, 192, 192)', //green
            'rgb(255, 159, 64)', //orange
            'rgb(153, 102, 255)', //purple
            'rgb(255, 205, 86)', //yellow
            'rgb(201, 203, 207)'//grey
        ]
        let areaColors = [
            'rgba(54, 162, 235, 0.2)', //blue
            'rgba(255, 99, 132, 0.2)', //red
            'rgba(75, 192, 192, 0.2)', //green
            'rgba(255, 159, 64, 0.2)', //orange
            'rgb(153, 102, 255, 0.2)', //purple
            'rgb(255, 205, 86, 0.2)', //yellow
            'rgb(201, 203, 207, 0.2)'//grey
        ]
        let dTmp
        let tmpValue
        console.log('multiLine', multiLine)
        if (true) {
            let tmpDataset = new Array(jsonData.length)
            for (var i = 0; i < jsonData.length; i++) {
                tmpDataset[i] = []
            }
            let tmpMeasures = new Array(jsonData.length)
            for (var i = 0; i < jsonData.length; i++) {
                tmpMeasures[i] = []
            }
            console.log('jsonData.length', jsonData.length)
            for (var i = 0; i < jsonData.length; i++) {
                labels.push(jsonData[i][0]['timestamp'])
                console.log('push '+jsonData[i][0]['timestamp'])
                for (var j = 0; j < jsonData[i].length; j++) {
                    try {
                        tmpMeasures[j].push({ x: (new Date(jsonData[i][j]['timestamp']).toISOString()), y: jsonData[i][j]['value'] })
                        if (j == 0 && jsonData[i][j]['timestamp'] < dFirst) { dFirst = jsonData[i][j]['timestamp'] }
                        if (jsonData[i][j]['timestamp'] > dLast) { dLast = jsonData[i][j]['timestamp'] }
                    } catch (err) { }
                }
            }
            for (var j = 0; j < jsonData[0].length; j++) {
                chartData.datasets.push(
                    {
                        label: jsonData[0].length > 0 ? getChannelNameTranslated(namesTranslated, j, jsonData[0][j]['name']) : '',
                        borderWidth: 1,
                        data: tmpMeasures[j],
                        backgroundColor: areaColors[(j%7)],
                        borderColor: borderColors[(j%7)],
                        fill: true,
                        spanGaps: true
                    }
                )
            }
        } else {
            for (var i = 0; i < jsonData.length; i++) {
                try {
                    dTmp = jsonData[i][0]['timestamp']
                    tmpValue = jsonData[i][0]['value']
                    measures.push(
                        { x: (new Date(dTmp).toISOString()), y: tmpValue }
                    )
                    labels.push(dTmp)
                    if (i == 0 && dTmp < dFirst) { dFirst = dTmp }
                    if (dTmp > dLast) { dLast = dTmp }
                } catch (err) {
                    //console.log(err)
                }
            }
            chartData.datasets.push(
                {
                    label: jsonData[0].length > 0 ? getChannelNameTranslated(namesTranslated, 0, jsonData[0][0]['name']) : '',
                    borderWidth: 1,
                    data: measures,
                    backgroundColor: areaColors[0],
                    borderColor: borderColors[0],
                    borderDash: [],
                    borderDashOffset: 0.0,
                    fill: true,
                    spanGaps: true
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
        let chartOptions = {
            responsive: true,
            animation: false,
            maintainAspectRatio: false,
            scales: {
                y: {
                    suggestedMin: 0
                },
                x: {
                    type: (config.format == 'timeseries' ? 'timeseries' : 'time'),
                    type: 'time',
                    time: {
                        unit: sgxhelper.getChartUnit(dFirst, dLast, config.timeUnit),
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
        let charConfig = {
            type: config.chartType,
            data: chartData,
            options: chartOptions
        }
        console.log(JSON.stringify(charConfig))
        return charConfig
    }

    function toLocaleTimeStringSupportsLocales() {
        try {
            new Date().toLocaleTimeString('i');
        } catch (e) {
            return e.name === 'RangeError';
        }
        return false;
    }
    function getChannelNameTranslated(names, index, channelName) {
        if (names.length > index) {
            return names[index]
        } else {
            return channelName
        }
    }


</script>
<div class="p-1 pt-2 w-100">
    <canvas bind:this={chartCanvas} class="w-100" />
</div>