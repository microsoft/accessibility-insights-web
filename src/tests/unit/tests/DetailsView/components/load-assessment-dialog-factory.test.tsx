// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Tab } from 'common/itab';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { DetailsViewCommandBarDeps } from 'DetailsView/components/details-view-command-bar';
import {
    getLoadAssessmentDialogForAssessment,
    getLoadAssessmentDialogForFastPass,
    LoadAssessmentDialogFactoryProps,
} from 'DetailsView/components/load-assessment-dialog-factory';
import { IMock, Mock } from 'typemoq';

describe('LoadAssessmentDialogFactory', () => {
    const isOpen: boolean = true;

    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let assessmentStoreData: AssessmentStoreData;
    let tabStoreData: TabStoreData;
    let deps: DetailsViewCommandBarDeps;
    let props: LoadAssessmentDialogFactoryProps;
    let loadedAssessmentData: VersionedAssessmentData;
    let tabId: number;
    let prevTab: Tab;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        assessmentStoreData = {} as AssessmentStoreData;
        loadedAssessmentData = {} as VersionedAssessmentData;
        tabStoreData = {} as TabStoreData;
        tabId = 5;
        prevTab = {} as Tab;
        deps = {
            detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
        } as DetailsViewCommandBarDeps;

        props = {
            deps,
            loadedAssessmentData,
            prevTab,
            tabId,
            assessmentStoreData,
            tabStoreData,
            isOpen,
            onClose: () => {},
        } as LoadAssessmentDialogFactoryProps;
    });

    test('renders load assessment dialog for Assessment', () => {
        const rendered = getLoadAssessmentDialogForAssessment(props);
        expect(rendered).toMatchSnapshot;
    });

    test('renders load assessment dialog as null for fast pass', () => {
        const rendered = getLoadAssessmentDialogForFastPass(props);
        expect(rendered).toBeNull();
    });
});
