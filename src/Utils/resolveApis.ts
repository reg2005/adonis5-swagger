import { join } from 'path'

export default function (paths: string[]) {
	const isBuildDir: boolean = process.cwd().includes('build')

	return paths.map((path) => {
		return isBuildDir ? join('..', path) : path
	})
}
