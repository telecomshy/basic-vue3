export function isError(error: unknown): error is Error {
    return typeof error === 'object' && error != null && 'message' in error && 'name' in error
}

export function saveBlobToFile(blob: Blob, filename: string) {
    const href = URL.createObjectURL(blob)

    const anchorElement = document.createElement('a')
    anchorElement.href = href
    anchorElement.download = filename

    document.body.appendChild(anchorElement)
    anchorElement.click()

    document.body.removeChild(anchorElement)
    URL.revokeObjectURL(href)
}
