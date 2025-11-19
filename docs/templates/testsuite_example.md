# eNOW Login Feature Test Suite

## Introduction

This test suite covers the functionality of the "Login" feature for the eNOW system based on the user stories and requirements. It includes detailed test steps, test data, and expected results for each scenario identified in the login user story.

## Test Environment Requirements

- Access to eNOW test environment
- Valid registered user accounts in the system
- Unregistered but valid email addresses for testing
- Modern web browsers (Chrome, Firefox, Safari, Edge)
- Access to language settings to verify translations

## Test Suite Structure

### Test Case Format

- **Test ID**: Unique identifier for the test case
- **Test Title**: Brief description of what's being tested
- **Prerequisites**: Conditions that must be met before test execution
- **Test Steps**: Numbered steps to execute the test
- **Expected Results**: What should happen after each step
- **Test Data**: Specific data to use during testing
- **Pass/Fail Criteria**: How to determine if the test passes or fails
## Test Cases

| Functional Area                      | Test ID     | Test Title                          | Priority | Prerequisites                                                    | Test Steps                                                                                                                                                                                                                                   | Expected Results                                                                                                                                                                                                                              | Test Data                                                                                                                                                           | Pass/Fail Criteria                                                                                                 |
|--------------------------------------|-------------|-------------------------------------|----------|------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| **Login Screen Display & Elements**  | TC-LOG-001  | 1.1 Verify Login Screen Display     | High     | User has access to eNOW link                                     | 1. Click on the link to eNOW                                                                                                                                                                                                                | 1. "Login" screen is displayed                                                                                                                                                                                                               | eNOW application link                                                                                                                                    | Test passes if the Login screen is displayed after clicking the eNOW link                                          |
|                                      | TC-LOG-002  | 1.2 Verify Login Screen Elements    | High     | User has clicked on eNOW link; Login screen is displayed         | 1. Observe the right half of the screen<br>2. Observe the top left corner of the screen<br>3. Observe the screen label<br>4. Observe the text entry box label<br>5. Observe the text entry box default content<br>6. Observe the "Next" button | 1. Right half of screen displays a configurable image<br>2. Top left corner contains a language dropdown<br>3. Screen displays "Login" label<br>4. Text entry box is labeled "Email"<br>5. Text entry box contains default text "Enter email"<br>6. "Next" button is present with configurable color and is enabled by default | N/A                                                                                                                                                                 | Test passes if all screen elements are present and match requirements                                               |
| **Language Dropdown Functionality**  | TC-LOG-003  | 2.1 Verify Language Dropdown Display| Medium   | User has navigated to the Login screen                           | 1. Click on the language dropdown                                                                                                                                                                                                           | 1. List of available languages is displayed<br>2. List includes English and Spanish options                                                                                                           | N/A                                                                                                                                                                 | Test passes if dropdown displays and includes both English and Spanish options                                     |
|                                      | TC-LOG-004  | 2.2 Verify English Language Selection| Medium  | User has navigated to the Login screen; Language dropdown is open| 1. Select "English" from language dropdown                                                                                                                                                            | 1. English is set as application language<br>2. All text on Login page appears in English<br>3. Language dropdown list disappears after selection                                                     | Language = "English"                                                                                                                                               | Test passes if language is set to English, text appears in English, and dropdown closes                            |
|                                      | TC-LOG-005  | 2.3 Verify Spanish Language Selection| Medium  | User has navigated to the Login screen; Language dropdown is open| 1. Select "Spanish" from language dropdown                                                                                                                                                            | 1. Spanish is set as application language<br>2. All text on Login page appears in Spanish<br>3. Language dropdown list disappears after selection                                                     | Language = "Spanish"                                                                                                                                               | Test passes if language is set to Spanish, text appears in Spanish, and dropdown closes                            |
| **Email Validation**                 | TC-LOG-006  | 3.1 Verify Empty Email Field Validation| High   | User has navigated to the Login screen                           | 1. Leave email field empty<br>2. Click the "Next" button                                                                                                                                              | 1. Error message "Enter an email" is displayed                                                                                                                                                        | Email = "" (empty)                                                                                                                                                 | Test passes if the appropriate error message is displayed                                                          |
|                                      | TC-LOG-007  | 3.2 Verify Invalid Email Format Validation| High| User has navigated to the Login screen                           | 1. Begin typing in the email field with an invalid format<br>2. Observe validation message                                                                                                            | 1. Message "Please enter a valid email address" is displayed<br>2. Message continues to display until a valid email is entered                                                                         | Email formats to test:<br>- "test"<br>- "test@"<br>- "test@domain"<br>- "@domain.com"                                                                     | Test passes if validation message appears and persists while email format is invalid                               |
|                                      | TC-LOG-008  | 3.3 Verify Valid Email Format Acceptance| High | User has navigated to the Login screen                           | 1. Enter valid email format in the email field<br>2. Observe validation message behavior                                                                       | 1. System accepts the email as valid<br>2. Validation message disappears                                                                                       | Valid email formats:<br>- "user@domain.com"<br>- "user.name@domain.com"<br>- "user-name@domain.com"<br>- "user123@domain.com"<br>- "user.name-123@domain.co.uk" | Test passes if validation message disappears when valid email format is entered                                    |
| **Email Registration Verification**  | TC-LOG-009  | 4.1 Verify Unregistered Email Handling| High   | User has navigated to the Login screen; User has entered a valid but unregistered email address | 1. Enter valid but unregistered email address<br>2. Click the "Next" button                                                                                   | 1. System validates the email against registered accounts<br>2. Message "Couldn't find an account for the email address provided." is displayed                 | Email = "unregistered@domain.com" (valid format but not registered in system)                                                                             | Test passes if system shows appropriate message for unregistered email                                             |
|                                      | TC-LOG-010  | 4.2 Verify Registered Email Handling| High    | User has navigated to the Login screen; User has entered a valid and registered email address | 1. Enter valid and registered email address<br>2. Click the "Next" button                                                                                     | 1. System validates the email against registered accounts<br>2. Password entry mechanism is presented                                                            | Email = "registered@domain.com" (valid format and registered in system)                                                                                   | Test passes if system progresses to password entry mechanism for registered email                                 |

## Traceability Matrix

| Requirement ID | Test Case ID           |
| -------------- | ---------------------- |
| 1.1            | TC-LOG-001             |
| 1.2            | TC-LOG-002             |
| 2.1, 2.2       | TC-LOG-003             |
| 3.1, 3.2, 3.3  | TC-LOG-004, TC-LOG-005 |
| 4.1            | TC-LOG-006             |
| 5.1, 5.2       | TC-LOG-007             |
| 6.1, 6.2       | TC-LOG-008             |
| 7.1            | TC-LOG-009, TC-LOG-010 |
| 8.1            | TC-LOG-009             |
| 9.1            | TC-LOG-010             |

## Test Execution Checklist

- [ ] Test environment is configured and accessible
- [ ] Test data is prepared (registered and unregistered emails)
- [ ] All browsers to be tested are installed and updated
- [ ] Test team has access to the eNOW application link
- [ ] Test language settings are available for validation

## Defect Reporting Guidelines

1. Capture screenshots of any defects
2. Record exact steps to reproduce
3. Note the browser and version used
4. Document any error messages displayed
5. Specify the test data used when the defect occurred
6. Assign severity based on impact
