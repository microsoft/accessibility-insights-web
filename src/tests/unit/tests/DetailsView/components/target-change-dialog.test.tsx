// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dialog, TooltipHost } from '@fluentui/react';
import { BlockingDialog } from 'common/components/blocking-dialog';
import { PersistedTabInfo } from 'common/types/store-data/assessment-result-data';
import { Tab } from 'common/types/store-data/itab';
import { UrlParser } from 'common/url-parser';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    TargetChangeDialog,
    TargetChangeDialogDeps,
    TargetChangeDialogProps,
} from 'DetailsView/components/target-change-dialog';
import * as Enzyme from 'enzyme';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('TargetChangeDialog test set for prev tab null', () => {
    const urlParserMock = Mock.ofType(UrlParser, MockBehavior.Strict);

    test.each([
        null,
        undefined,
        {} as PersistedTabInfo,
        { detailsViewId: 'testId' } as PersistedTabInfo,
    ])('should render null when prevTab does not exists', prevTab => {
        const detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        const assessmentActionMessageCreatorMock = Mock.ofType(AssessmentActionMessageCreator);

        const newTab = {
            id: 111,
            url: 'https://www.def.com',
            title: 'test title',
        };

        urlParserMock
            .setup(urlParserObject => urlParserObject.areURLsEqual(It.isAny(), newTab.url))
            .returns(() => true)
            .verifiable(Times.never());

        const targetChangeProps: TargetChangeDialogProps = {
            deps: {
                urlParser: urlParserMock.object,
                getAssessmentActionMessageCreator: () => assessmentActionMessageCreatorMock.object,
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
                detailsViewId: '',
            },
            prevTab: prevTab,
            newTab: newTab,
        };

        const wrapper = Enzyme.shallow(<TargetChangeDialog {...targetChangeProps} />);

        expect(wrapper.find(Dialog).exists()).toBe(false);
        urlParserMock.verifyAll();
    });
});

describe('TargetChangeDialog test sets for same prev tab and newTab values', () => {
    let urlParserMock: IMock<UrlParser>;
    let prevTab: PersistedTabInfo;
    let newTab: Tab;
    let deps: TargetChangeDialogDeps;
    let detailsViewActionMessageCreatorMock;
    let assessmentActionMessageCreatorMock;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        assessmentActionMessageCreatorMock = Mock.ofType(AssessmentActionMessageCreator);
        prevTab = {
            id: 111,
            url: 'https://www.abc.com',
            title: 'test title 1',
            detailsViewId: 'detailsViewId',
        };
        newTab = {
            id: 123,
            url: 'https://www.def.com',
            title: 'test title 2',
        };
        urlParserMock = Mock.ofType(UrlParser, MockBehavior.Strict);
        deps = {
            urlParser: urlParserMock.object,
            detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            getAssessmentActionMessageCreator: () => assessmentActionMessageCreatorMock.object,
            detailsViewId: 'detailsViewId',
        };
    });

    afterEach(() => {
        urlParserMock.verifyAll();
    });

    test('should show dialog when target tab id changed', () => {
        urlParserMock
            .setup(urlParserObject => urlParserObject.areURLsEqual(prevTab.url, newTab.url))
            .returns(() => true)
            .verifiable(Times.once());

        const targetChangeProps: TargetChangeDialogProps = {
            deps,
            prevTab,
            newTab,
        };

        const wrapper = Enzyme.mount(<TargetChangeDialog {...targetChangeProps} />);
        expect(wrapper.find(BlockingDialog).exists()).toBe(true);
        expect(wrapper.find(TooltipHost).exists()).toBe(true);
        expect(wrapper.find(TooltipHost).length).toEqual(2);
        expect(wrapper.find(BlockingDialog).props().hidden).toBe(false);
    });

    test('snapshot: render when target tab id changed', () => {
        prevTab = {
            ...prevTab,
        };

        urlParserMock
            .setup(urlParserObject =>
                urlParserObject.areURLsEqual(It.isValue(prevTab.url), It.isValue(newTab.url)),
            )
            .returns(() => true)
            .verifiable();

        const targetChangeProps: TargetChangeDialogProps = {
            deps,
            prevTab,
            newTab,
        };

        const wrapper = Enzyme.shallow(<TargetChangeDialog {...targetChangeProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('snapshot: render when previous tab info shows app is refreshed', () => {
        prevTab = {
            ...prevTab,
            detailsViewId: 'differentDetailsViewId',
        };

        urlParserMock
            .setup(urlParserObject => urlParserObject.areURLsEqual(prevTab.url, newTab.url))
            .returns(() => true)
            .verifiable(Times.never());

        const targetChangeProps: TargetChangeDialogProps = {
            deps,
            prevTab,
            newTab,
        };

        const wrapper = shallow(<TargetChangeDialog {...targetChangeProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('snapshot: render when tab ids are same but url changes', () => {
        prevTab = {
            ...prevTab,
        };
        newTab = {
            ...newTab,
            id: 123,
        };

        urlParserMock
            .setup(urlParserObject => urlParserObject.areURLsEqual(prevTab.url, newTab.url))
            .returns(() => true)
            .verifiable();

        const targetChangeProps: TargetChangeDialogProps = {
            deps,
            prevTab,
            newTab,
        };

        const wrapper = shallow(<TargetChangeDialog {...targetChangeProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test("snapshot: render when tab ids are same and also url doesn't change", () => {
        newTab = {
            ...newTab,
            url: 'https://www.abc.com',
            id: 123,
        };
        urlParserMock
            .setup(urlParserObject => urlParserObject.areURLsEqual(prevTab.url, newTab.url))
            .returns(() => false)
            .verifiable();

        const targetChangeProps: TargetChangeDialogProps = {
            deps,
            prevTab,
            newTab,
        };

        const wrapper = shallow(<TargetChangeDialog {...targetChangeProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('snapshot: render the only information available in prevTab detailsViewId matches current detailsViewId', () => {
        prevTab = {
            id: 456,
            detailsViewId: 'differentDetailsViewId',
        };
        newTab = {
            ...newTab,
            url: 'https://www.abc.com',
            id: 123,
        };
        urlParserMock
            .setup(urlParserObject => urlParserObject.areURLsEqual(prevTab.url, newTab.url))
            .returns(() => false)
            .verifiable(Times.never());

        const targetChangeProps: TargetChangeDialogProps = {
            deps,
            prevTab,
            newTab,
        };

        const wrapper = shallow(<TargetChangeDialog {...targetChangeProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
