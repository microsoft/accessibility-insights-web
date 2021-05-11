// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Tab } from 'common/itab';
import { NamedFC } from 'common/react/named-fc';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { UrlParser } from 'common/url-parser';
import {
    ChangeAssessmentDialog,
    ChangeAssessmentDialogProps,
} from 'DetailsView/components/change-assessment-dialog';
import * as styles from 'DetailsView/components/load-assessment-dialog.scss';
import * as React from 'react';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';

export type LoadAssessmentDialogDeps = {
    urlParser: UrlParser;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
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
            props.deps.detailsViewActionMessageCreator.loadAssessment(
                props.loadedAssessmentData,
                props.tabId,
            );
            props.onClose();
        };

        const continuePreviousAssessment = (event: React.MouseEvent<any, MouseEvent>) => {
            props.deps.detailsViewActionMessageCreator.continuePreviousAssessment(event);
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
