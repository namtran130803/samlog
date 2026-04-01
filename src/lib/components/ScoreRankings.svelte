<script lang="ts">
	import type { IScoreRankings } from '../types/IScoreRankings';
	import { getRankStyle } from '../utils/getRankStyle';
	import { flip } from 'svelte/animate';

	interface Props {
		items: IScoreRankings[];
	}

	let { items }: Props = $props();
</script>

<div class="flex gap-2 rounded border bg-card p-2 text-sm">
	{#each items as item, index (item.name)}
		{@const { bgColor, borderColor, textColor } = getRankStyle(index)}

		<div
			class={[
				'animate__animated animate__fadeIn flex flex-1 flex-col items-center justify-center rounded border py-1 transition-colors',
				bgColor,
				borderColor,
				textColor
			]}
			animate:flip={{ duration: 500 }}
		>
			<span class="line-clamp-1 font-medium capitalize">
				{item.name}
			</span>

			<span class="text-lg font-semibold">{item.total}</span>
		</div>
	{/each}
</div>
