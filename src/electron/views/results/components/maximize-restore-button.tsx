// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { RestoreIcon } from 'common/icons/restore-icon';
import { NamedFC } from 'common/react/named-fc';
import { ActionButton } from 'office-ui-fabric-react';
import * as React from 'react';

export interface MaximizeRestoreButtonProps {
    isMaximized: boolean;
    onClick: () => void;
}

export const MaximizeRestoreButton = NamedFC<MaximizeRestoreButtonProps>(
    'TitleBar',
    (props: MaximizeRestoreButtonProps) => {
        const renderRestore = () => <RestoreIcon />;
        const iconProps = { iconName: 'stop' };
        const onClick = () => props.onClick();

        const button = props.isMaximized ? (
            <ActionButton
                onRenderIcon={renderRestore}
                ariaHidden={true}
                id="maximize-button"
                tabIndex={-1}
                key="maximize"
                onClick={onClick}
            />
        ) : (
            <ActionButton
                ariaHidden={true}
                iconProps={iconProps}
                id="maximize-button"
                tabIndex={-1}
                key="maximize"
                onClick={onClick}
            />
        );

        return button;
    },
);
