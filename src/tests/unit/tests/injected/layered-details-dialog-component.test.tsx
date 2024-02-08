// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { getRTL } from '@fluentui/utilities';
import {
    LayeredDetailsDialogComponent,
    LayeredDetailsDialogProps,
} from 'injected/layered-details-dialog-component';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';
import { mockReactComponents } from '../../mock-helpers/mock-module-helpers';
import { DetailsDialog } from '../../../../injected/components/details-dialog';

jest.mock('injected/components/details-dialog');
describe('LayeredDetailsDialogComponent', () => {
    mockReactComponents([DetailsDialog]);
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
        const renderResult = render(<LayeredDetailsDialogComponent {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
