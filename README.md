# Proximus Enjoy Boilerplate

- [git repository](https://gitlab.com/hilarious/proximus/enjoy-boilerplate)

## Maintainers

- [Robin](mailto:robin@hilarious.be)
- [Jérôme](mailto:freeze@hilarious.be)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (>= 18.16.1) (preferably installed via [NVM](https://github.com/nvm-sh/nvm))
- [NPM](https://www.npmjs.com/) (>= 9.5.1) (included with Node.js)

### Built With

- [Webpack](https://webpack.js.org/) - Module bundler (for css and js)
- [Eleventy](https://www.11ty.dev/) - Static site generator (for html)

### NPM Scripts

#### Installing

```zsh
npm install
```

#### Running

```zsh
npm start
```

#### Building

```zsh
npm run build
```

---

## Project

### Folder structure

This uncommon folder structure is used to match the one used in the .NET solution and is as follows:

```
.
├── dist - Output folder.
├── src - Source folder.
│   ├── Content - Assets folder, basically everything except JavaScript.
│   │   ├── css - CSS folder.
│   │   │   ├── _static - Static CSS files, copied as is.
│   │   │   ├── abstracts - Sass that dont output any CSS, like variables, mixins, functions...
│   │   │   ├── components - Sass components.
│   │   │   ├── globals - Default unscoped styling.
│   │   │   ├── pages - Styling scoped to pages.
│   │   │   ├── vendor - Third party styles (will be bundled in the same file).
│   │   ├── img - Images folder inner structure is free.
│   │   │   ├── proximus - Proximus images used in every project.
│   │   ├── webfonts - Webfonts files when not imported from Google Fonts.
│   ├── data - Data folder, used by Eleventy (mostly unused in games).
│   ├── includes - Eleventy includes folder (see HTML section below).
│   ├── layouts - Eleventy layouts folder (see HTML section below).
│   ├── Scripts - JavaScript folder. All js files located here are entry points for webpack compilation.
│   │   ├── _static - Static JS files, copied as is.
│   │   ├── modules - Standalone JS modules.
│   │   ├── three-engine - Three.js engine. Only available when in `feature/threejs` git branch.
│   │   ├── utils - JS utilities (see list of most important utils below).
```

### HTML

HTML is built by [Eleventy](https://www.11ty.dev/). It uses the [Nunjucks](https://mozilla.github.io/nunjucks/) templating language.

All html files at the root of the `src` folder will be used as entry points. Layouts located in `src/layouts` reflect the layout system used in the .NET solution. Modules (i.e. header, footer...) are located in the `src/includes` folder.

Even though files extension is `.html`, they are parsed as `.njk` files.

### CSS

CSS is built by [Webpack](https://webpack.js.org/). It uses the [Sass](https://sass-lang.com/) preprocessor.

There are 2 entry points: index.scss and app.scss. The first one is the bundle of all styles, the second one is a specific stylesheet loaded only when displaying a page in the Proximus app's webview.

### JS

JS is built by [Webpack](https://webpack.js.org/). It uses the [Babel](https://babeljs.io/) transpiler.

All js files at the root of the `src/Scripts` folder will be used as entry points. `index.js` and `game.js` are for those 2 specific pages. `app.js` is used only to build the `app.css` separately from the main styles bundle.

Below is a non exhaustive list of utils classes & methods.

#### Public packages

- [GSAP](https://greensock.com/gsap/) - Animation library. Used in all games.

#### Internal packages

- [@hilarious-be/controls-manager](https://github.com/hilarious-be/controls-manager) - Keyboard and pointer events controller. Easily bind functions to keys and pointer events via a mapping object.
- [@hilarious-be/event-manager](https://github.com/hilarious-be/event-manager) - Event manager allowing scoped custom events.
- [@hilarious-be/joystick](https://github.com/hilarious-be/joystick) - Virtual joystick.
- [@hilarious-be/particle-emitter](https://github.com/hilarious-be/particle-emitter) - Framework agnostic particle emitter.
- [@hilarious-be/timer](https://github.com/hilarious-be/timer) - Multi-purpose timer.

#### Utils classes

- [WeightedRandom](src/Scripts/utils/_random.js) - Weighted random generator. Useful to generate random values with a specific probability.

#### Utils methods

- [dispatchCustomEvent](src/Scripts/utils/_events.js) - Dispatch a custom event.
- [listenCustomEvent](src/Scripts/utils/_events.js) - Sets a listener to a custom event.
- [respondTo](src/Scripts/utils/_mediaQueries.js) - Returns a boolean indicating if the current viewport matches the given media query.
- [setBreakpointListener](src/Scripts/utils/_mediaQueries.js) - Sets a listener to a media query triggering a callback when the breakpoint is reached.
- [shuffleArray](src/Scripts/utils/_random.js) - Shuffles an array.
- [debounce](src/Scripts/utils/_helpers.js) - DEPRECATED - Use Lodash's debounces functions.
- [debounceLeading](src/Scripts/utils/_helpers.js) - DEPRECATED - Use Lodash's debounces functions.
- [onWindowVisibilityChange](src/Scripts/utils/_helpers.js) - Sets a listener to the window visibility change event. Useful to pause animations or render loops when the window is not visible.
- [loopNumber](src/Scripts/utils/_helpers.js) - Loops a number between a min and a max value.
