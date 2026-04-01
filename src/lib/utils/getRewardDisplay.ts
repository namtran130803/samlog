export function getRewardDisplay(value: string) {
	const number = Number(value);
	const isNumber = !Number.isNaN(number);

	if (!isNumber || number === 0) {
		return {
			textSize: 'text-xs',
			textColor: 'text-foreground',
			text: value
		};
	}

	return {
		textColor: number > 0 ? 'text-green-500' : 'text-red-500',
		textSize: 'text-base font-medium',
		text: number > 0 ? `+${number}` : `${number}`
	};
}
