// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
using System.Text.RegularExpressions;

internal class CommandResult {
    public string? stdout { get; set; }
    public string? stderr { get; set; }
    public int? exitCode { get; set; }
    public int? delayMs { get; set; }

    public string[]? input { get; set; }
    public string? inputCommand { get; set; }
    public string? regexTarget { get; set; }

    public static CommandResult FromCommand(Dictionary<string, CommandResult> config, string inputCommand) {
        // First option: exact match
        if (config.ContainsKey(inputCommand)) {
            return config[inputCommand];
        }

        // Second option: regex match
        foreach (CommandResult result in config.Values) {
            if (result.regexTarget != null) {
                var resultRegex = new Regex(result.regexTarget);
                if (resultRegex.IsMatch(inputCommand)) {
                    return result;
                }
            }
        }

        // default result (error)
        return new CommandResult {
            exitCode = 1,
            stderr = $"unrecognized command: {inputCommand}",
        };
    }
}
