import { onMount } from 'svelte';

export function poll(fn, ms) {
  onMount(() => {
    const interval = setInterval(fn, ms);
    fn();

    return () => clearInterval(interval);
  });
}