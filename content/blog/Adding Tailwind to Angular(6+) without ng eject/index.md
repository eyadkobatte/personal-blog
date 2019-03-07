---
title: Adding Tailwind to Angular(6+) without ng eject
date: '2019-03-07T10:20:32.169Z'
---

Tailwind CSS is a CSS Framework developed by Adam Wathan, Jonathan Reinink, David Hemphill, and Steve Schoger. Official documentation suggests using ng eject, but it does not work for Angular 6+

The official documentation does not have installation process without using ng eject. Angular 6+ does not support ng eject. This guide will show you how to install tailwindcss in Angular without using ng eject.

We can install tailwind css in angular using an npm package called ng-tailwindcss. This generates the config file and makes the setup super easy.

1. Install ng-tailwindcss globally
   `npm install ng-tailwindcss -g`

This will install ng-tailwindcss globally in your system. You only need to do this once. The commands of ng-tailwindcss can be accessed with `ngtw command`

2. Save original tailwindcss in developer dependencies in npm
   `npm install tailwindcss -D`

Install tailwindcss in your developer dependencies in your angular project. It is only needed in developer dependencies because during build time, the css gets compiled.

3. Initialize tailwindcss in your project
   `./node_modules/.bin/tailwind init`

This will initialise tailwind be creating a config file by the name of `tailwind.js` in the root of the project

4. Create a new file `src/tailwind.css` and add these three lines to it

```css
@tailwind preflight;
@tailwind components;
@tailwind utilities;
```

This injects all of tailwinds preflight and utilities into your global style file.

5. Run this command
   `ngtw configure --config <path-to-tailwind.js> --source <path-to-tailwind.css> --output <path-to-global-styles>`
   This creates a file called `ng-tailwind.js` in root of your project. This is where we use the npm package we previously installed. It creates a file called `ng-tailwind.js` in the root of the project using the following options. This step is optional and `ng-tailwind.js` file can be created manually and filled with the following details.

```js
module.exports = {
  configJS: './tailwind.js', // This is the js file created by tailwind when it was initialised
  sourceCSS: './src/tailwind.css', // This is the css file we created
  outputCSS: './src/styles.scss', // This is the global style file
  sass: true, // False if using css
  purge: false,
  keyframes: false,
  fontFace: false,
  rejected: false,
  whitelist: [],
  whitelistPatterns: [],
  whitelistPatternsChildren: []
};
```

I changed the absolute paths in my windows laptop to relative paths because the `/` could cause problems.

6. Add these scripts to package.json

```json
"prestart": "ngtw build",
"start": "ng serve & ngtw watch",
"build": "ngtw build && ng build"
```

To start development server, we have to use `npm start` and not `ng serve` otherwise the css files wont build if there is any change in tailwind configuration.

Thats it. All the setup is done. We can now use tailwindcss in our Angular project.