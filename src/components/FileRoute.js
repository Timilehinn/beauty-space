import React from 'react'
import { Route } from 'react-router-dom'

export function FileRoute({ path, filePath }) {
  return (
    <Route
      path={path}
      render={() => {
        const fileUrl = process.env.PUBLIC_URL + filePath
        return <a href={fileUrl}>Download file</a>
      }}
    />
  )
}