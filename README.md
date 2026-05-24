# ReadMe-Generator
=======================

## Table of Contents
1. [Overview](#overview)
2. [Environment Variables](#environment-variables)
3. [Setup](#setup)
4. [Features](#features)
5. [Usage](#usage)
6. [License](#license)

## Overview
The ReadMe-Generator is a full-stack application that automatically generates professional README files for repositories.

## Environment Variables
To configure the application, set the following environment variables:
* `GITHUB_CLIENT_ID`
* `GITHUB_CLIENT_SECRET`
* `SERVER_PORT`

## Setup
To get started:
1. Clone the repository: `git clone https://github.com/astrophileAqsa123/ReadMe-Generator.git`
2. Install dependencies: `npm install`
3. Start the application: `npm run dev` (frontend) and `node index.js` (server)

## Features
* Automatic project type detection
* Framework and library detection from files
* Automatic setup steps detection
* Professional Markdown generation
* Relevant section inclusion only
* No generic filler text

## Usage
1. Clone and install dependencies.
2. Set environment variables.
3. Start both applications.
4. Log in with GitHub credentials.
5. Select a repository to generate a README.

## License
The ReadMe-Generator is licensed under the MIT License. See the LICENSE file for details.