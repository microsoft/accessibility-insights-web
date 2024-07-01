// Licensed under the MIT License.
import { makeStyles, themeToTokensObject, tokens, webLightTheme } from '@fluentui/react-components';
import {
    ArrowExportRegular,
    FolderArrowRightRegular,
    FolderOpenRegular,
    SaveRegular,
    ArrowClockwiseRegular,
    Checkmark16Filled,
    ChevronDownRegular,
    ChevronRight20Regular,
    InfoRegular, CopyRegular, BugRegular
} from '@fluentui/react-icons';
import { CopyIcon } from 'common/icons/copy-icon';
import { LadyBugSolidIcon } from 'common/icons/lady-bug-solid-icon';

import React from 'react';

export const Icons = {
    ArrowExportRegular: <ArrowExportRegular color={themeToTokensObject(webLightTheme).colorCompoundBrandStrokeHover} />,
    FolderArrowRightRegular: <FolderArrowRightRegular color={themeToTokensObject(webLightTheme).colorCompoundBrandStrokeHover} />,
    FolderOpenRegular: <FolderOpenRegular color={themeToTokensObject(webLightTheme).colorCompoundBrandStrokeHover} />,
    SaveRegular: <SaveRegular color={themeToTokensObject(webLightTheme).colorCompoundBrandStrokeHover} />,
    ArrowClockwiseRegular: <ArrowClockwiseRegular color={themeToTokensObject(webLightTheme).colorCompoundBrandStrokeHover} />,
    Checkmark16Filled: <Checkmark16Filled />,
    ChevronDownRegular: <ChevronDownRegular />,
    ChevronRightRegular: <ChevronRight20Regular />,
    info: <InfoRegular color={themeToTokensObject(webLightTheme).colorCompoundBrandStrokeHover} />,
    ladybugSolid: <BugRegular filled color={themeToTokensObject(webLightTheme).colorCompoundBrandStrokeHover} />,
    copy: <CopyRegular filled color={themeToTokensObject(webLightTheme).colorCompoundBrandStrokeHover} />
};


export const IconsStyles = makeStyles({
    refreshIcon: {
        color: tokens.colorCompoundBrandStrokeHover,
        paddingLeft: '14px'
    }
});
