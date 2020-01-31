// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css, IRenderFunction } from '@uifabric/utilities';
import { NamedFC } from 'common/react/named-fc';
import { IPanelProps, Panel, PanelType } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './generic-panel.scss';

export interface GenericPanelProps {
    isOpen: boolean;
    onDismiss: () => void;
    headerText: string;
    className?: string;
    closeButtonAriaLabel: string;
    hasCloseButton: boolean;
    onRenderFooterContent?: IRenderFunction<IPanelProps>;
    innerPanelAutomationId?: string;
}

export const GenericPanel = NamedFC<GenericPanelProps>('GenericPanel', props => (
    <Panel
        data-automation-id={props.innerPanelAutomationId}
        isOpen={props.isOpen}
        type={PanelType.custom}
        customWidth="550px"
        className={css(styles.genericPanel, props.className)}
        isLightDismiss={true}
        onDismiss={props.onDismiss}
        closeButtonAriaLabel={props.closeButtonAriaLabel}
        hasCloseButton={props.hasCloseButton}
        headerText={props.headerText}
        headerClassName={styles.headerText}
        onRenderFooter={props.onRenderFooterContent}
    >
        {props.children}
    </Panel>
));
