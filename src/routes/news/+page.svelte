{#if !$isAuthenticated}
<div class="alert alert-danger w-100 mt-2 text-center" role="alert">
    Brak dostępu
</div>
{:else}
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('news',labels,$language)}</h5>
</div>
{#await promise}
{:then data}
<div class="row">
    <div class="col-12">
        <div class="table-responsive">
            <table class="table">
                <thead class="table-light">
                    <tr>
                        <th scope="col" class="col-9">Tytuł</th>
                        <th scope="col" class="col-3">Data</th>
                        <!-- <th scope="col" class="col-1"></th> -->
                    </tr>
                </thead>
                <tbody>
                    {#each data.news as post, index}
                    <tr>
                        <td class="col-9"><a href="/news/{post.newsId}">{post.title}</a></td>
                        <td class="col-3">{new Date(post.created).toLocaleString()}</td>
                        <!-- <td class="col-1"><a href="#" on:click|preventDefault={remove(post.id)}><i class="bi bi-trash3 link-dark"></i></a></td> -->
                    </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">
        <nav aria-label="Table navigation">
            <ul class="pagination justify-content-end">
                <li class="page-item">
                    <a class="page-link" class:disabled={offset==0} on:click={handleLoadPrevious}>
                        <span aria-hidden="true" class="px-2"> &laquo;</span>
                    </a>
                </li>
                <li class="page-item">
                    <a class="page-link disabled" on:click={handleDoNothing}>
                        {offset+1}-{offset+data.news.length}
                    </a>
                </li>
                <li class="page-item">
                    <a class="page-link" class:disabled={data.news.length<limit} on:click={handleLoadNext}>
                        <span aria-hidden="true" class="px-2">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</div>
{/await}
{/if}
<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { dev } from '$app/environment';
    import { invalidateAll } from '$app/navigation';


    export let data
    let offset = 0
    let limit = 20
    let errorMessage = ''

    let promise = getNews()

    async function getNews() {
        let news = []
        if (!$isAuthenticated) {
            return news
        }
        if (dev) {
            news = {
                "news": [
                    { "id": 1, "title": "News 1", "created": "2021-01-01T12:00:00" },
                    { "id": 2, "title": "News 2", "created": "2021-01-02T12:00:00" },
                    { "id": 3, "title": "News 3", "created": "2021-01-03T12:00:00" },
                    { "id": 4, "title": "News 4", "created": "2021-01-04T12:00:00" },
                    { "id": 5, "title": "News 5", "created": "2021-01-05T12:00:00" },
                    { "id": 6, "title": "News 6", "created": "2021-01-06T12:00:00" },
                    { "id": 7, "title": "News 7", "created": "2021-01-07T12:00:00" },
                    { "id": 8, "title": "News 8", "created": "2021-01-08T12:00:00" },
                    { "id": 9, "title": "News 9", "created": "2021-01-09T12:00:00" },
                    { "id": 10, "title": "News 10", "created": "2021-01-10T12:00:00" },
                    { "id": 11, "title": "News 11", "created": "2021-01-11T12:00:00" },
                    { "id": 12, "title": "News 12", "created": "2021-01-12T12:00:00" },
                    { "id": 13, "title": "News 13", "created": "2021-01-13T12:00:00" },
                    { "id": 14, "title": "News 14", "created": "2021-01-14T12:00:00" }
            ],
            size: 14
            }
        } else {
            let headers = new Headers();
            let url = utils.getBackendUrl(location) + "/api/ms/news"
            url = url + '?language='+$language+'&offset=' + offset + '&limit=' + limit
            headers.set('Authentication', $token);
            headers.set('Access-Control-Allow-Origin', '*');
            await fetch(url, { 
                    mode: 'cors',
                    method: 'GET',
                    referrerPolicy: 'origin-when-cross-origin',
                    headers: headers 
                })
                .then((response) => {
                    if (response.status == 200) {
                        news = response.json();
                    } else if (response.status == 401 || response.status == 403) {
                        token.set(null)
                    } else {
                        alert(alertMessage.replace('%1', response.status).replace('%2', response.statusText))
                    }
                }).catch((error) => {
                    console.log(error)
                });
        }
        return news;
    }
    function handleLoadPrevious(event) {
        offset = offset - limit
        if (offset < 0) offset = 0
        promise = getNews()
    }
    function handleLoadNext(event) {
        offset = offset + limit;
        promise = getNews();
    }
    function handleDoNothing(event) {
        console.log(event)
    }
    function remove(id){
        console.log("remove alert"+id)
        sendRemove(id)
        promise = getNews()
        //invalidateAll()
    }
/*     function removeAll(){
        if (confirm("Czy na pewno chcesz usunąć wszystkie powiadomienia?")) {
            console.log("remove all alerts")
            sendRemove("-1")
            offset = 0
            promise = getNews()
            //invalidateAll()
        }
    } */

    function sendRemove(id) {
        if(dev){
            return
        }
        const headers = new Headers()
        let method = 'DELETE'
        let url = utils.getBackendUrl(location) + "/api/ms/news/" + id
        headers.set('Authentication', $token);
        let response = fetch(
            url,
            { method: method, mode: 'cors', headers: headers }
        ).then((response) => {
            if (response.status == 200) {
                errorMessage = ''
                //goto('/notifications')
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

    let labels = {
        'news': {
            'pl': "Wiadomości",
            'en': "News"
        }
    }


</script>