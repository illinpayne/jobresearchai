import { Module } from '@nestjs/common'

import { ParserModule } from '@/infrastructure/parser/parser.module'

import { ResumeController } from './resume.controller'

@Module({
	imports: [ParserModule],
	controllers: [ResumeController]
})
export class ResumeModule {}
