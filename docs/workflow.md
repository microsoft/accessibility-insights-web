<!--
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the MIT License.
-->

# Developer Workflow

## Automatically Build (`yarn watch`)

You can initiate a process to automatically build the extension on any source code changes and be able to see the changes in the browser. To start this run

```sh
yarn watch
```

Any time a non-test source file is changed, the build will automatically run.

## Working with the Electron app

To test the (currently experimental) Electron app form of the extension:

```sh
yarn build:unified
yarn start:unified:dev
```

To debug the built app in vscode, you can run the `Debug electron main process with --remote-debugging-port=9222` configuration. Once this is running, you can debug the renderer process via the `Attach debugger to electron renderer process` configuration.

Most of the functionality of the Electron app relies on connecting to a running [Axe for Android](https://www.deque.com/axe/axe-for-android/) service.

To simulate Axe for Android (running on port 9051) for local testing of the app, use:

```sh
yarn with:mock-axe-android start:unified:dev
```

## Pull Request title tagging convention (Labelling commit messages)

For every Pull Request, we prefer to add a tag in the PR title. This helps us in maintaining a good commit history as well as better documentation
when creating Release notes.
The convention that we follow is inspired from [SemVer](https://semver.org/) convention and is following:

| Tag      | What it conveys                                                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| feat     | a commit of the type feat introduces a new feature in master or means completion of task towards a feature                                  |
| fix      | a commit of the type fix patches a bug or fixes a small known problem                                                                       |
| chore    | a commit of the type chore updates something in codebase without impacting any production code. eg: updating a grunt task etc.              |
| refactor | a commit of type refactor specifies a code change that neither fixes a bug nor adds a feature but just refactors a portion of existing code |
