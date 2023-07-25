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
                        {#if $userSession.logged && $userSession.login!=''}
                        <span class="lead">{$userSession.login} </span>
                        {:else}
                        <span>{utils.getText('signin',session.language, labels)}</span>
                        {/if}
                        <i class="bi bi-caret-down-fill ms-1"></i>
                    </a>
                    <ul class="dropdown-menu">
                        {#if !$userSession.logged || $userSession.login==''}
                        <li><a class="dropdown-item" href="/login">
                                <span data-bs-toggle="collapse"
                                    data-bs-target=".navbar-collapse.show">{utils.getText('signin',session.language,
                                    labels)}</span>
                            </a></li>
                        {:else}
                        <li><a class="dropdown-item" href="/" on:click={logout}>
                                <span data-bs-toggle="collapse"
                                    data-bs-target=".navbar-collapse.show">{utils.getText('signout',session.language,
                                    labels)}</span></a>
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
                                <i class="bi bi-house me-2"></i>{utils.getText('home',session.language, labels)}
                            </span>

                        </a>
                    </li>
                    {#if $userSession.logged && $userSession.login!=''}
                    {#if $userSession.organization!=0}
                    <li class="nav-item">
                        <a class="nav-link" class:active={$page.url.pathname==='/organization' } href="/organization">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-bank me-2"></i>{utils.getText('organization',session.language, labels)}
                            </span>
                        </a>
                    </li>
                    {/if}
                    <li class="nav-item">
                        <a class="nav-link" class:active={$page.url.pathname==='/dashboards' } href="/dashboards">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-columns-gap me-2"></i>{utils.getText('dashboards',session.language,
                                labels)}
                            </span>
                        </a>
                    </li>
                    <!-- Structure -->
                    <li class="nav-item">
                        <a class="nav-link" class:active={false} on:click={toggleStructure}>
                            <span><i class="bi bi-diagram-3 me-2"></i><span>{utils.getText('structure',session.language,
                                    labels)}</span>
                        </a>
                    </li>
                    {#if structureExpanded}
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname==='/devices' } href="/devices">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-hdd-network me-2"></i><span>{utils.getText('devices',session.language,
                                    labels)}</span>
                        </a>
                    </li>
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname==='/groups' } href="/groups">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-hdd-stack me-2"></i><span>{utils.getText('groups',session.language,
                                    labels)}</span>
                        </a>
                    </li>
                    {#if $userSession.role==='admin'}
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname==='/applications' } href="/applications">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-code-square me-2"></i><span>{utils.getText('apps',session.language,
                                    labels)}</span>
                        </a>
                    </li>
                    {/if}
                    {/if}
                    <li class="nav-item">
                        <a class="nav-link" class:active={$page.url.pathname==='/notifications' } href="/notifications">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-megaphone me-2"></i>{utils.getText('notifications',session.language,
                                labels)}
                            </span>
                            {#if alertCounter.value>0}
                            <span class="badge rounded-pill text-bg-danger ms-2">{alertCounter.value}</span>
                            {/if}
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" class:active={$page.url.pathname==='/settings' } href="/settings">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-sliders me-2"></i>{utils.getText('settings',session.language, labels)}
                            </span>
                        </a>
                    </li>
                    {#if $userSession.type==1}
                    <!-- Administration -->
                    <li class="nav-item">
                        <a class="nav-link" class:active={false} on:click={toggleAdministration}>
                            <span><i class="bi bi-tools me-2"></i><span>{utils.getText('administration',session.language,
                                    labels)}</span>
                        </a>
                    </li>
                    {#if administrationExpanded}
                    <!-- TODO -->
                    {/if}
                    <!-- end Administration -->
                    {/if}
                    <!-- end logged in -->
                    {/if}
                    <li class="nav-item">
                        <a class="nav-link" class:active={$page.url.pathname==='/about' } href="/about">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-question-circle me-2"></i>{utils.getText('about',session.language,
                                labels)}
                            </span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
        <main class="col-md-9 col-lg-10 ms-sm-auto px-md-4">
            {#if ($userSession.logged && !$userSession.authorized)}
            <div class="alert alert-danger w-100 mt-2 text-center" role="alert">
                {utils.getText('api-unavialble',session.language, labels)}
            </div>
            {/if}
            <slot></slot>
        </main>
    </div>
</div>
<script>
    import { page } from '$app/stores';
    import { userSession } from '$lib/stores.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { utils } from '$lib/utils.js';
    import { browser } from '$app/environment'
    import { poll } from '$lib/poll.js';
    import { dev } from '$app/environment';
    import { sgxdata } from '$lib/sgxdata.js';

    function logout() {
        console.log("LOGOUT")
        userSession.set({ logged: false, login: '', password: '', language: 'en' })
        if (browser) {
            try {
                window.localStorage.removeItem('sgx.session.token');
            } catch (error) {
                console.log(error)
            }
        }
        return true
    }

    let session;
    userSession.subscribe(value => {
        session = value;
        if (!session.logged) {
            try {
                if (browser) {
                    if (window.localStorage.getItem('sgx.session.token') != null) {
                        session.token = window.localStorage.getItem('sgx.session.token')
                        session.logged = true
                        session.authorized = true
                    } else {
                        console.log("NO TOKEN")
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    });

    let structureExpanded = false;
    function toggleStructure(event) {
        structureExpanded = !structureExpanded;
    }
    let administrationExpanded = false;
    function toggleAdministration(event) {
        administrationExpanded = !administrationExpanded;
    }

    function setLanguagePl(event) {
        console.log("SET LANGUAGE PL")
        session.language = 'pl';
        userSession.set(session);
        goto('/')
        return true
    }
    function setLanguageEn(event) {
        console.log("SET LANGUAGE EN")
        session.language = 'en';
        userSession.set(session);
        goto('/')
        return true
    }
    let alertCounter= {value:0}
    poll(async function fetchData() {
        // your implementation goes here
        if (session.logged && session.authorized) {
            console.log("POLL")
            await sgxdata.getNotifications(dev, 'https://localhost/api/alert', 0, 0, session.token).then((data) => {
                alertCounter.value = data.value
            }).catch((error) => {
                console.log(error)
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
        }
        ,
        'about': {
            'pl': "O aplikacji",
            'en': "About"
        },
        'api-unaviable': {
            'pl': "Brak dostępu do API serwisu",
            'en': "Service API unaviable"
        }
    }
</script>