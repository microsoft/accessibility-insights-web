Scripts to help migrate [accessibility-insights-web](https://github.com/microsoft/accessibility-insights-web) to use strict null checks.

Based closely on the VS Code team's [vscode-strict-null-check-migration-tools](https://github.com/mjbvz/vscode-strict-null-check-migration-tools). See their excellent [migration write-up](https://code.visualstudio.com/blogs/2019/05/23/strict-null)!

## Usage

```bash
$ npm install
```

**index.js**

The main script prints of list of files that are eligible for strict null checks. This includes all files that only import files thare are already strict null checked. 

```bash
$ node index.js /path/to/accessibility-insights-web
```

**autoAdd.js**

Very simple script that tries to auto add any eligible file to the `tsconfig.strictNullChecks.json`. This iteratively compiles the `tsconfig` project with just that file added. If there are no errors, it is added to the `tsconfig`

```bash
$ node autoAdd.js /path/to/accessibility-insights-web
```
