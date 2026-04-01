export function getScoreStyle(score: number) {
	switch (score) {
		case 0:
			return {
				bgColor: 'bg-green-500/10',
				textColor: 'text-green-500'
			};

		case 1:
		case 2:
		case 3:
			return {
				bgColor: 'bg-lime-500/10',
				textColor: 'text-lime-500'
			};

		case 4:
		case 5:
		case 6:
			return {
				bgColor: 'bg-yellow-500/10',
				textColor: 'text-yellow-500'
			};

		case 7:
		case 8:
		case 9:
			return {
				bgColor: 'bg-orange-500/10',
				textColor: 'text-orange-500'
			};

		default:
			return {
				bgColor: 'bg-red-500/10',
				textColor: 'text-red-500'
			};
	}
}
