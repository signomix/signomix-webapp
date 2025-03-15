{#if env.PUBLIC_WEBAPP_MODE=='view'}
<div class="container-fluid">
    <div class="row">
        <div class="col">
            <slot></slot>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <a href="https://cloud.signomix.com" target="_blank" class="link-secondary"><small>Signomix</small></a>
        </div>
    </div>
</div>
{:else}
<Toaster richColors closeButton position="top-center" />
<header class="navbar navbar-dark bg-primary sticky-top flex-md-nowrap p-0 shadow">
    <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="/"><img src="{getLogoUrl($organizationConfig)}"
            height="30px" />
            {#if getOrganizationName($organizationConfig)=='' }
            <span class="h5 m-2">Signomix</span>
            {/if}
        </a>
    <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse"
        data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <span class="d-none d-sm-inline h5 text-white">{getOrganizationName($organizationConfig)}</span>
    <span class="d-none d-sm-inline">
        <a class="me-2" href="/" on:click|preventDefault={setLanguagePl}>
            <img src="/img/flags/4x3/pl.svg" height="16px" title="język polski" />
        </a>
        <a class="me-4" href="/" on:click|preventDefault={setLanguageEn}>
            <img src="/img/flags/4x3/gb.svg" height="16px" title="english language" />
        </a>
    </span>
</header>
<div class="container-fluid">
    <div class="row">
        <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse navbar-collapse">
            <div class="position-sticky pt-0 sidebar-sticky">
                <ul class="nav flex-column">
                    <li class="nav-item mt-2">
                        <div class="nav-link">
                            {#if isTakeover($profile)}
                              <i class="h2 bi bi-universal-access-circle me-2"></i>
                            {:else}
                            <i class="h2 bi bi-person-circle me-2"></i>
                            {/if}
                            {#if $isAuthenticated}
                            <span class="lead">{$profile.uid}</span>
                            {:else}
                            <a href="/login"
                                class="link-body-emphasis link-underline-opacity-0 link-underline-opacity-0-hover"
                                class:active={$page.url.pathname==='/login' }>
                                <span data-bs-toggle="collapse"
                                    data-bs-target=".navbar-collapse.show">{utils.getLabel('signin',labels,$language)}
                                </span>
                            </a>
                            {/if}
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" class:active={$page.url.pathname==='/' } href="/" on:click={collapseOther}>
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
                            <span><i
                                    class="bi bi-building me-2"></i><span>{utils.getLabel('organization',labels,$language)}</span>
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
                        <a class="nav-link" class:active={$page.url.pathname==='/organization/users' }
                            href="/organization/users">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-people me-2"></i>{utils.getLabel('users',labels,$language)}
                            </span>
                        </a>
                    </li>
                    {#if $profile.type==8 && $organizationConfig.menu_tenants==true && ($context==null || $context=='')}
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname==='/organization/tenants' }
                            href="/organization/tenants">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-houses me-2"></i>{utils.getLabel('tenants',labels,$language)}
                            </span>
                        </a>
                    </li>
                    {/if}
                    {/if}
                    {/if}
                    <li class="nav-item">
                        <a class="nav-link" class:active={$page.url.pathname==='/dashboards' } href="/dashboards"
                            on:click={collapseOther}>
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-columns-gap me-2"></i>{utils.getLabel('dashboards',labels,$language)}
                            </span>
                        </a>
                    </li>
                    <!-- Structure -->
                    {#if isCloud() || !utils.isUserRole($profile, 'limited', false)}
                    <li class="nav-item">
                        <a class="nav-link" class:active={false} on:click={toggleStructure}>
                            <span><i
                                    class="bi bi-diagram-3 me-2"></i><span>{utils.getLabel('structure',labels,$language)}</span>
                        </a>
                    </li>
                    {/if}
                    {#if structureExpanded && (isCloud() || !utils.isUserRole($profile, 'limited', false))}
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
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname==='/applications' } href="/applications">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i
                                    class="bi bi-box me-2"></i><span>{utils.getLabel('applications',labels,$language)}</span>
                        </a>
                    </li>
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname==='/notifications' } href="/notifications">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i
                                    class="bi bi-megaphone me-2"></i><span>{utils.getLabel('notifications',labels,$language)}</span>
                                {#if alertCounter.value>0}
                                <span class="badge rounded-pill text-bg-danger ms-2">{alertCounter.value}</span>
                                {/if}
                        </a>
                    </li>
                    {/if}
                    <!-- Analytics -->
                    <li class="nav-item">
                        <a class="nav-link" class:active={false} on:click={toggleAnalytics}>
                            <span><i
                                    class="bi bi-database me-2"></i><span>{utils.getLabel('analytics',labels,$language)}</span>
                        </a>
                    </li>
                    {#if analyticsExpanded}
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname==='/sentinels' } href="/sentinels">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i
                                    class="bi bi-list-check me-2"></i><span>{utils.getLabel('sentinels',labels,$language)}</span>
                        </a>
                    </li>
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname==='/alarms' } href="/alarms">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-bell me-2"></i><span>{utils.getLabel('alerts',labels,$language)}</span>
                        </a>
                    </li>
                    {/if}
                    <li class="nav-item">
                        <a class="nav-link" class:active={$page.url.pathname==='/news' } href="/news"
                            on:click={collapseOther}>
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-envelope me-2"></i>{utils.getLabel('news',labels,$language)}
                            </span>
                        </a>
                    </li>
                    {#if isCloud() || !utils.isUserRole($profile, 'limited', false)}
                    <!-- ACCOUNT -->
                    <li class="nav-item">
                        <a class="nav-link" class:active={false} on:click={toggleAccount}>
                            <span><i
                                    class="bi bi-person me-2"></i><span>{utils.getLabel('account',labels,$language)}</span>
                        </a>
                    </li>
                    {#if accountExpanded}
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname.startsWith('/account/settings') }
                            href="/account/settings">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-sliders me-2"></i>{utils.getLabel('settings',labels,$language)}
                            </span>
                        </a>
                    </li>
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname.startsWith('/account/notifications') }
                            href="/account/notifications">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-mailbox me-2"></i>{utils.getLabel('notifications',labels,$language)}
                            </span>
                        </a>
                    </li>
                    {#if $platformInfo.paidVersionAvailable==true}
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname.startsWith('/account/billing') }
                            href="/account/billing">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-coin me-2"></i>{utils.getLabel('billing',labels,$language)}
                            </span>
                        </a>
                    </li>
                    {/if}
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname.startsWith('/account/development') }
                            href="/account/development">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-code-square me-2"></i>{utils.getLabel('development',labels,$language)}
                            </span>
                        </a>
                    </li>
                    {/if}
                    <!-- end ACCOUNT -->
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
                        <a class="nav-link" class:active={$page.url.pathname==='/admin/applications' }
                            href="/admin/applications">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i
                                    class="bi bi-code-square me-2"></i><span>{utils.getLabel('apps',labels,$language)}</span>
                        </a>
                    </li>
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname==='/admin/organizations' }
                            href="/admin/organizations">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i
                                    class="bi bi-building me-2"></i><span>{utils.getLabel('organizations',labels,$language)}</span>
                        </a>
                    </li>
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname==='/admin/users' } href="/admin/users">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-people me-2"></i><span>{utils.getLabel('users',labels,$language)}</span>
                        </a>
                    </li>
                    <li class="nav-item ms-3">
                        <a class="nav-link" class:active={$page.url.pathname==='/admin/tasks' }
                            href="/admin/tasks">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i
                                    class="bi bi-list-task me-2"></i><span>{utils.getLabel('tasks',labels,$language)}</span>
                        </a>
                    </li>
                    {/if}
                    <!-- end Administration -->
                    {/if}
                    <!-- end logged in -->
                    {/if}
                    <!-- platform documentation -->
                    {#if isCloud() || !utils.isUserRole($profile, 'limited', true)}
                    <li class="nav-item">
                        <a class="nav-link" class:active={$page.url.pathname==='/documentation' }
                            href="https://documentation.signomix.com" target="_blank">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i
                                    class="bi bi-book me-2"></i>{utils.getLabel('documentation',labels,$language)}
                            </span>
                        </a>
                    </li>
                    {/if}
                    <!-- end platform documentation -->
                    <!-- documentation/help content for organization users -->
                    {#if isHelpVIsible($isAuthenticated, $profile, $organizationConfig)}
                        <li class="nav-item">
                            <a class="nav-link" class:active={$page.url.pathname==='/help' }
                                href="https://help.signomix.com?sid={$token}" target="_blank">
                                <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                    <i
                                        class="bi bi-question-circle me-2"></i>{utils.getLabel('help',labels,$language)}
                                </span>
                            </a>
                        </li>
                    {/if}
                    <!-- end documentation/help content for organization users -->
                    <!-- logout-->
                    {#if $isAuthenticated}
                    <li class="nav-item"><a class="nav-link" href="/" on:click={logout}>
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show"><i
                                    class="bi bi-x-circle me-2"></i>{utils.getLabel('signout',labels,$language)}</span></a>
                    </li>
                    {/if}
                    <!-- end logout -->
                    <!-- register -->
                    {#if (isCloud() || dev==true) && !$isAuthenticated}
                    <li class="nav-item">
                        <a class="nav-link" class:active={$page.url.pathname==='/account/register' }
                            href="/account/register">
                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                <i class="bi bi-person-add me-2"></i>{utils.getLabel('signup',labels,$language)}
                            </span>
                        </a>
                    </li>
                    {/if}
                    <!-- end register -->
                    <li class="nav-item d-inline d-sm-none">
                        <div class="nav-link">
                            <a href="/" on:click|preventDefault={setLanguagePl}>
                                <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                    <img class="border opacity-75" src="/img/flags/4x3/pl.svg" height="16px"
                                        title="język polski" />
                                </span>
                            </a>
                            <a class="ms-2" href="/" on:click|preventDefault={setLanguageEn}>
                                <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                    <img class="border opacity-75" src="/img/flags/4x3/gb.svg" height="16px"
                                        title="english language" /></span>
                            </a>
                        </div>
                    </li>
                    <li class="nav-item">
                        <div class="nav-link" style="color: darkgray;">{$webappRelease}/{$platformRelease}</div>
                    </li>
                </ul>
            </div>
        </nav>
        <main class="col-md-9 col-lg-10 ms-sm-auto px-md-4">
            {#if $isAuthenticated || $page.url.pathname=='/login' || $page.url.pathname=='/account/register'
            || $page.url.pathname=='/account/resetpassword' || $page.url.pathname=='/account/setpassword'
            || $page.url.pathname=='/confirmed'
            }
            <PageHeader />
            <slot></slot>
            {:else if $page.url.pathname!='/' && $page.url.pathname!='/login'}
            {goto('/')}
            {:else if utils.getSubdomain(location).toLowerCase() == 'cloud'}
            <div class="row mt-4">
                <div class="col-md-6 col-sm-12">
                    <div class="row">
                        <div class="col-12">
                            <span
                                class="fs-1 fw-bold text-body text-opacity-75">{utils.getLabel('info',labels,$language)}</span>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-12">
                            <span
                                class="fs-5 fw-normal text-body text-opacity-75">{utils.getLabel('info2',labels,$language)}<sup>*</sup>
                                {utils.getLabel('info3',labels,$language)}</span>
                        </div>
                    </div>
                    <div class="row mt-4">
                        <div class="col-12">
                            <a href="/account/register"
                                class="btn btn-lg btn-outline-primary w-100">{utils.getLabel('register',labels,$language)}</a>
                        </div>
                    </div>
                </div>
                <div class="col col-md-6 d-none d-md-block">
                    <img class="img-fluid" src="/img/media1.jpeg" alt="iot" />
                </div>
            </div>
            {/if}
        </main>
    </div>
</div>
{/if}
<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { utils } from '$lib/utils.js';
    import { browser } from '$app/environment'
    import { poll } from '$lib/poll.js';
    import { dev } from '$app/environment';
    import { sgxdata } from '$lib/sgxdata.js';
    import { token, profile, language, isAuthenticated, context, contextRoot, organizationConfig } from '$lib/usersession.js';
    import { getInfo, platformInfo, defaultOrganizationId, platformRelease, webappRelease } from '$lib/stores.js';
    import { Toaster, toast } from 'svelte-sonner'
    import PageHeader from '$lib/components/PageHeader.svelte'
    import { env } from '$env/dynamic/public';

    console.log('layout.svelte', env.PUBLIC_WEBAPP_MODE);

    onMount(async () => {
        if (env.PUBLIC_WEBAPP_MODE == 'view') {
            console.log('view mode')
            //goto('/dashboard')
        } else {
            console.log('not view mode')
            try {
                getInfo($page.url)
            } catch (e) {
                console.log(e)
            }
        }

    });

    function isDocumentationVIsible(userAuthenticated, userProfile, userOrganizationConfig) {
        if(!userAuthenticated) return true;
        if(userProfile.organization == utils.getDefaultOrganizationId()) return true;
        if(userOrganizationConfig==undefined) return true;
        if(userOrganizationConfig.menu_documentation == undefined) return true;
        if(userOrganizationConfig.menu_documentation == false) return false;
        return true;
    }

    function isHelpVIsible(userAuthenticated, userProfile, userOrganizationConfig) {
        if(!userAuthenticated) return false;
        //if(userProfile.organization == utils.getDefaultOrganizationId()) return true;
        if(userOrganizationConfig==undefined) return false;
        if(userOrganizationConfig.menu_help == undefined) return false;
        if(userOrganizationConfig.menu_help == true) return true;
        return false;
    }

    function getOrganizationName(userOrganizationConfig) {
        if(userOrganizationConfig==undefined) return '';
        if(userOrganizationConfig.name==null) return '';
        return userOrganizationConfig.name;
    }

    function getLogoUrl(userOrganizationConfig) {
        let url = '/img/logo-light.svg';
        if(userOrganizationConfig==undefined) return url;
        if(userOrganizationConfig.logo_url==null) return url;
        return userOrganizationConfig.logo_url;
    }

    function isTakeover(profile){
        if(profile==undefined||profile==null){
            return false
        }
        if(profile.role==undefined || profile.role==null){
            return false
        }
        let roles = profile.role.split(',')
        return roles.includes('takeover')
    }

    function isCloud() {
        return utils.isCloudSubdomain($page.url)
    }

    function logout() {
        console.log('logout clicked')
        token.set(null)
        profile.set(null)
        context.set(null)
        contextRoot.set('')
        language.set('pl')
        goto('/')
        return true
    }

    function doLogin() {
        console.log('login clicked')
        goto('/login')
        return false
    }

    let structureExpanded = false;
    function toggleStructure(event) {
        structureExpanded = !structureExpanded;
        if (structureExpanded) {
            collapseOther('structure')
        }
    }
    let administrationExpanded = false;
    function toggleAdministration(event) {
        administrationExpanded = !administrationExpanded;
        if (administrationExpanded) {
            collapseOther('administration')
        }
    }
    let organizationExpanded = false;
    function toggleOrganization(event) {
        organizationExpanded = !organizationExpanded;
        if (organizationExpanded) {
            collapseOther('organization')
        }
    }
    let analyticsExpanded = false;
    function toggleAnalytics(event) {
        analyticsExpanded = !analyticsExpanded;
        if (analyticsExpanded) {
            collapseOther('analytics')
        }
    }
    let accountExpanded = false;
    function toggleAccount(event) {
        accountExpanded = !accountExpanded;
        if (accountExpanded) {
            collapseOther('account')
        }
    }
    function collapseOther(actual) {
        if (actual == 'structure') {
            administrationExpanded = false
            organizationExpanded = false
            analyticsExpanded = false
            accountExpanded = false
        } else if (actual == 'administration') {
            structureExpanded = false
            organizationExpanded = false
            analyticsExpanded = false
            accountExpanded = false
        } else if (actual == 'organization') {
            structureExpanded = false
            administrationExpanded = false
            analyticsExpanded = false
            accountExpanded = false
        } else if (actual == 'analytics') {
            structureExpanded = false
            administrationExpanded = false
            organizationExpanded = false
            accountExpanded = false
        } else if (actual == 'account') {
            structureExpanded = false
            administrationExpanded = false
            organizationExpanded = false
            analyticsExpanded = false
        } else {
            structureExpanded = false
            administrationExpanded = false
            organizationExpanded = false
            analyticsExpanded = false
            accountExpanded = false
        }
    }

    function setLanguagePl(event) {
        language.set('pl')
        return true
    }
    function setLanguageEn(event) {
        language.set('en')
        return true
    }

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
        'signup': {
            'en': "Create account",
            'pl': "Utwórz konto"
        },
        'register': {
            'pl': "Utwórz bezpłatne konto",
            'en': "Create free account"
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
        'tasks': {
            'pl': "Zadania",
            'en': "Tasks"
        },
        'structure': {
            'pl': "Infrastruktura",
            'en': "Infrastructure"
        },
        'dashboards': {
            'pl': "Pulpity",
            'en': "Dashboards"
        },
        'notifications': {
            'pl': "Komunikaty",
            'en': "Messages"
        },
        'news': {
            'pl': "Wiadomości",
            'en': "News"
        },
        'settings': {
            'pl': "Ustawienia",
            'en': "Settings"
        },
        'users': {
            'pl': "Użytkownicy",
            'en': "Users"
        },
        'tenants': {
            'pl': "Klienci",
            'en': "Tenants"
        },
        'administration': {
            'pl': "Administracja",
            'en': "Administration"
        },
        'documentation': {
            'pl': "Dokumentacja",
            'en': "Documentation"
        },
        'documentation_old': {
            'pl': "Dokumentacja (ver. 1)",
            'en': "Documentation (ver. 1)"
        },
        'help': {
            'pl': "Pomoc",
            'en': "Help"
        },
        'about': {
            'pl': "O aplikacji",
            'en': "About"
        },
        'api-unaviable': {
            'pl': "Brak dostępu do API serwisu",
            'en': "Service API unaviable"
        },
        'account': {
            'pl': "Konto",
            'en': "Account"
        },
        'applications': {
            'pl': 'Aplikacje',
            'en': 'Applications'
        },
        'analytics': {
            'pl': 'Analityka',
            'en': 'Analytics'
        },
        'alerts': {
            'pl': 'Alerty',
            'en': 'Alerts'
        },
        'billing': {
            'pl': 'Płatności',
            'en': 'Payments'
        },
        'sentinels': {
            'pl': 'Reguły',
            'en': 'Rules'
        },
        'info': {
            'pl': 'Prosta platforma dla Internetu Rzeczy',
            'en': 'Simple platform for the Internet of Things'

        },
        'info2': {
            'pl': 'Zbieraj, przetwarzaj i prezentuj dane. Zbuduj swoje Smart Rozwiązanie',
            'en': 'Collect, process and present data. Build your Smart Solution'
        },
        'info3': {
            'pl': 'szybko i bez komplikacji.',
            'en': 'quickly and without complications.'
        },
        'notavailable': {
            'pl': 'Rejestrowanie kont jest obecnie niedostępne. Spróbuj ponownie za dzień lub dwa.',
            'en': 'Account registration is currently unavailable. Try again in a day or two.'
        },
        'context': {
            'pl': 'Kontekst:',
            'en': 'Context:'
        },
        'development': {
            'en': 'Development',
            'pl': 'Development'
        }
    }
</script>