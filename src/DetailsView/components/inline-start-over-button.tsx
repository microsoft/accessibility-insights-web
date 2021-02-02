// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { NamedFC } from 'common/react/named-fc';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import * as React from 'react';
import * as styles from './inline-start-over-button.scss';

export type InlineStartOverButtonProps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    selectedTest: VisualizationType;
};

export const InlineStartOverButton = NamedFC<InlineStartOverButtonProps>(
    'InlineStartOverButton',
    props => {
        const rescan = event =>
            props.detailsViewActionMessageCreator.rescanVisualization(props.selectedTest, event);
        return (
            <InsightsCommandButton
                onClick={rescan}
                text="Start over"
                iconProps={{ iconName: 'Refresh' }}
                className={styles.inlineStartOverButton}
            />
        );
    },
);
