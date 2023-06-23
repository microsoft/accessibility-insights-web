// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    allCardInteractionsSupported,
    noCardInteractionsSupported,
} from 'common/components/cards/card-interaction-support';
import {
    InstanceDetailsFooter,
    InstanceDetailsFooterDeps,
    InstanceDetailsFooterProps,
} from 'common/components/cards/instance-details-footer';
import { CardResult, HighlightState } from 'common/types/store-data/card-view-model';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { CreateIssueDetailsTextData } from '../../../../../../common/types/create-issue-details-text-data';
import {
    TargetAppData,
    UnifiedRule,
} from '../../../../../../common/types/store-data/unified-data-interface';
import { UnifiedResultToIssueFilingDataConverter } from '../../../../../../issue-filing/unified-result-to-issue-filing-data';
import { exampleUnifiedResult, exampleUnifiedRuleResult } from './sample-view-model-data';

describe('InstanceDetailsFooter', () => {
    let resultStub: CardResult;
    let props: InstanceDetailsFooterProps;
    let deps: InstanceDetailsFooterDeps;
    let ruleStub: UnifiedRule;
    let converterMock: IMock<UnifiedResultToIssueFilingDataConverter>;
    let targetAppInfo: TargetAppData;
    let issueDetailsData: CreateIssueDetailsTextData;

    const setupConverterToBeCalled = (times: Times) => {
        converterMock
            .setup(converter => converter.convert(resultStub, ruleStub, targetAppInfo))
            .returns(() => issueDetailsData)
            .verifiable(times);
    };

    const setupConverterToBeCalledOnce = () => {
        setupConverterToBeCalled(Times.once());
    };

    const setupConverterToNeverBeCalled = () => {
        setupConverterToBeCalled(Times.never());
    };

    beforeEach(() => {
        resultStub = { ...exampleUnifiedResult, isSelected: true, highlightStatus: 'visible' };
        ruleStub = exampleUnifiedRuleResult;
        issueDetailsData = {} as CreateIssueDetailsTextData;
        targetAppInfo = { name: 'app' };
        converterMock = Mock.ofType(UnifiedResultToIssueFilingDataConverter);
        deps = {
            cardInteractionSupport: allCardInteractionsSupported,
            unifiedResultToIssueFilingDataConverter: converterMock.object,
        } as InstanceDetailsFooterDeps;
        props = {
            deps,
            result: resultStub,
            rule: ruleStub,
            targetAppInfo: targetAppInfo,
            highlightState: 'hidden',
            userConfigurationStoreData: {} as UserConfigurationStoreData,
        };
    });

    it('renders as null when no card interactions are supported', () => {
        setupConverterToNeverBeCalled();
        deps.cardInteractionSupport = noCardInteractionsSupported;
        const testSubject = shallow(<InstanceDetailsFooter {...props} />);

        expect(testSubject.getElement()).toBeNull();
        converterMock.verifyAll();
    });

    it('renders per snapshot when all card interactions are supported (ie, web)', () => {
        setupConverterToBeCalledOnce();
        deps.cardInteractionSupport = allCardInteractionsSupported;
        const testSubject = shallow(<InstanceDetailsFooter {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
        converterMock.verifyAll();
    });

    const allHighlightStates: HighlightState[] = ['visible', 'hidden', 'unavailable'];

    it.each(allHighlightStates)(
        'renders per snapshot with highlightState="%s"',
        (highlightState: HighlightState) => {
            resultStub.highlightStatus = highlightState;
            setupConverterToBeCalledOnce();
            const testSubject = shallow(<InstanceDetailsFooter {...props} />);

            expect(testSubject.getElement()).toMatchSnapshot();
            converterMock.verifyAll();
        },
    );
});
