<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
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
            sgxdata.getGroupData(dev, apiUrl, config, filter, $token, transform)
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

        let namesTranslated = []
        if (config.channel_translated !== null && config.channel_translated !== undefined) {
            namesTranslated = config.channel_translated.split(',')
        }

        let areaColors = [
            'rgba(54, 162, 235, 0.2)', //blue
            'rgba(255, 99, 132, 0.2)', //red
            'rgba(75, 192, 192, 0.2)', //green
            'rgba(255, 159, 64, 0.2)', //orange
            'rgb(153, 102, 255, 0.2)', //purple
            'rgb(255, 205, 86, 0.2)', //yellow
            'rgb(201, 203, 207, 0.2)'//grey
        ]

        let chartData = {
            labels: namesTranslated,
            datasets: []
        }

        chartData = createDataSets(namesTranslated, jsonData, areaColors, chartData);

        var chartOptions = {
            scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
            },
        };

        let charConfig = {
            type:'bar', // config.chartType,
            data: chartData,
            options: chartOptions
        }

        return charConfig;
    }

    function createDataSets(dataSetNames, deviceJson, areaColors, chartData) {
        const dataSetsNumber = dataSetNames.length;
        const devicesNumber = deviceJson.length;

        for (let i = 0; i < devicesNumber; i++) {
            chartData.datasets.push(
                {
                    label: '',
                    data: [],
                    backgroundColor: '',
                }
            );

            chartData.datasets[i].label = deviceJson[i][0][0].deviceEUI;
            chartData.datasets[i].backgroundColor = areaColors[i];
            
            for(let j = 0 ; j< dataSetsNumber; j++) {
                chartData.datasets[i].data.push(deviceJson[i][0][j].value);
            }
        }

        return chartData;
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
