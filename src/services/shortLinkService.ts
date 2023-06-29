import axios from 'axios';
export async function genShortLink(url: string, key: string) {
    let resp = await axios.post('/api/create',
        JSON.stringify(
            {
                'original_link': url,
                'id': ''
            }),
        {
            headers: {
                'Content-Type': 'application/json',
                'x-space-app-key': key
            },
            //baseURL: 'https://proxy-1-y4927431.deta.app'
        })
    let link = resp.data.short_link
    return link
}

export async function encodeWithKeyDataCenter(data: any) {
    let resp = await axios.post('/',
        {
            data
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
            baseURL: 'https://keydatacenter-1-o0500338.deta.app/'
        })
    return resp.data.key
}

export async function decodeWithKeyDataCenter(key: string) {
    try {
        let resp = await axios.get('/' + key,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                baseURL: 'https://keydatacenter-1-o0500338.deta.app/'
            })
        return resp.data.data
    } catch (err) {
        return undefined
    }

}