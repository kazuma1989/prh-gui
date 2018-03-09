import fs from 'fs';
import path from 'path';
import { fromYAMLFilePaths, getRuleFilePath } from 'prh';

export default function prhCliImitate(filePaths, { replace, rules }) {
  return filePaths.map(filePath => {
    const content = fs.readFileSync(filePath, { encoding: "utf8" });
    const engine = getEngineByTargetDir(path.dirname(filePath));
    const changeSet = engine.makeChangeSet(filePath);

    if (replace) {
      const result = changeSet.applyChangeSets(content);
      if (content !== result) {
        fs.writeFileSync(filePath, result);
      }
    }

    const diffList = changeSet.diffs.map(diff => {
      const before = changeSet.content.substr(diff.index, diff.tailIndex - diff.index);
      const after = diff.newText;
      if (after == null) {
        return;
      }
      const { line, column } = indexToLineColumn(diff.index, changeSet.content);

      return {
        line,
        column,
        before,
        after
      };
    });

    return {
      filePath,
      diffList
    };
  });

  function getEngineByTargetDir(targetDir) {
    let rulePaths;
    if (rules && rules[0]) {
      rulePaths = [...opts.rules];
    } else {
      const foundPath = getRuleFilePath(targetDir);
      if (!foundPath) {
        throw new Error(`can't find rule file from ${targetDir}`);
      }

      rulePaths = [foundPath];
    }

    return fromYAMLFilePaths(...rulePaths);
  }
}

function indexToLineColumn(index, content) {
  if (index < 0 || content[index] == null) {
    throw new Error(`unbound index value: ${index}`);
  }
  let line = 0;
  let prevLfIndex = 0;
  while (true) {
    const lfIndex = content.indexOf("\n", prevLfIndex + 1);
    if (lfIndex === -1 || index <= lfIndex) {
      return {
        line,
        column: index - (prevLfIndex === 0 ? 0 : prevLfIndex + 1),
      };
    }
    line++;
    prevLfIndex = lfIndex;
  }
}
