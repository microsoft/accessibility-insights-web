// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
using System.Reflection;
using System.Text.Json;

using CommandConfig = System.Collections.Generic.Dictionary<string, CommandResult>;

string currentExe = Assembly.GetExecutingAssembly().Location;
string currentExeDir = Path.GetDirectoryName(currentExe) ?? throw new Exception("currentExe should not be a root directory");

string defaultConfigPath = Path.Join(currentExeDir, "mock_adb_config.json");
string configPath = Environment.GetEnvironmentVariable("MOCK_ADB_CONFIG") ?? defaultConfigPath;

if (!File.Exists(configPath))
{
    Console.Error.WriteLine($"Could not find mock-adb config file at \"{configPath}\"");
    Console.Error.WriteLine("You can create one with \"yarn mock-adb\"");
    Environment.Exit(1);
}

string configRaw = File.ReadAllText(configPath);
CommandConfig config = JsonSerializer.Deserialize<CommandConfig>(configRaw) ?? throw new Exception($"failed to parse config file {configPath} as JSON object");

// latestAdbContext.txt is a file which contains a relative file path
string currentAdbContextPath = Path.Join(currentExeDir, "latestAdbContext.txt");
string currentAdbContext = File.ReadAllText(currentAdbContextPath);

string outputLogsDir = Path.Join(currentExeDir, "logs", currentAdbContext);
Directory.CreateDirectory(outputLogsDir);

string adbLogPath = Path.Join(outputLogsDir, "adb.log");
string outputPath = Path.Join(outputLogsDir, "mock_adb_output.json");

int numIgnoredPrefixArgs = 0;
if (args.Length > 0 && args[0].Equals("-P")) {
    numIgnoredPrefixArgs = 2; // "mock-adb.exe -P <port> <command>" ignores the "-P <port>"
}

string inputCommand = String.Join(" ", args.Skip(numIgnoredPrefixArgs));
CommandResult result = CommandResult.FromCommand(config, inputCommand);

if (result.delayMs != null) {
    Thread.Sleep((int)result.delayMs);
}

if (result.stderr != null) {
    Console.Error.WriteLine(result.stderr);
}

if (result.stdout != null) {
    Console.WriteLine(result.stdout);
}

result.input = args;
result.inputCommand = inputCommand;

string resultRaw = JsonSerializer.Serialize(result);

using (StreamWriter adbLogFile = File.AppendText(adbLogPath)) {
    adbLogFile.WriteLine($"ADB {inputCommand}");
}

using (StreamWriter outputFile = File.CreateText(outputPath)) {
    outputFile.WriteLine(resultRaw);
}

string outputConfigPath = Path.Join(outputLogsDir, "mock_adb_config.json");
File.Copy(configPath, outputConfigPath, true);

Environment.Exit(result.exitCode ?? 0);
