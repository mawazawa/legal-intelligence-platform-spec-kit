import { readCaseFile } from '@/lib/api/file-reader'

export const GET = () => readCaseFile('withholding-evidence.md', 'text/markdown')
