const fs = require("fs");
const path = require("path");

// Configuration
const DOCS_DIR = path.join(__dirname, "..", "docs");
const USER_STORIES_DIR = path.join(DOCS_DIR, "user-stories");
const TEST_PLANS_DIR = path.join(DOCS_DIR, "test-plans");
const TEST_SUITES_DIR = path.join(DOCS_DIR, "test-suites");
const TEST_CASES_DIR = path.join(DOCS_DIR, "test-cases");

// Check if review mode is enabled
const REVIEW_MODE = process.argv.includes("--review");

/**
 * Get the base name from a user story filename
 * Example: EN2_Login.us.txt -> EN2_Login
 */
function getBaseName(filename) {
  return filename.replace(".us.txt", "");
}

/**
 * Check if artifacts exist for a user story
 */
function checkArtifacts(baseName) {
  const testPlanPath = path.join(TEST_PLANS_DIR, `${baseName}_TestPlan.txt`);
  const testSuitePath = path.join(TEST_SUITES_DIR, `${baseName}_TestSuite.md`);
  const testCasesPath = path.join(TEST_CASES_DIR, `${baseName}_TestCases.csv`);

  return {
    baseName,
    userStoryPath: path.join(USER_STORIES_DIR, `${baseName}.us.txt`),
    testPlan: {
      path: testPlanPath,
      exists: fs.existsSync(testPlanPath),
    },
    testSuite: {
      path: testSuitePath,
      exists: fs.existsSync(testSuitePath),
    },
    testCases: {
      path: testCasesPath,
      exists: fs.existsSync(testCasesPath),
    },
  };
}

/**
 * Scan for user stories and determine what needs to be generated
 */
function scanUserStories() {
  console.log("🔍 Scanning for user stories...\n");

  if (!fs.existsSync(USER_STORIES_DIR)) {
    console.error(
      `❌ Error: User stories directory not found: ${USER_STORIES_DIR}`
    );
    process.exit(1);
  }

  const files = fs.readdirSync(USER_STORIES_DIR);
  const userStoryFiles = files.filter((f) => f.endsWith(".us.txt"));

  if (userStoryFiles.length === 0) {
    console.log("ℹ️  No user story files (*.us.txt) found.");
    return [];
  }

  console.log(`Found ${userStoryFiles.length} user story file(s):\n`);

  const toProcess = [];

  userStoryFiles.forEach((file) => {
    const baseName = getBaseName(file);
    const artifacts = checkArtifacts(baseName);

    // Determine what needs to be generated
    const needsProcessing =
      !artifacts.testPlan.exists ||
      !artifacts.testSuite.exists ||
      !artifacts.testCases.exists;

    if (needsProcessing) {
      toProcess.push(artifacts);
      console.log(`📄 ${file}`);
      console.log(
        `   Test Plan:  ${
          artifacts.testPlan.exists ? "✅ exists" : "❌ missing"
        }`
      );
      console.log(
        `   Test Suite: ${
          artifacts.testSuite.exists ? "✅ exists" : "❌ missing"
        }`
      );
      console.log(
        `   Test Cases: ${
          artifacts.testCases.exists ? "✅ exists" : "❌ missing"
        }`
      );
      console.log("");
    } else {
      console.log(`✅ ${file} - All artifacts exist, skipping`);
      console.log("");
    }
  });

  return toProcess;
}

/**
 * Generate Copilot chat commands for a user story
 */
function generateCommands(artifacts) {
  const commands = [];
  const { baseName, userStoryPath, testPlan, testSuite, testCases } = artifacts;

  // Step 1: Generate Test Plan (if needed)
  if (!testPlan.exists) {
    commands.push({
      step: 1,
      title: "Generate Test Plan",
      agent: "@testplan_agent",
      prompt: `Please analyze the user story in \`${userStoryPath}\` and create a comprehensive test plan following the format shown in \`docs/templates/testplan_example.txt\`. Save the output as \`${testPlan.path}\`.`,
      outputFile: testPlan.path,
      waitMessage: "⏳ Waiting for test plan generation...",
    });
  }

  // Step 2: Generate Test Suite (if needed)
  if (!testSuite.exists) {
    commands.push({
      step: testPlan.exists ? 1 : 2,
      title: "Generate Test Suite",
      agent: "@testplan2testsuite_agent",
      prompt: `Please analyze the user story in \`${userStoryPath}\` and the test plan in \`${testPlan.path}\`, then create a comprehensive test suite following the format shown in \`docs/templates/testsuite_example.md\`. Save the output as \`${testSuite.path}\`.`,
      outputFile: testSuite.path,
      waitMessage: "⏳ Waiting for test suite generation...",
      dependencies: !testPlan.exists ? [testPlan.path] : [],
    });
  }

  // Step 3: Generate Test Cases (if needed)
  if (!testCases.exists) {
    commands.push({
      step:
        !testPlan.exists && !testSuite.exists
          ? 3
          : !testPlan.exists || !testSuite.exists
          ? 2
          : 1,
      title: "Generate Test Cases",
      agent: "@testsuite2testcase_agent",
      prompt: `Please analyze the user story in \`${userStoryPath}\`, the test plan in \`${testPlan.path}\`, and the test suite in \`${testSuite.path}\`, then create Azure-formatted test cases following the format shown in \`docs/templates/testcase_example.csv\`. Save the output as \`${testCases.path}\`.`,
      outputFile: testCases.path,
      waitMessage: "⏳ Waiting for test cases generation...",
      dependencies: [
        ...(!testPlan.exists ? [testPlan.path] : []),
        ...(!testSuite.exists ? [testSuite.path] : []),
      ],
    });
  }

  return commands;
}

