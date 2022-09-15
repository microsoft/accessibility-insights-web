// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopEvent } from 'common/types/store-data/tab-stop-event';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { isEqual } from 'lodash';

export class TabStopsDoneAnalyzingTracker {
    private firstSeenTabStopEvent: TabStopEvent | null = null;

    constructor(
        private readonly tabStopRequirementActionMessageCreator: TabStopRequirementActionMessageCreator,
    ) {}

    public reset() {
        this.firstSeenTabStopEvent = null;
    }

    public addTabStopEvents(events: TabStopEvent[]) {
        let startSearchingIndex = 0;

        if (this.firstSeenTabStopEvent === null) {
            this.firstSeenTabStopEvent = events[0];
            startSearchingIndex = 1;
        }

        const completedTabLoop = events.some((e, i) => {
            return (
                i >= startSearchingIndex && isEqual(e.target, this.firstSeenTabStopEvent!.target)
            );
        });

        if (completedTabLoop) {
            this.tabStopRequirementActionMessageCreator.updateTabbingCompleted(true);
        }
    }
}
