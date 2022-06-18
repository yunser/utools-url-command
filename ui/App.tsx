import { useEffect, useState } from 'react'
import axios from 'axios'
import './app.less'

console.log('_plugin', window._plugin)

function App() {

    const [list, setList] = useState([])
    const [configPath, setConfigPath] = useState('')
    const [msg] = useState('React')
    const [url, setUrl] = useState('')
    const [result, setResult] = useState('')
    const [view, setView] = useState('setting')

    useEffect(() => {
        if (window._plugin) {
            setList(window._plugin.getList())
            setConfigPath(window._plugin.getConfigPath())
        }
    }, [])

    async function loadData() {
        if (!url) {
            return
        }
        console.log('loadData')
        const res = await axios.get(url)
        console.log('res', res.status, res.data)
        if (typeof res.data == 'object') {
            setResult(JSON.stringify(res.data, null, 4))
        }
        else if (typeof res.data == 'string') {
            setResult(res.data)
        }
    }
    useEffect(() => {
        if (window._plugin) {
            console.log('注册0')
            window._plugin.on('url', (data) => {
                console.log('onUrl', data)
                const { url } = data
                setUrl(url)
            })
            // const url = window._plugin.getUrl()
            // setUrl(url)
            // setConfigPath(window._plugin.getConfigPath())
        }
        // console.log('fetch')
        // loadData()
    }, [])

    useEffect(() => {
        loadData()
    }, [url])


    console.log('render')

    return (
        <div className="app">
            <div className="mb-4">已加载 {list.length} 条数据</div>

            <div className="mb-4">配置文件路径：{configPath}</div>

            <button
                onClick={() => {
                    window._plugin.showPath(configPath)
                    // window._plugin.getConfigPath()
                }}
            >打开配置文件</button>
            {/* <div className="hello">Hello {msg}</div> */}
            {/* <div>
                <button
                    onClick={() => {
                        alert('hello')
                    }}
                >Send Message</button>
            </div> */}
            <div>================</div>
            <div>请求链接：{url}</div>
            <div>请求结果：</div>
            <div>
                <pre>{result}</pre>
            </div>
        </div>
    )
}
export default App
