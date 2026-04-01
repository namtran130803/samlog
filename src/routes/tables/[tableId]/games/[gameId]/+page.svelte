<script lang="ts">
	import ActionBar from '$/lib/components/ActionBar.svelte';
	import ScoreBoard from '$/lib/components/ScoreBoard.svelte';
	import ScoreKeyboard from '$/lib/components/ScoreKeyboard.svelte';
	import ScoreRankings from '$/lib/components/ScoreRankings.svelte';
	import { tablesStore } from '$/lib/stores/tablesStore.svelte';
	import { DicesIcon } from '@lucide/svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { untrack } from 'svelte';

	const tableId = $derived(page.params.tableId);
	const gameId = $derived(page.params.gameId);

	const table = $derived(tablesStore.find((t) => t.id === tableId));
	const game = $derived(table?.games.find((g) => g.id === gameId));

	$effect(() => {
		if (!table || !game) {
			untrack(() => goto('/'));
		}
	});

	function handleStartTyping() {
		if (!game) return;
		game.board.forEach((row) => row.push(0));
		game.activeCell = { r: 0, c: game.board[0].length - 1 };
		game.showKeyboard = true;
	}
</script>

{#if table && game}
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<div class="flex size-8 items-center justify-center rounded bg-muted">
				<DicesIcon class="size-4" />
			</div>
			<span class="text-sm font-medium">{game.title}</span>
		</div>
		<span class="text-xs text-muted-foreground">
			{new Date(game.createdAt).toLocaleString('vi-VN')}
		</span>
	</div>

	<ScoreRankings items={game.rankings} />

	<ScoreBoard players={table.players} {game} />

	{#if game.showKeyboard}
		<div class="h-1/2">
			<ScoreKeyboard {table} {game} />
		</div>
	{:else}
		<ActionBar title="Thua thì nhập đi" onClick={handleStartTyping} />
	{/if}
{/if}
