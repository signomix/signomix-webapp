<script>
    import { onMount } from 'svelte';
    import { beforeUpdate } from 'svelte';

    beforeUpdate(() => {
        //console.log('beforeUpdate');
    });
    export let config
    export let filter

    onMount(async () => {
        //console.log('onMount TEXT_widget');
    });

</script>
<div class="container p-1">
    <img class="img-fluid" src="{config.imageUrl}">
</div>