import { readCaseFile } from '@/lib/api/file-reader'

export const GET = () => readCaseFile('results.json')
