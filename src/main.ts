import * as core from '@actions/core'
import * as azureMonitor from './azureMonitor'
import {getWorkflowLogs} from './getLogs'

export async function run(): Promise<void> {
  try {
    // through secret
    const customerId: string = core.getInput('azure-customer-id', {
      required: true
    })
    const sharedKey: string = core.getInput('shared-key', {required: true})
    const runId: string = core.getInput('run-id', {required: true})
    const githubToken: string = core.getInput('github-token', {required: true})
    const componentId: string = core.getInput('component-id', {required: true})
    const repo: string = core.getInput('repo', {required: true})

    const jsonBody = {
      runId: runId,
      componentId: componentId,
      repo: repo,
      logs: await getWorkflowLogs(repo, githubToken, runId)
    }
    core.debug(`input json-body:'${jsonBody}'`)

    await azureMonitor.sendLogs(customerId, sharedKey, JSON.stringify(jsonBody))
  } catch (error) {
    core.setFailed(error.message)
  }
}

// run()
