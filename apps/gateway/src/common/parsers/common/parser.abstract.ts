export abstract class ResumeParser {
	abstract parse(buffer: Buffer<ArrayBufferLike>): Promise<string>
}
