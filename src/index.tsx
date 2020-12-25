import { Mathfield, MathfieldElement } from 'mathlive';
import 'mathlive/dist/mathlive-fonts.css';
import 'mathlive/dist/mathlive.min';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';
import { MathViewProps } from './types';
import { filterConfig, useAddChild, useEventDispatchRef, useUpdateOptions } from './utils';

const MathView = React.forwardRef<MathfieldElement, MathViewProps>((props, ref) => {
  const _ref = useRef<MathfieldElement>(null);
  useImperativeHandle(ref, () => _ref.current!, [_ref]);

  const value = useMemo(() =>
    props.children ?
      renderToString(props.children as React.ReactElement)! :
      props.value || "",
    [props.children, props.value]
  );
  const [config, passProps] = useMemo(() => filterConfig(props), [props]);
  useUpdateOptions(_ref, config);
  useEffect(() => {
    _ref.current?.setValue(value);
  }, [value]);

  return (
    <math-field
      {...passProps}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      onChange={undefined}
      ref={_ref}
    >
    </math-field>
  );
});

/**
 * This Component uses <input> and {useEventDispatchRef} as a workaround for bubbling change events to react
 * Motivation: 'onChange' is a must have in react, it is the basics of state handling
 * It fires an event from {onContentDidChange}
 */
const MathViewWrapper = React.forwardRef<MathfieldElement, MathViewProps>((props, ref) => {
  const [_input, dispatchEvent] = useEventDispatchRef();
  const onContentDidChange = useCallback((sender: Mathfield) => {
    props.onContentDidChange && props.onContentDidChange(sender);
    dispatchEvent('change', { value: sender.getValue(), mathfield: sender });
  }, [props.onContentDidChange]);

  return (
    <React.Fragment>
      {ReactDOM.createPortal(<input hidden ref={_input} onChange={props.onChange as any} />, useAddChild('span'))}
      <MathView
        {...props}
        ref={ref}
        onContentDidChange={onContentDidChange}
      />
    </React.Fragment>
  );
})

export * from './types';
export default MathViewWrapper;
