// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button, ButtonProps, mergeClasses, MenuButtonProps } from '@fluentui/react-components';

import { useInsightsCommandButtonStyle } from 'common/components/controls/insights-command-button-style';
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
    React.forwardRef((props, ref) => {
        const overrides = useInsightsCommandButtonStyle();

        return (
            <Button
                appearance="transparent"
                className={mergeClasses(
                    styles?.insightsCommandButton,
                    props.className,
                    overrides?.button,
                )}
                icon={{
                    children: props.insightsCommandButtonIconProps?.icon,
                }}
                ref={ref}
                {...props}
            >
                {props.children}
            </Button>
        );
    }),
);
