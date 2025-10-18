import { readCaseFile } from '@/lib/api/file-reader'

export const GET = () => readCaseFile('closing-statement-extract.txt', 'text/plain')
