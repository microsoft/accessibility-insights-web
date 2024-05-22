// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DocumentManipulator } from 'common/document-manipulator';
import {
    NoContentAvailableView,
    NoContentAvailableViewDeps,
} from 'DetailsView/components/no-content-available/no-content-available-view';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { config } from '../common/configuration';

export class NoContentAvailableViewRenderer {
    constructor(
        private readonly deps: NoContentAvailableViewDeps,
        private readonly dom: Document,
        private readonly renderer: typeof createRoot,
        private readonly documentManipulator: DocumentManipulator,
    ) {}

    public render(): void {
        const detailsViewContainer = this.dom.querySelector('#details-container') as Element;
        const iconPath = '../' + config.getOption('icon128');
        this.documentManipulator.setShortcutIcon(iconPath);
        const root = this.renderer(detailsViewContainer);
        root.render(<NoContentAvailableView deps={this.deps} />);
    }
}
