// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { DetailsViewPivotType } from '../../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../actions/details-view-action-message-creator';
import { NavLinkForLeftNav } from '../details-view-left-nav';


export class NavLinkHandler {
    constructor(
        private detailsViewActionMessageCreator: DetailsViewActionMessageCreator,
    ) {}

    @autobind
    public onTestClick(event: React.MouseEvent<HTMLElement>, item: NavLinkForLeftNav, selectedPivot: DetailsViewPivotType): void {
        this.detailsViewActionMessageCreator.selectDetailsView(event, VisualizationType[item.key], selectedPivot);
    }

    @autobind
    public onAssessmentTestClick(event: React.MouseEvent<HTMLElement>, item: NavLinkForLeftNav, selectedPivot: DetailsViewPivotType): void {
        this.detailsViewActionMessageCreator.selectDetailsView(event, VisualizationType[item.key], selectedPivot);
        this.detailsViewActionMessageCreator.changeRightContentPanel('TestView');
    }

    @autobind
    public onOverviewClick(): void {
        this.detailsViewActionMessageCreator.changeRightContentPanel('Overview');
    }

    public onFastPassTestClick = (event: React.MouseEvent<HTMLElement>, item: NavLinkForLeftNav) => {
        this.detailsViewActionMessageCreator.selectDetailsView(event, VisualizationType[item.key], DetailsViewPivotType.fastPass);
    }

    public onAllTestsTestClick = (event: React.MouseEvent<HTMLElement>, item: NavLinkForLeftNav) => {
        this.detailsViewActionMessageCreator.selectDetailsView(event, VisualizationType[item.key], DetailsViewPivotType.allTest);
    }

    public onAssessmentTestClickV2 = (event: React.MouseEvent<HTMLElement>, item: NavLinkForLeftNav) => {
        this.detailsViewActionMessageCreator.selectDetailsView(event, VisualizationType[item.key], DetailsViewPivotType.assessment);
        this.detailsViewActionMessageCreator.changeRightContentPanel('TestView');
    }
}
