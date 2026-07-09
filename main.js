/**
 * Solid Hello World — zero build, zero dependencies.
 *
 * Auth is solid-oidc: a single ~700-line file (4kb gzipped) doing the full
 * Solid-OIDC flow with Web Crypto. https://github.com/JavaScriptSolidServer/solid-oidc
 */

import { Session } from 'https://esm.sh/gh/JavaScriptSolidServer/solid-oidc/solid-oidc.js'

// DOM elements
const welcomeSection = document.getElementById('welcome')
const sessionSection = document.getElementById('session')
const debugSection = document.getElementById('debug-section')
const debugEl = document.getElementById('debug')
const avatarEl = document.getElementById('avatar')
const userLink = document.getElementById('user')
const profileName = document.getElementById('profile-name')
const loginBtn = document.getElementById('login')
const logoutBtn = document.getElementById('logout-btn')
const idpSelect = document.getElementById('idp-select')
const idpCustom = document.getElementById('idp-custom')

// Append a timestamped line to the green debug terminal (visible after login)
function debug(message) {
  const ts = new Date().toLocaleTimeString()
  debugEl.textContent += `[${ts}] ${message}\n`
  debugEl.scrollTop = debugEl.scrollHeight
}

const session = new Session({
  onStateChange: (event) => {
    const { isActive, webId } = event.detail
    debug(isActive ? `session active — webId: ${webId}` : 'session ended')
    if (isActive) renderLogin(webId)
    else renderLogout()
  }
})

// Render logged-in state
function renderLogin(webId) {
  welcomeSection.hidden = true
  sessionSection.hidden = false
  debugSection.hidden = false
  userLink.textContent = webId
  userLink.href = webId
  loadProfile(webId)
}

// Render logged-out state
function renderLogout() {
  welcomeSection.hidden = false
  sessionSection.hidden = true
  debugSection.hidden = true
  debugEl.textContent = ''
  avatarEl.textContent = ''
  userLink.textContent = ''
  profileName.textContent = '…'
}

// Good enough for a hello world: pull values out of the profile Turtle with
// regexes instead of an RDF parser.
function extractName(turtle) {
  const m = turtle.match(/(?:foaf:name|<http:\/\/xmlns\.com\/foaf\/0\.1\/name>)\s+"([^"]*)"/)
  return m ? m[1] : null
}

function extractPhoto(turtle) {
  const m = turtle.match(/(?:vcard:hasPhoto|foaf:img|foaf:depiction|<http:\/\/www\.w3\.org\/2006\/vcard\/ns#hasPhoto>|<http:\/\/xmlns\.com\/foaf\/0\.1\/(?:img|depiction)>)\s+<(https:\/\/[^>]+)>/)
  return m ? m[1] : null
}

function renderAvatar(name, photo) {
  avatarEl.textContent = ''
  if (photo) {
    const img = document.createElement('img')
    img.alt = ''
    img.onerror = () => { avatarEl.textContent = initial(name) }
    img.src = photo
    avatarEl.append(img)
  } else {
    avatarEl.textContent = initial(name)
  }
}

function initial(name) {
  return name ? [...name][0].toUpperCase() : '?'
}

// Load and display profile data
async function loadProfile(webId) {
  try {
    debug(`GET ${webId} (Accept: text/turtle)`)
    const response = await session.authFetch(webId, {
      headers: { Accept: 'text/turtle' }
    })
    debug(`HTTP ${response.status} ${response.statusText} — ${response.headers.get('content-type') ?? 'no content-type'}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const turtle = await response.text()
    debug(`profile document: ${turtle.length} chars`)
    const name = extractName(turtle)
    debug(name ? `foaf:name: "${name}"` : 'no foaf:name found in profile')
    const photo = extractPhoto(turtle)
    debug(photo ? `photo: ${photo}` : 'no profile photo found')
    profileName.textContent = name ?? 'Anonymous'
    renderAvatar(name, photo)
  } catch (error) {
    console.error('Error loading profile:', error)
    debug(`profile fetch failed: ${error.message}`)
    profileName.textContent = 'Could not load profile'
    renderAvatar(null, null)
  }
}

// Identity provider selection
idpSelect.addEventListener('change', () => {
  idpCustom.hidden = idpSelect.value !== 'custom'
  if (!idpCustom.hidden) idpCustom.focus()
})

function getIssuer() {
  return (idpSelect.value === 'custom' ? idpCustom.value : idpSelect.value).trim()
}

// Handle login button click
loginBtn.addEventListener('click', async () => {
  const issuer = getIssuer()
  if (!issuer) {
    alert('Please enter an identity provider URL')
    return
  }
  try {
    await session.login(issuer, window.location.href)
  } catch (error) {
    alert(`Login error: ${error.message}`)
  }
})

// Handle logout button click
logoutBtn.addEventListener('click', () => session.logout())

// Handle redirect after login, or restore a previous session
async function init() {
  try {
    await session.handleRedirectFromLogin()
  } catch (error) {
    console.error('Redirect handling error:', error)
  }
  if (!session.isActive) {
    try {
      await session.restore()
    } catch {
      // no session to restore — that's fine
    }
  }
  if (!session.isActive) renderLogout()
}

init()
