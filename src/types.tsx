import { MathfieldConfig, MathfieldElement } from "mathlive";
import { PropsWithChildren } from "react";

type ExcludeKey<K, KeyToExclude> = K extends KeyToExclude ? never : K;
type ExcludeField<A, KeyToExclude extends keyof A> = { [K in ExcludeKey<keyof A, KeyToExclude>]: A[K] };

export declare type MathFieldChangeEvent = CustomEvent<{ value: string, mathfield: MathfieldElement }>;
export declare type MathChangeEvent = React.SyntheticEvent<HTMLInputElement, MathFieldChangeEvent>;

export declare type MathViewProps = PropsWithChildren<
  Partial<ExcludeField<React.HTMLAttributes<MathfieldElement>, 'onChange'> &
    ExcludeField<MathfieldConfig, 'virtualKeyboardToggleGlyph' | 'onFocus' | 'onBlur'> &
  {
    /**LaTeX to render, optionally can be passed as child */
    value: string,
    /**Doesn't seem to work */
    virtualKeyboardToggleGlyph: JSX.Element,
    onFocus: React.HTMLAttributes<MathfieldElement>['onFocus'],
    onBlur: React.HTMLAttributes<MathfieldElement>['onBlur'],
    onMathFieldFocus: MathfieldConfig['onFocus'],
    onMathFieldBlur: MathfieldConfig['onBlur'],
    onChange: React.EventHandler<React.SyntheticEvent<HTMLInputElement, MathFieldChangeEvent>>
  }>
>;

export declare type MathViewRef = MathfieldElement;

declare global {
  /** @internal */
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement>
    }
  }
}
