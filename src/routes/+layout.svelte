<script>
    import { page } from '$app/stores';
    import { userSession } from '$lib/stores.js';
    import { onMount } from 'svelte';

    function logout() {
        console.log("LOGOUT")
        userSession.set({ logged: false, login: '', password: '', language: 'en' })
        return true
    }

    let session;
    userSession.subscribe(value => {
        session = value;
    });

    function setLanguagePl(event) {
        console.log("SET LANGUAGE PL")
        session.language = 'pl';
        userSession.set(session);
        return true
    }
    function setLanguageEn(event) {
        console.log("SET LANGUAGE EN")
        session.language = 'en';
        userSession.set(session);
        return true
    }
    function text(name) {
        let labels = {
            'anonymous': {
                'pl': "niezalogowany",
                'en': "anonymous"
            },
            'description': {
                'pl': "Opis aplikacji ...",
                'en': "Application description ..."
            }
        }
        return labels[name][session.language]
    }
</script>

<nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse navbar-collapse">
    <div class="position-sticky pt-0 sidebar-sticky">
        <div class="nav flex-column">
            <a class="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="h2 bi bi-person-circle"></i>
                {#if $userSession.logged}
                <span class="lead">{$userSession.login} </span>
                {:else}
                <span class="lead">niezalogowany</span>
                {/if}
                <i class="bi bi-caret-down-fill"></i>
            </a>
            <ul class="dropdown-menu">
                {#if !$userSession.logged}
                <li><a class="dropdown-item" href="/login">
                        <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Zaloguj się</span>
                    </a></li>
                {:else}
                <li><a class="dropdown-item" href="/" on:click={logout}>
                        <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Wyloguj się</span></a>
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
                        <i class="bi bi-house"></i>
                        &nbsp;Home
                    </span>

                </a>
            </li>
            {#if $userSession.logged}
            <li class="nav-item">
                <a class="nav-link" class:active={$page.url.pathname==='/dashboards' } href="/dashboards">
                    <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                        <i class="bi bi-columns-gap"></i>
                        &nbsp;Pulpity
                    </span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" class:active={$page.url.pathname==='/devices' } href="/devices">
                    <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                        <i class="bi bi-router"></i>
                        &nbsp;Urządzenia
                    </span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" class:active={$page.url.pathname==='/notifications' } href="/notifications">
                    <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                        <i class="bi bi-megaphone"></i>
                        &nbsp;Powiadomienia
                    </span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" class:active={$page.url.pathname==='/settings' } href="/settings">
                    <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                        <i class="bi bi-sliders mr-4"></i>
                        &nbsp;Ustawienia
                    </span>
                </a>
            </li>
            {/if}
            <li class="nav-item">
                <a class="nav-link" class:active={$page.url.pathname==='/about' } href="/about">
                    <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                        <i class="bi bi-question-circle"></i>
                        &nbsp;O aplikacji
                    </span>
                </a>
            </li>
        </ul>
    </div>
</nav>
<main class="col-md-9 col-lg-10 ms-sm-auto px-md-4">
    {#if ($userSession.logged && !$userSession.authorized)}
    <div class="alert alert-danger w-100 mt-2 text-center" role="alert">
        Brak dostępu do API serwisu.
    </div>
    {/if}
    <slot></slot>
</main>