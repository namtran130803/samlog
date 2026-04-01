export function getRankStyle(rank: number) {
	switch (rank) {
		case 0:
			return {
				textColor: 'text-green-500',
				borderColor: 'border-green-500/10',
				bgColor: 'bg-green-500/10'
			};

		case 1:
			return {
				textColor: 'text-lime-500',
				borderColor: 'border-lime-500/10',
				bgColor: 'bg-lime-500/10'
			};

		case 2:
			return {
				textColor: 'text-yellow-500',
				borderColor: 'border-yellow-500/10',
				bgColor: 'bg-yellow-500/10'
			};

		case 3:
			return {
				textColor: 'text-orange-500',
				borderColor: 'border-orange-500/10',
				bgColor: 'bg-orange-500/10'
			};

		case 4:
			return {
				textColor: 'text-red-500',
				borderColor: 'border-red-500/10',
				bgColor: 'bg-red-500/10'
			};

		default:
			return {
				textColor: 'text-muted-foreground',
				borderColor: 'border-muted-foreground',
				bgColor: 'bg-muted'
			};
	}
}
