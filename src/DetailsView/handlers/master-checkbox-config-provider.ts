// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewActionMessageCreator } from './../actions/details-view-action-message-creator';
import { AssessmentTableColumnConfigHandler } from './../components/assessment-table-column-config-handler';
import { IAssessmentNavState } from '../../common/types/store-data/iassessment-result-data';
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { autobind } from '@uifabric/utilities';
import * as classNames from 'classnames';

export class MasterCheckBoxConfigProvider {
    private static MASTER_CHECKBOX_ICON_NAME_ENABLED: string = 'view';
    private static MASTER_CHECKBOX_ICON_NAME_DISABLED: string = 'checkbox';
    private actionMessageCreator: DetailsViewActionMessageCreator;

    constructor(actionMessageCreator: DetailsViewActionMessageCreator ) {
        this.actionMessageCreator = actionMessageCreator;
    }

    public getMasterCheckBoxProperty(assessmentNavState: IAssessmentNavState, allEnabled: boolean): Partial<IColumn> {
        const iconName = allEnabled ? MasterCheckBoxConfigProvider.MASTER_CHECKBOX_ICON_NAME_ENABLED : MasterCheckBoxConfigProvider.MASTER_CHECKBOX_ICON_NAME_DISABLED;
        const iconClassName = classNames({'master-visualization-column-header-selected': (iconName === 'view')});
        const name = 'toggle all visualization';
        const onColumnClick = this.getMasterCheckBoxClickHandler(assessmentNavState, allEnabled);

        return {
            iconName: iconName,
            iconClassName: iconClassName,
            name: name,
            ariaLabel: name,
            onColumnClick: onColumnClick,
        };
    }

    @autobind
    private getMasterCheckBoxClickHandler(assessmentNavState: IAssessmentNavState, allEnabled: boolean): (ev: React.MouseEvent<HTMLElement>, column: IColumn) => void {
        return (ev: React.MouseEvent<HTMLElement>, column: IColumn) => {
            this.actionMessageCreator.changeAssessmentVisualizationStateForAll(!allEnabled, assessmentNavState.selectedTestType, assessmentNavState.selectedTestStep);
        };
    }
}

