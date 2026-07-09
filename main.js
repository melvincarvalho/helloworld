/**
 * Solid Hello World — zero build, zero dependencies.
 *
 * Auth is solid-oidc: a single ~700-line file (4kb gzipped) doing the full
 * Solid-OIDC flow with Web Crypto. https://github.com/JavaScriptSolidServer/solid-oidc
 */

import { Session } from 'https://esm.sh/gh/JavaScriptSolidServer/solid-oidc/solid-oidc.js'

// DOM elements
const welcomeSection = document.getElementById('welcome')
const logoutSection = document.getElementById('logout')
const profileSection = document.getElementById('profile-section')
const debugSection = document.getElementById('debug-section')
const debugEl = document.getElementById('debug')
const userLink = document.getElementById('user')
const profileName = document.getElementById('profile-name')
const loginBtn = document.getElementById('login')
const logoutBtn = document.getElementById('logout-btn')
const idpInput = document.getElementById('idp')

// Append a timestamped line to the green debug panel (visible after login)
function debug(message) {
  const ts = new Date().toLocaleTimeString()
  debugEl.textContent += `[${ts}] ${message}\n`
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
  welcomeSection.style.display = 'none'
  logoutSection.style.display = ''
  profileSection.style.display = ''
  debugSection.style.display = ''
  userLink.textContent = webId
  userLink.href = webId
  loadProfile(webId)
}

// Render logged-out state
function renderLogout() {
  welcomeSection.style.display = ''
  logoutSection.style.display = 'none'
  profileSection.style.display = 'none'
  debugSection.style.display = 'none'
  debugEl.textContent = ''
  userLink.textContent = ''
  profileName.textContent = ''
}

// Good enough for a hello world: pull the first foaf:name literal out of the
// profile Turtle without an RDF parser.
function extractName(turtle) {
  const m = turtle.match(/(?:foaf:name|<http:\/\/xmlns\.com\/foaf\/0\.1\/name>)\s+"([^"]*)"/)
  return m ? m[1] : null
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
    profileName.textContent = `Name: ${name ?? 'Name not found'}`
  } catch (error) {
    console.error('Error loading profile:', error)
    debug(`profile fetch failed: ${error.message}`)
    profileName.textContent = 'Could not load profile data'
  }
}

// Handle login button click
loginBtn.addEventListener('click', async () => {
  const issuer = idpInput.value.trim()
  if (!issuer) {
    alert('Please enter an Identity Provider URL')
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
