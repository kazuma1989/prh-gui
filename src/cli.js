import fs from 'fs';
import path from 'path';
// import diff from 'diff';
import { fromYAMLFilePaths, getRuleFilePath } from 'prh';

const args = {
  files: []
}
const opts = {
  verbose: false,
  stdout: false,
  diff: false,
  replace: false,
  verify: false,
  rules: [],
}

const invalidFiles = [];
args.files.forEach(filePath => {
  if (opts.verbose) {
    console.warn(`processing ${filePath}...`);
  }
  const content = fs.readFileSync(filePath, { encoding: "utf8" });
  const engine = getEngineByTargetDir(path.dirname(filePath));
  const changeSet = engine.makeChangeSet(filePath);
  if (changeSet.diffs.length !== 0) {
    invalidFiles.push(filePath);
  }

  if (opts.stdout) {
    const result = changeSet.applyChangeSets(content);
    process.stdout.write(result);

    // } else if (opts.diff) {
    //     const result = changeSet.applyChangeSets(content);
    //     const patch = diff.createPatch(filePath, content, result, "before", "replaced");
    //     console.log(patch);

  } else if (opts.replace) {
    const result = changeSet.applyChangeSets(content);
    if (content !== result) {
      fs.writeFileSync(filePath, result);
      console.warn(`replaced ${filePath}`);
    }

  } else {
    changeSet.diffs.forEach(diff => {
      const before = changeSet.content.substr(diff.index, diff.tailIndex - diff.index);
      const after = diff.newText;
      if (after == null) {
        return;
      }
      const lineColumn = indexToLineColumn(diff.index, changeSet.content);
      console.log(`${changeSet.filePath}(${lineColumn.line + 1},${lineColumn.column + 1}): ${before} → ${after}`);
    });
  }

})

if (opts.verify && invalidFiles.length !== 0) {
  throw new Error(`${invalidFiles.join(" ,")} failed proofreading`);
}

function getEngineByTargetDir(targetDir) {
  let rulePaths;
  if (opts.rules && opts.rules[0]) {
    rulePaths = [...opts.rules];
  } else {
    const foundPath = getRuleFilePath(targetDir);
    if (!foundPath) {
      throw new Error(`can't find rule file from ${targetDir}`);
    }

    rulePaths = [foundPath];
  }

  if (opts.verbose) {
    rulePaths.forEach((path, i) => {
      console.warn(`  apply ${i + 1}: ${path}`);
    });
  }

  return fromYAMLFilePaths(...rulePaths);
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
