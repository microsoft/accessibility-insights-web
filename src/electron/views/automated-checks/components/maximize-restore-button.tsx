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
    const renderRestore = () => <RestoreIcon />;
    const iconProps = { iconName: 'Stop' };
    const onClick = () => props.onClick();

    const button = props.isMaximized ? (
        <ActionButton onRenderIcon={renderRestore} ariaHidden={true} id="maximize-button" tabIndex={-1} key="maximize" onClick={onClick} />
    ) : (
        <ActionButton ariaHidden={true} iconProps={iconProps} id="maximize-button" tabIndex={-1} key="maximize" onClick={onClick} />
    );

    return button;
});
