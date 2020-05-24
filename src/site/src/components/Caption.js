import React, { useCallback } from 'react'

export default ({ onChange, value, disabled }) => {
  const change = useCallback(
    e => {
      onChange(e.target.value)
    },
    [onChange]
  )
  return (
    <label htmlFor="title">
      Caption:
      <input
        disabled={disabled}
        onChange={change}
        value={value}
        name="title"
        type="text"
        style={{ width: '100%', fontSize: '200%' }}
      />
      <br />
    </label>
  )
}