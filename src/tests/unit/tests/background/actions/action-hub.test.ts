// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionHub } from 'background/actions/action-hub';
import { AssessmentActions } from 'background/actions/assessment-actions';
import { ContentActions } from 'background/actions/content-actions';
import { DevToolActions } from 'background/actions/dev-tools-actions';
import { InjectionActions } from 'background/actions/injection-actions';
import { InspectActions } from 'background/actions/inspect-actions';
import { ScopingActions } from 'background/actions/scoping-actions';
import { SidePanelActions } from 'background/actions/side-panel-actions';
import { TabActions } from 'background/actions/tab-actions';
import { VisualizationActions } from 'background/actions/visualization-actions';
import { VisualizationScanResultActions } from 'background/actions/visualization-scan-result-actions';

describe('ActionHubTest', () => {
    it('tests constructor', () => {
        const actionHub = new ActionHub();
        runNullAserts(actionHub);
        runTypeAsserts(actionHub);
    });
});

function runNullAserts(hub: ActionHub): void {
    Object.keys(hub).forEach(key => {
        expect(key).toBeDefined();
    });
}

function runTypeAsserts(hub: ActionHub): void {
    expect(hub.assessmentActions).toBeInstanceOf(AssessmentActions);
    expect(hub.devToolActions).toBeInstanceOf(DevToolActions);
    expect(hub.scopingActions).toBeInstanceOf(ScopingActions);
    expect(hub.tabActions).toBeInstanceOf(TabActions);
    expect(hub.visualizationActions).toBeInstanceOf(VisualizationActions);
    expect(hub.visualizationScanResultActions).toBeInstanceOf(VisualizationScanResultActions);
    expect(hub.inspectActions).toBeInstanceOf(InspectActions);
    expect(hub.contentActions).toBeInstanceOf(ContentActions);
    expect(hub.injectionActions).toBeInstanceOf(InjectionActions);
    expect(hub.sidePanelActions).toBeInstanceOf(SidePanelActions);
}
