// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ContextualMenu, PrimaryButton } from '@fluentui/react';
import { FeatureFlags } from 'common/feature-flags';
import { ExportDropdown, ExportDropdownProps } from 'DetailsView/components/export-dropdown';
import { shallow } from 'enzyme';
import * as React from 'react';
import { CodePenReportExportService } from 'report-export/services/code-pen-report-export-service';
import {
    ReportExportService,
    ReportExportServiceKey,
} from 'report-export/types/report-export-service';
import { Mock } from 'typemoq';

describe('ExportDropdown', () => {
    const generateExportsMock = Mock.ofType<() => void>();
    const event = {
        currentTarget: 'test target',
    } as React.MouseEvent<any>;
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
        const rendered = shallow(<ExportDropdown {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('handles click to show menu without feature flags', () => {
        props.reportExportServices = makeReportExportServicesForKeys(['html']);

        const rendered = shallow(<ExportDropdown {...props} />);
        rendered.find(PrimaryButton).simulate('click', event);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('handles click to show menu with feature flags', () => {
        props.featureFlagStoreData[FeatureFlags.exportReportOptions] = true;
        props.reportExportServices = makeReportExportServicesForKeys(['html', 'json', 'codepen']);

        const rendered = shallow(<ExportDropdown {...props} />);
        rendered.find(PrimaryButton).simulate('click', event);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('handles click to show menu with feature flags but missing json', () => {
        props.featureFlagStoreData[FeatureFlags.exportReportOptions] = true;
        props.reportExportServices = makeReportExportServicesForKeys(['html', 'codepen']);

        const rendered = shallow(<ExportDropdown {...props} />);
        rendered.find(PrimaryButton).simulate('click', event);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('handles click on menu item', () => {
        let wasClicked = false;
        const onClick = () => {
            wasClicked = true;
        };
        props.onExportLinkClick = onClick;
        props.reportExportServices = makeReportExportServicesForKeys(['html']);

        const rendered = shallow(<ExportDropdown {...props} />);
        rendered.find(PrimaryButton).simulate('click', event);
        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'html')
            .onClick();

        expect(wasClicked).toBeTruthy();
    });

    it('should dismiss the contextMenu', () => {
        props.reportExportServices = makeReportExportServicesForKeys(['html']);

        const rendered = shallow(<ExportDropdown {...props} />);
        rendered.find(PrimaryButton).simulate('click', event);
        rendered.find(ContextualMenu).prop('onDismiss')();

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
