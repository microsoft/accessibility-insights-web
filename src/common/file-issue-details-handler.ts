// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { HTMLElementUtils } from './html-element-utils';

export class FileIssueDetailsHandler {

    constructor(private htmlElementUtils: HTMLElementUtils) { }

    public onLayoutDidMount() {
        const dialogContainer = this.htmlElementUtils.querySelector('.ms-file-issue-details-modal-override') as HTMLElement;
        if (dialogContainer == null) {
            return;
        }

        let parentLayer = dialogContainer;

        while (parentLayer != null) {
            if (parentLayer.classList.contains('ms-Layer--fixed')) {
                // office fabric uses z-index value as 10000 which is not configurable. So, we have to do this workaround
                parentLayer.style.zIndex = '2147483648';
            }
            parentLayer = parentLayer.parentElement;
        }
    }
}
