import { remote } from 'electron';
import { observable } from 'knockout';
import prhCliImitate from './prh-cli-imitate';

const { BrowserWindow, dialog } = remote;

export default class App {

  constructor() {
    this.resultList = observable([]);
    this.replace = observable(false);
  }

  openFiles() {
    const modalTarget = BrowserWindow.getFocusedWindow();

    dialog.showOpenDialog(
      modalTarget,
      {
        properties: ['openFile', 'multiSelections'],
        filters: [
          {
            name: 'Documents',
            extensions: ['txt', 'md', 'html', 'css', 'js', 'adoc', 'json', 'yaml', 'yml', 'csv', 'tsv']
          }
        ]
      },
      filePaths => {
        if (!filePaths) {
          return;
        }

        const replace = this.replace();
        const resultList = prhCliImitate(filePaths, { replace });

        this.resultList(resultList.map(({ filePath, diffList }) => {
          return {
            filePath,
            diffList: diffList.map(({ line, column, before, after }) => `${line + 1},${column + 1}: ${before} → ${after}`)
          };
        }));
      }
    );
  }

}
