// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { Tab } from 'common/types/store-data/itab';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { UrlParser } from 'common/url-parser';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import {
    ChangeAssessmentDialog,
    ChangeAssessmentDialogProps,
} from 'DetailsView/components/change-assessment-dialog';
import styles from 'DetailsView/components/load-assessment-dialog.scss';
import * as React from 'react';

export type LoadAssessmentDialogDeps = {
    urlParser: UrlParser;
    assessmentActionMessageCreator: AssessmentActionMessageCreator;
    detailsViewId: string;
};

export const loadAssessmentDialogLoadButtonAutomationId = 'load-assessment-dialog-load-button';
export interface LoadAssessmentDialogProps {
    deps: LoadAssessmentDialogDeps;
    prevTab: Tab;
    isOpen: boolean;
    loadedAssessmentData: VersionedAssessmentData;
    tabId: number;
    onClose: () => void;
}

export const LoadAssessmentDialog = NamedFC<LoadAssessmentDialogProps>(
    'LoadAssessmentDialog',
    props => {
        const loadAssessment = () => {
            props.deps.assessmentActionMessageCreator.loadAssessment(
                props.loadedAssessmentData,
                props.tabId,
                props.deps.detailsViewId,
            );
            props.onClose();
        };

        const continuePreviousAssessment = (event: React.MouseEvent<any, MouseEvent>) => {
            props.deps.assessmentActionMessageCreator.continuePreviousAssessment(event);
            props.onClose();
        };

        const dialogProps: ChangeAssessmentDialogProps = {
            deps: props.deps,
            prevTab: props.prevTab,
            dialogContentTitle: 'Assessment in progress',
            subtitleAriaId: 'load-assessment-dialog-description',
            divId: 'load-assessment-dialog-description',
            leftButtonText: 'Continue previous',
            leftButtonOnClick: continuePreviousAssessment,
            rightButtonText: 'Load assessment',
            rightButtonOnClick: loadAssessment,
            dialogFirstText: (
                <>Would you like to continue your current assessment or load the new assessment?</>
            ),
            dialogNoteText:
                "If 'Continue previous' is selected, the assessment selected will not be loaded.",
            dialogWarningText:
                "If 'Load assessment’ is selected, all previous progress will be lost.",
            isOpen: props.isOpen,
            rightButtonStyle: styles.loadButton,
            rightButtonDataAutomationId: loadAssessmentDialogLoadButtonAutomationId,
        };

        return <ChangeAssessmentDialog {...dialogProps} />;
    },
);
