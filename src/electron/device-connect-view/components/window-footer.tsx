// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { remote } from 'electron';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

export class WindowFooter extends React.Component {
    public render(): JSX.Element {
        return (
            <footer className="ms-Grid window-footer">
                <div className={css('ms-Grid-row')}>
                    <DefaultButton onClick={this.cancelClick} text="Cancel"></DefaultButton>
                </div>
            </footer>
        );
    }

    private cancelClick(): void {
        remote.getCurrentWindow().close();
    }
}
