# Contributing

We'd love to have you as a contributor to this project.

This document contains the guidelines and directions to get started with our
development process.

## Table of Contents

 - [Before contributing](#before-contributing)
 - [Set up](#set-up)
 - [Preview changes](#preview-changes)
 - [Submit changes](#submit-changes)
 - [Coding conventions](#coding-conventions)


## Before contributing

- **Major changes (e.g. bug fixes, new features)**:  
  You should have a discussion about it first:
  - Check for existing issues/feature requests or open a new one.
  - Make sure someone else isn't already working on it.
- **Minor changes (e.g. typos, other small mistakes)**:  
  You can go ahead without needing any discussion.


## Set up

After forking and cloning the repo `cd` in the repo directory and install the
necessary npm dependencies:

```sh
npm install
```

## Preview changes

Start the preview server:

```sh
npm run dev
```

Next, open the URL displayed in the terminal. In most cases, a new browser tab
should automatically open for you.

You can modify the existing previews (i.e. **stories**) or create new ones for the
specific features that you're working on.

You can find the stories inside the `stories/node/` directory.

---

> [!NOTE]
> If you make changes to `src/browser-component.jsx` file, previewing those
> changes requires a different command. This file provides the browser API that
> allows Topspin to be used directly in the browser like a library. So it
> requires some different build parameters.
> 
> Start the preview server with this command:
> ```sh
> npm run dev:browser
> ```
> 
> The stories for browser API are inside the `stories/browser/` directory.

---


## Submit changes

Open a Pull Request to submit your changes.

Some guidelines:

 - Commit messages should be in present tense.
 - Try to adhere to the coding conventions as [listed below](#coding-conventions).


## Coding conventions

 - **Quotes**:
   ```jsx
   // Prefer single quotes
   let x = 'value';
   let y = {'a': 1};

   // Use double quotes if a string has a single quote (apostrophe)
   let x = "What's up?"

   // Use double quotes for HTML/JSX attributes
   <Button type="button" />
   ```
 - **Global constants**: Upper snake case.
   - DO: `MY_GLOBAL_CONSTANT`
   - DON'T: `myGlobalConstant`
 - **File names**: Lower kebab case.
   - DO: `my-file-name.js`
   - DON'T: `myFileName.js`
 - **File extension**:
   - `.jsx` if a JS file has JSX code.
   - `.js` if a JS file doesn't have any JSX code.
 - **CSS**: Try to follow BEM guidelines for naming CSS classes.
