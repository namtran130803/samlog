// $/lib/actions/scrollIntoView.ts
import type { Attachment } from 'svelte/attachments';

type Params = {
	active?: boolean;
	block?: ScrollLogicalPosition;
	behavior?: ScrollBehavior;
	inline?: ScrollLogicalPosition;
};

export function scrollIntoView(params: Params = {}): Attachment<HTMLElement> {
	return (node: HTMLElement) => {
		$effect(() => {
			console.log(params.active);
			if (params.active !== true) return;

			node.scrollIntoView({
				behavior: params.behavior ?? 'smooth',
				block: params.block ?? 'center',
				inline: params.inline ?? 'nearest'
			});
		});

		// Cleanup không bắt buộc
		return () => {};
	};
}
