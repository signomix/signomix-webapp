<script>
    import { get } from "svelte/store";

    /**
     * This is work in progress.
     * The idea is to have a component that will allow to change the theme of the application.
     */

    function getCustomHeaderBackground() {
        return hslToHex(230, 100, 30);
    }

    function hslToHex(h, s, l) {
        l /= 100;
        const a = (s * Math.min(l, 1 - l)) / 100;
        const f = (n) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color)
                .toString(16)
                .padStart(2, "0"); // Convert to hex and pad with zeroes if needed
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
</script>

<svelte:head>
    <style>
        /* Nadpisz domyślne kolory w <head> */
        /*:root {
            --bs-primary: #2c3e50;
            --bs-secondary: #3498db;
            --bs-success: #2ecc71;
        }*/

        /* Dla trybu ciemnego */
        /*[data-bs-theme="dark"] {
            --bs-primary: #3498db;
            --bs-light: #f8f9fa;
        }*/
        /* https://htmlcolors.com/hex-to-hsl */

        /* hsl(9, 30%, 13%); */

        :root {
            --custom-header-background: hsl(230, 100%, 30%);
            --custom-header-text: #f8f9fa;
        }

        .btn-primary {
            background-color: var(--bs-primary);
        }

        .navbar-dark {
            color: var(--bs-light);
            background-color: var(--custom-header-background, #ddd);
        }

        .navbar-brand {
            color: var(--bs-light);
            background-color: var(--custom-header-background, blue);
        }
    </style>
</svelte:head>
