export type ParseResult = {
	match: RegExpMatchArray | null;
	base: string;
	suffix: string;
	next: string;
	first: string;
};

export type Options = {
	suffixes?: string[];
	defaultValue?: string;
};

const DEFAULT_SUFFIXES = [' lần ', ' hiệp ', ' trận ', ' ván ', ' lượt ', ' [', ' #'];

/**
 * Escape regex special characters
 */
function escapeRegex(str: string) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Parse & increment a string with number suffix
 * Example:
 *  - "Hiệp 1" → "Hiệp 2"
 *  - "Game #3" → "Game #4"
 *  - "Round [2]" → "Round [3]"
 */
export function parseIncrementalTitle(title: string, options: Options = {}): ParseResult {
	const suffixes = options.suffixes ?? DEFAULT_SUFFIXES;
	const current = title || options.defaultValue || 'Untitled';

	// 1. Match số ở cuối
	const endMatch = current.match(/^(.*?)(\d+)\]?$/);

	if (endMatch) {
		let base = endMatch[1].trimEnd();
		const num = parseInt(endMatch[2], 10);

		for (const s of suffixes) {
			const escaped = escapeRegex(s);
			const suffixMatch = base.match(new RegExp(`(.+)${escaped}$`, 'i'));

			if (suffixMatch) {
				const cleanBase = suffixMatch[1];
				const endChar = s === ' [' ? ']' : '';

				return {
					match: endMatch,
					base: cleanBase,
					suffix: s,
					next: `${cleanBase}${s}${num + 1}${endChar}`,
					first: `${cleanBase}${s}1${endChar}`
				};
			}
		}

		// Không có suffix rõ ràng → chỉ tăng số
		return {
			match: endMatch,
			base,
			suffix: ' ',
			next: `${base} ${num + 1}`,
			first: `${base} 1`
		};
	}

	// 2. Match dạng có suffix + số (fallback)
	for (const s of suffixes) {
		const escaped = escapeRegex(s);
		const match = current.match(new RegExp(`(.+)${escaped}(\\d+)\\]?$`, 'i'));

		if (match) {
			const base = match[1];
			const num = parseInt(match[2], 10);
			const endChar = s === ' [' ? ']' : '';

			return {
				match,
				base,
				suffix: s,
				next: `${base}${s}${num + 1}${endChar}`,
				first: `${base}${s}1${endChar}`
			};
		}
	}

	// 3. Fallback: chưa có số
	const defaultSuffix = suffixes[0];

	return {
		match: null,
		base: current,
		suffix: defaultSuffix,
		next: `${current}${defaultSuffix}2`,
		first: `${current}${defaultSuffix}1`
	};
}

/**
 * Lấy title tiếp theo
 */
export function getNextTitle(title: string, options?: Options) {
	return parseIncrementalTitle(title, options).next;
}

/**
 * Lấy title đầu tiên (khi chưa có số)
 */
export function getFirstTitle(title: string, options?: Options) {
	return parseIncrementalTitle(title, options).first;
}
