// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IButton, IRefObject } from '@fluentui/react';
import { themeToTokensObject, webDarkTheme, webLightTheme } from '@fluentui/react-components';
import { ArrowExportRegular } from '@fluentui/react-icons';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { ThemeContext } from 'common/components/theme';
import { FluentUIV9Icon } from 'common/icons/fluentui-v9-icons';
import { NamedFC } from 'common/react/named-fc';
import { CommandButtonStyle } from 'DetailsView/components/command-button-styles';
import * as React from 'react';

export interface ReportExportButtonProps {
    showReportExportDialog: () => void;
    //buttonRef?: IRefObject<IButton>;
    buttonRef?: React.RefObject<HTMLInputElement>
}

export const reportExportButtonAutomationId = 'report-export-button';

export const ReportExportButton = NamedFC<ReportExportButtonProps>('ReportExportButton', props => {
    const exportButtonStyles = CommandButtonStyle();
    const value = React.useContext(ThemeContext);
    console.log('export button props-->', props)

    return (
        <InsightsCommandButton
            insightsCommandButtonIconProps={{
                // icon: <ArrowExportRegular
                // //className={value === false ? exportButtonStyles.arrowIconLight : exportButtonStyles.arrowIconDark}
                // //    color={value === false ? themeToTokensObject(webLightTheme)?.colorCompoundBrandStrokeHover : themeToTokensObject(webDarkTheme).colorCompoundBrandStrokeHover} />
                // />
                icon: <FluentUIV9Icon iconName="ArrowExportRegular"
                //customClass={exportButtonStyles.assessmentButton}
                />
            }}
            onClick={props.showReportExportDialog}
            ref={props.buttonRef}
            data-automation-id={reportExportButtonAutomationId}
            className={exportButtonStyles.assessmentButton}
        >
            Export result
        </InsightsCommandButton>
    );
});
