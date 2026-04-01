import { browser } from '$app/environment';

export function createLocalStore<T>(key: string, initialValue: T) {
	let value = $state<T>(initialValue);

	if (browser) {
		const saved = localStorage.getItem(key);
		if (saved) {
			try {
				value = JSON.parse(saved);
			} catch (e) {
				console.error(`Error parsing localStorage key "${key}":`, e);
			}
		}

		$effect.root(() => {
			$effect(() => {
				localStorage.setItem(key, JSON.stringify(value));
			});
		});
	}

	return {
		get value() {
			return value;
		},
		set value(newValue: T) {
			value = newValue;
		}
	};
}
