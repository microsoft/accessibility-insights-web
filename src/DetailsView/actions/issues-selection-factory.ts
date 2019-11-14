// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ISelection } from 'office-ui-fabric-react/lib/DetailsList';

import { DetailsRowData } from '../components/issues-table-handler';
import { DetailsViewActionMessageCreator } from './details-view-action-message-creator';
import { IssuesSelection } from './issues-selection';

export class IssuesSelectionFactory {
    public createSelection(
        messageCreator: DetailsViewActionMessageCreator,
    ): ISelection {
        const selection = new IssuesSelection({
            onSelectionChanged: () => {
                const items: DetailsRowData[] = selection.getSelection() as DetailsRowData[];
                const targets = items.map(item => '' + item.key);
                messageCreator.updateIssuesSelectedTargets(targets);
                const firstSelectedInstance = items[0];
                messageCreator.updateFocusedInstanceTarget(
                    firstSelectedInstance ? firstSelectedInstance.target : null,
                );
            },
        });
        return selection;
    }
}
