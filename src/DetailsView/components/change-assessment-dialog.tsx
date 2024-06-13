// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DialogFooter, DialogType, TooltipHost } from '@fluentui/react';
import { Button } from '@fluentui/react-components';
import { css } from '@fluentui/utilities';
import * as Markup from 'assessments/markup';
import { BlockingDialog } from 'common/components/blocking-dialog';
import { NewTabLink } from 'common/components/new-tab-link';
import { NamedFC } from 'common/react/named-fc';
import { Tab } from 'common/types/store-data/itab';
import styles from 'DetailsView/components/change-assessment-dialog.scss';
import commonDialogStyles from 'DetailsView/components/common-dialog-styles.scss';
import * as React from 'react';
export interface ChangeAssessmentDialogProps {
    prevTab: Tab;
    dialogContentTitle: string;
    subtitleAriaId: string;
    divId: string;
    leftButtonText: string;
    leftButtonOnClick: (event: React.MouseEvent<any>) => void;
    rightButtonText: string;
    rightButtonOnClick: (event: React.MouseEvent<any>) => void;
    dialogFirstText: JSX.Element;
    dialogNoteText: string;
    dialogWarningText: string;
    isOpen: boolean;
    rightButtonStyle: string;
    rightButtonDataAutomationId: string;
}

export const ChangeAssessmentDialog = NamedFC<ChangeAssessmentDialogProps>(
    'ChangeAssessmentDialog',
    props => {
        const { isOpen } = props;
        if (!isOpen) {
            return null;
        }

        return (
            <BlockingDialog
                hidden={false}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: props.dialogContentTitle,
                }}
                modalProps={{
                    className: styles.changeAssessmentDialogModal,
                    containerClassName: css(
                        commonDialogStyles.insightsDialogMainOverride,
                        styles.changeAssessmentDialog,
                    ),
                    subtitleAriaId: props.subtitleAriaId,
                }}
            >
                <div id={props.divId}>
                    <div>
                        There is already an assessment running on&nbsp;
                        {renderPreviousTabLink(props.prevTab)}.&nbsp;
                        {props.dialogFirstText}
                    </div>
                    <p>
                        <Markup.Term>Note</Markup.Term>: {props.dialogNoteText}
                    </p>
                    <p>{props.dialogWarningText}</p>
                </div>

                <DialogFooter>
                    <div className={styles.changeAssessmentDialogButtonContainer}>
                        <div className={css(styles.actionCancelButtonCol, styles.continueButton)}>
                            <Button autoFocus={true} onClick={props.leftButtonOnClick}>
                                {props.leftButtonText}
                            </Button>
                        </div>
                        <div className={css(styles.actionCancelButtonCol, props.rightButtonStyle)}>
                            <Button
                                onClick={props.rightButtonOnClick}
                                data-automation-id={props.rightButtonDataAutomationId}
                            >
                                {props.rightButtonText}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </BlockingDialog>
        );

        function renderPreviousTabLink(tab: Tab): JSX.Element {
            return (
                <TooltipHost
                    content={tab.url}
                    id={'previous-target-page-link'}
                    calloutProps={{ gapSpace: 0 }}
                >
                    <NewTabLink role="link" href={tab.url}>
                        {tab.title}
                    </NewTabLink>
                </TooltipHost>
            );
        }
    },
);
