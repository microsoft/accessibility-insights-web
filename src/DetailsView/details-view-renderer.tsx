// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Theme, ThemeDeps } from '../common/components/theme';
import { config } from '../common/configuration';
import { DocumentManipulator } from '../common/document-manipulator';
import { DetailsView, DetailsViewContainerDeps } from './details-view-container';

export type DetailsViewRendererDeps = DetailsViewContainerDeps & ThemeDeps;
export class DetailsViewRenderer {
    constructor(
        private readonly deps: DetailsViewRendererDeps,
        private readonly dom: Document,
        private readonly renderer: typeof ReactDOM.render,
        private readonly documentManipulator: DocumentManipulator,
    ) {}

    public render(): void {
        const detailsViewContainer = this.dom.querySelector('#details-container');
        const iconPath = '../' + config.getOption('icon128');
        this.documentManipulator.setShortcutIcon(iconPath);

        this.renderer(
            <>
                <Theme deps={this.deps} />
                <DetailsView deps={this.deps} />
            </>,
            detailsViewContainer,
        );
    }
}
