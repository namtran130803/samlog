<script lang="ts">
	import ActionBar from '$/lib/components/ActionBar.svelte';
	import GameItem from '$/lib/components/GameItem.svelte';
	import TotalMoney from '$/lib/components/TotalMoney.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { tablesStore } from '$/lib/stores/tablesStore.svelte';
	import { untrack } from 'svelte';

	const tableId = $derived(page.params.tableId);
	const table = $derived(tablesStore.find((t) => t.id === tableId));

	$effect(() => {
		if (!table) {
			untrack(() => goto('/'));
		}
	});

	const totalRankings = $derived.by(() => {
		if (!table) return [];
		const totals: Record<string, number> = {};
		table.players.forEach((p) => (totals[p] = 0));

		table.games.forEach((game) => {
			game.rankings.forEach((r) => {
				if (totals[r.name] !== undefined) {
					totals[r.name] += parseInt(r.reward) || 0;
				}
			});
		});

		return Object.entries(totals)
			.map(([name, total]) => ({
				name,
				reward: total.toString()
			}))
			.sort((a, b) => parseInt(b.reward) - parseInt(a.reward));
	});
</script>

{#if table}
	<TotalMoney items={totalRankings} />

	<ul class="flex flex-1 flex-col gap-4 overflow-auto">
		{#each table.games.toReversed() as game, i (game.id)}
			<div class="animate__animated animate__fadeIn" style:animation-delay={`${i * 100}ms`}>
				<GameItem
					id={game.id}
					title={game.title}
					rankings={game.rankings}
					createdAt={game.createdAt}
					roundsCount={game.board[0]?.length || 0}
				/>
			</div>
		{:else}
			<div
				class="animate__animated animate__fadeIn flex flex-1 flex-col items-center justify-center gap-2 py-20 text-muted-foreground"
			>
				<p class="text-sm">Chưa có ván nào ở bàn này</p>
				<p class="text-xs italic">Hãy nhấn vào nút bên dưới để bắt đầu</p>
			</div>
		{/each}
	</ul>

	<ActionBar title="Thêm bát thêm đũa" href={`/tables/${tableId}/games/new`} />
{/if}
