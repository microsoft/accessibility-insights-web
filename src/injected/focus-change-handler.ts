// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { isEmpty } from 'lodash';

import { TargetPageStoreData } from './client-store-listener';
import {
    ScrollingController,
    ScrollingWindowMessage,
} from './frameCommunicators/scrolling-controller';
import { TargetPageActionMessageCreator } from './target-page-action-message-creator';

export class FocusChangeHandler {
    private previousFocusedTarget: string[] | null;
    constructor(
        private targetPageActionMessageCreator: TargetPageActionMessageCreator,
        private scrollingController: ScrollingController,
    ) {}

    public handleFocusChangeWithStoreData = async (storeData: TargetPageStoreData) => {
        const newTarget = this.getTarget(storeData);
        await this.handleFocusChange(newTarget);
        this.previousFocusedTarget = newTarget;
    };

    private handleFocusChange = async (newTarget: string[] | null) => {
        if (
            newTarget == null ||
            (this.previousFocusedTarget != null && newTarget === this.previousFocusedTarget)
        ) {
            return;
        }

        const scrollingMessage: ScrollingWindowMessage = {
            focusedTarget: newTarget,
        };
        await this.scrollingController.processRequest(scrollingMessage);
        this.targetPageActionMessageCreator.scrollRequested();
    };

    private getTarget(storeData: TargetPageStoreData): string[] | null {
        return (
            // We need to check the visualization store data since the assessment UX uses it.
            storeData.visualizationStoreData.focusedTarget || this.getCardResultTarget(storeData)
        );
    }

    private automatedChecksDataIsPopulated(storeData: TargetPageStoreData): boolean {
        return (
            storeData.cardSelectionStoreData !== null &&
            storeData.unifiedScanResultStoreData !== null &&
            storeData.cardSelectionStoreData.focusedResultUid !== null &&
            !isEmpty(storeData.unifiedScanResultStoreData.results)
        );
    }

    private needsReviewDataIsPopulated(storeData: TargetPageStoreData): boolean {
        return (
            storeData.needsReviewCardSelectionStoreData !== null &&
            storeData.needsReviewScanResultStoreData !== null &&
            storeData.needsReviewCardSelectionStoreData.focusedResultUid !== null &&
            !isEmpty(storeData.needsReviewScanResultStoreData.results)
        );
    }

    private findAutomatedChecksFocusedResult(storeData: TargetPageStoreData): UnifiedResult {
        const focusedResult = storeData.unifiedScanResultStoreData.results!.find(
            result => result.uid === storeData.cardSelectionStoreData.focusedResultUid,
        );

        if (focusedResult !== undefined) {
            return focusedResult;
        }

        throw new Error('focused result was not found');
    }

    private findNeedsReviewFocusedResult(storeData: TargetPageStoreData): UnifiedResult {
        const focusedResult = storeData.needsReviewScanResultStoreData.results!.find(
            result => result.uid === storeData.needsReviewCardSelectionStoreData.focusedResultUid,
        );

        if (focusedResult !== undefined) {
            return focusedResult;
        }

        throw new Error('focused result was not found');
    }

    private getTargetFromUnifiedResult(UnifiedResult: UnifiedResult): string[] {
        return UnifiedResult.identifiers.identifier.split(';');
    }

    private getCardResultTarget(storeData: TargetPageStoreData): string[] | null {
        if (this.automatedChecksDataIsPopulated(storeData)) {
            return this.getTargetFromUnifiedResult(
                this.findAutomatedChecksFocusedResult(storeData),
            );
        }
        if (this.needsReviewDataIsPopulated(storeData)) {
            return this.getTargetFromUnifiedResult(this.findNeedsReviewFocusedResult(storeData));
        }

        return null;
    }
}
