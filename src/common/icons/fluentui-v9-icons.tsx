// Licensed under the MIT License.
import {
    makeStyles,
    mergeClasses,
    themeToTokensObject,
    tokens,
    webDarkTheme,
    webLightTheme,
} from '@fluentui/react-components';
import {
    ArrowExportRegular,
    FolderArrowRightRegular,
    FolderOpenRegular,
    SaveRegular,
    ArrowClockwiseRegular,
    Checkmark16Filled,
    ChevronDown20Regular,
    ChevronRight20Regular,
    InfoRegular,
    DocumentCopyRegular,
    BugFilled,
    MoreVerticalRegular,
    ChevronDown32Regular,
    ChevronRight32Regular,
    MoreHorizontalRegular,
} from '@fluentui/react-icons';
import { CopyIcon } from 'common/icons/copy-icon';
import { LadyBugSolidIcon } from 'common/icons/lady-bug-solid-icon';
import { NamedFC } from 'common/react/named-fc';

import React from 'react';

export const Icons = {
    ArrowExportRegular: ArrowExportRegular,
    FolderArrowRightRegular: FolderArrowRightRegular,
    FolderOpenRegular: FolderOpenRegular,
    SaveRegular: SaveRegular,
    ArrowClockwiseRegular: ArrowClockwiseRegular,
    Checkmark16Filled: Checkmark16Filled,
    ChevronDown20Regular: ChevronDown20Regular,
    ChevronRight20Regular: ChevronRight20Regular,
    info: InfoRegular,
    ladybugSolid: BugFilled,
    copy: DocumentCopyRegular,
    MoreVerticalRegular: MoreVerticalRegular,
    ChevronDown32Regular: ChevronDown32Regular,
    ChevronRight32Regular: ChevronRight32Regular,
    MoreHorizontalRegular: MoreHorizontalRegular,
};

export const IconsStyles = makeStyles({
    refreshIcon: {
        //color: tokens.colorCompoundBrandStrokeHover,
        paddingLeft: '14px',
    },
    IconTheme: {
        color: tokens.colorCompoundBrandStrokeHover,
        // ':hover': {
        //     color: 'inherit',
        // },
    },
});

export type FluentUIV9IconProps = {
    iconName: string | any;
    customClass?: string | any
};

export const FluentUIV9Icon = NamedFC<FluentUIV9IconProps>('FluentUIV9Icon', props => {
    const styleClasses = IconsStyles();
    const Icon = Icons[props?.iconName];
    return <Icon className={mergeClasses(props?.customClass)} />;
});
