# Suncoast CS Club Website ![Bruh](https://github.com/Suncoast-Computer-Science/cs-club-official-site/actions/workflows/firebase-hosting-push.yml/badge.svg)

[Visit the site](https://competition-submission-app.firebaseapp.com/)

## About

The website provides a place to host local and interschool competitive programming competitions for highschoolers.

## Competitions

### Intraschool

The CS club has hosted informal competitive programming competitions at Suncoast before that didn't require as much planning. But, even grading submissions on such a small scale required a lot of effort. In the future, the CS club site will be used for these school competitions allowing us to grade submissions and handle users in a streamlined way.

### Interschool

The chief reason for the site is to handle interschool competitions between schools in Palm Beach School District (PBSD). There are some notable competitive programming competitions in Florida (like [UCF's HSPT](https://hspt.ucfprogrammingteam.org/)), but there are no major ones in PBSD. This competition would also be organized by highschool students, for highschool students. Hosting it earlier without a dedicated website was too logistically challenging. The website will allow us to run a large scale competition and continue in future years.

## Stack

### Frontend

- [React](https://reactjs.org/) frontend framework
- [React Bootstrap](https://react-bootstrap.github.io/) component library
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for in-browser code editing

### Backend

- [Firebase](https://firebase.google.com/)
  - Authentication
  - Database
  - Serverless functions
- [Judge0](https://judge0.com/)
  - Code execution from editor
  - Grading submissionss

## In the Future

### Expanding the site to use it for other club purposes:

- Other Local Competitions
- Programming Resources
- CS Tutoring
- Club Attendance

# Getting Started

Set up development environment to work on the website. These steps will work for any code editor or IDE, we use Visual Studio Code.

## Clone the project

Clone this Github repository into your local device by running

    git clone https://github.com/Suncoast-Computer-Science/cs-club-official-site.git

## Setup a Firebase project

To run Firebase with the project yourself, you will have to make your own firebase app. Go to
the [Firebase site](https://firebase.google.com/) and follow the instructions.

## Dependencies

### Required CLIs

First install Node

- [NodeJS](https://nodejs.org/en/)

Next install the rest of the CLIs by following the instructions linked or running the following commands.

- [Firebase](https://firebase.google.com/docs/cli) `npm install -g firebase-tools`
- [Prettier](https://prettier.io/docs/en/install.html) `npm install --save-dev --save-exact prettier`

### Install project dependencies

Inside your local copy of the project, navigate to `cs-club-official-site/` and run the command `npm install` to install the project dependencies. Next, navigate to `cs-club-official-site/functions` and run `npm install` again.
