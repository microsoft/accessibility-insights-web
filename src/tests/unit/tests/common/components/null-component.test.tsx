// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getNullComponent, NullComponent } from 'common/components/null-component';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('NullComponent', () => {
    test('it returns null', () => {
        expect(shallow(<NullComponent />).getElement()).toBeNull();
    });
});

describe('getNullComponent', () => {
    test('it returns null', () => {
        expect(getNullComponent()).toBeNull();
    });
});
