import {toRaw, isRef, isReactive, isProxy, toValue} from 'vue';


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

export function deepToRaw<T extends Record<string, any>>(sourceObj: T): T {
    const recursive = (target: any): any => {
        if (Array.isArray(target)) {
            return target.map(item => recursive(item))
        }
        if (isRef(target) || isProxy(target)) {
            return recursive(toValue(target))
        }
        if (isReactive(target)) {
            return recursive(toRaw(target))
        }
        if (typeof target === 'object') {
            return Object.keys(target).reduce((obj, key) => {
                obj[key as keyof typeof obj] = recursive(target[key])
                return obj
            }, {} as T)
        }
        return target
    }

    return recursive(sourceObj);
}
