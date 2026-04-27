import { Injectable } from '@nestjs/common'
import { PDFParse } from 'pdf-parse'

import { ResumeParser } from '@/common/parsers/common/parser.abstract'

@Injectable()
export class PdfParser implements ResumeParser {
	async parse(buffer: Buffer<ArrayBufferLike>): Promise<string> {
		try {
			const parser = new PDFParse({ data: buffer })
			const result = await parser.getText()

			await parser.destroy()

			if (result.pages.length !== 1) {
				throw new Error('There is should be only one page')
			}

			return result.text
		} catch (error) {
			throw error ?? new Error('Failed to extract text from PDF')
		}
	}
}
