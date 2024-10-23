<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>applications</h5>
</div>
<div class="col-12">
    {#await promise then apps}
    <div class="table-responsive">
        <table class="table table-striped table-sm">
            <thead>
                <tr>
                    <th>id</th>
                    <th>organization</th>
                    <th>name</th>
                    <th>description</th>
                </tr>
            </thead>
            <tbody>
                {#each apps as app}
                <tr>
                    <td><a href="/admin/applications/{app.id}">{app.id}</a></td>
                    <td>{app.organization}</td>
                    <td><a href="/admin/applications/{app.id}">{app.name}</a></td>
                    <td>{app.description}</td>
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
    {/await}
</div>
<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { dev } from '$app/environment';

    let offset = 0;
    let limit = 10;
    let promise = getApplications(offset)

    onMount(async () => {
        if (!$isAuthenticated) {
            goto('/login');
        }
    });

    async function getApplications(actualOffset) {
        let apps = []
        if (!$isAuthenticated) {
            return apps
        }
        if (dev) {
            for (var i = 0; i < limit; i++) {
                apps.push(
                    {
                        id: (i + actualOffset + 1),
                        organization: 1,
                        name: 'app' + (i + actualOffset + 1),
                        description: 'GENERIC'
                    }
                )
            }
        } else {
            let headers = new Headers();
            let url = utils.getBackendUrl(location) + "/api/core/application";
            url = url + '?offset=' + actualOffset + '&limit=' + limit

            //if (loginFilter.length > 0) {
            //    url = url + '&search=id:' + loginFilter
            //    offset = 0
            //} else if (nameFilter.length > 0) {
            //    url = url + '&search=name:' + nameFilter
            //    offset = 0
            //}
            headers.set('Authentication', $token);
            headers.set('Access-Control-Allow-Origin', '*');
            await fetch(url,
                {
                    mode: 'cors',
                    method: 'GET',
                    referrerPolicy: 'origin-when-cross-origin',
                    headers: headers
                })
                .then((response) => {
                    if (response.status == 200) {
                        apps = response.json();
                    } else if (response.status == 401 || response.status == 403) {
                        token.set(null)
                    } else {
                        alert(alertMessage.replace('%1', response.status).replace('%2', response.statusText))
                    }
                }).catch((error) => {
                    console.log(error)
                });
        }
        return apps;
    }


    let labels = {
        'title': {
            'pl': "Aplikacje",
            'en': "Applications"
        }
    }
</script>