// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IPanelProps, Panel } from '@fluentui/react';
import { css } from '@fluentui/utilities';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import styles from './generic-panel.scss';

export type GenericPanelProps = IPanelProps & {
    innerPanelAutomationId?: string;
};

export const GenericPanel = NamedFC<GenericPanelProps>('GenericPanel', props => (
    <Panel
        {...props}
        data-automation-id={props.innerPanelAutomationId}
        className={css(styles.genericPanel, props.className)}
        isLightDismiss={true}
        headerClassName={styles.headerText}
    >
        {props.children}
    </Panel>
));
