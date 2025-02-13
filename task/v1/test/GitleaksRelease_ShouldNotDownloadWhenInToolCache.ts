import * as mr from 'azure-pipelines-task-lib/mock-run'

import path = require('path')
import * as helpers from './MockHelper'

const taskPath = path.join(__dirname, '..', 'index.js')
let tmr: mr.TaskMockRunner = new mr.TaskMockRunner(taskPath)

// Inputs
tmr.setInput('version', '7.0.0')
tmr.setInput('configType', 'default')
tmr.setInput('scanfolder', __dirname)
tmr.setInput('reportformat', 'json')

tmr.setInput('nogit', 'false')
tmr.setInput('verbose', 'false')
tmr.setInput('uploadresults', 'false')
tmr.setInput('redact', 'false')
tmr.setInput('taskfail', 'true')
tmr.setInput('taskfailonexecutionerror', 'true')

const executable = 'gitleaks-darwin-amd64'

helpers.BuildWithDefaultValues()
tmr.registerMock('azure-pipelines-tool-lib/tool', {
  downloadTool () {
    return '/tool'
  },
  findLocalTool: function (toolName) {
    if (toolName !== 'gitleaks') {
      throw new Error('Searching for wrong tool')
    }
    return '/tool'
  },
  cleanVersion: function (version) {
    return version
  },
  findLocalToolVersions: function (toolName) {
    if (toolName !== 'gitleaks') {
      throw new Error('Searching for wrong tool')
    }
    return ['7.0.0']
  }
})

tmr = helpers.BuildWithSucceedingToolExecution(tmr, executable)
tmr = helpers.BuildWithDefaultMocks(tmr)
tmr.run()
