import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import { RestoreIcon } from 'common/icons/restore-icon';
import { NamedFC } from 'common/react/named-fc';

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface MaximizeRestoreButtonProps {
    isMaximized: boolean;
    onClick: () => void;
}

export const MaximizeRestoreButton = NamedFC<MaximizeRestoreButtonProps>('TitleBar', (props: MaximizeRestoreButtonProps) => {
    const content = props.isMaximized ? null : <RestoreIcon />;
    const icon = props.isMaximized ? { iconName: 'Stop' } : null;
    const onClick = () => props.onClick();

    return (
        <ActionButton ariaHidden={true} iconProps={icon} id="maximize-button" tabIndex={-1} key="maximize" onClick={onClick}>
            {content}
        </ActionButton>
    );
});
