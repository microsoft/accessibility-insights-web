// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { BaseButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

export interface WindowFooterProps {
    cancelClick: React.MouseEventHandler<BaseButton>;
}

export class WindowFooter extends React.Component<WindowFooterProps> {
    constructor(props: WindowFooterProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <footer className="ms-Grid window-footer">
                <div className={css('ms-Grid-row')}>
                    <DefaultButton
                        className={css('window-footer-button-cancel')}
                        onClick={this.props.cancelClick}
                        text="Cancel"
                    ></DefaultButton>
                </div>
            </footer>
        );
    }
}
