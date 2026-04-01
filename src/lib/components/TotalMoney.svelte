<script lang="ts">
	import type { ITotalMoney } from '../types/ITotalMoney';
	import { getRewardDisplay } from '../utils/getRewardDisplay';

	interface Props {
		items: ITotalMoney[];
	}

	let { items }: Props = $props();
</script>

<div class="flex gap-2 rounded border bg-card p-2 text-sm">
	{#each items as item}
		{@const rewardDisplay = getRewardDisplay(item.reward)}
		<div class="flex flex-1 flex-col items-center gap-1">
			<span class="font-medium text-card-foreground capitalize">
				{item.name}
			</span>

			<span class={[rewardDisplay.textColor, 'text-lg font-semibold']}>
				{rewardDisplay.text}
			</span>
		</div>
	{/each}
</div>
