// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import classNames from 'classnames';
import { IColumn } from 'office-ui-fabric-react';

import { AssessmentNavState } from '../../common/types/store-data/assessment-result-data';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';

export class MasterCheckBoxConfigProvider {
    private static MASTER_CHECKBOX_ICON_NAME_ENABLED: string = 'view';
    private static MASTER_CHECKBOX_ICON_NAME_DISABLED: string = 'checkbox';
    private detailsViewActionMessageCreator: DetailsViewActionMessageCreator;

    constructor(detailsViewActionMessageCreator: DetailsViewActionMessageCreator) {
        this.detailsViewActionMessageCreator = detailsViewActionMessageCreator;
    }

    public getMasterCheckBoxProperty(
        assessmentNavState: AssessmentNavState,
        allEnabled: boolean,
    ): Partial<IColumn> {
        const iconName = allEnabled
            ? MasterCheckBoxConfigProvider.MASTER_CHECKBOX_ICON_NAME_ENABLED
            : MasterCheckBoxConfigProvider.MASTER_CHECKBOX_ICON_NAME_DISABLED;
        const iconClassName = classNames({
            'master-visualization-column-header-selected': iconName === 'view',
        });
        const name = 'Visualization toggle';
        const label = `${allEnabled ? 'Hide' : 'Show'} all visualizations`;
        const onColumnClick = this.getMasterCheckBoxClickHandler(assessmentNavState, allEnabled);

        return {
            iconName: iconName,
            iconClassName: iconClassName,
            name: name,
            ariaLabel: label,
            onColumnClick: onColumnClick,
        };
    }

    private getMasterCheckBoxClickHandler = (
        assessmentNavState: AssessmentNavState,
        allEnabled: boolean,
    ): ((ev: React.MouseEvent<HTMLElement>, column: IColumn) => void) => {
        return (ev: React.MouseEvent<HTMLElement>, column: IColumn) => {
            this.detailsViewActionMessageCreator.changeAssessmentVisualizationStateForAll(
                !allEnabled,
                assessmentNavState.selectedTestType,
                assessmentNavState.selectedTestSubview,
            );
        };
    };
}
