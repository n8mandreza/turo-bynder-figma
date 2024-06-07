// npm run watch to watch for code changes
import { render, useWindowResize } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { ResizeWindowHandler } from './types'
import { h } from 'preact'
import { useState } from 'preact/hooks'
import Button from './components/Button'
import TabItem from './components/TabItem'
import '!./output.css'

function Plugin () {
  function onWindowResize(windowSize: { width: number; height: number }) {
    emit<ResizeWindowHandler>('RESIZE_WINDOW', windowSize)
  }
  useWindowResize(onWindowResize, {
    maxHeight: 800,
    maxWidth: 600,
    minHeight: 640,
    minWidth: 440,
    resizeBehaviorOnDoubleClick: 'minimize'
  })

  const clientId = 'caf02bf3-e0ce-4370-b9ff-81d538cabb32'
  const clientSecret = '21b1f3b4-fa51-4fbf-8048-8545a0998d9f'
  const scope = 'offline%20asset%3Aread%20collection%3Aread'
  const redirectUri = 'https%3A%2F%2Fturo%2Dbynder%2Doauth%2Evercel%2Eapp%2F'
  const authorizeEndpoint = `https://turo.bynder.com/v6/authentication/oauth2/auth?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&response_type=code&state=state`

  async function fetchAccessToken() {
    return await fetch('https://turo.bynder.com/v6/authentication/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: new URLSearchParams({
        'client_id': clientId,
        'client_secret': clientSecret,
        'grant_type': 'authorization_code',
        'redirect_uri': redirectUri,
        'code': '48f37bdba4b66642cd41107a65e9607a' // Need to get this from the authorizeEndpoint
      })
    })
      .then(response => response.json())
      .then(data => {
        const accessToken = data.access_token
        console.log(accessToken)
      })
      .catch(error => {
        console.log("Couldn't fetch access token")
      })
  }

  return (
    <div class="flex flex-col h-full gap-6 items-center justify-center">
      <h1 class="text-3xl font-bold">
        Turo Bynder
      </h1>

      <Button label='Log in to Bynder' onClick={() => window.open(authorizeEndpoint, '_blank')}/>

      <Button label='Show access token' onClick={() => console.log(fetchAccessToken())}/>
    </div>

  )
}

export default render(Plugin)
