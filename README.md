# react-math-view | react-mathlive

> React bindings for [MathLive](https://github.com/arnog/mathlive)

[![NPM](https://img.shields.io/npm/v/react-math-view.svg)](https://www.npmjs.com/package/react-math-view) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-math-view
yarn add react-math-view
```

## Usage

```tsx
import { useRef } from 'react';
import MathView, { MathViewRef } from 'react-math-view';

const ref = useRef<MathViewRef>(null);
const toggleKeyboard = useCallback(() => ref.current?.executeCommand('toggleVirtualKeyboard'), [ref]);
const getSpokenValue = useCallback(() => ref.current?.getValue('spoken'), [ref]);
<MathView
 value="x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}"
 ref={ref}
  />
```

## Example
Check out the [live example](https://shaman123.github.io/react-math-view/).

## Looking for React-Native?
Check out [react-native-math-view](https://github.com/ShaMan123/react-native-math-view#readme).

## Dev
### Before you begin make sure to install dependecies
```bash
npm i /* or */ yarn --production=false
```

### Available commands
```bash
// start dev servers for /src and /example
npm run dev

// publish to npm
npm run publish

// deploy gh-pages (example app)
npm run deploy
```

## License

MIT © [ShaMan123](https://github.com/ShaMan123)
