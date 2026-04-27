import { Module } from '@nestjs/common'

import { PDF_PARSER, WORD_PARSER } from './parser.inject-keys'
import { PdfParser } from './parsers/pdf-parser.service'
import { WordParser } from './parsers/word-parser.service'

@Module({
	providers: [
		{
			provide: PDF_PARSER,
			useClass: PdfParser
		},
		{
			provide: WORD_PARSER,
			useClass: WordParser
		}
	],
	exports: [PDF_PARSER, WORD_PARSER]
})
export class ParserModule {}
