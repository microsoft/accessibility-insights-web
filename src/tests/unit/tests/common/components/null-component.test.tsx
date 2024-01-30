// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { getNullComponent, NullComponent } from 'common/components/null-component';
import * as React from 'react';

describe('NullComponent', () => {
    test('it returns null', () => {
        expect(render(<NullComponent />).container.firstChild).toBeNull();
    });
});

describe('getNullComponent', () => {
    test('it returns null', () => {
        expect(getNullComponent()).toBeNull();
    });
});
