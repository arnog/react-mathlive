import { Mathfield, MathfieldElement } from 'mathlive';
import 'mathlive/dist/mathlive-fonts.css';
import 'mathlive/dist/mathlive.min';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';
import { MathViewProps } from './types';
import { filterConfig, useEventRegistration, useAddChild, useEventDispatchRef, useUpdateOptions } from './utils';

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
  useEventRegistration(_ref, props);
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
      {value}
    </math-field>
  );
});

export * from './types';
export default MathView;
