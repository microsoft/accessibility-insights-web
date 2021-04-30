// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import * as Markup from 'assessments/markup';
import { BlockingDialog } from 'common/components/blocking-dialog';
import { NewTabLink } from 'common/components/new-tab-link';
import { Tab } from 'common/itab';
import { NamedFC } from 'common/react/named-fc';
import { PersistedTabInfo } from 'common/types/store-data/assessment-result-data';
import * as commonDialogStyles from 'DetailsView/components/common-dialog-styles.scss';
import * as styles from 'DetailsView/components/target-change-dialog.scss';
import { DefaultButton, DialogFooter, DialogType, TooltipHost } from 'office-ui-fabric-react';
import * as React from 'react';
export interface ChangeAssessmentDialogProps {
    prevTab: PersistedTabInfo;
    newTab: Tab;
    dialogContentTitle: string;
    subtitleAriaId: string;
    divId: string;
    leftButtonText: string;
    leftButtonOnClick;
    rightButtonText: string;
    rightButtonOnClick;
    dialogFirstText: JSX.Element;
    dialogNoteText: string;
    dialogWarningText: string;
    show: boolean;
}

export const ChangeAssessmentDialog = NamedFC<ChangeAssessmentDialogProps>(
    'ChangeAssessmentDialog',
    props => {
        const { show } = props;
        if (!show) {
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
                    className: styles.targetChangeDialogModal,
                    containerClassName: css(
                        commonDialogStyles.insightsDialogMainOverride,
                        styles.targetChangeDialog,
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
                    <div className={styles.targetChangeDialogButtonContainer}>
                        <div className={css(styles.actionCancelButtonCol, styles.continueButton)}>
                            <DefaultButton
                                autoFocus={true}
                                text={props.leftButtonText}
                                onClick={props.leftButtonOnClick}
                            />
                        </div>
                        <div className={css(styles.actionCancelButtonCol, styles.restartButton)}>
                            <DefaultButton
                                text={props.rightButtonText}
                                onClick={props.rightButtonOnClick}
                            />
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
