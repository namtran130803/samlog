export function getCyclicIndex(index: number, delta: number, length: number) {
	return (index + delta + length) % length;
}