/**
 * Print instructions for user
 */
function printInstructions(toProcess) {
  if (toProcess.length === 0) {
    console.log(
      "✅ All user stories have complete artifacts. Nothing to generate!\n"
    );
    return;
  }

  console.log("\n" + "=".repeat(80));
  console.log("📋 GENERATION WORKFLOW");
  console.log("=".repeat(80) + "\n");

  if (REVIEW_MODE) {
    console.log(
      "🔍 REVIEW MODE - Pause between steps for verification\n"
    );
  } else {
    console.log("📝 GUIDED MODE - Follow the steps in sequence\n");
  }

  toProcess.forEach((artifacts, index) => {
    console.log(`\n${"─".repeat(80)}`);
    console.log(
      `📦 User Story ${index + 1}/${toProcess.length}: ${artifacts.baseName}`
    );
    console.log("─".repeat(80) + "\n");

    const commands = generateCommands(artifacts);

    commands.forEach((cmd, cmdIndex) => {
      console.log(
        `\n${REVIEW_MODE ? "┌" : ""}${"─".repeat(78)}${REVIEW_MODE ? "┐" : ""}`
      );
      console.log(`│ STEP ${cmd.step}: ${cmd.title}`);
      console.log(
        `${REVIEW_MODE ? "├" : ""}${"─".repeat(78)}${REVIEW_MODE ? "┤" : ""}`
      );
      console.log(`│`);
      console.log(`│ 1️⃣  Copy the command below:`);
      console.log(`│`);
      console.log(`│     ${cmd.agent} ${cmd.prompt}`);
      console.log(`│`);
      console.log(`│ 2️⃣  Paste it into GitHub Copilot Chat in VS Code`);
      console.log(`│`);
      console.log(
        `│ 3️⃣  Wait for the agent to generate: ${path.basename(cmd.outputFile)}`
      );
      console.log(`│`);

      if (REVIEW_MODE && cmdIndex < commands.length - 1) {
        console.log(`│ 4️⃣  Review the output, then proceed to the next step`);
      } else if (!REVIEW_MODE && cmdIndex < commands.length - 1) {
        console.log(
          `│ 4️⃣  Once complete, proceed immediately to the next step`
        );
      } else {
        console.log(`│ 4️⃣  Verify the final output meets your requirements`);
      }

      console.log(`│`);
      console.log(
        `${REVIEW_MODE ? "└" : ""}${"─".repeat(78)}${REVIEW_MODE ? "┘" : ""}\n`
      );

      if (REVIEW_MODE && cmdIndex < commands.length - 1) {
        console.log(
          `   ⏸️  PAUSE - Review ${path.basename(
            cmd.outputFile
          )} before continuing\n`
        );
      }
    });
  });

  console.log("\n" + "=".repeat(80));
  console.log(
    "🚀 Ready to start! Copy the commands above and paste into Copilot Chat."
  );
  console.log("=".repeat(80) + "\n");
}

/**
 * Main execution
 */
function main() {
  console.log(
    "\n╔═══════════════════════════════════════════════════════════════════════════╗"
  );
  console.log(
    "║                    TEST CASE GENERATION WORKFLOW                          ║"
  );
  console.log(
    "╚═══════════════════════════════════════════════════════════════════════════╝\n"
  );

  if (REVIEW_MODE) {
    console.log("ℹ️  Running in REVIEW MODE (--review flag detected)\n");
  } else {
    console.log("ℹ️  Running in GUIDED MODE\n");
    console.log(
      "💡 Tip: Use --review flag to pause between steps for verification\n"
    );
  }

  const toProcess = scanUserStories();
  printInstructions(toProcess);
}

// Run the script
main();
