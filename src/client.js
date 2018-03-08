import { remote } from 'electron';
import { applyBindings } from 'knockout';
import prhCliImitate from './prh-cli-imitate';

applyBindings({
  openFiles
});

const { BrowserWindow, dialog } = remote;

function openFiles() {

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

      result.forEach(({ filePath, changeSet }) => {
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
