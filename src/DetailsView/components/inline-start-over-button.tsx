// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ArrowClockwiseRegular } from '@fluentui/react-icons';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { NamedFC } from 'common/react/named-fc';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import * as React from 'react';
import styles from './inline-start-over-button.scss';
import { FluentUIV9Icon } from 'common/icons/fluentui-v9-icons';

export const inlineStartOverButtonDataAutomationId = 'inline-start-over-button';

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
                insightsCommandButtonIconProps={{ icon: <FluentUIV9Icon iconName='ArrowClockwiseRegular' /> }}
                className={styles.inlineStartOverButton}
                data-automation-id={inlineStartOverButtonDataAutomationId}
            >
                Start over
            </InsightsCommandButton>
        );
    },
);
