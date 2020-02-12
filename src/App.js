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
async function toTaiwanWithPhrases(jszip, callback = console.log) {
  const files = []
  jszip.forEach((path, obj) => {
    files.push([path, obj]);
  })
  for (let file of files) {
    let [path, obj] = file
    if (!obj.dir) {
      callback(path) // 處理到哪個檔案了
      const path2 = opencc.simplifiedToTaiwanWithPhrases(path) // 路徑轉換
      const comment = await jszip.file(path).async("string");
      const ext = textplain.find(tp => { // 是否為文字檔的副檔名
        if (path.length >= tp.length) { // 正規表達式此時不好用
          return path.substr(path.length - tp.length) === tp
        }
        return false
      })
      if (path !== path2) { // 原路徑刪除
        jszip = jszip.remove(path)
        path = path2
      }
      if (ext) { // 副檔名匹配轉換內容
        comment = opencc.simplifiedToTaiwanWithPhrases(comment)
      }
      jszip = jszip.file(path2, comment);
    }
  }
  return jszip;
}

function App() {
  let [path, setPath] = useState("ZIP文字內容轉換臺灣繁體");
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input type="file" onChange={async (e) => {
          let jszip = new Jszip()
          let rawfile = e.target.files[0];
          jszip = await jszip.loadAsync(rawfile);
          jszip = await toTaiwanWithPhrases(jszip, setPath)
          setPath("Waitting ....")
          jszip = removeEmptyDir(jszip)
          jszip.generateAsync({ type: "blob" })
            .then(function (blob) {
              setPath("Finish")
              saveAs(blob, 'tw_' + rawfile.name);
            });
        }} />
        {path}
      </header>
        <p>鑑於簡體字和用語不合使用習慣，做了一個將目錄內容全轉換為臺灣繁體工具</p>
        <p>先將目錄ZIP打包後，點擊網頁內選擇檔案，處理完成後自動下載，檔名為 tw_原名稱.zip </p>
        <p>用途舉例：簡體字做的程式專案(GitHub上一堆)</p>
        <p>使用 React , node-opencc 文字轉換，jszip 存取zip，file-saver 檔案存取(只使用到下載功能)</p>
    </div>
  );
}

export default App;
