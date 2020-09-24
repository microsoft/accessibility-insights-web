# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

# This is an extension point defined by the electron-builder/app-builder-lib NSIS template
!macro customInstallMode
  # This causes the installer to always install in the context of the current user, as opposed
  # to prompting whether to install for the current user vs the current machine.
  StrCpy $isForceCurrentInstall "1"
!macroend

# We use this to force the license page down to a height that fits within a 256px tall screen,
# to support users at 1280x1024/400% zoom
Function resizeLicenseWindow
  # Resizes the outer dialog (window frame + cancel/back/next button footer)
  System::Call 'user32::SetWindowPos(i$hwndparent,i,i,i,i 640,i 480,i 0x16)'

  # Finds the inner dialog (the license textbox)
  FindWindow $0 "#32770" "" $HWNDPARENT 

  # Resizes the inner dialog
  System::Call 'user32::MoveWindow(i$0,i0,i0,i 600,i 200,i0)'
FunctionEnd

# This is an extension point defined by the electron-builder/app-builder-lib NSIS template
# It runs before any nsDialogs setup begins
!macro customInit
  # This is an extension point defined by the standard NSIS MUI_LICENSEPAGE dialog which
  # runs after the license dialog is "created" and set up with controls, immediately before
  # the dialog is "shown"
  #
  # We are only safe to use it because app-builder-lib happens not to override it for our usage
  # (note, it *does* override it if we use a .html LICENSE file, so we can't do that!)
  !define MUI_PAGE_CUSTOMFUNCTION_SHOW resizeLicenseWindow
!macroend
