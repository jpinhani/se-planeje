/* eslint no-eval: 0 */
const SearchFilterVision = (array, fields, value) => {
    if (!Array.isArray(array)) return [];
    else if (value === '') {
        return array;
    } else {
        value = value.replace(/V|\\|\[|\]|\(|\)/gi, '')
        return (array.filter(i => fields.some(f =>
            vectorSearch(i, f, value)
        )))
    }
}


const vectorSearch = (item, field, value) => {
    if (!Array.isArray(field)) {
        return (
            item[field] && (
                !Array.isArray(item[field]) ? String(item[field]).match(new RegExp(value, 'gi')) :
                    item[field].some(n => n.match(new RegExp(value, 'gi')))
            )
        )
    } else {
        let aux = "Item"
        field.forEach(i => {
            if (eval(aux + "." + i)) {
                aux += "." + i
            }
        })
        return (String(eval(aux)).match(new RegExp(value, 'gi')))
    }
}


export default SearchFilterVision