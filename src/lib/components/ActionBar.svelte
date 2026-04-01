<script lang="ts">
	import { page } from '$app/state';
	import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/svelte';
	import { twMerge } from 'tailwind-merge';
	const props: {
		title: string;
		onClick?: () => void;
		href?: string;
		class?: string;
		disabled?: boolean;
	} = $props();

	const isHome = $derived(page.url.pathname === '/');

	function handleBack() {
		if (isHome) return;
		history.back();
	}

	function handleForward() {
		history.forward();
	}

	const commonClasses = $derived(
		twMerge(
			'h-12 flex-1 rounded bg-primary font-medium text-primary-foreground shadow shadow-primary flex items-center justify-center',
			props.class,
			props.disabled && 'pointer-events-none opacity-50'
		)
	);
</script>

<div class="flex items-center justify-between gap-4">
	<button
		class="flex aspect-square h-full items-center justify-center rounded bg-secondary"
		onclick={handleBack}
	>
		<ChevronLeftIcon />
	</button>

	<a
		href={props.href ?? '#'}
		class={commonClasses}
		onclick={(e) => {
			if (!props.href) e.preventDefault();
			props.onClick?.();
		}}
	>
		{#key props.title}
			<span class="animate__animated animate__fadeIn">{props.title}</span>
		{/key}
	</a>

	<button
		class="flex aspect-square h-full items-center justify-center rounded bg-secondary"
		onclick={handleForward}
	>
		<ChevronRightIcon />
	</button>
</div>
