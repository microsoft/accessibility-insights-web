// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { InlineStartOverButton } from 'DetailsView/components/inline-start-over-button';
import * as commonStaticStyles from 'DetailsView/components/static-content-common.scss';
import * as styles from 'DetailsView/components/target-page-changed-view.scss';
import * as React from 'react';

import { NamedFC } from '../../common/react/named-fc';
import { DisplayableVisualizationTypeData } from '../../common/types/displayable-visualization-type-data';
import { VisualizationType } from '../../common/types/visualization-type';

export interface TargetPageChangedViewProps {
    visualizationType: VisualizationType;
    displayableData: DisplayableVisualizationTypeData;
    toggleClickHandler: (event) => void;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
}

export const TargetPageChangedView = NamedFC<TargetPageChangedViewProps>(
    'TargetPageChangedView',
    props => {
        const { title = '', subtitle } = props.displayableData;

        const startOverButton = (
            <InlineStartOverButton
                selectedTest={props.visualizationType}
                detailsViewActionMessageCreator={props.detailsViewActionMessageCreator}
            />
        );
        const startOverText = (
            <>
                The target page has changed. Use the {startOverButton} button to scan the new target
                page.
            </>
        );

        return (
            <div className={commonStaticStyles.staticContentInDetailsView}>
                <h1>{title}</h1>
                <div className={styles.targetPageChangedSubtitle}>{subtitle}</div>
                <p>{startOverText}</p>
            </div>
        );
    },
);
