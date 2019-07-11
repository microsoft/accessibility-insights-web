// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { DetailsViewPivotType } from '../../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../actions/details-view-action-message-creator';
import { BaseLeftNavLink } from '../base-left-nav';

export class NavLinkHandler {
    constructor(private detailsViewActionMessageCreator: DetailsViewActionMessageCreator) {}

    public onOverviewClick = (): void => {
        this.detailsViewActionMessageCreator.changeRightContentPanel('Overview');
    };

    public onFastPassTestClick = (event: React.MouseEvent<HTMLElement>, item: BaseLeftNavLink) => {
        this.detailsViewActionMessageCreator.selectDetailsView(event, VisualizationType[item.key], DetailsViewPivotType.fastPass);
    };

    public onAssessmentTestClick = (event: React.MouseEvent<HTMLElement>, item: BaseLeftNavLink) => {
        this.detailsViewActionMessageCreator.selectDetailsView(event, VisualizationType[item.key], DetailsViewPivotType.assessment);
        this.detailsViewActionMessageCreator.changeRightContentPanel('TestView');
    };
}
