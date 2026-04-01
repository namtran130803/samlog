import { createLocalStore } from '$/lib/utils/localStore.svelte';

export interface PlayerRanking {
	name: string;
	total: number;
	reward: string;
}

export interface ActiveCell {
	r: number;
	c: number;
}

export interface Game {
	id: string;
	createdAt: string;
	title: string;
	rewards: string[];
	board: number[][];
	rankings: PlayerRanking[];
	activeCell: ActiveCell;
	showKeyboard: boolean;
}

export interface Table {
	id: string;
	createdAt: string;
	players: string[];
	games: Game[];
}

const localTables = createLocalStore<Table[]>('samlog_tables', []);

export const tablesStore = localTables.value;
