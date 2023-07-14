# Getting Started with MathLive and React

This sample demonstrates how to use MathLive with React.

## Theory of Operations

A MathLive mathfield behaves as a regular DOM element:
- define mathfields using the `<math-field>` tag in JSX
- use the `useRef()` hook to get a reference to the corresponding DOM element
- use the `useEffect(..., [])` hook to customize the mathfield on mount

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


## Learn More

You can learn more in the [MathLive documentation](https://cortexjs.io/mathlive/guides/react/).

