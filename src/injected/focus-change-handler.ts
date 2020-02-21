// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEmpty } from 'lodash';

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

    public handleFocusChangeWithStoreData = (storeData: TargetPageStoreData) => {
        const newTarget = this.getTarget(storeData);
        this.handleFocusChange(newTarget);
        this.previousFocusedTarget = newTarget;
    };

    private handleFocusChange = (newTarget: string[]) => {
        if (
            newTarget == null ||
            (this.previousFocusedTarget != null && newTarget === this.previousFocusedTarget)
        ) {
            return;
        }

        const scrollingMessage: ScrollingWindowMessage = {
            focusedTarget: newTarget,
        };
        this.scrollingController.processRequest(scrollingMessage);
        this.targetPageActionMessageCreator.scrollRequested();
    };

    private getTarget(storeData: TargetPageStoreData): string[] {
        return (
            storeData.visualizationStoreData.focusedTarget || this.getCardResultTarget(storeData)
        );
    }

    private getCardResultTarget(storeData: TargetPageStoreData): string[] {
        if (isEmpty(storeData.unifiedScanResultStoreData.results)) {
            return null;
        }

        const focusedResult = storeData.unifiedScanResultStoreData.results.find(
            result => result.uid === storeData.cardSelectionStoreData.focusedResultUid,
        );

        if (focusedResult == null) {
            throw 'focused result was not found';
        }

        return focusedResult.identifiers.identifier.split(';');
    }
}
