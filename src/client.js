import { remote } from 'electron';

const { BrowserWindow, dialog } = remote;

/**
 * 読み込みするためのファイルを開く
 */
function openLoadFile() {
  const win = BrowserWindow.getFocusedWindow();

  dialog.showOpenDialog(
    win,
    // どんなダイアログを出すかを指定するプロパティ
    {
      properties: ['openFile'],
      filters: [
        {
          name: 'Documents',
          extensions: ['txt', 'text', 'html', 'js', 'adoc']
        }
      ]
    },
    // [ファイル選択]ダイアログが閉じられた後のコールバック関数
    function (filenames) {
      if (filenames) {
        readFile(filenames[0]);
      }
    });
}

import fs from 'fs';
/**
 * テキストを読み込み、テキストを入力エリアに設定する
 */
function readFile(path) {
  const footerArea = document.querySelector('footer');
  const editor = document.querySelector('#editor');
  // currentPath = path;
  fs.readFile(path, function (error, text) {
    if (error != null) {
      alert('error : ' + error);
      return;
    }
    // フッター部分に読み込み先のパスを設定する
    footerArea.innerHTML = path;
    // テキスト入力エリアに設定する
    // editor.setValue(text.toString(), -1);
    editor.textContent = text.toString();
  });
}
