<!--
    Table component for displaying data in a table with CRUD operations.
    Can be used to display and edit limited amount of data - e.g. configuration settings, tags, etc.

    Properties:
    header: array of column labels in the table header
    columns: array of data names
    data: array of objects with data
    createAllowed: boolean, can create new rows
    updateAllowed: boolean, can update rows
    deleteAllowed: boolean, can delete rows

    TODO:
    - responsive design
    - unique value for selected column (e.g. name) to prevent duplicates - optional
    - validation of input data - optional
    - sorting by column - optional
    - modification indicator and undo changes - optional

    Example usage:
    <p>Table component:</p>
    <Table 
        header={['Product','Quantity','Unit','Action']} 
        columns={['name','value','unit']} 
        data={[{name: 'orange', value: 2, unit: 'kg'}]} 
        createAllowed={true} 
        updateAllowed={true} 
        deleteAllowed={true} 
    />
    <script>
        import Table from '$lib/components/Table.svelte';
    </script>
-->
<table class="table table-sm">
    <thead>
        <tr>
            {#each header as headerName, i}
                {#if i==header.length-1}
                    <td class="text-end">{headerName}</td>
                {:else}
                    <td>{headerName}</td>
                {/if}
            {/each}
        </tr>
    </thead>
    <tbody class="table-group-divider">
        {#each data as row, index}
            <tr>
                {#if index===editedRow}
                    {#each columns as column}
                        <td><input type="text" bind:value={editedData[column]} /></td>
                    {/each}
                    <td class="text-end">
                        <button type="button" class="btn btn-outline-dark btn-sm" on:click|preventDefault={() => saveRow(index)}>{utils.getLabel('save',labels,$language)}</button>
                    </td>
                {:else}
                {#each columns as column}
                    <td>{row[column]}</td>
                {/each}
                <td class="text-end">
                    {#if updateAllowed}
                        <i class="bi bi-pencil h5 me-2 link-dark" title={utils.getLabel('edit',labels,$language)} on:click|preventDefault={() => onUpdate(index)}></i>
                    {/if}
                    {#if deleteAllowed}
                        <i class="bi bi-trash3 h5 link-dark" title={utils.getLabel('delete',labels,$language)} on:click|preventDefault={() => onDelete(index)}></i>
                    {/if}
                </td>
                {/if}
            </tr>
        {/each}
        {#if createAllowed && !newRow}
        <tr>
            <td></td>
            <td></td>
            <td class="text-end">
                <i class="bi bi-plus-square h5 link-dark" on:click={addRow} title={utils.getLabel('add',labels,$language)}></i>
            </td>
        </tr>
        {:else if createAllowed && newRow}
        <tr>
            {#each columns as column}
                <td><input type="text" bind:value={newData[column]} /></td>
            {/each}
            <td class="text-end">
                <button type="button" class="btn btn-outline-dark btn-sm" on:click|preventDefault={saveNewRow}>{utils.getLabel('save',labels,$language)}</button>
            </td>
        {/if}
    </tbody>
</table>
<script>
    import { utils } from '$lib/utils.js';
    import { language } from '$lib/usersession.js';

    export let header = [];
    export let columns = [];
    export let data = [];
    export let createAllowed = true; // can create new rows
    export let updateAllowed = true; // can update rows
    export let deleteAllowed = true; // can delete rows

    let newRow=false
    let editingRow=false
    let newData = {}
    let editedData = {}
    let editedRow = -1
    let originalData = {...data}

    function onUpdate(index) {
        editedData = {...data[index]}
        editedRow = index
        newRow=false
    }
    function addRow(event) {
        newRow=true
        newData={}
        editedRow=-1
        for (let i=0; i<columns.length; i++) {
            newData[columns[i]] = ''
        }
    }
    function saveNewRow(event) {
        data.push({...newData});
        $: data=data
        newRow=false
    }
    function saveRow(index) {
        data[index]={...editedData};
        $: data=data
        editedRow=-1
    }
    function onDelete(index) {
        data.splice(index, 1);
        $: data=data
    }

    let labels = {
        'add': {
            'en': 'Add',
            'pl': 'Dodaj'
        },
        'edit': {
            'en': 'Edit',
            'pl': 'Edytuj'
        },
        'delete': {
            'en': 'Delete',
            'pl': 'Usuń'
        },
        'save': {
            'en': 'Save',
            'pl': 'Zapisz'
        }
    }
</script>