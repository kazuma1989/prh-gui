import { remote } from 'electron';

const { BrowserWindow, dialog } = remote;

function openLoadFile() {
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
    filenames => {
      if (!filenames) {
        return;
      }

      filenames.forEach(filename => {
        console.log(filename);
      });
    }
  );
}
