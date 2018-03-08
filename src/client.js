// import { exec } from 'child_process';
// import { readFileSync } from 'fs';
import { remote } from 'electron';
// import { fromYAMLFilePaths, getRuleFilePath } from 'prh';
import prhCliImitate from './prh-cli-imitate';

const { BrowserWindow, dialog } = remote;

function openLoadFile() {
  // exec('./resources/app/node_modules/prh/bin/prh --rules C:\\Users\\kebina1\\workspace\\prh-app\\src\\prh.yml --diff C:\\Users\\kebina1\\workspace\\prh-app\\src\\test.adoc', (err, stdout, stderr) => {
  //   if (err) { console.log(err); }
  //   console.log(stdout);
  // });

  // const engine = fromYAMLFilePaths(getRuleFilePath('C:\\Users\\kebina1\\workspace\\prh-app\\src'))
  // const changeSet = engine.makeChangeSet('C:\\Users\\kebina1\\workspace\\prh-app\\src\\test.adoc');
  // const content = readFileSync('C:\\Users\\kebina1\\workspace\\prh-app\\src\\test.adoc', { encoding: 'utf8' });
  // const result = changeSet.applyChangeSets(content);
  // console.log(result);

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

      const options = {
        verbose: false,
        stdout: false,
        diff: false,
        replace: false,
        verify: false,
        rules: [],
      };
      const { result, invalidFiles } = prhCliImitate(filePaths, options);

      result.forEach(({filePath, changeSet}) => {
        console.log(filePath);
        changeSet.forEach(console.log);
      });

      console.log(invalidFiles);

      // filePaths.forEach(path => {
      //   console.log(path);
      // });
    }
  );
}
