// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

export interface WindowFooterProps {
    cancelClick: () => void;
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
                        onClick={this.onCancelClick}
                        text="Cancel"
                    ></DefaultButton>
                </div>
            </footer>
        );
    }

    private onCancelClick = (): void => this.props.cancelClick();
}
