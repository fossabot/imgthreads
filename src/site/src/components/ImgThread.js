import React, { useRef, memo, useState, useEffect } from 'react'
import { useListVals } from 'react-firebase-hooks/database'
import firebase from 'firebase/app'
import { getOwnerCode } from '../helpers/identity'
import { databaseURL, databasePath } from '../config'
import BlockList from './BlockList'
import 'firebase/database'

firebase.initializeApp({
  databaseURL,
})

export default memo(
  ({ id, browserId, sendingId, onLoad, onUpload, isUploading }) => {
    const timeout = useRef(null)
    const [ownerCode, setOwnerCode] = useState(false)
    const [message, setMessage] = useState('Loading...')
    const [values, loading] = useListVals(
      firebase
        .database()
        .ref(`/${databasePath}/${id}`)
        .orderByChild('timestamp')
    )

    useEffect(() => {
      if (loading) return

      if (values.length) {
        clearTimeout(timeout.current)
        setOwnerCode(getOwnerCode(values[0].id))
      } else {
        setMessage('Wait for it...')
        timeout.current = setTimeout(() => {
          setMessage('Mmm...')
          timeout.current = setTimeout(() => {
            window.location.replace('/')
          }, 9000)
        }, 6000)
      }
    }, [values, loading])

    useEffect(() => {
      if (values.find(v => v.id === sendingId)) {
        onLoad()
      }
    }, [values, sendingId, onLoad])

    return (
      <>
        {!values.length && <span>{message}</span>}
        <BlockList
          values={values.filter(v => !v.disabled)}
          ownerCode={ownerCode}
          browserId={browserId}
        />
        {!isUploading && !loading && (
          <div className="block block--borderless">
            <input type="button" value="reply" onClick={onUpload} />
          </div>
        )}
      </>
    )
  }
)
