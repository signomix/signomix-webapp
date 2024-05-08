<!--
    bindings: https://learn.svelte.dev/tutorial/text-inputs
-->
<div class="canvas text-right p-1" id={parentId} on:click={onWidgetClick}>
    <canvas bind:this={canvas} id={canvasId} on:click={onWidgetClick}></canvas>
</div>
<style>
    .canvas {
        width: 100%;
        height: 100%;
    }

    canvas {
        width: 100%;
        height: 100%;
    }
</style>
<script>
    import { onMount } from 'svelte';

    export let index
    export let config
    export let filter

    let parentDiv
    let parentId = 'widget' + index
    let canvasId = 'canvas' + index

    let front = true
    let rawdata = "[]"
    let jsonData = []
    let devConfigs = {}
    let appConfigs = {}

    let dataAvailable = false
    let unitName = ''
    let rounding = 0

    let canvas;
    let ctx

    onMount(() => {
        ctx = canvas.getContext('2d');
        parentDiv = document.getElementById(parentId)
        show()
    });

    function onWidgetClick(event) {
        //console.log('canvas ', canvasId, ' ', parentDiv.offsetWidth);
        front = !front
    }

    let show = function () {
        //jsonData = JSON.parse(rawdata)
        //dataAvailable = true;
        //drawContent()
        drawDefault()
    }

    let drawContent = function () {
        if (!front) return;
        if (!drawDedicated(jsonData, unitName, rounding)) {
            drawDefault()
        }
    }

    function drawDedicated(list, unitName, rounding) {
        //put your code here and return true
        return false;
    }

    function drawDefault() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillRect(10, 10, 50, 50)

        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.beginPath()
        //diagonal 1
        ctx.moveTo(0, 0)
        ctx.lineTo(canvas.width, canvas.height)
        //diagonal2
        ctx.moveTo(0, canvas.height)
        ctx.lineTo(canvas.width, 0)
        //arrow 1
        ctx.moveTo(0, 0)
        ctx.lineTo(0, 20)
        ctx.moveTo(0, 0)
        ctx.lineTo(20, 0)
        //arrow 2
        ctx.moveTo(canvas.width, canvas.height)
        ctx.lineTo(canvas.width, canvas.width - 20)
        ctx.moveTo(canvas.width, canvas.height)
        ctx.lineTo(canvas.width - 20, canvas.width)
        //arrow 3
        ctx.moveTo(0, canvas.height)
        ctx.lineTo(0, canvas.height - 20)
        ctx.moveTo(0, canvas.height)
        ctx.lineTo(20, canvas.height)
        //arrow 4
        ctx.moveTo(canvas.width, 0)
        ctx.lineTo(canvas.width, 20)
        ctx.moveTo(canvas.width, 0)
        ctx.lineTo(canvas.width - 20, 0)

        ctx.stroke()

        //title text
        ctx.font = 'bold 12px Courier New';
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillText('>' + config.title + '<', 26, 12);
    }


</script>