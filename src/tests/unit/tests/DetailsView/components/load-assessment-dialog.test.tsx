// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Tab } from 'common/itab';
import { PersistedTabInfo } from 'common/types/store-data/assessment-result-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { UrlParser } from 'common/url-parser';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    LoadAssessmentDialog,
    LoadAssessmentDialogProps,
} from 'DetailsView/components/load-assessment-dialog';
import { shallow } from 'enzyme';
import Dialog from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('LoadAssessmentDialog', () => {
    let urlParserMock: IMock<UrlParser>;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let loadAssessmentDialogProps: LoadAssessmentDialogProps;
    let prevTab: PersistedTabInfo;
    let newTab: Tab;

    beforeEach(() => {
        urlParserMock = Mock.ofType(UrlParser, MockBehavior.Strict);
        detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        prevTab = {
            id: 111,
            url: 'https://www.test.com',
            title: 'test title',
        } as PersistedTabInfo;

        newTab = {
            id: 112,
            url: 'https://www.test2.com',
            title: 'test title 2',
        } as Tab;

        loadAssessmentDialogProps = {
            deps: {
                urlParser: urlParserMock.object,
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            },
            prevTab: prevTab,
            newTab: newTab,
            tabId: 5,
            loadedAssessmentData: {} as VersionedAssessmentData,
            onClose: () => {},
            isOpen: true,
        };
    });

    test.each([null, undefined, {} as PersistedTabInfo])(
        'should render null when prevTab does not exist',
        prevTab => {
            const newTab = {
                id: 111,
                url: 'https://www.def.com',
                title: 'test title',
            };

            urlParserMock
                .setup(urlParserObject => urlParserObject.areURLsEqual(It.isAny(), newTab.url))
                .returns(() => true)
                .verifiable(Times.never());

            loadAssessmentDialogProps.prevTab = prevTab;

            const wrapper = shallow(<LoadAssessmentDialog {...loadAssessmentDialogProps} />);

            expect(wrapper.find(Dialog).exists()).toBe(false);
            urlParserMock.verifyAll();
        },
    );

    it('should show when isOpen is set to true', () => {
        const rendered = shallow(<LoadAssessmentDialog {...loadAssessmentDialogProps} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('should not show when isOpen is set to false', () => {
        loadAssessmentDialogProps.isOpen = false;
        const rendered = shallow(<LoadAssessmentDialog {...loadAssessmentDialogProps} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
