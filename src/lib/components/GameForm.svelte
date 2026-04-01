<script lang="ts">
	import { getRewardDisplay } from '$/lib/utils/getRewardDisplay';
	import { getRankStyle } from '$/lib/utils/getRankStyle';
	import type { IGameForm } from '../types/IGameForm';

	type Props = {
		title: IGameForm['title'];
		rewards: IGameForm['rewards'];
		onchange: (data: IGameForm) => void;
		onsubmit?: () => void;
	};

	const { title, rewards, onchange, onsubmit }: Props = $props();

	function updateTitle(value: string) {
		onchange({ title: value, rewards });
	}

	function updateReward(index: number, value: string) {
		const newRewards = [...rewards];
		newRewards[index] = value;
		onchange({ title, rewards: newRewards });
	}

	function handleKeydown(e: KeyboardEvent, index: number) {
		if (e.key !== 'Enter') return;

		// chỉ submit khi ở input cuối
		console.log(index, rewards.length - 1);
		if (index === rewards.length - 1) {
			e.preventDefault();
			onsubmit?.();
		}
	}
</script>

<form
	class="flex flex-1 flex-col gap-4 overflow-auto rounded border bg-card p-4"
	onsubmit={(e) => {
		e.preventDefault();
		onsubmit?.();
	}}
>
	<!-- Header -->
	<div class="animate__animated animate__fadeIn flex flex-col items-center gap-1">
		<h1 class="text-lg font-medium text-card-foreground">Thêm bát thêm đũa</h1>
		<p class="text-sm text-muted-foreground">Người không chơi là người thắng</p>
	</div>

	<!-- Title -->
	<div class="animate__animated animate__fadeIn2 mt-4 flex flex-col gap-2">
		<label for="title" class="text-sm text-card-foreground"> Kèo gì đây các dân chơi? </label>
		<input
			value={title}
			oninput={(e) => updateTitle(e.currentTarget.value)}
			autocomplete="off"
			autocapitalize="sentences"
			spellcheck="false"
			id="title"
			type="text"
			class="h-9 rounded border bg-input/40 px-3 py-1 text-sm placeholder:text-muted-foreground"
		/>
	</div>

	<!-- Rewards -->
	<ol class="animate__animated animate__fadeIn flex flex-col gap-2">
		{#each rewards as value, index}
			{@const rank = index}
			{@const rankStyle = getRankStyle(rank)}
			{@const rewardDisplay = getRewardDisplay(value)}

			<li
				class="animate__animated animate__fadeIn flex gap-2"
				style:animation-delay={`${index * 100}ms`}
			>
				<label
					for="rank-{rank}"
					class={[
						'flex size-9 items-center justify-center rounded border',
						rankStyle.bgColor,
						rankStyle.textColor,
						rankStyle.borderColor
					]}
				>
					#{rank + 1}
				</label>

				<input
					{value}
					oninput={(e) => updateReward(index, e.currentTarget.value)}
					onkeydown={(e) => handleKeydown(e, index)}
					autocomplete="off"
					autocapitalize="sentences"
					spellcheck="false"
					id="rank-{rank}"
					type="text"
					class={[
						'flex-1 rounded border px-2 text-sm placeholder:text-muted-foreground',
						rankStyle.bgColor,
						rankStyle.borderColor,
						rewardDisplay.textColor
					]}
				/>
			</li>
		{/each}
	</ol>

	<!-- Hint -->
	<div class="animate__animated animate__fadeIn flex flex-col gap-1 px-1">
		<ul class="flex flex-col gap-0.5 text-[10px] text-muted-foreground">
			<li>• Nhập số dương cho người thắng/được thêm tiền (+100, +50)</li>
			<li>• Nhập số âm cho người thua/phải trả tiền (-100, -200)</li>
			<li>• Có thể nhập nội dung (Trả tiền nước, Mua trà sữa...)</li>
			<li>• Có thể để trống các trường</li>
		</ul>
	</div>
</form>
