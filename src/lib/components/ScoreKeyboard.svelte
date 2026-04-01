<script lang="ts">
	import { getCyclicIndex } from '$/lib/utils/getCyclicIndex';
	import type { Game, Table } from '$/lib/stores/tablesStore.svelte';
	import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, DeleteIcon } from '@lucide/svelte';

	interface Props {
		table: Table;
		game: Game;
	}

	const { table, game }: Props = $props();

	const playerCount = $derived(table.players.length);

	function updateRankings() {
		const totals = game.board.map((row, i) => ({
			name: table.players[i],
			total: row.reduce((sum, n) => sum + n, 0)
		}));
		const sorted = [...totals].sort((a, b) => a.total - b.total);
		game.rankings = sorted.map((p, i) => ({ ...p, reward: game.rewards[i] }));
	}

	function handleAppendDigit(num: number) {
		const { r, c } = game.activeCell;
		if (game.board[r][c].toString().length > 2) return;
		game.board[r][c] = Number(`${game.board[r][c]}${num}`);
		updateRankings();
	}

	function handleBackspace() {
		const { r, c } = game.activeCell;
		game.board[r][c] = Number(`${game.board[r][c]}`.slice(0, -1));
		updateRankings();
	}

	function handleMove(delta: number) {
		game.activeCell.r = getCyclicIndex(game.activeCell.r, delta, playerCount);
	}

	function handleFinish() {
		const lastIdx = game.board[0].length - 1;
		const allZero = game.board.every((row) => row[lastIdx] === 0);
		if (allZero) game.board.forEach((row) => row.pop());
		game.activeCell = { r: -1, c: -1 };
		game.showKeyboard = false;
	}
</script>

<div class="grid grid-cols-5 gap-4">
	{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as num}
		<button
			class="aspect-square rounded border bg-secondary text-xl font-bold text-secondary-foreground"
			onclick={() => handleAppendDigit(num)}
		>
			{num}
		</button>
	{/each}

	<button
		class="col-span-2 flex items-center justify-between rounded border bg-secondary px-2 text-primary capitalize"
		onclick={() => handleMove(-1)}
	>
		<ChevronLeftIcon />
		<span class="flex-1">{table.players[getCyclicIndex(game.activeCell.r, -1, playerCount)]}</span>
	</button>

	{#if game.activeCell.r === playerCount - 1}
		<button
			class="col-span-2 flex items-center justify-between rounded border bg-secondary px-2 text-green-500"
			onclick={handleFinish}
		>
			<span class="flex-1">Xong</span>
			<CheckIcon />
		</button>
	{:else}
		<button
			class="col-span-2 flex items-center justify-between rounded border bg-secondary px-2 text-primary capitalize"
			onclick={() => handleMove(+1)}
		>
			<span class="flex-1">{table.players[getCyclicIndex(game.activeCell.r, +1, playerCount)]}</span
			>
			<ChevronRightIcon />
		</button>
	{/if}

	<button
		class="flex aspect-square items-center justify-center rounded border bg-secondary text-red-500"
		onclick={handleBackspace}
	>
		<DeleteIcon />
	</button>
</div>
