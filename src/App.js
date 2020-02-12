import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import opencc from 'node-opencc'
import Jszip from 'jszip'
import { saveAs } from 'file-saver'
import textplain from './textplain';
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
async function transfer(jszip, taiwan = true, callback = console.log) {
  const files = []
  jszip.forEach((path, obj) => {
    files.push([path, obj]);
  })
  for (let file of files) {
    let [path, obj] = file
    if (!obj.dir) {
      callback(path) // 處理到哪個檔案了
      transfer = taiwan ? opencc.simplifiedToTaiwanWithPhrases : opencc.taiwanToSimplifiedWithPhrases;
      const path2 = transfer(path) // 路徑轉換
      const ext = textplain.find(tp => { // 是否為文字檔的副檔名
        if (path.length >= tp.length) { // 正規表達式此時不好用
          return path.substr(path.length - tp.length) === tp
        }
        return false
      })
      let comment = await jszip.file(path).async("string");
      if (ext) { // 副檔名匹配轉換內容
        comment = transfer(comment)
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
  const [path, setPath] = useState("ZIP文字內容轉換簡繁體工具");
  const [taiwan, setTaiwan] = useState(true);
  const templateStr = (flag) => `
  <p>鑑於${flag ? '簡體字' : '繁體字'}和用語不合使用習慣，做了一個將目錄內容全轉換為${flag ?  '臺灣繁體' :'簡體中文'}工具</p>
  <p>先將目錄ZIP打包後，點擊網頁內選擇檔案，處理完成後自動下載，檔名為 ${flag ? 'tw_':'cn_'}原名稱.zip <a href="./test.zip">範例</a></p>
  <p>用途舉例：不幸的交接到${flag ? '簡體' : '繁體'}專案、或clone到${flag ? '簡體' : '繁體'}字做的程式專案${'(GitHub上一堆)' ? '簡體' : ''}</p>
  <p>使用 React , node-opencc 文字轉換，jszip 存取zip，file-saver 檔案存取(只使用到下載功能)</p>
  
`
  const [text, setText] = useState(opencc.simplifiedToTaiwanWithPhrases(templateStr(true)));
  function changeFlag(e) {
    const taiwan = e.target.value === "1"
    const func = taiwan ? opencc.simplifiedToTaiwanWithPhrases : opencc.taiwanToSimplifiedWithPhrases;
    setTaiwan(taiwan)
    setText(func(templateStr(taiwan)))
    setPath(func(path))
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <label>臺灣繁體化
        <input type="radio" value={"1"} name="flag" checked={taiwan} onChange={changeFlag} />
        </label>
        <label>简体中文化
        <input type="radio" value={"0"} name="flag" checked={!taiwan} onChange={changeFlag} />
        </label>
        <input type="file" onChange={async (e) => {
          let jszip = new Jszip()
          let rawfile = e.target.files[0];
          jszip = await jszip.loadAsync(rawfile);
          jszip = await transfer(jszip, taiwan, setPath)
          setPath("Waitting ....")
          jszip = removeEmptyDir(jszip)
          jszip.generateAsync({ type: "blob" })
            .then(function (blob) {
              setPath("Finish")
              saveAs(blob, (taiwan ? 'tw_' : 'cn_') + rawfile.name);
            });
        }} />
        {path}
      </header>
      <span dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}

export default App;
