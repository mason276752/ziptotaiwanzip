import { useState, useMemo } from 'react'
import opencc from 'node-opencc'
import { Helmet } from 'react-helmet-async'
import { saveAs } from 'file-saver'
import debounce from 'debounce'
import { useDropzone } from 'react-dropzone'
import JSZip from 'jszip'
import textplain from './textplain'
import packageJson from '../package.json'

function removeEmptyDir(jszip: JSZip): JSZip {
  const files: [string, JSZip.JSZipObject][] = []
  jszip.forEach((path, obj) => {
    files.push([path, obj])
  })
  for (const [path, obj] of files) {
    if (obj.dir) {
      const dir = jszip.folder(path)
      let i = 0
      dir?.forEach(() => i++)
      if (i === 0) {
        jszip = jszip.remove(path)
      }
    }
  }
  return jszip
}

async function zipTransfer(
  jszip: JSZip,
  taiwan: boolean,
  onProgress: (current: number, total: number) => void,
  total: number,
): Promise<JSZip> {
  const files: [string, JSZip.JSZipObject][] = []
  jszip.forEach((path, obj) => {
    files.push([path, obj])
  })
  let count = 0
  for (const [origPath, obj] of files) {
    if (!obj.dir) {
      const transfer = taiwan
        ? opencc.simplifiedToTaiwanWithPhrases
        : opencc.taiwanToSimplifiedWithPhrases
      const newPath = transfer(origPath)
      const ext = textplain.find((tp) => origPath.slice(-tp.length) === tp)
      let content: string | Uint8Array
      if (ext) {
        const raw = await jszip.file(origPath)!.async('string')
        content = transfer(raw)
      } else {
        content = await jszip.file(origPath)!.async('uint8array')
      }
      if (origPath !== newPath) {
        jszip = jszip.remove(origPath)
      }
      jszip = jszip.file(newPath, content)
      onProgress(++count, total)
    }
  }
  return jszip
}

function isTextFile(fileName: string): boolean {
  return textplain.some((tp) => fileName.slice(-tp.length) === tp)
}

