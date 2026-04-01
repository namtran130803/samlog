<script lang="ts">
	import { swipeMenu } from '$/lib/actions/swipeMenu';
	import { DicesIcon, ListTreeIcon, TrashIcon, UsersIcon } from '@lucide/svelte';
	import type { ITableItem } from '$/lib/types/ITableItem';
	import { tablesStore } from '$/lib/stores/tablesStore.svelte';

	const { id, createdAt, playersText, gamesCount, roundsCount }: ITableItem = $props();

	function handleDelete() {
		if (confirm('Xóa bàn chơi này, chắc chưa?')) {
			const index = tablesStore.findIndex((t) => t.id === id);
			if (index !== -1) {
				tablesStore.splice(index, 1);
			}
		}
	}
</script>

<li class="flex flex-col gap-1">
	<p class="text-xs text-muted-foreground">{new Date(createdAt).toLocaleString('vi-VN')}</p>

	<div
		class="relative overflow-hidden"
		{@attach swipeMenu({
			direction: 'right',
			menuItemRatio: 0.25,
			rightMenuItems: 1
		})}
	>
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
			href={`tables/${id}`}
			class="relative flex items-center gap-4 rounded border bg-card p-4"
		>
			<div class="flex size-12 items-center justify-center rounded bg-muted text-card-foreground">
				<UsersIcon />
			</div>

			<div class="flex flex-col gap-2">
				<p class="line-clamp-1 text-sm font-medium text-card-foreground">{playersText}</p>

				<div class="flex items-center gap-2 text-sm text-muted-foreground">
					<p class="flex items-center gap-1">
						<DicesIcon class="size-4" />
						<span>{gamesCount} ván</span>
					</p>
					<div class="h-4 w-px bg-border"></div>
					<p class="flex items-center gap-1">
						<ListTreeIcon class="size-4" />
						<span>{roundsCount} vòng</span>
					</p>
				</div>
			</div>
		</a>
	</div>
</li>
