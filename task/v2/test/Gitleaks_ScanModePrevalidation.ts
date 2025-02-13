import * as mr from 'azure-pipelines-task-lib/mock-run'

import path = require('path')
import { TaskInputBuilder } from './_TaskInputBuilder'
import { EnvironmentBuilder } from './_EnvironmentBuilder'
import { ToolCallBuilder } from './_ToolCallBuilder'
import { ReportBuilder } from './_ReportBuilder'
import { TaskMockBuilder } from './_TaskMockBuilder'
import { AzureDevOpsAPIMock } from './_AzureDevOpsAPIMock'

const taskPath = path.join(__dirname, '..', 'index.js')
let tmr: mr.TaskMockRunner = new mr.TaskMockRunner(taskPath)

new EnvironmentBuilder()
  .withEnvironmentalSetting('BUILD_REASON', 'PullRequest')
  .withEnvironmentalSetting('SYSTEM_PULLREQUEST_PULLREQUESTID', 'PullRequestId')
  .withEnvironmentalSetting('BUILD_REPOSITORY_PROVIDER', 'TfsGit')
  .build()

tmr = new TaskInputBuilder(tmr)
  .withScanMode('prevalidation')
  .build()

tmr = new AzureDevOpsAPIMock(tmr)
  .withAzureDevOpsAPIMock()
  .build()

const toolCall = new ToolCallBuilder()
  .withLogOptions('lastCommitPr..firstCommitPr')
  .build()

const reportCall = new ReportBuilder()
  .build()

tmr = new AzureDevOpsAPIMock(tmr)
  .withAzureDevOpsAPIMock()
  .build()

tmr = new TaskMockBuilder(tmr)
  .withOnlineAgentMocks()
  .withReport(reportCall, true)
  .withToolExecution(toolCall, 0)
  .withEmptyToolCache()
  .build()

tmr.run()
