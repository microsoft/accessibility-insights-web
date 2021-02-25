// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionActions } from 'background/actions/card-selection-actions';
import { InjectedDialogActions } from 'background/actions/injected-dialog-actions';
import { InjectionActions } from 'background/actions/injection-actions';
import { SidePanelActions } from 'background/actions/side-panel-actions';
import { TabActions } from '../actions/tab-actions';
import { VisualizationActions } from '../actions/visualization-actions';
import { VisualizationScanResultActions } from '../actions/visualization-scan-result-actions';
import { AssessmentActions } from './assessment-actions';
import { ContentActions } from './content-actions';
import { DetailsViewActions } from './details-view-actions';
import { DevToolActions } from './dev-tools-actions';
import { InspectActions } from './inspect-actions';
import { PathSnippetActions } from './path-snippet-actions';
import { PreviewFeaturesActions } from './preview-features-actions';
import { ScopingActions } from './scoping-actions';
import { UnifiedScanResultActions } from './unified-scan-result-actions';

export class ActionHub {
    public visualizationActions: VisualizationActions;
    public visualizationScanResultActions: VisualizationScanResultActions;
    public tabActions: TabActions;
    public devToolActions: DevToolActions;
    public previewFeaturesActions: PreviewFeaturesActions;
    public assessmentActions: AssessmentActions;
    public scopingActions: ScopingActions;
    public inspectActions: InspectActions;
    public contentActions: ContentActions;
    public detailsViewActions: DetailsViewActions;
    public pathSnippetActions: PathSnippetActions;
    public scanResultActions: UnifiedScanResultActions;
    public cardSelectionActions: CardSelectionActions;
    public injectionActions: InjectionActions;
    public sidePanelActions: SidePanelActions;
    public injectedDialogActions: InjectedDialogActions;

    constructor() {
        this.visualizationActions = new VisualizationActions();
        this.visualizationScanResultActions = new VisualizationScanResultActions();
        this.tabActions = new TabActions();
        this.devToolActions = new DevToolActions();
        this.previewFeaturesActions = new PreviewFeaturesActions();
        this.assessmentActions = new AssessmentActions();
        this.scopingActions = new ScopingActions();
        this.inspectActions = new InspectActions();
        this.contentActions = new ContentActions();
        this.detailsViewActions = new DetailsViewActions();
        this.pathSnippetActions = new PathSnippetActions();
        this.scanResultActions = new UnifiedScanResultActions();
        this.cardSelectionActions = new CardSelectionActions();
        this.injectionActions = new InjectionActions();
        this.sidePanelActions = new SidePanelActions();
        this.injectedDialogActions = new InjectedDialogActions();
    }
}
