import isEqual from 'lodash.isequal';
import { MathfieldConfig } from "mathlive";
import React, { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { renderToString } from "react-dom/server";
import { MathViewProps, MathViewRef } from "./types";

export const options: Array<keyof MathfieldConfig> = [
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

const MAPPING = {
  className: 'class',
  htmlFor: 'for',
  onMathFieldFocus: 'onFocus',
  onMathFieldBlur: 'onBlur'
};

export function filterConfig(props: MathViewProps) {
  const config: Partial<MathfieldConfig> = {};
  const passProps: MathViewProps = {};
  for (const _key in props) {
    const key = MAPPING[_key] || _key;
    let value = props[_key];
    if (options.indexOf(key) > -1) {
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
 * This hook is used to prevent the loss of caret position upon rendering (setting options causes what seems to be a full reset of Mathfield).
 * When an update was passed to the component the effect deemed the new config dep !== previous config dep, hence invoking `setOptions` and losing caret.
 * This solution will update options only if they have changed is comparison to the previous values (not object containing them), avoiding uncessary rendering.
 * 
 * !! The issue of losing caret when using `setOptions` consists. !!
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
}

/**
 * @deprecated Events don't fire for some reason. Probably becasue mathfield resides in a shadow node.
 * https://github.com/facebook/react/issues/7901
 * @param node 
 * @param props 
 */
export function handleEventRegistration(node: HTMLElement, props: MathViewProps) {
  const fns: { key: string, fn: (customEvent: any) => any }[] = Object.keys(props)
    .filter(key => typeof props[key] === 'function' && key.startsWith('on'))
    .map(key => ({
      key: MAPPING[key] || key,
      fn: (...args: any[]) => { props[key](...args) },
    }));

  fns.forEach(({ key, fn }) => {
    node.addEventListener(key, fn);
  });

  return () => {
    fns.forEach(({ key, fn }) =>
      node.removeEventListener(key, fn),
    );
  };
}

/**
 * This hook enables change events to propagate to react
 * https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js#46012210
 * https://github.com/facebook/react/issues/11488
 * https://stackoverflow.com/a/62111884/9068029
 */
export function useEventDispatchRef() {
  const ref = useRef<HTMLInputElement>(null);
  const dispatchEvent = useCallback((type: string, detail: { value: string, [key: string]: any }) => {
    const handler = ref.current;
    if (!handler) return;
    const valueSetter = Object.getOwnPropertyDescriptor(handler, 'value')!.set!;
    const prototype = Object.getPrototypeOf(handler);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')!.set!;
    if (valueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(handler, detail.value);
    } else {
      valueSetter.call(handler, detail.value);
    }
    handler.dispatchEvent(new CustomEvent(type, { bubbles: true, cancelable: true, detail }));
  }, [ref]);

  return [ref, dispatchEvent] as [typeof ref, typeof dispatchEvent];
}

export function useAddChild(tagName: keyof HTMLElementTagNameMap) {
  const container = useMemo(() => document.createElement(tagName), []);
  useLayoutEffect(() => {
    document.body.appendChild(container);
    return () => { document.body.removeChild(container) };
  }, [container]);
  return container;
}