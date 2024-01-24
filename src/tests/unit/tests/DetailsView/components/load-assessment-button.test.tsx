// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { AssessmentDataParser } from 'common/assessment-data-parser';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { UrlParser } from 'common/url-parser';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    LoadAssessmentButton,
    LoadAssessmentButtonProps,
    LoadAssessmentButtonDeps,
} from 'DetailsView/components/load-assessment-button';
import { LoadAssessmentHelper } from 'DetailsView/components/load-assessment-helper';
import * as React from 'react';
import { IMock, It, Mock } from 'typemoq';
import { InsightsCommandButton } from '../../../../../common/components/controls/insights-command-button';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
    useOriginalReactElements,
} from '../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../common/components/controls/insights-command-button');

describe('LoadAssessmentButton', () => {
    mockReactComponents([InsightsCommandButton]);
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let assessmentDataParserMock: IMock<AssessmentDataParser>;
    let urlParserMock: IMock<UrlParser>;
    let loadAssessmentHelperMock: IMock<LoadAssessmentHelper>;
    let handleLoadAssessmentButtonClickMock: IMock<(event: React.MouseEvent<any>) => void>;
    let props: LoadAssessmentButtonProps;
    let deps: LoadAssessmentButtonDeps;
    let tabStoreData: TabStoreData;
    let assessmentStoreData: AssessmentStoreData;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        assessmentDataParserMock = Mock.ofType(AssessmentDataParser);
        urlParserMock = Mock.ofType(UrlParser);
        loadAssessmentHelperMock = Mock.ofType(LoadAssessmentHelper);
        handleLoadAssessmentButtonClickMock = Mock.ofInstance(e => {});

        props = {
            deps,
            tabStoreData,
            assessmentStoreData,
            handleLoadAssessmentButtonClick: handleLoadAssessmentButtonClickMock.object,
        } as LoadAssessmentButtonProps;

        deps = {
            detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            assessmentDataParser: assessmentDataParserMock.object,
            urlParser: urlParserMock.object,
            loadAssessmentHelper: loadAssessmentHelperMock.object,
        } as LoadAssessmentButtonDeps;

        tabStoreData = {
            id: 5,
        } as TabStoreData;

        assessmentStoreData = {} as AssessmentStoreData;
    });

    it('should render per the snapshot', () => {
        const renderResult = render(<LoadAssessmentButton {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([InsightsCommandButton]);
    });

    it('should call load button click method on click', async () => {
        useOriginalReactElements('../../../common/components/controls/insights-command-button', [
            'InsightsCommandButton',
        ]);
        handleLoadAssessmentButtonClickMock.setup(m => m(It.isAny())).verifiable();
        const renderResult = render(<LoadAssessmentButton {...props} />);
        await userEvent.click(renderResult.getByRole('button'));
        handleLoadAssessmentButtonClickMock.verifyAll();
    });
});
