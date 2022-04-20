import {Octokit} from '@octokit/rest'
import JSZip from 'jszip'

export async function getWorkflowLogs(
  repo: string,
  gitToken: string,
  runId: any
): Promise<{file: string; data: string}[]> {
  try {
    const repoNameSplitter = repo.split('/')
    if (repoNameSplitter.length !== 2) {
      throw new Error(
        `Failed to get repository details ${repoNameSplitter.toString()}`
      )
    }
    const octokit: Octokit = new Octokit({
      auth: gitToken
    })
    const runsRes = await octokit.request(
      'GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs',
      {
        owner: repoNameSplitter[0],
        repo: repoNameSplitter[1],
        run_id: runId
      }
    )

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const arr = new Uint8Array(runsRes.data)
    const res = await JSZip.loadAsync(arr)

    const logs: {file: string; data: string}[] = []

    const promiseQueue = []

    for (const property in res.files) {
      const file = res.files[property]

      promiseQueue.push(
        (async () => {
          const fileContent = await file.async('uint8array')
          const decodedContent = Buffer.from(fileContent).toString('base64')
          logs.push({
            file: property,
            data: Buffer.from(decodedContent, 'base64').toString('utf-8')
          })
        })()
      )
    }

    await Promise.all(promiseQueue)
    return logs
  } catch (error) {
    throw new Error(`Failed to get git logs ${error.message}`)
  }
}
