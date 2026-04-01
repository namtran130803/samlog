<script lang="ts">
	import ActionBar from '$/lib/components/ActionBar.svelte';
	import GameForm from '$/lib/components/GameForm.svelte';
	import type { IGameForm } from '$/lib/types/IGameForm';
	import { page } from '$app/state';
	import { tablesStore } from '$/lib/stores/tablesStore.svelte';
	import { goto } from '$app/navigation';
	import { untrack } from 'svelte';

	const tableId = $derived(page.params.tableId);
	const table = $derived(tablesStore.find((t) => t.id === tableId));

	let form = $state({
		title: '',
		rewards: [] as string[]
	});

	$effect(() => {
		if (!table) {
			untrack(() => goto('/'));
		} else {
			untrack(() => {
				form.rewards = table.players.map(() => '');
			});
		}
	});

	function handleChange(data: IGameForm) {
		form = data;
	}

	function handleCreate() {
		if (!table) return;

		const newGameId = (table.games.length + 1).toString();
		const newGame = {
			id: newGameId,
			createdAt: new Date().toISOString(),
			title: form.title || 'Chơi xong tính tiếp',
			rewards: form.rewards,
			board: table.players.map(() => []),
			rankings: table.players.map((p, i) => ({
				name: p,
				total: 0,
				reward: form.rewards[i] || ''
			})),
			activeCell: { r: -1, c: -1 },
			showKeyboard: false
		};

		table.games.push(newGame);
		goto(`/tables/${tableId}/games/${newGameId}`, { replaceState: true });
	}
</script>

{#if table}
	<GameForm
		title={form.title}
		rewards={form.rewards}
		onchange={handleChange}
		onsubmit={handleCreate}
	/>
	<ActionBar title={form.title ? 'Vào việc' : 'Chơi xong tính tiếp'} onClick={handleCreate} />
{/if}
