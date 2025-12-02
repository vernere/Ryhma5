# Personal notation tool

## Overview
Notely is a notation tool developed for technical students, software engineers. Offering features like : real-time collaboration, tagging and categorozation, in editor code pasting .

The project is implemented in React using Bun and supports localization using i18n in English, Vietnamese, Kurdish, Finnish, Swedish, Ukrainian and Hindi.
## Features
- Manage notes
- Manage users
- Collaborate with other users in different notes
- Search for notes by title or tag
- Favorite notes
- Tag notes 
- Export to pdf/import
- Media embed
- Code embed

## Technology stack
- React
- Tailwind
- Vite
- Supabase
- Bun
- ESLint
- Cypress
- Docker
- Instanbul
- Babel
- Mailslurp
- css.gg
- Tiptap
- docx
- file-saver
- clsx
- html-to-text
- html2pdf
- turndown
- v8-to-istanbul
- i18n
- SonarQube
- SonarScanner
- SonarQube cloud
- Prop-types

## Use case diagram

![use case diagram](/resources/Use_case_diagram.png)


## DB Schema
![supabase er diagram](/resources/Er_diagram.png)
![er diagram](/resources/Er_diagram_converted.png)
![er graph converted to realtional diagram](/resources/supabase_er.jpg)

## Plugins

### Bun

## Setup

## Localization

This project implements localization through **i18n** with JSON translation files. User language prefrences are stored as a ENUM type in the database, while UI strings are maintained in the JSON files.

See [Localization plan and report](/Documents/Localization_plan.md) for complete documentation.

## Project structure
- /App: Contains the main application code.
- /App/frontend: Contains the configuration files.
- /App/frontend/cypress/e2e: Contains the frontend e2e testing code.
- /App/schema.sql: DB schema.
- .github/ci.yaml: GitHub actions pipeline.
- /App/frontend/.env: contains environment variables for application.
- /App/frontend/coverage: contains coverage code reports and data
- /App/frontend/dockerfile: Docker
- /App/frontend/eslint.config.js: ESLint config
- /App/frontend/sonar-project.properties: SonarQube config


## GitHub actions
GitHub actions pipeline automatically runs :
- Unit tests
- Cypress e2e tests
- Generates code coverage reports for both
- Merges code coverage reports
- Runs analysis with SonarQube
- Uploads analysis report and code coverage report to SonarQube Cloud

## Tests
The project includes e2e tests for the frontend layer To run the tests, use the following command:
   ```sh
      bun cypress:e2e
```
Unit tests:
   ```sh
      bun test
```
Code coverage:
   ```sh
      bun coverage:full
```
- /App/frontend/coverage/merged/index.html for visual report

## Running the Application with Docker
**Running Docker locally**

**Set the environment variables:**

- Create a .env file in the frontend directory of the project.

Add the following code to the .env file:
```sh
   VITE_SUPABASE_URL={your_supabase_url}
   VITE_SUPABASE_PUBLISHABLE_KEY={your_supabase_key}
```

**Build Docker Image:**
   
   ```sh
      docker build -t ryhma5:latest .
   ```
**Check docker image:**
   
   ```sh
      docker images
   ```

**Run docker image**

   ```sh
      docker run -p 5173:5173 --env-file .env ryhma5:latest
   ```

**Docker Hub**
   
   ```sh
      docker pull vernere/ryhma5:latest
   ```

## Data persistance

## Database setup

## Code Quality & Static Analysis

### ESLint plugin (VS Code, Microsoft)

The project uses ESLint extension in VS Code to maintain coding standards

See [ESLint extension documentation](https://github.com/Microsoft/vscode-eslint) for complete documentation.

## SonarQube Code Analysis

The project uses SonarQube for code analysis for security, reliability and maintainability.

Current Quality Gate Rating:

- Security: A
- Reliability: B
- Maintainability: A

This project uses SonarQube Server locally, for instructions see [SonarQube server documentation](https://docs.sonarsource.com/sonarqube-server) and SonarQube cloud for CI/CD pipeline, see [SonarQube cloud documentation](https://docs.sonarsource.com/sonarqube-cloud)

## Non Functional Testing

### User Acceptance Testing (UAT)
Acceptance testing was carried out based on the project requirements and user stories in the product backlog. Testing verifies that the system meets functional, performance and usability requirements. The full acceptance testing plan documentation is found in the documents folder. 

Plan:
-	Based on the project requirements and user stories
-	Validates functional, usability and performance criteria
  
Execution
-	Performed during Sprint 7 (19.11-3.12.2025)
  
Results
-	Will be reported later

### Heuristic Evaluation
During Sprint 7, a Heuristic Evaluation of Notely was done. For the detailed evaluation see [Heuristic Evaluation](/Documents/Team5_Heuristic_Evaluation.pdf).

Summary of Heuristic Evaluation:

1. Strengths
Language and layout is simple and readable

2. Issues
Collaborative features do not give nessceserary feedback, components dont contrast enough, components are missing labels, missing feedback from errors and components

Suggested Improvements:

Iterate on collaborative features feedback, change component colors darker/lighter, add labels for confusing components, add more feedback to errors and components.

