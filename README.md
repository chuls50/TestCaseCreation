# Test Case Creation Automation

A guided workflow project that streamlines the creation of comprehensive test documentation from user stories. Using GitHub Copilot agents, this tool helps you generate test plans, test suites, and Azure DevOps-compatible test cases through an interactive, copy-paste workflow.

> **⚠️ Important:** This project is focused exclusively on **test case creation and documentation generation**. It does not execute automated tests or run Playwright browser automation. This is a documentation generation tool, not a test execution tool.

## 🎯 Purpose

This project automates the traditionally manual and time-consuming process of creating test documentation. Starting with a user story written in Gherkin format, the system generates:

1. **Test Plans** - Requirements analysis and detailed test case mappings
2. **Test Suites** - Comprehensive test scenarios with steps and expected results
3. **Test Cases** - Azure DevOps-compatible CSV files ready for import

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- VS Code with GitHub Copilot enabled
- GitHub Copilot subscription with agent support

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/chuls50/TestCaseCreation.git
   cd TestCaseCreation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize Playwright agents (first time only):
   ```bash
   npx playwright init-agents --loop=vscode
   ```

### Usage

1. **Add your user story** to `docs/user-stories/` with the naming convention:
   ```
   <FeatureName>.us.txt
   ```
   Example: `EN2_Login.us.txt`

2. **Run the generation script:**
   ```bash
   npm run generate-testcases
   ```

3. **Follow the instructions** - The script will provide copy-paste commands for GitHub Copilot Chat

4. **Execute commands** in Copilot Chat (Ctrl+Alt+I or Cmd+Alt+I) one at a time

That's it! Your test documentation will be generated automatically.

## 📋 Workflow Overview

The automation workflow consists of three sequential steps, each handled by a specialized GitHub Copilot agent:

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

### Agents

1. **@testplan_agent** - Converts user stories into structured test plans
2. **@testplan2testsuite_agent** - Creates detailed test suites with comprehensive test cases
3. **@testsuite2testcase_agent** - Generates Azure DevOps CSV import files

## 📁 Project Structure

```
TestCaseCreation/
├── .github/
│   └── agents/                      # GitHub Copilot agent configurations
│       ├── userstory2testplan.agent.md
│       ├── testplan2testsuite.agent.md
│       └── testsuite2testcase.agent.md
├── docs/
│   ├── templates/                   # Example formats for generated files
│   │   ├── testplan_example.txt
│   │   ├── testsuite_example.md
│   │   └── testcase_example.csv
│   ├── user-stories/                # Input: User stories (*.us.txt)
│   ├── test-plans/                  # Output: Test plans (*_TestPlan.txt)
│   ├── test-suites/                 # Output: Test suites (*_TestSuite.md)
│   └── test-cases/                  # Output: Test cases (*_TestCases.csv)
├── scripts/
│   └── generate-testcases.js        # Automation script
├── tests/                           # Playwright test files (future use)
├── package.json
├── playwright.config.js
└── README.md
```

## 🎮 Modes

### Guided Mode (Default)

Generates all commands in sequence for you to copy and paste:

```bash
npm run generate-testcases
```

**Best for:**
- Standard workflow
- Processing single or multiple user stories
- Quick command generation

### Review Mode

Same as Guided Mode, but with clear pause indicators between steps:

```bash
npm run generate-testcases:review
```

**Best for:**
- Quality assurance
- Critical features
- Learning the workflow
- When you want to review each artifact before proceeding

## 📝 File Naming Convention

For a user story named `FeatureName.us.txt`, the workflow generates:

| Artifact | Location | Filename |
|----------|----------|----------|
| Test Plan | `docs/test-plans/` | `FeatureName_TestPlan.txt` |
| Test Suite | `docs/test-suites/` | `FeatureName_TestSuite.md` |
| Test Cases | `docs/test-cases/` | `FeatureName_TestCases.csv` |

## 💡 Example

### Input: User Story

Create a file `docs/user-stories/EN2_Login.us.txt`:

```gherkin
Scenario 1: Login to eNOW
GIVEN that a user has been registered to use eNOW
WHEN they click on the link to eNOW
THEN they will be presented with the "Login" screen with the following contents:
- Right half of the screen presents a configurable image
- Top left provides a language dropdown with all available languages
- Screen label: "Login"
- Text entry box labeled "Email" with default content "Enter email"
- "Next" button with configurable color and enabled by default
```

### Run the Script

```bash
npm run generate-testcases
```

### Output

The script generates three files:
1. `docs/test-plans/EN2_Login_TestPlan.txt`
2. `docs/test-suites/EN2_Login_TestSuite.md`
3. `docs/test-cases/EN2_Login_TestCases.csv`

The CSV file can be imported directly into Azure DevOps!

## 🔧 Troubleshooting

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

## ✨ Tips

- ✅ Keep the terminal window open while executing commands
- ✅ Execute commands in the order shown
- ✅ Wait for each agent to complete before moving to the next step
- ✅ Review the final CSV file to ensure it meets Azure import requirements
- ✅ The agents automatically reference the example files for formatting guidance
- ✅ Use review mode when working with critical features

## 🎯 Use Cases

### Batch Processing

Process multiple user stories at once:

1. Add all `.us.txt` files to `docs/user-stories/`
2. Run `npm run generate-testcases`
3. The script processes them sequentially
4. Follow the generated commands for each user story

### Selective Regeneration

Regenerate specific artifacts by deleting them:

```bash
# Regenerate test suite and test cases only
rm docs/test-suites/EN2_Login_TestSuite.md
rm docs/test-cases/EN2_Login_TestCases.csv
npm run generate-testcases
```

### Integration with Azure DevOps

1. Generate test cases using this tool
2. Open Azure DevOps Test Plans
3. Import the generated CSV file
4. Test cases are automatically created with all steps and expected results

## 🛠️ Technology Stack

- **Playwright** - Test automation framework
- **Node.js** - Runtime environment
- **GitHub Copilot** - AI-powered code generation
- **Custom Copilot Agents** - Specialized AI agents for test documentation

## 📚 Next Steps

After generating test cases:

1. **Manual Testing** - Execute the test cases manually to validate functionality
2. **Review & Refine** - Adjust test cases as needed based on testing results
3. **Azure Import** - Upload the CSV file to Azure DevOps
4. **Automation** - Use Playwright to automate test execution (future enhancement)

## 🤝 Contributing

This project is designed for internal team use. If you have suggestions or improvements:

1. Create a feature branch
2. Make your changes
3. Submit a pull request with a clear description

## 📄 License

ISC

## 📧 Support

For questions or issues:
- Review the agent configuration files in `.github/agents/`
- Check the example files in `docs/templates/`
- Ensure GitHub Copilot is properly configured in VS Code
- Contact the repository owner

## 🎉 Examples Included

The repository includes complete examples:
- `docs/user-stories/EN2_Login.us.txt` - Sample user story
- `docs/test-plans/EN2_Login_TestPlan.txt` - Generated test plan
- `docs/test-suites/EN2_Login_TestSuite.md` - Generated test suite
- `docs/test-cases/EN2_Login_TestCases.csv` - Generated test cases

Use these as references for creating your own user stories!

---

**Made with ❤️ using GitHub Copilot and Playwright**
