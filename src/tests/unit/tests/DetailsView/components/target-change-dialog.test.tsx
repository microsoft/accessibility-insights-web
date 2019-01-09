// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Enzyme from 'enzyme';
import Dialog from 'office-ui-fabric-react/lib/Dialog';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import * as React from 'react';
import { Mock } from 'typemoq';

import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { ITargetChangeDialogProps, TargetChangeDialog } from '../../../../../DetailsView/components/target-change-dialog';

describe('TargetChangeDialog', () => {
    test('should render null when prev tab in not set', () => {
        const actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);

        const targetChangeProps: ITargetChangeDialogProps = {
            prevTab: null,
            newTab: {
                id: 111,
                url: 'https://www.def.com',
                title: 'test title',
            },
            actionMessageCreator: actionMessageCreatorMock.object,
        };

        const wrapper = Enzyme.shallow(<TargetChangeDialog {...targetChangeProps} />);
        expect(wrapper.find(Dialog).exists()).toBeFalsy();
    });

    test('should render null when target tab id did not change', () => {
        const actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);

        const targetChangeProps: ITargetChangeDialogProps = {
            prevTab: {
                id: 111,
                url: 'https://www.abc.com',
                title: 'test title 1',
            },
            newTab: {
                id: 111,
                url: 'https://www.def.com',
                title: 'test title 2',
            },
            actionMessageCreator: actionMessageCreatorMock.object,
        };

        const wrapper = Enzyme.shallow(<TargetChangeDialog {...targetChangeProps} />);
        expect(wrapper.find(Dialog).exists()).toBeFalsy();
    });

    test('should show when target tab id changed', () => {
        const actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);

        const targetChangeProps: ITargetChangeDialogProps = {
            prevTab: {
                id: 111,
                url: 'https://www.abc.com',
                title: 'test title 1',
            },
            newTab: {
                id: 123,
                url: 'https://www.def.com',
                title: 'test title 2',
            },
            actionMessageCreator: actionMessageCreatorMock.object,
        };

        const wrapper = Enzyme.shallow(<TargetChangeDialog {...targetChangeProps} />);
        expect(wrapper.find(Dialog).exists()).toBeTruthy();
        expect(wrapper.find(TooltipHost).exists()).toBeTruthy();
        expect(wrapper.find(TooltipHost).length).toEqual(2);
        expect(wrapper.find(Dialog).props().hidden).toBeFalsy();
    });

    test('snapshot: render when target tab id changed', () => {
        const actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);

        const targetChangeProps: ITargetChangeDialogProps = {
            prevTab: {
                id: 111,
                url: 'https://www.abc.com',
                title: 'test title 1',
            },
            newTab: {
                id: 123,
                url: 'https://www.def.com',
                title: 'test title 2',
            },
            actionMessageCreator: actionMessageCreatorMock.object,
        };

        const component = new TargetChangeDialog(targetChangeProps);
        expect(component.render()).toMatchSnapshot();
    });
});
