import { uid } from 'uid'
import md5 from 'md5'
const fs = require('fs')
// import fs from 'fs'
// console.log('Node version is: ' + process.version);
// console.log('version', process.versions)
console.log('fs', fs, fs.readFileSync)
const code_prefix = 'open-app-v1-'

const features = utools.getFeatures()

// console.log('features', features)

let g_url
let g_handlers = {}

const dbPath = '/Users/yunser/data/url-command/data.json'

const demo_urls = [
    {
        "title": "云设测试",
        "url": "https://nodeapi.yunser.com/"
    }
]

let urls = demo_urls

async function main() {
    
    // console.log('urls', JSON.stringify(ur))
    if (fs.existsSync(dbPath)) {
        const jsonContent = fs.readFileSync(dbPath, 'utf-8')
        let jsonData
        try {
            jsonData = JSON.parse(jsonContent)
        }
        catch (err) {
            console.error('JSON 格式解析出错')
            console.error(err)
        }
        if (jsonData) {
            urls = jsonData.data
        }
    }
    
    for (let item of urls) {
        item.id = md5(item.url)
    }
    
    for (let url of urls) {
        utools.setFeature({
            "code": code_prefix + url.id,
            explain: `打开 ${url.title} ` + url.url,
            cmds: [
                url.title,
                ...(url.keywords || []),
            ]
        })
    }
    for (let feature of features) {
        if (!feature.code.includes(code_prefix)) {
            utools.removeFeature(feature.code)
        }
    }
    
    const features2 = utools.getFeatures()
    
    console.log('features2', features2)
    
    utools.onPluginEnter(({ code, type, payload }) => {
        console.log('用户进入插件', code, type, payload)
        g_url = ''
        if (code.includes(code_prefix)) {
            const item = urls.find(u => code_prefix + u.id == code)
            if (item) {
                console.log('找到', item)
                g_url = item.url
                if (g_handlers['url']) {
                    for (let handle of g_handlers['url']) {
                        handle({
                            url: item.url,
                        })
                    }
                }
                // utools.shellOpenPath(item.url)
                                // window.utools.hideMainWindow()
                    // utools.showNotification('hello')
                    // window.utools.outPlugin()
            }
        }
    })
    
    // window.exports = {
    //     'open-in-browser': {
    //         mode: 'none',
    //         args: {
    //             enter: (action) => {
    //                 console.log('action', action)
    //                 // window.utools.hideMainWindow()
    //                 // utools.showNotification('hello')
    //                 // window.utools.outPlugin()
    //             }
    //         }
    //     }
    // }
}

main()

window._plugin = {

    getList() {
        return urls
    },

    getConfigPath() {
        return dbPath
    },

    showPath(path) {
        utools.shellShowItemInFolder(path)
    },

    getUrl() {
        return g_url
    },

    on(name, handler) {
        console.log('注册1')
        if (!g_handlers[name]) {
            g_handlers[name] = []
        }
        g_handlers[name].push(handler)
        console.log('注册', name, g_handlers)
    }
}

console.log('main end')