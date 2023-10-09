<header class="navbar navbar-dark bg-primary sticky-top flex-md-nowrap p-0 shadow">
    <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="/"><img src="/img/logo-light.svg"
            height="30px" /><span class="h5 m-2">Signomix</span></a>
    <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse"
        data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
</header>
<div class="container-fluid">
    <div class="row">
        <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse navbar-collapse">
            <div class="position-sticky pt-0 sidebar-sticky">
                <div class="nav flex-column">
                    <a class="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="h2 bi bi-person-circle me-2"></i>
                        {#if $isAuthenticated}
                        <span class="lead">{$profile.uid}</span>
                        {:else}
                        <span>{utils.getLabel('signin',labels,$language)}</span>
                        {/if}
                        <i class="bi bi-caret-down-fill ms-1"></i>
                    </a>
                    <ul class="dropdown-menu">
                        {#if !$isAuthenticated}
                        <li><a class="dropdown-item" href="/login">
                                <span data-bs-toggle="collapse"
                                    data-bs-target=".navbar-collapse.show">{utils.getLabel('signin',labels,$language)}</span>
                            </a></li>
                        {:else}
                        <li><a class="dropdown-item" href="/" on:click={logout}>
                                <span data-bs-toggle="collapse"
                                    data-bs-target=".navbar-collapse.show">{utils.getLabel('signout',labels,$language)}</span></a>
                        </li>
                        {/if}
                        <li><a class="dropdown-item" href="/" on:click|preventDefault={setLanguagePl}>
                                <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">PL</span></a>
                        </li>
                        <li><a class="dropdown-item" href="/" on:click|preventDefault={setLanguageEn}>
                                <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">EN</span></a>
                        </li>
                    </ul>
                </div>
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link" class:active={$page.url.pathname==='/' } href="/">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-house me-2"></i>{utils.getLabel('home',labels,$language)}
                            </span>

                        </a>
                    </li>
                    {#if $isAuthenticated}
                    {#if $profile && !utils.isDefaultOrganizationUser($profile)}
                    {#if !utils.isUserRole($profile, 'limited', false)}
                    <li class="nav-item">
                        <a class="nav-link" class:active={false} on:click={toggleOrganization}>
                            <span><i class="bi bi-building me-2"></i><span>{utils.getLabel('organization',labels,$language)}</span>
                        </a>
                    </li>
                    {/if}
                    {#if organizationExpanded && !utils.isUserRole($profile, 'limited', false)}
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname==='/organization/settings' }
                            href="/organization/settings">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i
                                    class="bi bi-building-gear me-2"></i><span>{utils.getLabel('orgsettings',labels,$language)}</span>
                        </a>
                    </li>
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname==='/organization/applications' }
                            href="/organization/applications">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-box me-2"></i>{utils.getLabel('applications',labels,$language)}
                            </span>
                        </a>
                    </li>
                    {/if}
                    {/if}
                    <li class="nav-item">
                        <a class="nav-link" class:active={$page.url.pathname==='/dashboards' } href="/dashboards">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-columns-gap me-2"></i>{utils.getLabel('dashboards',labels,$language)}
                            </span>
                        </a>
                    </li>
                    <!-- Structure -->
                    {#if !utils.isUserRole($profile, 'limited', false)}
                    <li class="nav-item">
                        <a class="nav-link" class:active={false} on:click={toggleStructure}>
                            <span><i
                                    class="bi bi-diagram-3 me-2"></i><span>{utils.getLabel('structure',labels,$language)}</span>
                        </a>
                    </li>
                    {/if}
                    {#if structureExpanded && !utils.isUserRole($profile, 'limited', false)}
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname==='/devices' } href="/devices">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i
                                    class="bi bi-hdd-network me-2"></i><span>{utils.getLabel('devices',labels,$language)}</span>
                        </a>
                    </li>
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname==='/groups' } href="/groups">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i
                                    class="bi bi-hdd-stack me-2"></i><span>{utils.getLabel('groups',labels,$language)}</span>
                        </a>
                    </li>
                    {/if}
                    <li class="nav-item">
                        <a class="nav-link" class:active={$page.url.pathname==='/notifications' } href="/notifications">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-megaphone me-2"></i>{utils.getLabel('notifications',labels,$language)}
                            </span>
                            {#if alertCounter.value>0}
                            <span class="badge rounded-pill text-bg-danger ms-2">{alertCounter.value}</span>
                            {/if}
                        </a>
                    </li>
                    {#if !utils.isUserRole($profile, 'limited', false)}
                    <li class="nav-item">
                        <a class="nav-link" class:active={$page.url.pathname==='/settings' } href="/settings">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-sliders me-2"></i>{utils.getLabel('settings',labels,$language)}
                            </span>
                        </a>
                    </li>
                    {/if}
                    {#if $profile.type==1}
                    <!-- Administration -->
                    <li class="nav-item">
                        <a class="nav-link" class:active={false} on:click={toggleAdministration}>
                            <span><i
                                    class="bi bi-tools me-2"></i><span>{utils.getLabel('administration',labels,$language)}</span>
                        </a>
                    </li>
                    {#if administrationExpanded}
                    <!-- TODO -->
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname==='/admin/applications' } href="/admin/applications">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i
                                    class="bi bi-code-square me-2"></i><span>{utils.getLabel('apps',labels,$language)}</span>
                        </a>
                    </li>
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname==='/admin/organizations' } href="/admin/organizations">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i
                                    class="bi bi-building me-2"></i><span>{utils.getLabel('organizations',labels,$language)}</span>
                        </a>
                    </li>
                    {/if}
                    <!-- end Administration -->
                    {/if}
                    <!-- end logged in -->
                    {/if}
                    {#if !utils.isUserRole($profile, 'limited', false)}
                    <li class="nav-item">
                        <a class="nav-link" class:active={$page.url.pathname==='/documentation' }
                            href="https://documentation.signomix.com" target="_blank">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i
                                    class="bi bi-question-circle me-2"></i>{utils.getLabel('documentation',labels,$language)}
                            </span>
                        </a>
                    </li>
                    {/if}
                </ul>
            </div>
        </nav>
        <main class="col-md-9 col-lg-10 ms-sm-auto px-md-4">
            {#if $isAuthenticated || $page.url.pathname==='/login'}
            <slot></slot>
            {/if}
        </main>
    </div>
</div>
<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { utils } from '$lib/utils.js';
    import { browser } from '$app/environment'
    import { poll } from '$lib/poll.js';
    import { dev } from '$app/environment';
    import { sgxdata } from '$lib/sgxdata.js';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { getInfo, platformInfo, defaultOrganizationId } from '$lib/stores.js';

    /* $: available=setAvailableOptions($profile)

    function isAvailable(endpoint){
        let result = available.includes(endpoint)
        console.log('isAvailable', available, endpoint, result)
        return result
    }
    function setAvailableOptions(userProfile){
        console.log('setAvailableOptions', userProfile)
        if(utils.isUserRole(userProfile, 'limited')){
            return []
        }else{
            return ['/documentation']
        }
    }
 */

    onMount(async () => {
        //console.log('onMount', $page)
        getInfo($page.url)
    });

    function logout() {
        console.log("LOGOUT")
        token.set(null)
        return true
    }

    let structureExpanded = false;
    function toggleStructure(event) {
        structureExpanded = !structureExpanded;
    }
    let administrationExpanded = false;
    function toggleAdministration(event) {
        administrationExpanded = !administrationExpanded;
    }
    let organizationExpanded = false;
    function toggleOrganization(event) {
        organizationExpanded = !organizationExpanded;
    }

    function setLanguagePl(event) {
        language.set('pl')
        return true
    }
    function setLanguageEn(event) {
        language.set('en')
        return true
    }
    /* function isVisible(endpoint) {
        let restricted = ['/', '/login', '/about', '/documentation']
        console.log('profile', $profile)
        console.log('isvisible', endpoint, restricted.includes(endpoint), utils.isUserRole($profile, 'limited'))
        if (restricted.includes(endpoint) && utils.isUserRole($profile, 'limited')) {
            return false
        }
        return true
    } */
    let alertCounter = { value: 0 }
    poll(async function fetchData() {
        if ($isAuthenticated) {
            let url = utils.getBackendUrl(location) + "/api/core/notifications/status"
            console.log("POLL")
            await sgxdata.getNotifications(dev, url, 0, 0, $token)
                .then((data) => {
                    //alertCounter.value = data.value
                    alertCounter.value = data
                }).catch((error) => {
                    console.log('POLL ERROR', error)
                    token.set(null)
                })
        }
    }, dev ? 10000 : 60000);

    let labels = {
        'home': {
            'pl': "Strona główna",
            'en': "Home"
        },
        'signin': {
            'pl': "Zaloguj się",
            'en': "Sign in"
        },
        'signout': {
            'pl': "Wyloguj się",
            'en': "Sign out"
        },
        'anonymous': {
            'pl': "niezalogowany",
            'en': "anonymous"
        },
        'organization': {
            'pl': "Organizacja",
            'en': "Organization"
        },
        'organizations': {
            'pl': "Organizacje",
            'en': "Organizations"
        },
        'orgsettings': {
            'pl': "Dane",
            'en': "Data"
        },
        'devices': {
            'pl': "Urządzenia",
            'en': "Devices"
        },
        'groups': {
            'pl': "Grupy",
            'en': "Groups"
        },
        'apps': {
            'pl': "Aplikacje",
            'en': "Applications"
        },
        'structure': {
            'pl': "Struktura",
            'en': "Structure"
        },
        'dashboards': {
            'pl': "Pulpity",
            'en': "Dashboards"
        },
        'notifications': {
            'pl': "Powiadomienia",
            'en': "Notifications"
        },
        'settings': {
            'pl': "Ustawienia",
            'en': "Settings"
        },
        'administration': {
            'pl': "Administracja",
            'en': "Administration"
        },
        'documentation': {
            'pl': "Dokumentacja",
            'en': "Documentation"
        },
        'about': {
            'pl': "O aplikacji",
            'en': "About"
        },
        'api-unaviable': {
            'pl': "Brak dostępu do API serwisu",
            'en': "Service API unaviable"
        },
        'applications': {
            'pl': 'Aplikacje',
            'en': 'Applications'
        }
    }
</script>