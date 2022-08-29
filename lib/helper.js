export function inProps(key, props){
    return key in props
}

export function findValueById(array, id){
    return array.find(item=>item.id==id).value
}