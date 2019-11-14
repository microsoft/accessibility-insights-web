// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TargetPageStoreData } from './client-store-listener';
import {
    ScrollingController,
    ScrollingWindowMessage,
} from './frameCommunicators/scrolling-controller';
import { TargetPageActionMessageCreator } from './target-page-action-message-creator';

export class FocusChangeHandler {
    private previousFocusedTarget: string[];
    constructor(
        private targetPageActionMessageCreator: TargetPageActionMessageCreator,
        private scrollingController: ScrollingController,
    ) {}

    public handleFocusChangeWithStoreData = (
        storeData: TargetPageStoreData,
    ) => {
        this.handleFocusChange(storeData);
        this.previousFocusedTarget =
            storeData.visualizationStoreData.focusedTarget;
    };

    private handleFocusChange = (storeData: TargetPageStoreData) => {
        const newTarget = storeData.visualizationStoreData.focusedTarget;
        if (
            newTarget == null ||
            (this.previousFocusedTarget != null &&
                newTarget === this.previousFocusedTarget)
        ) {
            return;
        }

        const scrollingMessage: ScrollingWindowMessage = {
            focusedTarget: newTarget,
        };
        this.scrollingController.processRequest(scrollingMessage);
        this.targetPageActionMessageCreator.scrollRequested();
    };
}
