import React, { useState, createRef } from 'react';
import opencc from 'node-opencc'
import { Helmet } from 'react-helmet';
import { saveAs } from 'file-saver'
import { debounce } from 'debounce'
import logo from './logo.svg';
import './App.css';
import Jszip from 'jszip'
import textplain from './textplain';
import packageJson from '../package.json';
console.log(opencc)
console.log(Jszip)

// 處理完後刪除空目錄
function removeEmptyDir(jszip) {
  let files = []
  jszip.forEach((path, obj) => {
    files.push([path, obj]);
  })
  for (let file of files) {
    let [path, obj] = file
    if (obj.dir) {
      let dir = jszip.folder(path)
      let i = 0;
      dir.forEach(() => i++)
      if (i === 0) {
        jszip = jszip.remove(path)
      }
    }
  }
  return jszip;
}

// 內容和路徑轉換成臺灣繁體
async function zipTransfer(jszip, taiwan = true, callback = console.log) {
  const files = []
  jszip.forEach((path, obj) => {
    files.push([path, obj]);
  })
  for (let file of files) {
    let [path, obj] = file
    if (!obj.dir) {
      callback(path) // 處理到哪個檔案了
      const transfer = taiwan ? opencc.simplifiedToTaiwanWithPhrases : opencc.taiwanToSimplifiedWithPhrases;
      const path2 = transfer(path) // 路徑轉換
      const ext = textplain.find(tp => { // 是否為文字檔的副檔名
        if (path.length >= tp.length) { // 正規表達式此時不好用
          return path.substr(path.length - tp.length) === tp
        }
        return false
      })
      let comment;
      if (ext) { // 副檔名匹配轉換內容
        comment = await jszip.file(path).async("string");
        comment = transfer(comment)
      } else {
        comment = await jszip.file(path).async("uint8array");
      }
      if (path !== path2) { // 原路徑刪除
        jszip = jszip.remove(path)
        path = path2
      }
      jszip = jszip.file(path2, comment);
    }
  }
  return jszip;
}

function App() {
  const ref = createRef();
  const [path, setPath] = useState("檔案或ZIP文字內容轉換簡繁體工具");
  const [taiwan, setTaiwan] = useState(true);
  const [textarea, setTextarea] = useState('');
  const func = taiwan ? opencc.simplifiedToTaiwanWithPhrases : opencc.taiwanToSimplifiedWithPhrases;
  const templateStr = (flag) => `
  <p>鑑於${flag ? '簡體字' : '繁體字'}和用語不合使用習慣，做了一個將目錄內容全轉換為${flag ? '臺灣繁體' : '簡體中文'}工具</p>
  <p>先將目錄ZIP打包後，點擊網頁內選擇檔案，處理完成後自動下載，檔名為 ${flag ? 'tw_' : 'cn_'}原名稱.zip <a href="./test.zip">範例.zip</a></p>
  <p>用途舉例：不幸的交接到${flag ? '簡體' : '繁體'}專案、或clone到${flag ? '簡體' : '繁體'}字做的程式專案${flag ? '(GitHub上一堆)' : ''}</p>
  <p>使用 React , node-opencc 文字轉換，jszip 存取zip，file-saver 檔案下載，debounce 節流處理</p>
  <p>現在單一檔案亦支援</p>
  
`
  const [text, setText] = useState(opencc.simplifiedToTaiwanWithPhrases(templateStr(true)));
  function changeFlag(e) {
    const taiwan = e.target.value === "1"
    const func = taiwan ? opencc.simplifiedToTaiwanWithPhrases : opencc.taiwanToSimplifiedWithPhrases;
    setTaiwan(taiwan)
    setText(func(templateStr(taiwan)))
    setPath(func(path))
    setTextarea(func(textarea))
    
  }
  const textareaChange=debounce((target) => {
    setTextarea(func(target.value))
  }, 800)
  return (
    <div className="App">
      <Helmet>
        <title>{path}</title>
        <meta name="description" content={text} />
        <link rel="icon" href={`${packageJson.homepage}${taiwan ? 'favicon.ico' : 'favicon2.ico'}`}></link>
      </Helmet>
      <header className="App-header">
        <textarea
          placeholder="Text Plain"
          rows="10"
          style={{ width: 'calc(100% - 50px)' }}
          onChange={(e) => textareaChange(e.target)}>
        </textarea>
        <textarea
          placeholder="Click Copy Button to Copy"
          rows="10"
          style={{ width: 'calc(100% - 50px)' }}
          value={textarea}
          ref={ref}
          disabled>
        </textarea>
        <button
          style={{ width: 'calc(100% - 50px)', fontSize: '20px' }}
          onClick={(e) => {
            const range = window.document.createRange();
            range.selectNode(ref.current)
            const selection = window.document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy')
            alert(textarea)
          }}>Copy</button>
        <label>臺灣繁體化
        <input type="radio" value={"1"} name="flag" checked={taiwan} onChange={changeFlag} />
        </label>
        <label>简体中文化
        <input type="radio" value={"0"} name="flag" checked={!taiwan} onChange={changeFlag} />
        </label>
        <input type="file" onChange={async (e) => {
          const rawfile = e.target.files[0];
          if (!rawfile) return
          const fileName = rawfile.name;
          if (/zip|epub/.test(fileName)) {
            let jszip = new Jszip()
            jszip = await jszip.loadAsync(rawfile);
            jszip = await zipTransfer(jszip, taiwan, setPath)
            setPath("Waitting ....")
            jszip = removeEmptyDir(jszip)
            jszip.generateAsync({ type: "blob" })
              .then(function (blob) {
                setPath("Finish")
                saveAs(blob, (taiwan ? 'tw_' : 'cn_') + rawfile.name);
              });
          } else {
            const reader = new FileReader();
            reader.onload = function (event) {
              const ext = textplain.find(tp => { // 是否為文字檔的副檔名
                if (fileName.length >= tp.length) { // 正規表達式此時不好用
                  return fileName.substr(fileName.length - tp.length) === tp
                }
                return false
              })
              if (ext) { // 副檔名匹配轉換內容
                const transfer = taiwan ? opencc.simplifiedToTaiwanWithPhrases : opencc.taiwanToSimplifiedWithPhrases;
                const comment = transfer(event.target.result)
                const blob = new Blob([comment], { type: "text/plain;charset=utf-8" });
                saveAs(blob, (taiwan ? 'tw_' : 'cn_') + fileName)
              }
            };

            reader.readAsText(rawfile);
          }
        }} />
        {path}
      </header>
      <span dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}

export default App;
