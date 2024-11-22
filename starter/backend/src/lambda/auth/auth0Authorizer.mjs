import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')
const jwksUrl = 'https://dev-f17k77k5zxy2arkt.us.auth0.com/.well-known/jwks.json'
const cert = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJAdWc4cYDSBRgMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1mMTdrNzdrNXp4eTJhcmt0LnVzLmF1dGgwLmNvbTAeFw0yNDExMTkx
NDIyNTZaFw0zODA3MjkxNDIyNTZaMCwxKjAoBgNVBAMTIWRldi1mMTdrNzdrNXp4
eTJhcmt0LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAJZFmyzftyDd/3qCEQUhsXnfEBkD6AdptxdDWJLx4rtyVjXcN2DLO5WtDXcN
jPJd/vTRWclLgyEFPSVlCfg8FxWGzY2dK6AQkgAk15FK0SBLfL2s4XfDuPqza5w/
6Dzp0D6lcPhG/T43YHAxmOn5yZUDkJV4ujDXcEGsQ3l1sgdxDV6Iw3raWoE6YCeA
QN3J+uk3AgLQP530Tu6RwGyJ9PpHJHZkUbwVlynQfbMeNS9hRcxkm+mDmwCaNeK1
O9ZRru92FQHYNCUym45qTXHpMMaETFyuQgPx2cW7OAEfP6/mrt75xYF9egTTwTeT
EJFWVTu/oHHqxE2VP7qN/FVm/UMCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUskub4vqVuBnXd6WT+7JbXIttVbIwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQA3rfWWEdzh5buuB7hO3oOaTXEKNC8Z3EuzZWt8B2ve
M8w/qIF/BXLhSt3MXmk5I6sveuU1Zt0hcAnjMUVbS5sKMqA3sXInQRpn4VlP5VAx
lRT7iW9GwBvTfSIymi9KvYvVs0UCxp7X4Kb2xMxgPwZNVtxU4cEuTVTDgxitTdEG
i5lNhQrd66fEt9CSK1DdOs4r+vNI1v7Qq6va6XnfbOxumGOw2bNYoUlqPji5s52k
pKfSgGlB2A6na5jO4ALzZgJ0jkpY8sFx0FxUhYJ+mYhnznudXtiuML3cQmr6HeEN
LznFqe1dd49HrM5tJNTJyDyzAOEwU1umPNsUdZjIznDN
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  logger.info('Verifying token', { token })

  return jsonwebtoken.verify(token, cert, { algorithms: ['RS256'] });
}

async function getJwks() {
  const response = await Axios.get(jwksUrl)
  const jwks = response.data.keys
  return jwks
}


function getToken(authHeader) {
  if (!authHeader) {
    throw new Error('No authentication header')
  }

  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    logger.error('Invalid authentication header', { header: authHeader })
    throw new Error('Invalid authentication header')
  }

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
