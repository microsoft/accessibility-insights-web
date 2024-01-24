// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ContextualMenu, PrimaryButton } from '@fluentui/react';
import { fireEvent, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { FeatureFlags } from 'common/feature-flags';
import { ExportDropdown, ExportDropdownProps } from 'DetailsView/components/export-dropdown';
import * as React from 'react';
import { CodePenReportExportService } from 'report-export/services/code-pen-report-export-service';
import {
    ReportExportService,
    ReportExportServiceKey,
} from 'report-export/types/report-export-service';
import { Mock } from 'typemoq';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');
describe('ExportDropdown', () => {
    mockReactComponents([ContextualMenu, PrimaryButton]);

    const generateExportsMock = Mock.ofType<() => void>();
    let props: ExportDropdownProps;

    const makeReportExportServiceStub = (key: ReportExportServiceKey): ReportExportService => {
        return {
            key: key,
            generateMenuItem: (onItemClick, href?, download?) => {
                return {
                    key: key,
                    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                        onItemClick(e, key);
                    },
                    href: href,
                    download: download,
                };
            },
            exportForm: CodePenReportExportService.exportForm,
        };
    };

    const makeReportExportServicesForKeys = (keys: ReportExportServiceKey[]) => {
        return keys.map(key => makeReportExportServiceStub(key));
    };

    beforeEach(() => {
        props = {
            onExportLinkClick: null,
            reportExportServices: null,
            htmlFileName: 'A file name',
            jsonFileName: 'json file name',
            htmlFileURL: 'html file url',
            jsonFileURL: 'json file url',
            generateExports: generateExportsMock.object,
            featureFlagStoreData: {},
        };
    });

    it('renders without menu items', () => {
        const renderResult = render(<ExportDropdown {...props} />);
        expectMockedComponentPropsToMatchSnapshots([ContextualMenu]);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('handles click to show menu without feature flags', async () => {
        props.reportExportServices = makeReportExportServicesForKeys(['html']);

        useOriginalReactElements('@fluentui/react', ['PrimaryButton']);
        const renderResult = render(<ExportDropdown {...props} />);
        expectMockedComponentPropsToMatchSnapshots([ContextualMenu]);
        await userEvent.click(renderResult.getByRole('button'));

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('handles click to show menu with feature flags', async () => {
        props.featureFlagStoreData[FeatureFlags.exportReportOptions] = true;
        props.reportExportServices = makeReportExportServicesForKeys(['html', 'json', 'codepen']);

        useOriginalReactElements('@fluentui/react', ['PrimaryButton']);
        const renderResult = render(<ExportDropdown {...props} />);
        expectMockedComponentPropsToMatchSnapshots([ContextualMenu]);
        await userEvent.click(renderResult.getByRole('button'));

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('handles click to show menu with feature flags but missing json', async () => {
        props.featureFlagStoreData[FeatureFlags.exportReportOptions] = true;
        props.reportExportServices = makeReportExportServicesForKeys(['html', 'codepen']);

        useOriginalReactElements('@fluentui/react', ['PrimaryButton']);
        const renderResult = render(<ExportDropdown {...props} />);
        expectMockedComponentPropsToMatchSnapshots([ContextualMenu]);
        await userEvent.click(renderResult.getByRole('button'));

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('handles click on menu item', async () => {
        let wasClicked = false;
        const onClick = () => {
            wasClicked = true;
        };
        props.onExportLinkClick = onClick;
        props.reportExportServices = makeReportExportServicesForKeys(['html']);

        useOriginalReactElements('@fluentui/react', ['PrimaryButton']);
        const renderResult = render(<ExportDropdown {...props} />);
        expectMockedComponentPropsToMatchSnapshots([ContextualMenu]);
        const button = renderResult.getByRole('button');
        fireEvent.click(button);

        const menu = getMockComponentClassPropsForCall(ContextualMenu);
        menu.items.find(elem => elem.key === 'html').onClick();

        expect(wasClicked).toBeTruthy();
    });

    it('should dismiss the contextMenu', async () => {
        props.reportExportServices = makeReportExportServicesForKeys(['html']);

        useOriginalReactElements('@fluentui/react', ['PrimaryButton']);
        const renderResult = render(<ExportDropdown {...props} />);
        expectMockedComponentPropsToMatchSnapshots([ContextualMenu]);
        const button = renderResult.getByRole('button');
        fireEvent.click(button);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
