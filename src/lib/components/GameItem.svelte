<script lang="ts">
	import { CopyIcon, DicesIcon, ListTreeIcon, PenIcon, TrashIcon } from '@lucide/svelte';
	import { getRewardDisplay } from '../utils/getRewardDisplay';
	import type { IGameItem } from '../types/IGameItem';
	import { getRankStyle } from '../utils/getRankStyle';
	import { swipeMenu } from '../actions/swipeMenu';
	import { tablesStore } from '$/lib/stores/tablesStore.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let { id, title, rankings, roundsCount, createdAt }: IGameItem = $props();

	const tableId = $derived(page.params.tableId);
	const table = $derived(tablesStore.find((t) => t.id === tableId));

	function handleDelete() {
		if (confirm('Xóa ván chơi này, chắc chưa?')) {
			if (table) {
				const index = table.games.findIndex((g) => g.id === id);
				if (index !== -1) {
					table.games.splice(index, 1);
				}
			}
		}
	}
</script>

<li
	class="relative text-sm"
	{@attach swipeMenu({
		direction: 'both',
		menuItemRatio: 0.25,
		rightMenuItems: 1,
		leftMenuItems: 2
	})}
>
	<div data-swipe-menu-left class="absolute top-0 left-0 flex h-full">
		<a
			href={`/tables/${tableId}/games/${id}/copy`}
			class="flex h-full flex-none items-center justify-center rounded bg-blue-600"
		>
			<CopyIcon />
		</a>
		<a
			href={`/tables/${tableId}/games/${id}/edit`}
			class="flex h-full flex-none items-center justify-center rounded bg-yellow-600"
		>
			<PenIcon />
		</a>
	</div>

	<div data-swipe-menu-right class="absolute top-0 right-0 flex h-full">
		<button
			type="button"
			class="flex h-full flex-none items-center justify-center rounded bg-red-600"
			onclick={handleDelete}
		>
			<TrashIcon />
		</button>
	</div>

	<a
		data-swipe-content
		href={`/tables/${tableId}/games/${id}`}
		class="flex flex-col gap-3 rounded border bg-card p-4"
	>
		<header class="flex items-center gap-2 font-medium text-card-foreground">
			<div class="flex size-8 items-center justify-center rounded bg-muted">
				<DicesIcon class="size-4" />
			</div>
			<h2 class="line-clamp-1">{title}</h2>
		</header>

		<ol class="flex flex-col gap-1">
			{#each rankings as player, i}
				{@const rewardDisplay = getRewardDisplay(player.reward)}
				{@const rankStyle = getRankStyle(i)}

				<li
					class="flex h-8 gap-4 {rankStyle.bgColor} {rankStyle.textColor} {rankStyle.borderColor} animate__animated animate__fadeIn rounded border"
					style:animation-delay={`${i * 100}ms`}
				>
					<p class="flex w-full items-center gap-4 rounded px-2 py-1 text-sm">
						<span>#{i + 1}</span>

						<span class="line-clamp-1 flex-2 text-center capitalize">{player.name}</span>

						<span class="line-clamp-1 flex-1 text-end">{player.total}</span>

						<span
							class="line-clamp-1 flex-4 text-end {rewardDisplay.textColor} {rewardDisplay.textSize}"
						>
							{rewardDisplay.text}
						</span>
					</p>
				</li>
			{/each}
		</ol>

		<hr />

		<footer class="flex items-center justify-between text-sm text-muted-foreground">
			<p class="flex items-center gap-1">
				<ListTreeIcon class="size-4" />
				<span>{roundsCount} vòng</span>
			</p>

			<p class="text-xs">{new Date(createdAt).toLocaleString('vi-VN')}</p>
		</footer>
	</a>
</li>
