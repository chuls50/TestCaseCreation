# Test Case Generation Workflow

This workflow automates the generation of test plans, test suites, and test cases from user stories using GitHub Copilot agents.

## Prerequisites

1. VS Code with GitHub Copilot enabled
2. Custom agents configured in `.github/agents/`
3. User stories in `docs/user-stories/` with `.us.txt` extension

## Quick Start

### 1. Add Your User Story

Place your user story file in `docs/user-stories/` with the naming convention:
```
<FeatureName>.us.txt
```

Example: `EN2_Login.us.txt`

### 2. Run the Generation Script

**Full Automation Mode** (recommended for first run):
```bash
npm run generate-testcases
```

**Review Mode** (step-by-step verification):
```bash
npm run generate-testcases:review
```

### 3. Follow the Instructions

The script will:
- ✅ Detect new user stories that need processing
- ✅ Generate copy-paste commands for each step
- ✅ Show you exactly which Copilot agent to use
- ✅ Guide you through the entire workflow

### 4. Execute Commands in Copilot Chat

1. Copy the command from the terminal
2. Open GitHub Copilot Chat in VS Code (Ctrl+Alt+I or Cmd+Alt+I)
3. Paste the command and press Enter
4. Wait for the agent to generate the file
5. Move to the next command

## Workflow Overview

The workflow consists of three sequential steps:

```
User Story (*.us.txt)
    ↓
    ├─→ @testplan_agent
    ↓
Test Plan (*_TestPlan.txt)
    ↓
    ├─→ @testplan2testsuite_agent
    ↓
Test Suite (*_TestSuite.md)
    ↓
    ├─→ @testsuite2testcase_agent
    ↓
Test Cases (*_TestCases.csv)
```

## File Naming Convention

For a user story `FeatureName.us.txt`, the workflow generates:

- `FeatureName_TestPlan.txt` in `docs/test-plans/`
- `FeatureName_TestSuite.md` in `docs/test-suites/`
- `FeatureName_TestCases.csv` in `docs/test-cases/`

## Agents Used

### 1. @testplan_agent (userstory2testplan.agent.md)
- **Input**: User story with Gherkin scenarios
- **Output**: Test plan with Requirements Analysis and Detailed Test Cases tables
- **Format**: `.txt` file

### 2. @testplan2testsuite_agent (testplan2testsuite.agent.md)
- **Input**: User story + Test plan
- **Output**: Comprehensive test suite with detailed test case table
- **Format**: `.md` file

### 3. @testsuite2testcase_agent (testsuite2testcase.agent.md)
- **Input**: User story + Test plan + Test suite
- **Output**: Azure DevOps-compatible CSV with test cases
- **Format**: `.csv` file

## Modes

### Full Automation Mode (Default)

Run all steps sequentially without pausing:
```bash
npm run generate-testcases
```

Best for:
- Initial generation of test artifacts
- Trusted workflows
- Bulk processing

### Review Mode

Pause between steps for manual verification:
```bash
npm run generate-testcases:review
```

Best for:
- Quality assurance
- Critical features
- Learning the workflow
- Troubleshooting issues

## Example: Processing EN2_Login.us.txt

1. **Run the script:**
   ```bash
   npm run generate-testcases
   ```

2. **Script output shows:**
   ```
   Found 1 user story file(s):
   
   📄 EN2_Login.us.txt
      Test Plan:  ❌ missing
      Test Suite: ❌ missing
      Test Cases: ❌ missing
   ```

3. **Copy and execute commands sequentially:**
   
   **Step 1 - Generate Test Plan:**
   ```
   @testplan_agent Please analyze the user story in `docs/user-stories/EN2_Login.us.txt` and create a comprehensive test plan following the format shown in `docs/templates/testplan_example.txt`. Save the output as `docs/test-plans/EN2_Login_TestPlan.txt`.
   ```
   
   **Step 2 - Generate Test Suite:**
   ```
   @testplan2testsuite_agent Please analyze the user story in `docs/user-stories/EN2_Login.us.txt` and the test plan in `docs/test-plans/EN2_Login_TestPlan.txt`, then create a comprehensive test suite following the format shown in `docs/templates/testsuite_example.md`. Save the output as `docs/test-suites/EN2_Login_TestSuite.md`.
   ```
   
   **Step 3 - Generate Test Cases:**
   ```
   @testsuite2testcase_agent Please analyze the user story in `docs/user-stories/EN2_Login.us.txt`, the test plan in `docs/test-plans/EN2_Login_TestPlan.txt`, and the test suite in `docs/test-suites/EN2_Login_TestSuite.md`, then create Azure-formatted test cases following the format shown in `docs/templates/testcase_example.csv`. Save the output as `docs/test-cases/EN2_Login_TestCases.csv`.
   ```

## Troubleshooting

### Agent produces incorrect output

1. **Retry with the same command** - The agent will reference the example files
2. **Use review mode** to catch issues early
3. **Manually edit** the generated file if needed
4. **Re-run the script** - It will skip completed artifacts and only generate missing ones

### Script doesn't detect new user stories

- Ensure filename ends with `.us.txt`
- Check file is in `docs/user-stories/` directory
- Verify the file is not empty

### Already generated artifacts

The script automatically skips user stories that already have all three artifacts. To regenerate:

1. Delete the artifact(s) you want to regenerate
2. Run the script again

Example: To regenerate only test cases:
```bash
rm docs/test-cases/EN2_Login_TestCases.csv
npm run generate-testcases
```

## Tips

- ✅ Keep the terminal window open while executing commands
- ✅ Execute commands in the order shown
- ✅ Wait for each agent to complete before moving to the next step
- ✅ Review the final CSV file to ensure it meets Azure import requirements
- ✅ The agents automatically reference the example files for formatting guidance
- ✅ Use review mode when working with critical features

## Next Steps

After generating test cases:

1. **Manual Testing**: Execute the test cases manually to validate functionality
2. **Review & Refine**: Adjust test cases as needed based on testing results
3. **Azure Import**: Upload the CSV file to Azure DevOps
4. **Automation**: Use Playwright agent modes to record automated tests (future workflow)

## Advanced: Batch Processing

To process multiple user stories:

1. Add all `.us.txt` files to `docs/user-stories/`
2. Run `npm run generate-testcases`
3. The script processes them sequentially
4. Follow the generated commands for each user story

## Support

For issues or questions:
- Review the agent configuration files in `.github/agents/`
- Check the example files in `docs/templates/`
- Ensure GitHub Copilot is properly configured in VS Code
