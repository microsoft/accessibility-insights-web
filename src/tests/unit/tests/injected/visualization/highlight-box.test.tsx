// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';

import {
    BoxConfig,
    SimpleHighlightDrawerConfiguration,
} from '../../../../../injected/visualization/formatter';
import {
    HighlightBox,
    HighlightBoxDeps,
    HighlightBoxProps,
} from '../../../../../injected/visualization/highlight-box';

describe('HighlightBox', () => {
    let deps: HighlightBoxDeps;
    let classNameStub: string;
    let drawerConfiguration: SimpleHighlightDrawerConfiguration;
    let boxConfig: BoxConfig;
    let onClickHandlerStub: () => void;
    let props: HighlightBoxProps;

    beforeEach(() => {
        deps = {};

        boxConfig = {
            background: 'green',
            fontColor: 'red',
            boxWidth: '100',
            text: 'some text',
        };

        drawerConfiguration = {
            cursor: 'auto',
            textAlign: 'center',
        };

        onClickHandlerStub = () => {};
        classNameStub = 'some class name';
        props = {
            deps: deps,
            className: classNameStub,
            drawerConfig: drawerConfiguration,
            boxConfig: boxConfig,
            onClickHandler: onClickHandlerStub,
        };
    });

    test('renders null when boxConfig is null', () => {
        props.boxConfig = null;
        const renderResult = render(<HighlightBox {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('renders with appropriate styles/elements when boxConfig is set', () => {
        const renderResult = render(<HighlightBox {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
