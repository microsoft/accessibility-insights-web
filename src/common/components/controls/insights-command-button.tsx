// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionButton, css, IButtonProps } from '@fluentui/react';
import {
    Button,
    ButtonProps,
    mergeClasses,
    makeStyles,
    tokens,
    shorthands,
    MenuButtonProps,
    MenuItemProps,
    Menu,
    MenuTrigger,
    MenuButton,
    MenuPopover,
    MenuList,
    MenuItem,
} from '@fluentui/react-components';
import { FluentIcon } from '@fluentui/react-icons';
import { InsightsCommandButtonStyle } from 'common/components/controls/insights-command-button-style';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import styles from './insights-command-button.scss';

export type InsightsCommandButtonIconProps = {
    className?: string;
    icon?: JSX.Element;

};

export type InsightsCommandButtonProps = (ButtonProps | MenuButtonProps) & {
    insightsCommandButtonIconProps?: InsightsCommandButtonIconProps;
    ref?: any;
};

// See https://www.figma.com/file/Wj4Ggf6GGQBQkiDIaHfXRX2B/Accessibility-Insights%3A-Styles?node-id=1%3A27
export const InsightsCommandButton = NamedFC<InsightsCommandButtonProps>(
    'InsightsCommandButton',
    props => {
        const overrides = InsightsCommandButtonStyle();

        return (
            <>
                <Button
                    appearance="transparent"
                    className={mergeClasses(
                        styles.insightsCommandButton,
                        props.className,
                        overrides.button,
                    )}
                    icon={{
                        className: mergeClasses(
                            styles.commandBarButtonIcon,
                            props.insightsCommandButtonIconProps.className,
                            overrides.buttonIcon,
                        ),
                        children: props.insightsCommandButtonIconProps.icon,
                    }}
                    {...props}
                >
                    {props.children}
                </Button>
            </>
        );
    },
);
