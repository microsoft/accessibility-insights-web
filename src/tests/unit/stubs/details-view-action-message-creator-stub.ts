// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryDataFactory } from '../../../common/telemetry-data-factory';
import { VisualizationType } from '../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../../DetailsView/actions/details-view-action-message-creator';

export class DetailsViewActionMessageCreatorStub extends DetailsViewActionMessageCreator {
    public updateIssuesSelectedTargets(selectedTargets: string[]): void {
        throw new Error('Method not implemented.');
    }
    public updateFocusedInstanceTarget(instanceTarget: string[]): void {
        throw new Error('Method not implemented.');
    }
    public selectDetailsView(event: React.MouseEvent<HTMLElement>, type: VisualizationType): void {
        throw new Error('Method not implemented.');
    }
    public sendPivotItemClicked(pivotItem: any, ev?: React.MouseEvent<HTMLElement>): void {
        throw new Error('Method not implemented.');
    }
    public switchToTargetTab(event: React.MouseEvent<HTMLElement>): void {
        throw new Error('Method not implemented.');
    }
    public saveServerBaseUrl(url: string, ev: React.MouseEvent<any>): void {
        throw new Error('Method not implemented.');
    }
    public forgetServerSettings(ev: React.MouseEvent<any>): void {
        throw new Error('Method not implemented.');
    }
    protected telemetryFactory: TelemetryDataFactory;
    public setDevToolStatus(status: boolean): void {
        throw new Error('Method not implemented.');
    }
    public setInspectElement(event: React.SyntheticEvent<MouseEvent>, target: string[]): void {
        throw new Error('Method not implemented.');
    }
    public setInspectFrameUrl(frameUrl: string): void {
        throw new Error('Method not implemented.');
    }
    protected _tabId: number;
    protected dispatchMessage(message: Message): void {
        throw new Error('Method not implemented.');
    }
    protected dispatchType(type: string): void {
        throw new Error('Method not implemented.');
    }
}
