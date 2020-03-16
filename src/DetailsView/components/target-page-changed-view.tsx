// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as commonStaticStyles from 'DetailsView/components/static-content-common.scss';
import * as styles from 'DetailsView/components/target-page-changed-view.scss';
import * as React from 'react';

import { DisplayableVisualizationTypeData } from '../../common/configs/visualization-configuration-factory';
import { NamedFC } from '../../common/react/named-fc';
import { VisualizationType } from '../../common/types/visualization-type';

export interface TargetPageChangedViewProps {
    visualizationType: VisualizationType;
    displayableData: DisplayableVisualizationTypeData;
    toggleClickHandler: (event) => void;
}

export const TargetPageChangedView = NamedFC<TargetPageChangedViewProps>(
    'TargetPageChangedView',
    props => {
        const { title = '', subtitle } = props.displayableData;

        const startOverText =
            'The target page has changed. Use the start over button to scan the new target page.';

        return (
            <div className={commonStaticStyles.staticContentInDetailsView}>
                <h1>{title}</h1>
                <div className={styles.targetPageChangedSubtitle}>{subtitle}</div>
                <p>{startOverText}</p>
            </div>
        );
    },
);
