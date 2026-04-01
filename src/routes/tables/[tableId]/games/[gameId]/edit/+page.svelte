<script lang="ts">
	import ActionBar from '$/lib/components/ActionBar.svelte';
	import GameForm from '$/lib/components/GameForm.svelte';
	import type { IGameForm } from '$/lib/types/IGameForm';
	import { page } from '$app/state';
	import { tablesStore } from '$/lib/stores/tablesStore.svelte';
	import { goto } from '$app/navigation';
	import { untrack } from 'svelte';

	const tableId = $derived(page.params.tableId);
	const gameId = $derived(page.params.gameId);
	const table = $derived(tablesStore.find((t) => t.id === tableId));
	const game = $derived(table?.games.find((g) => g.id === gameId));

	let form = $state({
		title: '',
		rewards: [] as string[]
	});

	$effect(() => {
		if (!table || (gameId && !game)) {
			untrack(() => goto('/'));
		} else if (game) {
			untrack(() => {
				form.title = game.title;
				form.rewards = [...game.rewards];
			});
		}
	});

	function handleChange(data: IGameForm) {
		form = data;
	}

	function handleUpdate() {
		if (!table || !game) return;

		game.title = form.title || 'Chơi xong tính tiếp';
		game.rewards = form.rewards;
		game.rankings = table.players.map((p, i) => ({
			name: p,
			total: game.board[i]?.reduce((acc, val) => acc + val, 0) ?? 0,
			reward: form.rewards[i] || ''
		}));

		goto(`/tables/${tableId}`, { replaceState: true });
	}
</script>

{#if table && game}
	<GameForm
		title={form.title}
		rewards={form.rewards}
		onchange={handleChange}
		onsubmit={handleUpdate}
	/>
	<ActionBar title="Cập nhật" onClick={handleUpdate} />
{/if}
