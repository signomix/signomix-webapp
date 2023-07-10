import { goto } from '$app/navigation';
import { browser } from '$app/environment'

export const redirects = {
    handleOriginalUri: function () {
        // Handle original request and redirects to 
        // the expected subpage.
        // This is a workaround for the problem with a PWA
        // single page application.
        if (browser) {
            if (!location.search.startsWith('?uri=')) {
            }
            let originalURI = location.search.slice(5);
            if (originalURI.startsWith('/dashboards')) {
                goto('/dashboards');
            } else if (originalURI.startsWith('/structure')) {
                goto('/structure');
            } else if (originalURI.startsWith('/organization')) {
                goto('/organization');
            } else if (originalURI.startsWith('/notifications')) {
                goto('/notifications');
            } else if (originalURI.startsWith('/settings')) {
                goto('/settings');
            } else if (originalURI.startsWith('/about')) {
                goto('/about');
            }
        }
    }
}