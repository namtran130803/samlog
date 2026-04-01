<script lang="ts">
	import { scrollIntoView } from '$/lib/actions/scrollIntoView.svelte';
	import type { Game } from '$/lib/stores/tablesStore.svelte';
	import { getScoreStyle } from '$/lib/utils/getScoreStyle';
	import { random } from '../utils/random';

	interface Props {
		players: string[];
		game: Game;
	}

	const { players, game }: Props = $props();

	function handleEditCell(r: number, c: number) {
		game.activeCell = { r, c };
		game.showKeyboard = true;
	}
</script>

<div
	class="flex flex-1 flex-col justify-start overflow-auto rounded border bg-card p-2 pt-0 text-sm"
>
	<div class="sticky top-0 z-10 flex h-fit flex-col text-center capitalize">
		<div class="h-2 w-full bg-card"></div>
		<div class="flex gap-2">
			{#each players as player, r}
				<span
					class={[
						'animate__animated animate__zoomIn flex h-10 flex-1 items-center justify-center bg-border/20 backdrop-blur',
						game.activeCell.r === r && 'text-primary underline underline-offset-6'
					]}
					style:animation-delay={`${random(0, 500)}ms`}
					style:animation-duration={`${random(100, 500)}ms`}
				>
					{player}
				</span>
			{/each}
		</div>
	</div>

	<main class="flex h-fit gap-2 text-center">
		{#each game.board as row, r}
			<div class="flex-1">
				{#each row.toReversed() as score, i (row.length - 1 - i)}
					{@const c = row.length - 1 - i}
					{@const active = game.activeCell.r === r && game.activeCell.c === c}
					{@const { textColor } = getScoreStyle(score)}

					<button
						class="animate__animated animate__zoomIn flex h-10 w-full items-center justify-center bg-border/20"
						class:border={active}
						class:border-primary={active}
						style:animation-delay={`${Math.random() * 500}ms`}
						style:animation-duration={`${100 + Math.random() * 400}ms`}
						{@attach active && scrollIntoView({ active })}
						onclick={() => handleEditCell(r, c)}
					>
						<span class={`flex size-8 items-center justify-center ${textColor}`}>
							{score}
						</span>
					</button>
				{/each}
			</div>
		{/each}
	</main>
</div>
