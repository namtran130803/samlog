<script lang="ts">
	import ActionBar from '$/lib/components/ActionBar.svelte';
	import TableItem from '$/lib/components/TableItem.svelte';
	import { goto } from '$app/navigation';
	import { tablesStore } from '$/lib/stores/tablesStore.svelte';
</script>

<ul class="flex flex-1 flex-col gap-4 overflow-auto">
	{#each tablesStore.toReversed() as table, i (table.id)}
		{@const tableItem = {
			id: table.id,
			createdAt: table.createdAt,
			playersText: table.players.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' · '),
			gamesCount: table.games.length,
			roundsCount: table.games.reduce((acc, game) => acc + (game.board[0]?.length || 0), 0)
		}}
		<div class="animate__animated animate__fadeIn" style:animation-delay={`${i * 100}ms`}>
			<TableItem {...tableItem} />
		</div>
	{:else}
		<div
			class="animate__animated animate__fadeIn flex flex-1 flex-col items-center justify-center gap-2 py-20 text-muted-foreground"
		>
			<p class="text-sm">Chưa có bàn chơi nào</p>
			<p class="text-xs italic">Hãy nhấn vào nút bên dưới để thêm mới</p>
		</div>
	{/each}
</ul>

<ActionBar title="Thêm bàn thêm ghế" href="/tables/new" />
