export function inProps(key, props) {
    return key in props
}

export function findValueById(array, id) {
    return array.find(item => item.id == id).value
}

export async function getToken() {

    const res = await fetch(`${process.env.API_URL}/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: process.env.API_TOKEN
        })
    })

    const response = await res.json()
    return response.token
}