import { promises as fs } from "fs";
import path from "path";
import { Command } from "commander";
import ora from "ora";
import prompts from "prompts";
import chalk from "chalk";
import { getSignedKey } from "./lib/auth";

const REQUIRED_ENV_VARS = ["FARCASTER_DEVELOPER_MNEMONIC", "SIGNER_UUID"];

const init = new Command()
  .name("init")
  .description("Initialize your project and configure the signer")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async (opts) => {
    const cwd = path.resolve(opts.cwd);

    console.log(chalk.cyan("Welcome to the Farcaster Signer Setup!"));
    console.log("This script will help you configure your project.\n");

    // Check for existing .env file
    const envPath = path.join(cwd, ".env");
    let existingEnv: Record<string, string> = {};
    try {
      const envContent = await fs.readFile(envPath, "utf8");
      existingEnv = parseEnvFile(envContent);
    } catch (error) {
      // .env file doesn't exist, we'll create one
      console.log(chalk.yellow("No .env file found. Creating a new one."));
    }

    // Check if signer already exists
    if (existingEnv.SIGNER_UUID) {
      console.log(chalk.green("Signer already configured. Skipping setup."));
      return;
    }

    // Check for mnemonic
    let mnemonic = existingEnv.FARCASTER_DEVELOPER_MNEMONIC;
    if (!mnemonic) {
      const { value } = await prompts({
        type: "text",
        name: "value",
        message: "Enter your FARCASTER_DEVELOPER_MNEMONIC:",
      });
      mnemonic = value;
      existingEnv.FARCASTER_DEVELOPER_MNEMONIC = mnemonic;
    }

    // Write .env file with mnemonic
    await writeEnvFile(envPath, existingEnv);

    // Generate signer
    await generateSigner(cwd, envPath);

    console.log(chalk.green("\nSetup complete!"));
    console.log("You can now use the configured signer in your project.");
  });

async function promptForEnvVars(existingEnv: Record<string, string>) {
  const envVars: Record<string, string> = {};

  for (const varName of REQUIRED_ENV_VARS) {
    const { value } = await prompts({
      type: "text",
      name: "value",
      message: `Enter your ${varName}:`,
      initial: existingEnv[varName] || "",
    });

    envVars[varName] = value;
  }

  return envVars;
}

function parseEnvFile(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = content.split("\n");
  for (const line of lines) {
    const [key, value] = line.split("=");
    if (key && value) {
      result[key.trim()] = value.trim();
    }
  }
  return result;
}

async function writeEnvFile(filePath: string, envVars: Record<string, string>) {
  const content = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  await fs.writeFile(filePath, content, "utf8");
  console.log(chalk.green(".env file updated successfully."));
}

async function generateSigner(cwd: string, envPath: string) {
  const spinner = ora("Generating signer...").start();
  try {
    const signedKey = await getSignedKey();
    spinner.succeed("Signer generated successfully.");

    // Update .env with SIGNER_UUID
    const envContent = await fs.readFile(envPath, "utf8");
    const existingEnv = parseEnvFile(envContent);
    existingEnv.SIGNER_UUID = signedKey.signer_uuid;
    await writeEnvFile(envPath, existingEnv);

    console.log(chalk.green(".env file updated with SIGNER_UUID."));
  } catch (error) {
    spinner.fail("Failed to generate signer.");
    console.error(error);
  }
}

init.parse(process.argv);
