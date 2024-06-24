// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@fluentui/react';
import { Button, ButtonProps } from '@fluentui/react-components';
import { Icons } from 'common/icons/fluentui-v9-icons';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import styles from './insights-command-button.scss';

React.useEffect;
export type InsightsCommandButtonProps = ButtonProps & {
    iconName?: any;
    componentRef?: any;
    text?: any;
    menuIconProps?: any;
};

// See https://www.figma.com/file/Wj4Ggf6GGQBQkiDIaHfXRX2B/Accessibility-Insights%3A-Styles?node-id=1%3A27

export const InsightsCommandButton = NamedFC<InsightsCommandButtonProps>(
    'InsightsCommandButton',
    props => {
        const iconComponent = props.iconName;
        const menuIconComponent = props.menuIconProps ? props.menuIconProps.iconName : null;

        return (
            <>
                <h3>InsightsCommandButton</h3>
                <Button
                    appearance="transparent"
                    {...props}
                    icon={Icons[iconComponent]}
                    className={css(styles.insightsCommandButton, props.className)}
                    ref={props.componentRef}
                >
                    {props.text}
                    {menuIconComponent !== null && Icons[menuIconComponent]}
                </Button>
            </>
        );
    },
);
