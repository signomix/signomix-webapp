<!--
    responsive grid: https://svelte-grid.vercel.app/examples/responsive
    bindings: https://learn.svelte.dev/tutorial/text-inputs
-->
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-2 border-bottom">
    <h5>{utils.getLabel('title',labels,$language)}</h5><a href="/dashboards/{data.id}"
        title="{utils.getLabel('view',labels,$language)}"><i class="bi bi-eye h5 me-2 link-dark"></i></a>
</div>
<div class="container border-bottom pb-2">
    <form>
        <div class="row">
            <div class="col-md-2 col-form-label">
                <label for="input-id" class="form-label">{utils.getLabel('id',labels,$language)}</label>
            </div>
            <div class="col-md-3">
                <input disabled type="text" class="form-control" id="input-id" bind:value={data.id}>
            </div>
            <div class="col-md-2 col-form-label">
                <label for="input-userid" class="form-label">{utils.getLabel('owner',labels,$language)}</label>
            </div>
            <div class="col-md-3">
                <input disabled type="text" class="form-control" id="input-userid" bind:value={data.userID}>
            </div>
            <div class="col-md-2">
                <input type="checkbox" class="form-check-input me-2" id="input-shared" bind:checked={data.shared}
                    on:change={onChange}>
                <label class="form-check-label" for="input-shared">{utils.getLabel('shared',labels,$language)}</label>
            </div>
        </div>
        {#if data.organizationId>1}
        <div class="row">
            <div class="col-md-2 col-form-label">
                <label for="input-organization"
                    class="form-label">{utils.getLabel('organization',labels,$language)}</label>
            </div>
            <div class="col-md-10">
                <input type="text" disabled class="form-control" id="input-organization"
                    value={data.organizationName} on:input={onChange}>
            </div>
        </div>
        {/if}
        <div class="row">
            <div class="col-md-2 col-form-label">
                <label for="input-title" class="form-label">{utils.getLabel('dashboard_title',labels,$language)}</label>
            </div>
            <div class="col-md-10">
                <input type="text" class="form-control" id="input-name" bind:value={data.title} on:input={onChange}>
            </div>
        </div>
        {#if data.organizationId>1}
         <div class="row">
            <div class="col-md-2 col-form-label">
                <label for="input-template" class="form-label">{utils.getLabel('template',labels,$language)}</label>
            </div>
            <div class="col-md-4">
                <input type="text" class="form-control" id="input-template" bind:value={data.templateId} on:input={onChange}>
            </div>
        </div>
        <div class="row">
            <div class="col-md-2 col-form-label">
                <label for="input-variables" class="form-label">{utils.getLabel('variables',labels,$language)}</label>
            </div>
            <div class="col-md-8">
                <textarea class="form-control" id="input-variables" bind:value={data.variables} on:input={onChange}/>
            </div>
        </div>
        {:else}
        <div class="row">
            <div class="col-md-1 col-form-label">
                <label for="input-team" class="form-label">{utils.getLabel('widget_team',labels,$language)}</label>
            </div>
            <div class="col-md-4">
                <input type="text" class="form-control" id="input-team" bind:value={data.team} on:input={onChange}>
            </div>
            <div class="col-md-2 col-form-label">
                <label for="input-admins" class="form-label">{utils.getLabel('widget_admins',labels,$language)}</label>
            </div>
            <div class="col-md-5">
                <input type="text" class="form-control" id="input-admins" bind:value={data.administrators} on:input={onChange}>
            </div>
        </div>
        {/if}
        <div class="row">
            <div class="col-form-label">
                <button class="btn btn-outline-secondary mt-1"
                    on:click|preventDefault={goBack}>{utils.getLabel('cancel',labels,$language)}</button>
                <button class="btn btn-outline-primary me-4 mt-1" on:click={saveDashboard} disabled={modified==false}><i
                        class="bi bi-save me-2"></i> {utils.getLabel('save',labels,$language)}
                </button>
                <button class="btn btn-outline-primary me-4 mt-1" on:click|preventDefault={removeDashboard}>
                    <i class="bi bi-trash me-2"></i> {utils.getLabel('remove',labels,$language)}
                </button>
                {#if !isTemplateSet(data)}
                <button class="btn btn-outline-primary mt-1 me-4" on:click={addWidget}><i
                        class="bi bi-plus-lg"></i></button>
                {/if}
            </div>
        </div>

    </form>
</div>
{#if !isTemplateSet(data)}
<div class="demo-container size">
    {#if $isAuthenticated}
    <Grid gap={[1,1]} bind:items={data.items} rowHeight={100} let:item {cols} let:index on:change={onChange}>
        <div class="demo-widget content bg-white border border-primary">
            <WidgetConfig index={index} bind:config={data.widgets} removeCallback={removeItem} copyCallback={copyItem} setCurrentIndex={(idx)=>
                setCurrentConfigureIndex(idx)}/>
        </div>
    </Grid>
    {/if}
</div>
{/if}
<!-- Modal -->
<div class="modal fade" id="configModal" tabindex="0" role="dialog" aria-labelledby="configModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                {#if currentConfigureIndex >= 0}
                <WidgetForm bind:index={currentConfigureIndex} bind:config={data.widgets}
                    callback={widgetFormCallback} />
                {/if}
            </div>
        </div>
    </div>
</div>

<script>
    import Grid from "svelte-grid";
    import gridHelp from "svelte-grid/build/helper/index.mjs";
    import { browser } from '$app/environment'
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { base } from '$app/paths'
    import { goto, afterNavigate } from '$app/navigation'
    import { onMount } from 'svelte';
    import { sgxdata } from '$lib/sgxdata.js';

    import WidgetConfig from '$lib/components/WidgetConfig.svelte';
    import WidgetForm from '$lib/components/WidgetForm.svelte';
    import widgets from '$lib/widgets.js';

    export let data
    let errorMessage = ''

    onMount(() => {
        if (!$isAuthenticated) {
            console.log('redirect to login');
            goto('/login');
        } else {
            //console.log('settings', data);
        }
    });

    let previousPage = base;
    afterNavigate(({ from }) => {
        previousPage = from?.url.pathname || previousPage
    })
    function goBack(event) {
        //console.log('goBack: ', event);
        goto("/dashboards");
    }

    let currentConfigureIndex = -1;
    let modified = false;
    //let defaultOrganizationId = 0

    const cols = [
        [1500, 10],
        [500, 1],
    ];

    let WIDTH = 1500;
    if (browser) {
        WIDTH = screen.width;
    }
    const COLS = WIDTH > 500 ? 10 : 1;
    //console.log("screen width: ", WIDTH, ", cols size: ", COLS);


    const id = () => "_" + Math.random().toString(36).substr(2, 9);

    function onChange({ detail }) {
        //console.log('onChange: ', detail);
        modified = true
        //console.log(data)
    }

    function onTemplateChange({ detail }) {
        //console.log('onTemplateChange: ', detail);
        modified = true
        //console.log(data)
    }

    function isTemplateSet(data) {
        //console.log('isTemplateSet: ', data);
        if (data.templateId && data.templateId.trim().length > 0) {
            return true;
        }
        return false;
    }

    function saveDashboard() {
        if (!(data.id === 'new' || data.id == null || data.id == '' || data.id == undefined)) {
            data.version = 2; // new dashboards are always in version 2
        }
        data.items = gridHelp.normalize(data.items, COLS);
        //console.log(data)
        if (data.version == 1) {
            if (!confirm('Zapisana konfiguracja pulpitu jest w wersji 1.0. \nPo zaktualizowaniu do wersji 2 nie będzie możliwe wyświetlenie go w starszej wersji aplikacji?\n Zapisać?')) {
                return;
            }
        }
        if(data.shared){
            if (!confirm('Zapisanie pulpitu jako publicznie dostępny spowoduje,\n że publicznie dostępne staną się dane wszystkich urządzeń oraz grup\n wykorzystywanych na tym pulpicie.\nZapisać?')) {
                return;
            }
        }
        if (dev) {
            if (browser) {
                if (data.id == 'new') {
                    data.id = new Date().getTime();
                }
                data.updatedAt = new Date();
                window.localStorage.setItem(data.id, JSON.stringify(transformBack(data)));
            }
        } else {
            sendForm(data);
        }
        modified = false;
    }

    function removeDashboard() {
        if (!confirm('Usunąć?')) {
            return;
        }
        if (dev) {
            window.localStorage.removeItem(data.id)
            goto('/dashboards')
        } else {
            remove();
        }
    }

    function remove() {
        const headers = new Headers()
        let method = 'DELETE'
        let url = utils.getBackendUrl(location) + "/api/core/v2/dashboards/" + data.id
        headers.set('Authentication', $token);
        let response = fetch(
            url,
            { method: method, mode: 'cors', headers: headers, body: JSON.stringify(data) }
        ).then((response) => {
            if (response.status == 200) {
                errorMessage = ''
                goto('/dashboards')
            } else if (response.status == 401 || response.status == 403) {
                token.set(null)
            } else {
                alert(
                    utils.getMessage(utils.FETCH_STATUS)
                        .replace('%1', response.status)
                        .replace('%2', response.statusText)
                )
            }
        }).catch((error) => {
            errorMessage = error.message
            if (errorMessage == 'Failed to fetch' && location.protocol.toLowerCase() == 'https') {
                errorMessage = errorMessage + ' Możliwa przyczyna: self signed nie są obsługiwane.'
            }
            console.log(error)
        });
    }

    function sendForm(data) {
        data = transformBack(data)
        const headers = new Headers()
        let method = 'POST'
        let url = utils.getBackendUrl(location) + "/api/core/v2/dashboards/"
        if (!(data.id === 'new' || data.id == null || data.id == '' || data.id == undefined)) {
            url = url + data.id
            method = 'PUT'
        }
        headers.set('Authentication', $token);
        headers.set('Content-Type', 'application/json');
        let response = fetch(
            url,
            { method: method, mode: 'cors', headers: headers, body: JSON.stringify(data) }
        ).then((response) => {
            if (response.status == 200) {
                errorMessage = ''
                goto('/dashboards')
            } else if (response.status == 401 || response.status == 403) {
                token.set(null)
            } else {
                alert(
                    utils.getMessage(utils.FETCH_STATUS)
                        .replace('%1', response.status)
                        .replace('%2', response.statusText)
                )
            }
        }).catch((error) => {
            errorMessage = error.message
            if (errorMessage == 'Failed to fetch' && location.protocol.toLowerCase() == 'https') {
                errorMessage = errorMessage + ' ' + utils.getLabel('fetcherror_message', labels, $language)
            }
            console.log(error)
        });
    }

    function transformBack(cfg) {
        // TODO: layout will be OK when configured for 10 columns: for 1 column layout widget height will be always 1 row
        // TODO: it should be possible preserve widget height when changing layout from 10 to 1 column
        console.log('transformBack', cfg);
        //console.log(cfg)
        for (let i = 0; i < cfg.items.length; i++) {
            let item = cfg.items[i]
            if (item['_el1'] !== null) {
                item['_el1'] = item['1']
                item['_el1']['y'] = i // fixes position of items in 1 column layout
                //delete item['1']
            }
            if (item['_el10'] !== null) {
                item['_el10'] = item['10']
                //delete item['10']
            }
        }
        //console.log(cfg)
        return cfg
    }

    function setCurrentConfigureIndex(idx) {
        currentConfigureIndex = idx;
        //console.log('New currentConfigureIndex: ', currentConfigureIndex);
    }

    function widgetFormCallback(idx, cfg) {
        //console.log('testCallback ', idx, cfg);
        data.widgets[idx].changed = true
        if(widgets.singleValueTypes.includes(cfg.type)) {
            //cfg.query = 'last 1'
        }
        if(!cfg.axisOptions){
            cfg.yAxisAutoScale=false
        }
        modified = true
    }

    function addWidget() {
        modified = true

        data.widgets.push({
            title: data.widgets.length.toString(),
            type: 'text',
            role: '',
            description: 'opis',
            name: 'w' + data.widgets.length
        });

        let newItem = {
            id: id(),
            10: gridHelp.item({
                w: 2,
                h: 2,
                x: 0,
                y: 0,
                draggable: true, resizable: true
            }),
            1: gridHelp.item({
                w: 1,
                h: 1,
                x: 0,
                y: 0,
                draggable: true, resizable: true
            }),
        };

        let findOutPosition = gridHelp.findSpace(newItem, data.items, COLS);

        newItem = {
            ...newItem,
            [COLS]: {
                ...newItem[COLS],
                ...findOutPosition,
            },
        };

        data.items = [...data.items, ...[newItem]];

        //console.log('widgets_data size ' + data.widgets.length + ' items size ' + data.items.length);
    }

    function removeItem(itemIndex) {
        //console.log(itemIndex);

        if (itemIndex > -1) {
            data.items.splice(itemIndex, 1);
            data.widgets.splice(itemIndex, 1);
        }

        data.items = gridHelp.normalize(data.items, COLS);

        //console.log('widgets_data size ' + data.widgets.length + ' items size ' + data.items.length);
        modified = true;
    }

    async function getOrganization(id) {
        let apiUrl = utils.getBackendUrl(location) + '/api/organization/' + id
        await sgxdata.getOrganization(dev, apiUrl, $token)
        .then((response) => {
            if (response.status == 200) {
                return response.data.name
            }
        }).catch((error) => {
            console.log(error)
        });
        return ''
    }

    function copyItem(index) {
        modified = true
        let newWidget=structuredClone(data.widgets[index])
        newWidget.name = 'w'+data.widgets.length.toString()
        newWidget.title = newWidget.title + ' copy'
        data.widgets.push(newWidget);

        let newItem = {
            id: id(),
            10: gridHelp.item({
                w: 2,
                h: 2,
                x: 0,
                y: 0,
                draggable: true, resizable: true
            }),
            1: gridHelp.item({
                w: 1,
                h: 1,
                x: 0,
                y: 0,
                draggable: true, resizable: true
            }),
        };

        let findOutPosition = gridHelp.findSpace(newItem, data.items, COLS);

        newItem = {
            ...newItem,
            [COLS]: {
                ...newItem[COLS],
                ...findOutPosition,
            },
        };

        data.items = [...data.items, ...[newItem]];
    }

    let labels = {
        'title': {
            'pl': "Konfiguracja pulpitu",
            'en': "Dashboard configuration"
        },
        'view': {
            'pl': "Pokaż pulpit",
            'en': "Show dashboard"
        },
        'id': {
            'pl': "Identyfikator",
            'en': "Identifier"
        },
        'owner': {
            'pl': "Właściciel",
            'en': "Owner"
        },
        'shared': {
            'pl': "Udostępniony",
            'en': "Shared"
        },
        'dashboard_title': {
            'pl': "Tytuł",
            'en': "Title"
        },
        'organization': {
            'pl': "Organizacja",
            'en': "Organization"
        },
        'widget_title': {
            'pl': "Tytuł kontrolki",
            'en': "Widget title"
        },
        'widget_team': {
            'pl': "Zespół",
            'en': "Team"
        },
        'widget_admins': {
            'pl': "Administratorzy",
            'en': "Administrators"
        },
        'cancel': {
            'pl': "Anuluj",
            'en': "Cancel"
        },
        'save': {
            'pl': "Zapisz",
            'en': "Save"
        },
        'remove': {
            'pl': "Usuń",
            'en': "Remove"
        },
        'fetcherror': {
            'pl': "Błąd pobierania danych: ",
            'en': "Fetch error: "
        },
        'fetcherror_message': {
            'pl': " Możliwa przyczyna: sertyfikaty self signed nie są obsługiwane.",
            'en': " Possible cause: self signed certificates are not supported."
        }
    }


</script>
<style>
    .size {
        max-width: 1500px;
        width: 100%;
        height: 2000px;
    }

    .demo-widget {
        height: 100%;
        width: 100%;
        display: flex;

    }

    .demo-container {
        max-width: 1500px;
        width: 100%;
    }
</style>