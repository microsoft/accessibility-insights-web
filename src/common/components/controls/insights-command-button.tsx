// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { ActionButton, css, IButtonProps } from '@fluentui/react';
import * as React from 'react';
import * as styles from './insights-command-button.scss';

export type InsightsCommandButtonProps = IButtonProps;

// See https://www.figma.com/file/Wj4Ggf6GGQBQkiDIaHfXRX2B/Accessibility-Insights%3A-Styles?node-id=1%3A27
export const InsightsCommandButton = NamedFC<InsightsCommandButtonProps>(
    'InsightsCommandButton',
    props => {
        return (
            <ActionButton
                {...props}
                className={css(styles.insightsCommandButton, props.className)}
                iconProps={{
                    ...props.iconProps,
                    className: css(styles.commandBarButtonIcon, props.iconProps?.className),
                }}
            />
        );
    },
);
