<script lang="ts">
	import ActionBar from '$/lib/components/ActionBar.svelte';
	import { tablesStore } from '$/lib/stores/tablesStore.svelte';
	import { goto } from '$app/navigation';

	let inputEl: HTMLInputElement | undefined = $state();
	let players: string = $state('');

	const badges: string[] = $derived(players.split(' ').filter(Boolean));
	const disabled = $derived(!(badges.length > 1 && badges.length < 6));

	function handleCreate() {
		if (disabled) {
			inputEl?.focus();
			return;
		}

		const newTableId = (tablesStore.length + 1).toString();
		const newTable = {
			id: newTableId,
			createdAt: new Date().toISOString(),
			players: badges.map((p) => p.toLowerCase()),
			games: []
		};

		tablesStore.push(newTable);
		goto(`/tables/${newTableId}/games/new`, { replaceState: true });
	}
</script>

<div class="flex flex-1 flex-col gap-4 overflow-auto rounded border bg-card p-4">
	<div class="animate__animated animate__fadeIn flex flex-col items-center gap-1">
		<h1 class="text-lg font-medium text-card-foreground">Thêm bàn thêm ghế</h1>
		<p class="text-sm text-muted-foreground">Người không chơi là người thắng</p>
	</div>

	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleCreate();
		}}
		class="animate__animated animate__fadeIn mt-4 flex flex-col gap-2"
	>
		<label for="players" class="text-sm text-card-foreground">Tên các dân chơi</label>
		<input
			bind:this={inputEl}
			bind:value={players}
			autocomplete="off"
			autocapitalize="words"
			spellcheck="false"
			id="players"
			type="text"
			class="h-9 rounded border bg-input/40 px-3 py-1 text-sm placeholder:text-muted-foreground"
		/>
		<p class="text-xs text-muted-foreground italic">Nhập 2 đến 5 tên, cách nhau bằng dấu cách</p>
	</form>

	<div class="flex flex-wrap gap-2">
		{#each badges as badge}
			<div
				class="animate-in fade-in zoom-in w-fit rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground capitalize"
			>
				{badge}
			</div>
		{/each}
	</div>
</div>

<ActionBar title="Oke la" onClick={handleCreate} />
