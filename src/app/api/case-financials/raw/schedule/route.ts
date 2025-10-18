import { readCaseFile } from '@/lib/api/file-reader'

export const GET = () => readCaseFile('schedule.md', 'text/markdown')
