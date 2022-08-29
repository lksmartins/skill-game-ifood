import * as fs from 'fs'
import path from 'path'

export default function getFilesFromDir(folderPath) {
    const dir = path.resolve('./public',folderPath)
    const dirents = fs.readdirSync(dir, { withFileTypes: true })
    const filesNames = dirents
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name)

    return filesNames
}