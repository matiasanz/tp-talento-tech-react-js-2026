export function normalizeValueForSearch(value){
    return value
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/z|c(?=[ei])/g, "s") // replace z & c by s
        .replace(/v/g, "b")
        .replace(/ll/g, "y")
        .replace(/(\s+)|[-_.,;:]/g, "")

}