function App() {
  const [taiwan, setTaiwan] = useState(true)
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  const func = taiwan
    ? opencc.simplifiedToTaiwanWithPhrases
    : opencc.taiwanToSimplifiedWithPhrases

  const handleTextareaChange = useMemo(
    () =>
      debounce((value: string) => {
        setOutputText(value ? func(value) : '')
      }, 800),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [taiwan],
  )

  function toggleMode() {
    const next = !taiwan
    const transfer = next
      ? opencc.simplifiedToTaiwanWithPhrases
      : opencc.taiwanToSimplifiedWithPhrases
    setTaiwan(next)
    if (inputText) setOutputText(transfer(inputText))
  }

  async function fileTransfer(rawfile: File) {
    const fileName = rawfile.name
    setStatusMsg('')
    if (/zip|epub/.test(fileName)) {
      let jszip = new JSZip()
      jszip = await jszip.loadAsync(rawfile)
      let total = 0
      jszip.forEach((_, obj) => {
        if (!obj.dir) total++
      })
      setProgress({ current: 0, total })
      jszip = await zipTransfer(jszip, taiwan, (current, t) => {
        setProgress({ current, total: t })
      }, total)
      jszip = removeEmptyDir(jszip)
      const blob = await jszip.generateAsync({ type: 'blob' })
      setProgress(null)
      setStatusMsg('完成！')
      saveAs(blob, (taiwan ? 'tw_' : 'cn_') + rawfile.name)
    } else {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (isTextFile(fileName) && event.target?.result) {
          const comment = func(event.target.result as string)
          const blob = new Blob([comment], { type: 'text/plain;charset=utf-8' })
          saveAs(blob, (taiwan ? 'tw_' : 'cn_') + fileName)
        }
      }
      reader.readAsText(rawfile)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      for (const file of acceptedFiles) {
        fileTransfer(file)
      }
    },
  })

  async function handleCopy() {
    if (!outputText) return
    await navigator.clipboard.writeText(outputText)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2000)
  }

  const inputLabel = taiwan ? '簡體中文（輸入）' : '臺灣繁體（輸入）'
  const outputLabel = taiwan ? '臺灣繁體（輸出）' : '簡體中文（輸出）'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <Helmet>
        <title>簡繁轉換工具</title>
        <link
          rel="icon"
          href={`${packageJson.homepage}${taiwan ? 'favicon.ico' : 'favicon2.ico'}`}
        />
      </Helmet>

      {/* Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500" />
          <span className="font-semibold tracking-wide">簡繁轉換工具</span>
        </div>

        {/* Mode Toggle */}
        <button
          onClick={toggleMode}
          className="relative flex items-center bg-slate-800 border border-slate-700 rounded-full p-1 cursor-pointer hover:border-slate-600 transition-colors"
          aria-label="切換轉換模式"
        >
          <span
            className={`absolute top-1 h-7 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300 ${
              taiwan ? 'left-1 w-[5.5rem]' : 'left-[5.75rem] w-[5.5rem]'
            }`}
          />
          <span className={`relative z-10 px-3 py-1 text-sm font-medium transition-colors ${taiwan ? 'text-white' : 'text-slate-400'}`}>
            臺灣繁體化
          </span>
          <span className={`relative z-10 px-3 py-1 text-sm font-medium transition-colors ${!taiwan ? 'text-white' : 'text-slate-400'}`}>
            简体中文化
          </span>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">

        {/* Textarea panel */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {/* Input */}
            <div className="flex flex-col">
              <div className="px-4 py-2 bg-slate-800/50 text-xs text-slate-400 font-medium border-b border-slate-800">
                {inputLabel}
              </div>
              <textarea
                className="flex-1 w-full min-h-64 p-4 bg-transparent text-slate-100 placeholder-slate-600 resize-none focus:outline-none font-mono text-sm"
                placeholder="在此輸入文字，將即時轉換..."
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value)
                  handleTextareaChange(e.target.value)
                }}
              />
              <div className="px-4 py-2 bg-slate-800/30 text-xs text-slate-500 border-t border-slate-800">
                字數：{inputText.length.toLocaleString()}
              </div>
            </div>

            {/* Output */}
            <div className="flex flex-col">
              <div className="px-4 py-2 bg-slate-800/50 flex items-center justify-between border-b border-slate-800">
                <span className="text-xs text-slate-400 font-medium">{outputLabel}</span>
                <button
                  onClick={handleCopy}
                  disabled={!outputText}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-md bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity cursor-pointer"
                >
                  複製
                </button>
              </div>
              <textarea
                className="flex-1 w-full min-h-64 p-4 bg-transparent text-slate-100 placeholder-slate-600 resize-none focus:outline-none font-mono text-sm"
                placeholder="轉換結果將顯示於此..."
                value={outputText}
                readOnly
              />
              <div className="px-4 py-2 bg-slate-800/30 text-xs text-slate-500 border-t border-slate-800">
                字數：{outputText.length.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
              : 'border-slate-700 bg-slate-900 hover:border-slate-500 hover:bg-slate-800/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isDragActive ? 'bg-indigo-500/20' : 'bg-slate-800'
            }`}>
              <svg
                className={`w-6 h-6 transition-colors ${isDragActive ? 'text-indigo-400' : 'text-slate-500'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div className="text-center">
              <p className={`font-medium transition-colors ${isDragActive ? 'text-indigo-300' : 'text-slate-300'}`}>
                {isDragActive ? '放開以上傳' : '拖曳或點擊上傳'}
              </p>
              <p className="text-xs text-slate-500 mt-1">支援 ZIP、EPUB 及純文字格式，可多檔同時處理</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {progress && (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col gap-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>處理中...</span>
              <span>{progress.current} / {progress.total} 個檔案</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                style={{ width: `${Math.round((progress.current / progress.total) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {statusMsg && !progress && (
          <p className="text-center text-sm text-green-400">{statusMsg}</p>
        )}

        {/* About */}
        <div className="text-center text-xs text-slate-600 space-y-1 pb-4">
          <p>使用 node-opencc 文字轉換・jszip 存取 ZIP・react-dropzone 拖曳上傳</p>
          <p>
            <a
              href={`${packageJson.homepage}test.zip`}
              className="underline hover:text-slate-400 transition-colors"
            >
              下載範例 ZIP
            </a>
          </p>
        </div>
      </main>

      {/* Toast */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg transition-all duration-300 pointer-events-none ${
          toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        ✓ 已複製到剪貼簿
      </div>
    </div>
  )
}

export default App
