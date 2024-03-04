// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { LayerHost } from '@fluentui/react';
import { getRTL } from '@fluentui/utilities';
import { render } from '@testing-library/react';
import {
    LayeredDetailsDialogComponent,
    LayeredDetailsDialogProps,
} from 'injected/layered-details-dialog-component';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';
import { DetailsDialog } from '../../../../injected/components/details-dialog';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../mock-helpers/mock-module-helpers';

jest.mock('injected/components/details-dialog');
jest.mock('@fluentui/react');
describe('LayeredDetailsDialogComponent', () => {
    mockReactComponents([DetailsDialog, LayerHost]);
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
        expectMockedComponentPropsToMatchSnapshots([DetailsDialog]);
    });
});
