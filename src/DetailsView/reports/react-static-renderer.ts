// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class ReactStaticRenderer {
    public renderToStaticMarkup(element: JSX.Element, parentElementName: string) {
        const parentDomElement = document.createElement(parentElementName);
        ReactDOM.render(element, parentDomElement);
        const markup = parentDomElement.innerHTML;
        return this.removeReactCruft(markup);
    }

    private removeReactCruft(s: string): string {
        return s
            .replace(/<!-- react-text: [0-9]* -->/g, '')
            .replace(/<!-- \/react-text -->/g, '')
            .replace(/ data-reactroot=""/, '');
    }
}
