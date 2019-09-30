// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as ReactDOMServer from 'react-dom/server';

export class ReactStaticRenderer {
    public renderToStaticMarkup(element: JSX.Element): string {
        return ReactDOMServer.renderToStaticMarkup(element);
    }
}
