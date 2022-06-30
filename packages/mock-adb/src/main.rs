// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
use regex::Regex;
use serde_derive::{Deserialize, Serialize};
use std::{env, fs, process, thread};
use std::collections::HashMap;
use std::error::Error;
use std::io::Write;
use std::path::PathBuf;
use std::time::Duration;

#[derive(Serialize, Deserialize, Clone)]
#[allow(non_snake_case)] // for consistency with JS api
struct CommandResult {
    stdout: Option<String>,
    stderr: Option<String>,
    exitCode: Option<i32>,
    delayMs: Option<u64>,

    input: Option<Vec<String>>,
    inputCommand: Option<String>,
    regexTarget: Option<String>,
}

type CommandConfig = HashMap<String, CommandResult>;

fn result_from_command<'a>(config: &CommandConfig, input_command: &str) -> Result<CommandResult, Box<dyn Error>> {
    // First option: exact match
    if let Some(result) = config.get(input_command) {
        return Ok(result.clone());
    }

    // Second option: regex match
    for (_, result) in config {
        if let Some(regex_target) = &result.regexTarget {
            let re = Regex::new(&regex_target)?;
            if re.is_match(input_command) {
                return Ok(result.clone());
            }
        }
    }

    // default result (error)
    Ok(CommandResult {
        exitCode: Some(1),
        stderr: Some(format!("unrecognized command: {}", input_command)),
        stdout: None,
        delayMs: None,
        input: None,
        inputCommand: None,
        regexTarget: None,
    })
}

fn main() -> Result<(), Box<dyn Error>> {
    let current_exe = env::current_exe()?;
    let current_exe_dir = current_exe.parent().unwrap();
    let default_config_path = current_exe_dir.join("mock_adb_config.json");

    let config_path = match env::var("MOCK_ADB_CONFIG") {
        Ok(val) => PathBuf::from(val),
        Err(_) => default_config_path,
    };

    let config_raw = fs::read_to_string(config_path.as_path())
        .expect("Unable to read config file");
    let config: CommandConfig = serde_json::from_str(&config_raw)
        .expect("Unable to parse config file");

    // latestAdbContext.txt is a file which contains a relative file path
    let current_adb_context_path = current_exe_dir.join("latestAdbContext.txt");
    let current_adb_context = PathBuf::from(fs::read_to_string(current_adb_context_path)
        .expect("Unable to read ADB context file"));
    
    let output_logs_dir = current_exe_dir.join("logs").join(current_adb_context);
    fs::create_dir_all(output_logs_dir.as_path())
        .expect("Unable to create output logs dir");

    let adb_log_path = output_logs_dir.join("adb.log");
    let output_path = output_logs_dir.join("mock_adb_output.json");
    
    let args: Vec<String> = env::args().collect();
    let ignored_prefix_args = match args[1].as_str() {
        "-P" => 3, // mock-adb.exe -P <port> <command>
        _ => 1, // mock-adb.exe <command>
    };

    let input_command = &args[ignored_prefix_args..].join(" ");
    let mut result = result_from_command(&config, input_command)?;

    if let Some(delay_ms) = result.delayMs {
        thread::sleep(Duration::from_millis(delay_ms));
    }

    if let Some(stderr) = &result.stderr {
        eprintln!("{}", stderr);
    }

    if let Some(stdout) = &result.stdout {
        println!("{}", stdout);
    }
    
    result.input = Some(args);
    result.inputCommand = Some(input_command.to_string());

    let mut adb_log_file = fs::OpenOptions::new()
        .write(true)
        .append(true)
        .create(true)
        .open(adb_log_path)
        .expect("unable to open adb_log_file");
    writeln!(adb_log_file, "ADB {}", input_command)?;

    let result_raw = serde_json::to_string_pretty(&result)?;
    let mut output_file = fs::OpenOptions::new()
        .write(true)
        .append(true)
        .create(true)
        .open(output_path)
        .expect("unable to open output_file");
    writeln!(output_file, "{}", result_raw)?;

    let output_config_path = output_logs_dir.join("mock_adb_config.json");
    fs::copy(config_path.as_path(), output_config_path)?;

    if let Some(exit_code) = result.exitCode {
        process::exit(exit_code);
    }

    Ok(())
}
