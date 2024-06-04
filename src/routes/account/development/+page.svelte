<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels, $language)}</h5>
</div>
<div class="row">
    <div class="col-12">
        <h6>
            {utils.getLabel('tokens',labels, $language)}
        </h6>
    </div>
</div>
{#if newTokenPromise==null}
<div class="row">
    <div class="col-12">
        {#await promise}
        <p>{utils.getLabel('loading',labels, $language)}</p>
        {:then data}
        {#if isNaN(data)}
        <p>{utils.getLabel('noTokensFound',labels, $language)}</p>
        {:else}
        <p>{utils.getLabel('tokenValidUntil',labels, $language)} {getLocalDataFromEpoch(data, $language)}</p>
        {/if}
        {:catch error}
        <p>error: {error.message}</p>
        {/await}
    </div>
</div>
{/if}
{#if newTokenPromise!=null}
<div class="row">
    <div class="col-12">
        {#await newTokenPromise}
        <p>{utils.getLabel('loading',labels, $language)}</p>
        {:then data}
        <p>{utils.getLabel('tokenCreated',labels, $language)} <b>{data}</b></p>
        <p>{utils.getLabel('remember',labels, $language)}</p>
        {:catch error}
        <p>error: {error.message}</p>
        {/await}
    </div>
</div>
{/if}
<div class="row">
    <div class="col-12">
        <button type="button" class="btn btn-outline-primary ms-2" on:click={createNewToken}>{utils.getLabel('create',labels,$language)}</button>
        <button type="button" class="btn btn-outline-danger me-2" on:click={removeToken}>{utils.getLabel('removeToken',labels,$language)}</button>
    </div>
</div>

<Dialog bind:dialog callback={doSelectedAction} message={dialogText} title={utils.getLabel('alert',labels,$language)}
    labels={['OK','cancel']}>
</Dialog>
<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { utils } from '$lib/utils.js';
    import Dialog from '$lib/components/Dialog.svelte'

    onMount(async () => {
        if (!$isAuthenticated) {
            console.log('redirect to login');
            goto('/login');
        }
    });

    let promise = fetch('/api/auth/token', {
        method: 'GET',
        headers: {
            'Authentication': $token,
        }
    }).then(response => response.text()).then(data => {
        console.log(data);
        return data;
    });

    let newTokenPromise = null;
    let dialog;
    let selectedAction = null;

    let dialogText
    $: if(selectedAction=='create'){
        dialogText = utils.getLabel('createQuestion', labels, $language)
    } else if(selectedAction=='remove'){
        dialogText = utils.getLabel('removeQuestion', labels, $language)
    } else{
        dialogText = ''
    }

    function getDialogText() {
        if (selectedAction == 'create') {
            return utils.getLabel('createQuestion', labels, $language);
        } else if (selectedAction == 'remove') {
            return utils.getLabel('removeQuestion', labels, $language);
        }
    }

    function doSelectedAction(decision) {
        if (selectedAction == 'create') {
            doCreate(decision);
        } else if (selectedAction == 'remove') {
            doRemove(decision);
        }
    }

    function createNewToken() {
        selectedAction = 'create';
        dialog.showModal();
    }

    function doCreate(decision) {
        dialog.close()
        selectedAction = null;
        if (!decision) {
            return
        }
        newTokenPromise = fetch('/api/auth/token?lifetime=' + 5259600, { //10 years
            method: 'POST',
            headers: {
                'Authentication': $token,
            }
        }).then(response => response.text()).then(data => {
            console.log(data);
            return data;
        });
    }

    function removeToken() {
        selectedAction = 'remove';
        dialog.showModal();
    }

    function doRemove(decision) {
        dialog.close()
        selectedAction = null;
        if (!decision) {
            return
        }
        fetch('/api/auth/token', {
            method: 'DELETE',
            headers: {
                'Authentication': $token,
            }
        }).then(response => {
            console.log(response);
            if (response.status == 200) {
                console.log('token removed');
                promise = fetch('/api/auth/token', {
                    method: 'GET',
                    headers: {
                        'Authentication': $token,
                    }
                }).then(response => response.text()).then(data => {
                    console.log(data);
                    return data;
                });
            }
        });
    }

    function getLocalDataFromEpoch(milliseconds, language) {
        console.log("milliseconds", milliseconds);
        try {
            let date = new Date(Number(milliseconds));
            return new Intl.DateTimeFormat(language=='pl'?'pl-PL':'en-US', {
                dateStyle: 'long',
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            }).format(date)

        } catch (e) {
            return e;
        }
    }

    let labels = {
        'tokens': {
            'en': "API access tokens",
            'pl': "Tokeny dostępu do  API"
        },
        'title': {
            'en': "Developer settings",
            'pl': "Ustawienia deweloperskie"
        },
        'description': {
            'en': "Here you can manage your access tokens.",
            'pl': "Tutaj możesz zarządzać swoimi tokenami dostępu."
        },
        'create': {
            'en': "Create new token",
            'pl': "Utwórz nowy token"
        },
        'tokenCreated': {
            'pl': "Został utworzony nowy token API: ",
            'en': "New API token has been created: "
        },
        'remember': {
            'pl': "Zapamiętaj ten token, ponieważ nie będzie on wyświetlany ponownie.",
            'en': "Remember this token, as it will not be displayed again."
        },
        'loading': {
            'en': "loading...",
            'pl': "ładowanie..."
        },
        'noTokensFound': {
            'en': "No tokens found",
            'pl': "Nie znaleziono tokenów"
        },
        'tokenValidUntil': {
            'pl': "Masz token API ważny do: ",
            'en': "You have API token valid until: "
        },
        'removeToken': {
            'pl': "Usuń token",
            'en': "Remove token"
        },
        'alert': {
            'pl': "Uwaga!",
            'en': "Warning!"
        },
        'removeQuestion': {
            'pl': "Czy na pewno chcesz usunąć token?",
            'en': "Are you sure you want to remove the token?"
        },
        'createQuestion': {
            'pl': " Utworzenie nowego tokenu spowoduje usunięcie aktualnego. Czy na pewno chcesz utworzyć nowy token?",
            'en': " Creating new token will remove the current one. Are you sure you want to create new token?"
        },
    }
</script>