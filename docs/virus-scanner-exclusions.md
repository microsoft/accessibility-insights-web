<!--
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the MIT License.
-->

## Virus scanner exclusions

When running locally, especially when running end-to-end (E2E) tests, virus scanners have been known to have a significant impact on execution time. In some extreme cases, E2E tests have been known to fail as a result of having virus scanners running against files that are built by the repo and used during the tests. To prevent this, you may wish to exclude the entire repo--or possibly just the `drop` folder--from virus scanning. The specifics of how to do this will vary between virus scanners, between operating systems, and possibly between different versions of the same virus scanner.

### Microsoft Defender (Windows only)
The following steps allow you to exclude a folder and all its descendants from Microsoft Defender. These instructions have been validated on both Windows 10 and Windows 11:
- From the start menu, run **Windows Security**
- Enter the **Virus & threat protection** tab
- Under **Virus & threat protection settings**, click **Manage settings**
- Under **Exclusions**, click **Add or remove exclusions**
- If prompted for permissions, grant permissions
- Click **Add an exclusion**
- Select **Folder** as the exclusion type
- Specify the folder to ignore--all descendants of this folder will be ignored. Note that the folder must exist when it is added as an exclusion. Take this into account if you choose to exclude just the `drop` folder
- Click **Select folder**

### Other antivirus products
Please consult your antivirus product's documentation.
