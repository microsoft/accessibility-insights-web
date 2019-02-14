// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { shallow } from 'enzyme';
import { IMock, Mock, MockBehavior } from 'typemoq';
import * as React from 'react';

import { ITab } from '../../../../../common/itab';
import { UrlParser } from '../../../../../common/url-parser';
import {
    AssessmentURLChangedWarning,
    AssessmentURLChangedWarningDeps,
} from '../../../../../DetailsView/components/assessment-url-changed-warning';

describe('AssessmentURLChangedWarning', () => {
    let urlParserMock: IMock<UrlParser>;
    let targetA: ITab;
    let targetB: ITab;
    let deps: AssessmentURLChangedWarningDeps;

    beforeEach(() => {
        urlParserMock = Mock.ofType(UrlParser, MockBehavior.Strict);
        targetA = {
            url: 'some url',
        };

        targetB = {
            url: 'some other url',
        };

        deps = {
            urlParser: urlParserMock.object,
        };
    });

    it('should return null as the target urls are same', () => {
        urlParserMock.setup(parserMock => parserMock.areURLHostNamesEqual(targetA.url, targetB.url)).returns(() => true);
        const testSubject = shallow(<AssessmentURLChangedWarning deps={deps} prevTarget={targetA} currentTarget={targetB} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('should return the message bar component as urls are different', () => {
        urlParserMock.setup(parserMock => parserMock.areURLHostNamesEqual(targetA.url, targetB.url)).returns(() => false);
        const testSubject = shallow(<AssessmentURLChangedWarning deps={deps} prevTarget={targetA} currentTarget={targetB} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
