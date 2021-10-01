// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlags } from 'common/feature-flags';
import { FileURLProvider } from 'common/file-url-provider';
import { ExportDropdown, ExportDropdownProps } from 'DetailsView/components/export-dropdown';
import { shallow } from 'enzyme';
import { ContextualMenu, PrimaryButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { ReportExportServiceProvider } from 'report-export/report-export-service-provider';
import { CodePenReportExportService } from 'report-export/services/code-pen-report-export-service';
import {
    ReportExportService,
    ReportExportServiceKey,
} from 'report-export/types/report-export-service';
import { It, Mock, Times } from 'typemoq';

describe('ExportDropdown', () => {
    const fileProviderMock = Mock.ofType<FileURLProvider>();
    const reportExportServiceProvider = Mock.ofType<ReportExportServiceProvider>();
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

    beforeEach(() => {
        props = {
            onExportLinkClick: null,
            reportExportServiceProvider: reportExportServiceProvider.object,
            fileName: 'A file name',
            html: '<some html>',
            fileURLProvider: fileProviderMock.object,
            featureFlagStoreData: {},
        };
        reportExportServiceProvider.reset();
        fileProviderMock
            .setup(f => f.provideURL(['<some html>'], 'text/html'))
            .returns(() => 'a file url');
    });

    it('renders without menu items', () => {
        const rendered = shallow(<ExportDropdown {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('handles click to show menu without feature flags', () => {
        reportExportServiceProvider
            .setup(p => p.forKey('html'))
            .returns(key => makeReportExportServiceStub(key))
            .verifiable(Times.once());

        const rendered = shallow(<ExportDropdown {...props} />);
        rendered.find(PrimaryButton).simulate('click', event);

        expect(rendered.getElement()).toMatchSnapshot();
        reportExportServiceProvider.verifyAll();
    });

    it('handles click to show menu with feature flags', () => {
        props.featureFlagStoreData[FeatureFlags.exportReportOptions] = true;
        props.featureFlagStoreData[FeatureFlags.exportReportJSON] = true;
        reportExportServiceProvider
            .setup(p => p.forKey(It.isAny()))
            .returns(key => makeReportExportServiceStub(key))
            .verifiable(Times.exactly(3));

        const rendered = shallow(<ExportDropdown {...props} />);
        rendered.find(PrimaryButton).simulate('click', event);

        expect(rendered.getElement()).toMatchSnapshot();
        reportExportServiceProvider.verifyAll();
    });

    it('handles click on menu item', () => {
        let wasClicked = false;
        const onClick = () => {
            wasClicked = true;
        };
        props.onExportLinkClick = onClick;
        reportExportServiceProvider
            .setup(p => p.forKey('html'))
            .returns(key => makeReportExportServiceStub(key))
            .verifiable(Times.once());

        const rendered = shallow(<ExportDropdown {...props} />);
        rendered.find(PrimaryButton).simulate('click', event);
        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'html')
            .onClick();

        expect(wasClicked).toBeTruthy();
        reportExportServiceProvider.verifyAll();
    });

    it('should dismiss the contextMenu', () => {
        reportExportServiceProvider
            .setup(p => p.forKey('html'))
            .returns(key => makeReportExportServiceStub(key));

        const rendered = shallow(<ExportDropdown {...props} />);
        rendered.find(PrimaryButton).simulate('click', event);
        rendered.find(ContextualMenu).prop('onDismiss')();

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
