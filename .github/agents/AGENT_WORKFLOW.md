# Agent Workflow Guide

This document describes the seamless handoff workflow between agents for test documentation creation.

## Workflow Overview

```
User Story (Gherkin)
        ↓
   [testplan_agent]
        ↓
    Test Plan (.txt)
        ↓
   [testplan2testsuite_agent]
        ↓
    Test Suite (.md)
        ↓
   [testsuite2testcase_agent]
        ↓
    Test Case CSV (.csv)
```

## Agent Chain

### 1. User Story → Test Plan
**Agent:** `testplan_agent` (userstory2testplan.agent.md)
- **Input:** User story with Gherkin scenarios from `docs/user-stories/`
- **Output:** Test plan in `docs/test-plans/`
- **Forward Handoff:** → `testplan2testsuite_agent` (auto-send enabled)
- **Purpose:** Analyzes requirements and creates test case structure

### 2. Test Plan → Test Suite
**Agent:** `testplan2testsuite_agent` (testplan2testsuite.agent.md)
- **Input:** Test plan + User story
- **Output:** Comprehensive test suite in `docs/test-suites/`
- **Forward Handoff:** → `testsuite2testcase_agent` (auto-send enabled)
- **Backward Handoff:** ← `testplan_agent` (manual trigger)
- **Purpose:** Creates detailed executable test cases with steps and expected results

### 3. Test Suite → Test Case CSV
**Agent:** `testsuite2testcase_agent` (testsuite2testcase.agent.md)
- **Input:** Test suite + Test plan + User story
- **Output:** Azure DevOps CSV in `docs/test-cases/`
- **Backward Handoffs:** 
  - ← `testplan2testsuite_agent` (manual trigger)
  - ← `testplan_agent` (manual trigger)
- **Purpose:** Converts test suite to Azure-compatible CSV format

## Handoff Configuration

### Forward Handoffs (Auto-send)
These handoffs automatically trigger the next agent with pre-filled context:

1. **testplan_agent → testplan2testsuite_agent**
   - Label: "test plan to test suite"
   - Pre-filled prompt: "Given the test plan and user story, create the corresponding test suite documentation."
   - Auto-send: ✅ Yes

2. **testplan2testsuite_agent → testsuite2testcase_agent**
   - Label: "test suite to test case CSV"
   - Pre-filled prompt: "Given the user story, test plan, and test suite, create the corresponding Azure DevOps CSV test case file."
   - Auto-send: ✅ Yes

### Backward Handoffs (Manual trigger)
These handoffs allow iterative refinement:

1. **testplan2testsuite_agent → testplan_agent**
   - Label: "back to test plan"
   - Pre-filled prompt: "Regenerate or modify the test plan based on the user story."
   - Auto-send: ❌ No (user chooses when to trigger)

2. **testsuite2testcase_agent → testplan2testsuite_agent**
   - Label: "back to test suite"
   - Pre-filled prompt: "Given the test plan and user story, regenerate or modify the test suite."
   - Auto-send: ❌ No

3. **testsuite2testcase_agent → testplan_agent**
   - Label: "back to test plan"
   - Pre-filled prompt: "Regenerate or modify the test plan based on the user story."
   - Auto-send: ❌ No

## Usage Instructions

### Starting the Workflow

1. **Invoke the first agent:**
   ```
   @testplan_agent Create a test plan for eNr_119219_workspace_devices_clear_steth.us.txt
   ```

2. **Agent creates test plan** and automatically offers handoff:
   - Handoff button appears: "test plan to test suite"
   - Click to proceed to next step

3. **Agent creates test suite** and automatically offers handoff:
   - Handoff button appears: "test suite to test case CSV"
   - Click to finalize the workflow

4. **Agent creates CSV** and offers backward navigation options:
   - "back to test suite" - if you need to modify the test suite
   - "back to test plan" - if you need to modify the test plan

### Context Preservation

Each handoff automatically includes:
- ✅ All previously generated artifacts (test plan, test suite, etc.)
- ✅ Original user story reference
- ✅ Pre-filled prompt with clear instruction
- ✅ Agent context from previous steps

You don't need to re-specify files or repeat context - the handoff system handles it!

### Iterative Refinement

If you need to make changes:
1. Use backward handoffs to go back to any step
2. Make modifications
3. Use forward handoffs to regenerate downstream artifacts
4. All context is preserved throughout

## Benefits

- **Seamless:** Auto-send eliminates manual prompt construction
- **Context-aware:** Each agent receives full context from previous steps
- **Bi-directional:** Can move forward or backward through the workflow
- **Error-recovery:** Easy to fix issues at any stage and regenerate
- **Efficient:** No need to manually copy file paths or repeat requirements

## File Structure

```
docs/
  ├── user-stories/          # Input: Gherkin scenarios
  ├── test-plans/            # Output from testplan_agent
  ├── test-suites/           # Output from testplan2testsuite_agent
  └── test-cases/            # Output from testsuite2testcase_agent
```

## Example Complete Workflow

```
User: @testplan_agent Create test plan for eNr_119219_workspace_devices_clear_steth.us.txt

Agent: [Creates test plan in docs/test-plans/]
       [Offers: "test plan to test suite" ✓]

User: [Clicks handoff button]

Agent: [Creates test suite in docs/test-suites/]
       [Offers: "test suite to test case CSV" ✓]

User: [Clicks handoff button]

Agent: [Creates CSV in docs/test-cases/]
       [Offers: "back to test suite", "back to test plan"]

Result: Complete set of artifacts ready for use!
```
