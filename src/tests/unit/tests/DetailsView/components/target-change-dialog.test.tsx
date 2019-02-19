// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Enzyme from 'enzyme';
import Dialog from 'office-ui-fabric-react/lib/Dialog';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import * as React from 'react';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { ITab } from '../../../../../common/itab';
import { PersistedTabInfo } from '../../../../../common/types/store-data/iassessment-result-data';
import { UrlParser } from '../../../../../common/url-parser';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { TargetChangeDialog, TargetChangeDialogProps } from '../../../../../DetailsView/components/target-change-dialog';

describe('TargetChangeDialog test set for prev tab null', () => {
    const urlParserMock = Mock.ofType(UrlParser, MockBehavior.Strict);
    test('should render null when prev tab is not set', () => {
        const actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        const prevTab = null;
        const newTab = {
            id: 111,
            url: 'https://www.def.com',
            title: 'test title',
        };

        urlParserMock
            .setup(x => x.areURLHostNamesEqual(prevTab, newTab.url))
            .returns(() => true)
            .verifiable(Times.never());

        const targetChangeProps: TargetChangeDialogProps = {
            deps: { urlParser: urlParserMock.object },
            prevTab: prevTab,
            newTab: newTab,
            actionMessageCreator: actionMessageCreatorMock.object,
        };

        const wrapper = Enzyme.shallow(<TargetChangeDialog {...targetChangeProps} />);
        expect(wrapper.find(Dialog).exists()).toBeFalsy();

        urlParserMock.verifyAll();
    });
});

describe('TargetChangeDialog test sets for same prev tab and newTab values', () => {
    let urlParserMock: IMock<UrlParser>;
    let prevTab: PersistedTabInfo;
    let newTab: ITab;

    beforeEach(() => {
        prevTab = {
            id: 111,
            url: 'https://www.abc.com',
            title: 'test title 1',
            appRefreshed: false,
        };
        newTab = {
            id: 123,
            url: 'https://www.def.com',
            title: 'test title 2',
        };
        urlParserMock = Mock.ofType(UrlParser, MockBehavior.Strict);
    });

    afterEach(() => {
        urlParserMock.verifyAll();
    });

    test('should show dialog when target tab id changed', () => {
        const actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        urlParserMock
            .setup(urlParserObject => urlParserObject.areURLHostNamesEqual(prevTab.url, newTab.url))
            .returns(() => true)
            .verifiable(Times.once());

        const targetChangeProps: TargetChangeDialogProps = {
            deps: { urlParser: urlParserMock.object },
            prevTab,
            newTab,
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
        prevTab = {
            ...prevTab,
            appRefreshed: false,
        };
        urlParserMock
            .setup(urlParserObject => urlParserObject.areURLHostNamesEqual(It.isValue(prevTab.url), It.isValue(newTab.url)))
            .returns(() => true)
            .verifiable();

        const targetChangeProps: TargetChangeDialogProps = {
            deps: { urlParser: urlParserMock.object },
            prevTab,
            newTab,
            actionMessageCreator: actionMessageCreatorMock.object,
        };

        const wrapper = Enzyme.shallow(<TargetChangeDialog {...targetChangeProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('snapshot: render when previous tab info shows app is refreshed', () => {
        const actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        prevTab = {
            ...prevTab,
            appRefreshed: true,
        };
        urlParserMock
            .setup(urlParserObject => urlParserObject.areURLHostNamesEqual(prevTab.url, newTab.url))
            .returns(() => true)
            .verifiable();

        const targetChangeProps: TargetChangeDialogProps = {
            deps: { urlParser: urlParserMock.object },
            prevTab,
            newTab,
            actionMessageCreator: actionMessageCreatorMock.object,
        };

        const component = new TargetChangeDialog(targetChangeProps);
        expect(component.render()).toMatchSnapshot();
    });

    test('snapshot: render when tab ids are same but url changes', () => {
        const actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        prevTab = {
            ...prevTab,
            appRefreshed: true,
        };
        newTab = {
            ...newTab,
            id: 123,
        };
        urlParserMock
            .setup(urlParserObject => urlParserObject.areURLHostNamesEqual(prevTab.url, newTab.url))
            .returns(() => true)
            .verifiable();

        const targetChangeProps: TargetChangeDialogProps = {
            deps: { urlParser: urlParserMock.object },
            prevTab,
            newTab,
            actionMessageCreator: actionMessageCreatorMock.object,
        };

        const component = new TargetChangeDialog(targetChangeProps);
        expect(component.render()).toMatchSnapshot();
    });

    test("snapshot: render when tab ids are same and also url doesn't change", () => {
        const actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        prevTab = {
            ...prevTab,
            appRefreshed: true,
        };
        newTab = {
            ...newTab,
            url: 'https://www.abc.com',
            id: 123,
        };
        urlParserMock
            .setup(urlParserObject => urlParserObject.areURLHostNamesEqual(prevTab.url, newTab.url))
            .returns(() => false)
            .verifiable();

        const targetChangeProps: TargetChangeDialogProps = {
            deps: { urlParser: urlParserMock.object },
            prevTab,
            newTab,
            actionMessageCreator: actionMessageCreatorMock.object,
        };

        const component = new TargetChangeDialog(targetChangeProps);
        expect(component.render()).toMatchSnapshot();
    });
});
