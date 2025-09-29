# Personal notation tool

## Overview
Notely is a notation tool developed for technical students, software engineers. Offering features like : real-time collaboration, tagging and categorozation, in editor code pasting .

The project is implemented in React using Bun and supports localization in English, TBA, and TBA.
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
- Cypress
- Docker
- Instanbul
- Babel
- Mailslurp
- css.gg
- Tiptap
- docx
- file-saver

## Use case diagram

## DB Schema
![alt text](/resources/image.png)
## Plugins

### Bun

## Setup

## Project structure
- /App: Contains the main application code.
- /App/frontend: Contains the configuration files.
- /App/frontend/cypress/e2e: Contains the frontend e2e testing code.
- /App/frontend/coverage: contains coverage code reports and data
- /App/schema.sql: DB schema
- /App/frontennd/dockerfile: Docker

## GitHub actions

## Tests
The project includes e2e tests for the frontend layer To run the tests, use the following command:
   ```sh
      bun cypress:e2e
```
Cypress code coverage:
   ```sh
      bun cypress:coverage
```
- /App/frontend/coverage/lcov-report/index.html for visual report

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
   

## Data persistance

## Database setup

## Evaluation

