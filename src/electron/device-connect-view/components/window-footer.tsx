// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { NamedSFC } from '../../../common/react/named-sfc';

export interface WindowFooterProps {
    cancelClick: () => void;
}

export const WindowFooter = NamedSFC<WindowFooterProps>('WindowFooter', (props: WindowFooterProps) => {
    const onCancelClick = () => props.cancelClick();
    return (
        <footer className="ms-Grid window-footer">
            <div className={css('ms-Grid-row')}>
                <DefaultButton className={css('window-footer-button-cancel')} onClick={onCancelClick} text="Cancel"></DefaultButton>
            </div>
        </footer>
    );
});
