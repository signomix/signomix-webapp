<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels, $language)}</h5>
</div>
<div class="row">
    <div class="col-12">
        <h6>
            {utils.getLabel('tokens',labels, $language)}
        </h6>
        <p>{utils.getLabel('description',labels, $language)}</p>
    </div>
</div>
{#if newTokenPromise==null}
<div class="row">
    <div class="col-12">
        {#await promise}
        <p>{utils.getLabel('loading',labels, $language)}</p>
        {:then data}
        <p>{utils.getLabel('tokenValidUntil',labels, $language)} {getLocalDataFromEpoch(data)}</p>
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
        <p>{utils.getLabel('tokenCreated',labels, $language)} {data}</p>
        <p>{utils.getLabel('remember',labels, $language)}</p>
        {:catch error}
        <p>error: {error.message}</p>
        {/await}
    </div>
</div>
{/if}
<div class="row">
    <div class="col-12">
        <button type="button" class="btn btn-danger me-2" on:click={removeToken}>{utils.getLabel('removeToken',labels,$language)}</button>
        <button type="button" class="btn btn-primary ms-2" on:click={createNewToken}>{utils.getLabel('create',labels,$language)}</button>
    </div>
</div>

<Dialog2 bind:dialog2 callback={doRemove} title={utils.getLabel('removeQuestion',labels,$language)}
    labels={['OK','cancel']}>
</Dialog2>
<Dialog bind:dialog callback={doCreate} title={utils.getLabel('createQuestion',labels,$language)}
    labels={['OK','cancel']}>
</Dialog>
<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { utils } from '$lib/utils.js';
    import Dialog from '$lib/components/Dialog.svelte'
    import Dialog2 from '$lib/components/Dialog2.svelte'

    onMount(async () => {
        if (!$isAuthenticated) {
            console.log('redirect to login');
            goto('/login');
        }
    });
    
    let locale;
    $: locale = $language=='pl'?'pl-PL':'en-US';

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
    let dialog2;

    function createNewToken() {
        console.log('dialog', dialog);
        dialog.showModal();
    }

    function doCreate(decision) {
        dialog.close()
        if (!decision) {
            return
        }
        newTokenPromise = fetch('/api/auth/token?lifetime=' + 1000, {
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
        console.log('dialog2', dialog2);
        dialog2.showModal();
    }

    function doRemove(decision) {
        dialog2.close()
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

    function getLocalDataFromEpoch(milliseconds) {
        console.log("milliseconds", milliseconds);
        try {
/*             const options = {
                hour12: false,
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            }; */
            let date = new Date(Number(milliseconds));
            //return date.toLocaleString(undefined, options);
            return new Intl.DateTimeFormat(locale, {
                dateStyle: 'long',
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            }).format(date)

        } catch (e) {
            return e;
        }
    }

    /*         let promise = fetch('/api/auth/token?lifetime='+1000, {
                method: 'POST',
                headers: {
                    'Authentication': $token,
                }
            }).then(response => response.text()).then(data => {
                console.log(data);
                return data;
            });  */



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
            'pl': "Uwaga! Utworzenie nowego tokenu spowoduje usunięcie aktualnego. Czy na pewno chcesz kontynuować?",
            'en': "Warning! Creating new token will remove the current one. Are you sure you want to continue?"
        },
        'removeQuestion': {
            'pl': "Czy na pewno chcesz usunąć token?",
            'en': "Are you sure you want to remove the token?"
        },
        'createQuestion': {
            'pl': "Czy na pewno chcesz utworzyć nowy token?",
            'en': "Are you sure you want to create new token?"
        },
    }
</script>