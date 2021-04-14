// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getRTL } from '@uifabric/utilities';
import { shallow } from 'enzyme';
import {
    LayeredDetailsDialogComponent,
    LayeredDetailsDialogProps,
} from 'injected/layered-details-dialog-component';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

describe('LayeredDetailsDialogComponent', () => {
    let props: LayeredDetailsDialogProps;
    let getRTLMock: IMock<typeof getRTL>;

    beforeEach(() => {
        getRTLMock = Mock.ofInstance(() => null);

        props = {
            deps: {
                getRTL: getRTLMock.object,
            },
            devToolActionMessageCreator: 'devToolActionMessageCreator' as any,
        } as LayeredDetailsDialogProps;
    });

    it('renders per snapshot', () => {
        const wrapper = shallow(<LayeredDetailsDialogComponent {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
