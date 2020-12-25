import isEqual from 'lodash.isequal';
import { MathfieldConfig } from "mathlive";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { renderToString } from "react-dom/server";
import { MathViewProps, MathViewRef } from "./types";

export const OPTIONS: Array<keyof MathfieldConfig> = [
  "createHTML",
  "customVirtualKeyboardLayers",
  "customVirtualKeyboards",
  "defaultMode",
  "fontsDirectory",
  "horizontalSpacingScale",
  "ignoreSpacebarInMathMode",
  "inlineShortcutTimeout",
  "inlineShortcuts",
  "keybindings",
  "keypressSound",
  "keypressVibration",
  "letterShapeStyle",
  "locale",
  "macros",
  "namespace",
  "onBlur",
  "onCommit",
  "onContentDidChange",
  "onContentWillChange",
  "onError",
  "onFocus",
  "onKeystroke",
  "onModeChange",
  "onMoveOutOf",
  "onReadAloudStatus",
  "onSelectionDidChange",
  "onSelectionWillChange",
  "onTabOutOf",
  "onUndoStateDidChange",
  "onUndoStateWillChange",
  "onVirtualKeyboardToggle",
  "overrideDefaultInlineShortcuts",
  "plonkSound",
  "readAloudHook",
  "readOnly",
  "removeExtraneousParentheses",
  "scriptDepth",
  "smartFence",
  "smartMode",
  "smartSuperscript",
  "speakHook",
  "speechEngine",
  "speechEngineRate",
  "speechEngineVoice",
  "strings",
  "substituteTextArea",
  "textToSpeechMarkup",
  "textToSpeechRules",
  "textToSpeechRulesOptions",
  "virtualKeyboardLayout",
  "virtualKeyboardMode",
  "virtualKeyboardTheme",
  "virtualKeyboardToggleGlyph",
  "virtualKeyboards",
];

/**
 * mount/unmount are unhandled
 */
const FUNCTION_MAPPING = {
  /**retargeting onChange to fire input events to match react expected behavior */
  onChange: 'input',
  onInput: 'input',
  /**rename onFocus to prevent name collision */
  onMathFieldFocus: 'focus',
  /**rename onBlur to prevent name collision */
  onMathFieldBlur: 'blur',
  onCommit: 'change',
  //onContentDidChange,
  //onContentWillChange,
  onError: 'math-error',
  onKeystroke: 'keystroke',
  onModeChange: 'mode-change',
  onMoveOutOf: 'focus-out',
  onReadAloudStatus: 'read-aloud-status',
  //onSelectionDidChange: 'selection-did-change',
  onSelectionWillChange: 'selection-will-change',
  //onTabOutOf,
  onUndoStateDidChange: 'undo-state-did-change',
  onUndoStateWillChange: 'undo-state-will-change',
  onVirtualKeyboardToggle: 'virtual-keyboard-toggle',
};

const FUNCTION_PROPS = Object.keys(FUNCTION_MAPPING);

const MAPPING = {
  className: 'class',
  htmlFor: 'for',
};

export function filterConfig(props: MathViewProps) {
  const config: Partial<MathfieldConfig> = {};
  const passProps: MathViewProps = {};
  for (const _key in props) {
    const key = MAPPING[_key] || _key;
    let value = props[_key];
    if (FUNCTION_PROPS.indexOf(key) > -1) {
      //  handled by attaching event listeners
    } else if (OPTIONS.indexOf(key) > -1) {
      if (React.isValidElement(value) || (value instanceof Array && value.every(React.isValidElement))) {
        value = renderToString(value as React.ReactElement);
      }
      config[key] = value;
    } else {
      passProps[key] = value;
    }
  }
  return [config, passProps] as [typeof config, typeof passProps];
}

/**
 * Performance Optimization
 * ------------------------
 * This hook memoizes config in order to prevent unnecessary rendering/changes
 * The hook deemed the new config dep !== previous config dep, hence invoking `setOptions`.
 * This solution will update options only if they have changed is comparison to the previous values (not object containing them),
 *  avoiding uncessary rendering.
 * 
 * @param ref 
 * @param config 
 */
export function useUpdateOptions(ref: React.RefObject<MathViewRef>, config: Partial<MathfieldConfig>) {
  const configRef = useRef(config);
  useLayoutEffect(() => {
    if (!isEqual(configRef.current, config)) {
      ref.current?.setOptions(config);
      configRef.current = config;
    }
  }, [ref, config, configRef]);
  // set options after rendering for first rendering pass, by then the mathfield has mounted and is able to receive it, before it mounted nothing happens
  useEffect(() => {
    ref.current?.setOptions(config);
  }, []);
}

export function useEventRegistration(ref: React.RefObject<HTMLElement>, props: MathViewProps) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return
    const fns: { key: string, fn: (customEvent: any) => any }[] = Object.keys(props)
      .filter(key => typeof props[key] === 'function' && FUNCTION_PROPS.indexOf(MAPPING[key] || key) > -1)
      .map(key => {
        return {
          key: FUNCTION_MAPPING[MAPPING[key] || key],
          fn: (...args: any[]) => { props[key](...args) },
        }
      });

    fns.forEach(({ key, fn }) => {
      node.addEventListener(key, fn);
    });

    return () => {
      fns.forEach(({ key, fn }) =>
        node.removeEventListener(key, fn),
      );
    };
  }, [ref, props])
}