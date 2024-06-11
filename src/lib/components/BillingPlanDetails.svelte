{#if (targetPlan === undefined || targetPlan === null)}
<div class="card-header">
    <h4>{utils.getLabel('yourPlan',labels, $language)}</h4>
</div>
{/if}
<div class="card-body">
    {#if (targetPlan === undefined || targetPlan === null)}
    <h4 class="card-title">{utils.getLabel(getUserTypeName(actualPlan),labels, $language)}</h4>
    {:else}
    <h4 class="card-title">{utils.getLabel(getUserTypeName(targetPlan),labels, $language)}</h4>
    {/if}
    <div class="row">
        {#if !(targetPlan === undefined || targetPlan === null)}
        <div class="col-md-12">
            <p class="card-text">{utils.getLabel('planDetails',labels, $language)}</p>
            <ul>
                <li>{getNumberOfDataSources(targetPlan)+' '+utils.getLabel('dataSources',labels, $language)}</li>
                <li>{getDataRetentionDays(targetPlan)+' '+utils.getLabel('dataRetention',labels, $language)}</li>
                <li>{utils.getLabel(getSupportName(targetPlan),labels, $language)}</li>
            </ul>
        </div>
        {:else}
        <div class="col-md-6">
            <h6 class="card-text">{utils.getLabel('planDetails',labels, $language)}</h6>
            {#if actualPlan === 4}
            <ul>
                <li>5 data sources</li>
                <li>7 days data retention</li>
                <li>community support</li>
            </ul>
            {:else if actualPlan === 5}
            <ul>
                <li>50 data sources</li>
                <li>1 year data retention</li>
                <li>support via GitHub dedicated issue tracker</li>
            </ul>
            {:else if actualPlan === 0}
            <ul>
                <li>20 data sources</li>
                <li>30 days data retention</li>
                <li>e-mail support</li>
            </ul>
            {:else}
            <ul>
                <li>number of data sources dependent on signed contract</li>
                <li>data retention dependent on signed contract</li>
                <li>support via dedicated GitHub issue tracker</li>
            </ul>
            {/if}
        </div>
        <div class="col-md-6">
            <h6 class="card-text">{utils.getLabel('paymentHistory',labels, $language)}</h6>
            <p>{utils.getLabel('paymentHistoryNotAvailable',labels, $language)}</p>
        </div>
        {/if}
    </div>
</div>
{#if !(targetPlan === undefined || targetPlan === null)}
<div class="card-footer">
    <a href="/account/billing/change_plan/{targetPlan}"
    class="btn-sticked btn btn-outline-primary">{utils.getLabel('changePlan',labels,$language)}</a>
</div>
{/if}

<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils';
    export let actualPlan;
    export let targetPlan;

    /** Returns the name of the user type.
     * Similar to the function in src/lib/utils.js but with limited names available.
     * @param {number} type - the type of the user
     * @returns {string} - the name of the user type
     */
    function getUserTypeName(type) {
        switch (type) {
            case 0:
                return 'user';
            case 4:
                return 'free';
            case 5:
                return 'primary';
            default:
                return 'otherAccountType';
        }
    }

    function getDataRetentionDays(accountType){
        switch (accountType) {
            case 0:
                return 30;
            case 4:
                return 7;
            case 5:
                return 365;
            default:
                return 'dependent on signed contract';
        }
    }

    function getSupportName(accountType){
        switch (accountType) {
            case 0:
                return 'emailSupport';
            case 4:
                return 'communitySupport';
            case 5:
                return 'trackerSupport';
            default:
                return 'trackerSupport';
        }
    }

    function getNumberOfDataSources(accountType){
        switch (accountType) {
            case 0:
                return 20;
            case 4:
                return 5;
            case 5:
                return 50;
            default:
                return 'dependent on signed contract';
        }
    }

    let labels = {
        yourPlan: {
            en: "Your plan",
            pl: "Twój plan"
        },
        planDetails: {
            en: 'Plan details:',
            pl: 'Szczegóły planu:'
        },
        changePlan: {
            en: 'Change plan',
            pl: 'Zmień plan'
        },
        paymentHistory: {
            en: 'Payment history',
            pl: 'Historia płatności'
        },
        paymentHistoryNotAvailable: {
            en: 'Payment history is not available yet',
            pl: 'Historia płatności nie jest na razie dostępna'
        },
        paymentHistoryNotAvailableForAccount: {
            en: 'Payment history is not available for this account',
            pl: 'Historia płatności nie jest dostępna dla tego konta'
        },
        free: {
            en: 'Free account',
            pl: 'Konto Darmowe'
        },
        user: {
            en: 'Standard account',
            pl: 'Konto Standardowe'
        },
        primary: {
            en: 'Premium account',
            pl: 'Konto Premium'
        },
        otherAccountType: {
            pl: 'Konto organizacyjne',
            en: 'Organization account'
        },
        dataSources: {
            en: 'data sources',
            pl: 'źródeł danych'
        },
        dataRetention: {
            en: 'data retention',
            pl: 'retencji danych'
        },
        emailSupport: {
            en: 'e-mail support',
            pl: 'wsparcie e-mailowe'
        },
        communitySupport: {
            en: 'community support',
            pl: 'wsparcie społecznościowe'
        },
        trackerSupport: {
            en: 'support via GitHub dedicated issue tracker',
            pl: 'wsparcie poprzez dedykowany system zgłoszeń na GitHubie'
        }
    }
</script>