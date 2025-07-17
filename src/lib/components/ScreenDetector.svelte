<script>
    import { onMount, onDestroy } from 'svelte';

    // Zmienna przechowująca aktualną szerokość okna przeglądarki.
    // Inicjalizujemy ją jako null, ponieważ `window` nie jest dostępne podczas renderowania po stronie serwera (SSR).
    let screenWidth = null;

    // Funkcja, która będzie wywoływana przy każdej zmianie rozmiaru okna.
    const handleResize = () => {
        screenWidth = window.innerWidth;
    }

    // `onMount` uruchamia kod tylko w przeglądarce, po zamontowaniu komponentu.
    onMount(() => {
        // Ustawiamy początkową szerokość okna.
        handleResize();

        // Dodajemy "nasłuchiwacz" (event listener), który będzie wywoływał `handleResize`
        // za każdym razem, gdy rozmiar okna się zmieni.
        window.addEventListener('resize', handleResize);

        // `onDestroy` (lub funkcja zwrotna w onMount) uruchamia się, gdy komponent jest niszczony.
        // Jest to kluczowe, aby usunąć listener i uniknąć wycieków pamięci.
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });

    // Reaktywna deklaracja (`$:`). Ten blok kodu uruchomi się ponownie za każdym razem,
    // gdy wartość `screenWidth` ulegnie zmianie.
    // Używamy progu 768px (breakpoint `md` w Bootstrap) do rozróżnienia smartfona od desktopa.
    $: deviceType = screenWidth < 768 ? 'smartfon' : 'desktop';

</script>

<div class="container mt-4 p-3 border rounded">
    <h4>Wykrywanie typu urządzenia (Svelte + Bootstrap)</h4>

    {#if screenWidth === null}
        <p>Sprawdzam szerokość ekranu...</p>
    {:else}
        <p>
            Aktualna szerokość ekranu: <strong>{screenWidth}px</strong>
        </p>
        <p>
            Wykryty typ urządzenia:
            {#if deviceType === 'smartfon'}
                <span class="badge bg-primary">📱 Smartfon</span>
            {:else}
                <span class="badge bg-success">💻 Desktop</span>
            {/if}
        </p>

        <hr>

        {#if deviceType === 'smartfon'}
            <div class="alert alert-info">
                Wyświetlam widok zoptymalizowany dla <strong>małych ekranów</strong>.
            </div>
        {:else}
            <div class="alert alert-warning">
                 Wyświetlam widok zoptymalizowany dla <strong>dużych ekranów</strong>.
            </div>
        {/if}
    {/if}
</div>

<style>
    /* Opcjonalne style dla lepszej prezentacji */
    .badge {
        font-size: 1rem;
    }
</style>