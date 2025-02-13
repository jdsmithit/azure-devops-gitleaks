import * as path from 'path'
import taskLib = require('azure-pipelines-task-lib/task')
import * as azdev from 'azure-devops-node-api/WebApi'
import { IProxyConfiguration, IRequestOptions } from 'azure-devops-node-api/interfaces/common/VsoBaseInterfaces'

taskLib.setResourcePath(path.join(__dirname, 'task.json'), true)

export function getEndpointUrl (name: string): string {
  const value = taskLib.getEndpointUrl(name, true)
  if (value === undefined) throw Error(taskLib.loc('GetEndpointUrlEmpty', name))
  return value
}

export function getEndpointAuthorizationParameter (name: string, key: string): string {
  const value = taskLib.getEndpointAuthorizationParameter(name, key, true)
  if (value === undefined) throw Error(taskLib.loc('GetEndpointAuthorizationParameterEmpty', name))
  return value
}

export function getAzureDevOpsVariable (name: string): string {
  const value = taskLib.getVariable(name)
  if (value === undefined) throw Error(taskLib.loc('VariableEmpty', name))
  return value
}

export function getAzureDevOpsInput (name: string): string {
  const value = taskLib.getInput(name)
  if (value === undefined) throw Error(taskLib.loc('InputEmpty', name))
  return value
}

export function getAzureDevOpsPathInput (name: string): string {
  const value = taskLib.getPathInput(name)
  if (value === undefined) throw Error(taskLib.loc('InputEmpty', name))
  return value
}

export function getRequestOptions (): IRequestOptions {
  const requestOptions: IRequestOptions = {
    socketTimeout: 10000,
    allowRetries: true,
    maxRetries: 3
  }

  const agentProxy = taskLib.getHttpProxyConfiguration()
  let proxyConfiguration: IProxyConfiguration

  if (agentProxy !== null) {
    proxyConfiguration = {
      proxyUrl: agentProxy.proxyUrl,
      proxyUsername: agentProxy.proxyUsername,
      proxyPassword: agentProxy.proxyPassword,
      proxyBypassHosts: agentProxy.proxyBypassHosts
    }
    requestOptions.proxy = proxyConfiguration
  }
  return requestOptions
}

export async function getAzureDevOpsConnection (collectionUri: string, token: string): Promise<azdev.WebApi> {
  const accessTokenHandler = azdev.getPersonalAccessTokenHandler(token)
  const connection = new azdev.WebApi(collectionUri, accessTokenHandler, getRequestOptions())
  if (connection === undefined) throw Error(taskLib.loc('AdoConnectionError'))
  return connection
}
