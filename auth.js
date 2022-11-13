/**
 * Created by marcusedwards on 2018-07-27.
 */

var ynabConfig = {}

function getUrlParameter(name) {
  var url = window.location.href
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

function refreshAndRetry(callback) {
  var attempts = 0
  return refreshAccessToken(function(attempts) {
    if (attempts == null) {
      attempts = 0
    }
    if (attempts < 5) {
      callback()
    }
  }, attempts)
}

function loadYnabConfig(callback) {
  $.getJSON('https://centsapp.ca/js/ynab/config.json', function(config) {
    ynabConfig = {
      baseApiUrl: config.baseApiUrl,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri
    }
    setLocalYnabConfig(ynabConfig)
    if (callback instanceof Function) {
      callback()
    }
  })
}

function loadYnabRegisterConfig(callback) {
  $.getJSON('https://centsapp.ca/js/ynab/config-register.json', function(config) {
    ynabConfig = {
      baseApiUrl: config.baseApiUrl,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri
    }
    setLocalYnabConfig(ynabConfig)
    if (callback instanceof Function) {
      callback()
    }
  })
}

function requestYnabPermissions() {
  var ynabConfig = getLocalYnabConfig()
  window.location =
    'https://app.youneedabudget.com/oauth/authorize?client_id=' +
    ynabConfig['clientId'] +
    '&redirect_uri=' +
    ynabConfig['redirectUri'] +
    '&response_type=code'
}

function getAccessToken(attempts) {
  if (attempts == null) {
    attempts = 0
  }
  var ynabConfig = getLocalYnabConfig()
  if (attempts < 5) {
    setTimeout(
      $
        .post(
          'https://app.youneedabudget.com/oauth/token?client_id=' +
            ynabConfig['clientId'] +
            '&client_secret=' +
            ynabConfig['clientSecret'] +
            '&redirect_uri=' +
            ynabConfig['redirectUri'] +
            '&grant_type=authorization_code&code=' +
            getUrlParameter('code')
        )
        .done(function(data) {
          setLocalAuthToken(data.access_token)
          setLocalRefreshToken(data.refresh_token)
          setLocalRefreshTime(now() + data.expires_in)
        })
        .fail(function(data) {
          if (data.responseJSON.hasOwnProperty('error')) {
            error = data.responseJSON.error
            if (error.id == '401') {
              refreshAccessToken(getAccessToken(), attempts)
            } else {
              console.log(error.detail)
            }
          }
        }),
      100
    )
  }
}

function refreshAccessToken(callback, attempts) {
  var ynabConfig = getLocalYnabConfig()
  $.post(
    'https://app.youneedabudget.com/oauth/token?client_id=' +
      ynabConfig['clientId'] +
      '&client_secret=' +
      ynabConfig['clientSecret'] +
      '&grant_type=refresh_token&refresh_token=' +
      getLocalRefreshToken()
  )
    .done(function(data) {
      setLocalAuthToken(data.access_token)
      setLocalRefreshToken(data.refresh_token)
      setLocalRefreshTime(now() + data.expires_in)
      callback(attempts + 1)
    })
    .fail(function(data) {
      if (confirm('YNAB connection has expired. Would you like to re-authenticate?')) {
        loadYnabConfig(requestYnabPermissions)
      }
    })
}

function setLocalAuthToken(auth_token) {
  localStorage.setItem('auth_token', auth_token)
}

function setLocalYnabConfig(config) {
  localStorage.setItem('ynab_config', JSON.stringify(config))
}

function setLocalRefreshToken(refresh_token) {
  localStorage.setItem('refresh_token', refresh_token)
}

function setLocalRefreshTime(refresh_time) {
  localStorage.setItem('refresh_time', refresh_time)
}

function getLocalAuthToken() {
  return localStorage.getItem('auth_token')
}

function getLocalYnabConfig() {
  return JSON.parse(localStorage.getItem('ynab_config'))
}

function getLocalRefreshToken() {
  return localStorage.getItem('refresh_token')
}

function getLocalRefreshTime() {
  return localStorage.getItem('refresh_time')
}

function now() {
  return new Date().getTime() / 1000
}
