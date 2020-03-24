// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DocumentManipulator } from 'common/document-manipulator';
import {
    NoContentAvailableView,
    NoContentAvailableViewDeps,
} from 'DetailsView/components/no-content-available/no-content-available-view';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { config } from '../common/configuration';

export class NoContentAvailableViewRenderer {
    constructor(
        private readonly deps: NoContentAvailableViewDeps,
        private readonly dom: Document,
        private readonly renderer: typeof ReactDOM.render,
        private readonly documentManipulator: DocumentManipulator,
    ) {}

    public render(): void {
        const detailsViewContainer = this.dom.querySelector('#details-container');
        const iconPath = '../' + config.getOption('icon128');
        this.documentManipulator.setShortcutIcon(iconPath);

        this.renderer(<NoContentAvailableView deps={this.deps} />, detailsViewContainer);
    }
}
