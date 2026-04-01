export interface IGameItem {
	id: string;
	title: string;
	rankings: { name: string; total: number; reward: string }[];
	roundsCount: number;
	createdAt: string;
}
