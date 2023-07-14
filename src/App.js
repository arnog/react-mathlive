import './App.css'
import '//unpkg.com/mathlive'
import { useState, useRef, useEffect } from 'react'

// Use &#123; and &#125; to escape { and } in JSX

function App() {
  const [value, setValue] = useState('\\sqrt{x}')

  // Customize the mathfield when it is mounted
  const mf = useRef()
  useEffect(() => {
    // Read more about customizing the mathfield: https://cortexjs.io/mathlive/guides/customizing/
    mf.current.smartFence = true

    // This could be an `onInput` handler, but this is an alternative
    mf.current.addEventListener('input', (evt) => {
      // When the return key is pressed, play a sound
      if (evt.inputType === 'insertLineBreak') {
        // The mathfield is available as `evt.target`
        // The mathfield can be controlled with `executeCommand`
        // Read more: https://cortexjs.io/mathlive/guides/commands/
        evt.target.executeCommand('plonk')
      }
    })
  }, [])

  // Update the mathfield when the value changes
  useEffect(() => {
    mf.current.value = value
  }, [value])

  return (
    <div className='App'>
      <h1>MathLive with React</h1>
      <math-field ref={mf} onInput={(evt) => setValue(evt.target.value)}>
        {value}
      </math-field>
      <code>Value: {value}</code>
    </div>
  )
}

export default App
