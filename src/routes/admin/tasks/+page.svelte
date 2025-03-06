<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels,$language)}</h5>
</div>
{#await promise then tasks}
<div class="col-12">
    <div class="table-responsive">
        <table class="table table-striped table-sm">
            <thead>
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>type</th>
                    <th>enabled</th>
                    <th>schedule</th>
                </tr>
            </thead>
            <tbody>
                {#each tasks as task}
                <tr>
                    <td><a href="/admin/tasks/{task.id}">{task.id}</a></td>
                    <td><a href="/admin/tasks/{task.id}">{task.jobName}</a></td>
                    <td>{task.type}</td>
                    <td>{task.enabled}</td>
                    <td>{task.scheduleDefinition}</td>
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
<div class="row">
    <div class="col-2">
        {#if payingUser}
        <a class="btn btn-outline-primary" role="button"
            href="/admin/tasks/new/edit">{utils.getLabel('add',labels,$language)}</a>
        {/if}
    </div>
    <div class="col-10">
        <nav aria-label="Table navigation">
            <ul class="pagination justify-content-end">
                <li class="page-item">
                    <a class="page-link" class:disabled={offset==0} on:click={handleLoadPrevious}>
                        <span aria-hidden="true"> &laquo; </span>
                    </a>
                </li>
                <li class="page-item">
                    <a class="page-link disabled" on:click={handleDoNothing}>
                        {offset+1}-{offset+tasks.length}
                    </a>
                </li>
                <li class="page-item">
                    <a class="page-link" class:disabled={tasks.length<limit} on:click={handleLoadNext}>
                        <span aria-hidden="true"> &raquo; </span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</div>
{/await}
<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { dev } from '$app/environment';

    let offset = 0;
    let limit = 10;
    let promise = getTasks(offset)
    let payingUser = utils.isPayingUser($profile.type)

    onMount(async () => {
        if (!$isAuthenticated) {
            goto('/login');
        }
    });

    async function getTasks(actualOffset) {
        let apps = []
        if (!$isAuthenticated) {
            return apps
        }
        if (dev) {
            for (var i = 0; i < limit; i++) {
                apps.push(
                    {
                        id: (i + actualOffset + 1),
                        type: 1,
                        userId: '',
                        enabled: true,
                        triggerName: 'trigger'+(i + actualOffset + 1),
                        triggerGroup: 'events',
                        jobName: 'job'+(i + actualOffset + 1),
                        jobGroup: 'jobs',
                        nlScheduleDefinition: 'Every 5 minutes',
                        scheduleDefinition: '0 0/5 * * * ?',
                        jobDataMap: {}
                    }
                )
            }
        } else {
            let headers = new Headers();
            let url = utils.getBackendUrl(location) + "/api/scheduler/tasks";
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

    function handleLoadPrevious(event) {
        offset = offset - limit
        if (offset < 0) offset = 0
        promise = getTasks(offset)
    }
    function handleLoadNext(event) {
        offset = offset + limit;
        promise = getTasks(offset);
    }
    function handleDoNothing(event) {
        console.log(event)
    }

    let labels = {
        'title': {
            'pl': "Zadania",
            'en': "Tasks"
        }
    }
</script>