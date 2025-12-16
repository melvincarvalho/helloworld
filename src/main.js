import {
  login,
  logout,
  handleIncomingRedirect,
  getDefaultSession,
  fetch
} from '@inrupt/solid-client-authn-browser'

import {
  getSolidDataset,
  getThing,
  getStringNoLocale,
  getUrl
} from '@inrupt/solid-client'

import { FOAF } from '@inrupt/vocab-common-rdf'

// DOM elements
const welcomeSection = document.getElementById('welcome')
const logoutSection = document.getElementById('logout')
const profileSection = document.getElementById('profile-section')
const userLink = document.getElementById('user')
const profileName = document.getElementById('profile-name')
const loginBtn = document.getElementById('login')
const logoutBtn = document.getElementById('logout-btn')
const idpInput = document.getElementById('idp')

// Render logged-in state
function renderLogin(webId) {
  welcomeSection.style.display = 'none'
  logoutSection.style.display = ''
  profileSection.style.display = ''
  userLink.textContent = webId
  userLink.href = webId
  loadProfile(webId)
}

// Render logged-out state
function renderLogout() {
  welcomeSection.style.display = ''
  logoutSection.style.display = 'none'
  profileSection.style.display = 'none'
  userLink.textContent = ''
  profileName.textContent = ''
}

// Load and display profile data
async function loadProfile(webId) {
  try {
    const dataset = await getSolidDataset(webId, { fetch })
    const profile = getThing(dataset, webId)

    if (profile) {
      const name = getStringNoLocale(profile, FOAF.name) ||
                   getUrl(profile, FOAF.name) ||
                   'Name not found'
      profileName.textContent = `Name: ${name}`
    }
  } catch (error) {
    console.error('Error loading profile:', error)
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

  await login({
    oidcIssuer: issuer,
    redirectUrl: window.location.href,
    clientName: 'Solid Hello World'
  })
})

// Handle logout button click
logoutBtn.addEventListener('click', async () => {
  await logout()
  renderLogout()
})

// Handle redirect after login
async function init() {
  await handleIncomingRedirect({ restorePreviousSession: true })

  const session = getDefaultSession()

  if (session.info.isLoggedIn) {
    renderLogin(session.info.webId)
  } else {
    renderLogout()
  }
}

init()
