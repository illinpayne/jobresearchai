import { Injectable } from '@nestjs/common'
import * as mammoth from 'mammoth'

import { ResumeParser } from '@/common/parsers/common/parser.abstract'

@Injectable()
export class WordParser implements ResumeParser {
	async parse(buffer: Buffer<ArrayBufferLike>): Promise<string> {
		try {
			const result = await mammoth.extractRawText({ buffer })
			const text = result.value

			if (!text || text.length <= 0) {
				throw new Error('Resume statement is not valid')
			}

			return text
		} catch (error) {
			throw error ?? new Error('Failed to extract text from PDF')
		}
	}
}
