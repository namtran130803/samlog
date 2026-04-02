<script lang="ts">
	import './layout.css';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<svelte:head>
	<title>Sam Log</title>
</svelte:head>

<div class="flex h-svh w-svw flex-col gap-4 p-4">
	<header class="relative flex items-center justify-center text-center font-bold">
		{#key page.url.pathname}
			<button class="flex gap-1" onclick={() => goto('/')}>
				<span class="animate__animated animate__fadeIn">Sam</span>
				<div
					class="animate__animated animate__flipInY rounded bg-primary px-1 text-primary-foreground"
				>
					Log
				</div>
			</button>
		{/key}
	</header>
	{@render children()}
</div>
