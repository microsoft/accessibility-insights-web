<!--
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the MIT License.
-->

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

Before you start, make sure you have read the [Git branch setup instructions](./docs/git-branch-setup.md).

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

## Code of Conduct

Please read through our [Code of Conduct](./CODE_OF_CONDUCT.md) to this project.

## Pull Requests

Pull Requests should have a title that starts with a tag indicating the type of change. This helps us in maintaining a good commit history as well as better documentation when creating Release notes.

The convention that we follow is inspired from [SemVer](https://semver.org/) convention:

| Tag      | What it conveys                                                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| feat     | a commit of the type feat introduces a new feature in main or means completion of task towards a feature                                  |
| fix      | a commit of the type fix patches a bug or fixes a small known problem                                                                       |
| chore    | a commit of the type chore updates something in codebase without impacting any production code. eg: updating a grunt task etc.              |
| refactor | a commit of type refactor specifies a code change that neither fixes a bug nor adds a feature but just refactors a portion of existing code |

Some examples of good PR titles are:

-   `refactor: rename FooWidget to BarWidget`
-   `feat(android-settings): add High Contrast toggle to unified settings panel`

## Further Guidance

-   [Git branch setup](./docs/git-branch-setup.md)
-   [Building Accessibility Insights for Web](./docs/building-web.md)
-   [Building Accessibility Insights for Android (Unified)](./docs/building-unified.md)
