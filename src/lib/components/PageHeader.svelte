{#if $context!=null}
<div class="row m-1">
    <div class="col w-100">
        <div class="alert alert-danger" role="alert">
            {utils.getLabel('context',labels,$language)}
            <a href="" on:click|preventDefault={setContext(null,'')}
                title={utils.getLabel('setcontext',labels,$language)}><i
                    class="bi bi-box-arrow-left ms-1 me-2 h5"></i></a>
            <span class="fw-bold">{$context}</span> {$contextRoot}/
        </div>
    </div>
</div>
{/if}
{#if $profile!=null && $profile.tenant!=null && $profile.tenant!=0}
<div class="row mt-1">
    <div class="col w-100">
        {$profile.path}
    </div>
</div>
{/if}
<script>
    import { token, profile, language, isAuthenticated, context, contextRoot } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { dev } from '$app/environment';
    import { goto } from '$app/navigation';
    
    function setContext(tenant, root) {
        return function (event) {
            event.preventDefault();
            context.set(tenant)
            contextRoot.set(root)
            goto('/organization/tenants')
        }
    }

    let labels = {
        'context': {
            'pl': "Kontekst",
            'en': "Context"
        },
        'setcontext': {
            'pl': "Usuń kontekst",
            'en': "Remove context"
        }
    }
</script>