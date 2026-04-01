<script lang="ts">
	import ActionBar from '$/lib/components/ActionBar.svelte';
	import GameForm from '$/lib/components/GameForm.svelte';
	import type { IGameForm } from '$/lib/types/IGameForm';
	import { page } from '$app/state';
	import { tablesStore } from '$/lib/stores/tablesStore.svelte';
	import { goto } from '$app/navigation';
	import { untrack } from 'svelte';
	import { parseIncrementalTitle } from '$/lib/utils/incrementalTitle';


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
				form.title = parseIncrementalTitle(game.title, {
					defaultValue: 'Chơi xong tính tiếp'
				}).next;
				form.rewards = [...game.rewards];
			});
		}
	});

	function handleChange(data: IGameForm) {
		form = data;
	}

	function handleCopy() {
		if (!table || !game) return;

		const { match, next, first } = parseIncrementalTitle(game.title, {
			defaultValue: 'Chơi xong tính tiếp'
		});

		// Nếu chưa có số → set về bản đầu (Hiệp → Hiệp lần 1)
		if (!match) {
			game.title = first;
		}

		const newGameId = (table.games.length + 1).toString();

		const newGame = {
			id: newGameId,
			createdAt: new Date().toISOString(),
			title: form.title || next,
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

		goto(`/tables/${tableId}/games/${newGameId}`, {
			replaceState: true
		});
	}
</script>

{#if table && game}
	<GameForm
		title={form.title}
		rewards={form.rewards}
		onchange={handleChange}
		onsubmit={handleCopy}
	/>
	<ActionBar title="Vào việc" onClick={handleCopy} />
{/if}
