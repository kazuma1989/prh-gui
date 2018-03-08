export default function prhCliImitate(filePaths, options) {
  return {
    result: [
      {
        filePath: 'FILEPATH',
        changeSet: [
          {
            line: 0,
            column: 0,
            before: 'BEFORE',
            after: 'AFTER'
          }
        ]
      }
    ],
    invalidFiles: []
  };
}