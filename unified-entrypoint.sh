# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.
#!/bin/bash

echo "Starting Xvfb"
Xvfb :99 -ac &
sleep 2

export DISPLAY=:99
Xvfb $DISPLAY -screen 0 1024x768x24

echo "Executing command $@"

exec "$@"
