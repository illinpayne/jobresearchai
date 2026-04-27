/* eslint-disable no-control-regex */
export class TextCleaner {
	public static sanitize(text: string): string {
		if (!text) return ''

		return text
			.replace(/(\w+)-\s*\r?\n\s*(\w+)/g, '$1$2')
			.replace(/(-+\s*)?\d+\s+of\s+\d+(\s*-+)?/gi, '')
			.replace(/^\s*\d+\s*$/gm, '')
			.replace(/\s-\s-\s?/g, ' ')
			.replace(/\s\/\s/g, ' ')
			.replace(/\/+/g, '/')
			.replace(/[\uE000-\uF8FF]/g, '')
			.replace(/\b([a-z])\s+\1\b/gi, '')
			.replace(/[\r\n]+/g, ' ')
			.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
			.replace(/\uFB01/g, 'fi')
			.replace(/\uFB02/g, 'fl')
			.replace(/[•\u2022\u25CF\u00B7]/g, '-')
			.replace(/-{2,}/g, '-')
			.replace(/\s{2,}/g, ' ')
			.trim()
	}
}
