// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PermissionsStateActions } from 'background/actions/permissions-state-actions';
import { FeatureFlagActions } from '../actions/feature-flag-actions';
import { LaunchPanelStateActions } from '../actions/launch-panel-state-action';
import { AssessmentActions } from './assessment-actions';
import { CommandActions } from './command-actions';
import { ScopingActions } from './scoping-actions';
import { UserConfigurationActions } from './user-configuration-actions';

export class GlobalActionHub {
    public commandActions: CommandActions;
    public featureFlagActions: FeatureFlagActions;
    public launchPanelStateActions: LaunchPanelStateActions;
    public scopingActions: ScopingActions;
    public assessmentActions: AssessmentActions;
    public quickAssessActions: AssessmentActions;
    public userConfigurationActions: UserConfigurationActions;
    public permissionsStateActions: PermissionsStateActions;

    constructor() {
        this.commandActions = new CommandActions();
        this.featureFlagActions = new FeatureFlagActions();
        this.launchPanelStateActions = new LaunchPanelStateActions();
        this.scopingActions = new ScopingActions();
        this.assessmentActions = new AssessmentActions();
        this.quickAssessActions = new AssessmentActions();
        this.userConfigurationActions = new UserConfigurationActions();
        this.permissionsStateActions = new PermissionsStateActions();
    }
}
