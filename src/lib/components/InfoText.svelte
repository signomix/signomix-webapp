{#if isLimitReached()}
<span>
    <i class="bi bi-exclamation-triangle text-danger fs-4"></i>
</span>
{/if}

<script>
    import { profile, language } from '$lib/usersession.js';
    import { utils } from '$lib/utils';

    function isLimitReached() {
        console.log('isLimitReached: ', $profile.deviceCounter, $profile.type);
        // '<i class="bi bi-exclamation-triangle text-danger"></i>'
        if (utils.isDefaultOrganizationUser($profile)) {
            switch ($profile.type) {
                case 0:
                    return $profile.devicesCounter >= 20 ? true : false;
                case 4:
                    return $profile.devicesCounter >= 5 ? true : false;
                case 5:
                    return $profile.devicesCounter >= 50 ? true : false;
                default:
                    return false;
            }
        } else {
            return false;
        }
    }
</script>