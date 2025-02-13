import * as path from 'path'
import * as assert from 'assert'
import * as ttm from 'azure-pipelines-task-lib/mock-test'
import 'mocha'

describe('Gitleaks Execution', function () {
  it('Should fail when gitleaks find leaks', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'Execution_ShouldFailWhenGitLeaksReturnsExitCodeOne.js')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.failed, true, 'should have failed')
    assert.strictEqual(tr.errorIssues.length, 2, 'should have two errors')
    assert.strictEqual(tr.stdout.includes('loc_mock_ResultError'), true, "Should contain 'loc_mock_ResultError'")
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })

  it('Should succeed when gitleaks find no leaks', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'Execution_ShouldSucceedWhenGitLeaksReturnsExitCodeZero.js')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })

  it('Should succeed with warning when gitleaks find leaks', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'Execution_ShouldWarningWhenGitLeaksReturnsExitCodeOne.js')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.stdout.includes('SucceededWithIssues'), true, "Should contain 'SucceededWithIssues'")
    assert.strictEqual(tr.stdout.includes('loc_mock_ResultError'), true, "Should contain 'loc_mock_ResultError'")
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should fail when download error occurs', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'Execution_ShouldFailWhenDownloadError.js')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.failed, true, 'should have failed')
    assert.strictEqual(tr.errorIssues.length, 1, 'should have one errors')
    assert.strictEqual(tr.stdout.includes('download error'), true, "Should contain 'download error'")
    assert.strictEqual(tr.invokedToolCount, 0, 'Gitleaks tool should not be invoked')
    done()
  })
  it('Should succeed with warnings when download error occurs', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'Execution_ShouldSucceedWarningWhenDownloadError.js')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.stdout.includes('SucceededWithIssues'), true, "Should contain 'SucceededWithIssues'")
    assert.strictEqual(tr.stdout.includes('download error'), true, "Should contain 'download error'")
    assert.strictEqual(tr.invokedToolCount, 0, 'Gitleaks tool should not be invoked')
    done()
  })
})

describe('Upload gitleaks results', function () {
  it('Should upload results when file exists and upload is set to true', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'UploadResults_ShouldUploadFileResults')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.failed, true, 'should have failed')
    assert.strictEqual(tr.stdout.includes('loc_mock_ResultError'), true, "Should contain 'loc_mock_ResultError'")
    assert.strictEqual(tr.stdout.includes('##vso[artifact.upload containerfolder=Gitleaks;artifactname=CodeAnalysisLogs;]'), true, "Should contain '##vso[artifact.upload containerfolder=gitleaks;artifactname=gitleaks;].'")
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should not upload results when upload is set to false', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'UploadResults_ShouldNotUploadFileResultsWhenUploadIsOff')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.failed, true, 'should have failed')
    assert.strictEqual(tr.stdout.includes('loc_mock_ResultError'), true, "Should contain 'loc_mock_ResultError'")
    assert.strictEqual(tr.stdout.indexOf('##vso[artifact.upload containerfolder=Gitleaks;artifactname=gitleaks;]'), -1, "Should not contain '##vso[artifact.upload containerfolder=gitleaks;artifactname=gitleaks;].'")
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should not upload results when report file does not exist', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'UploadResults_ShouldNotUploadFileResultsWhenUploadIsOff')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.failed, true, 'should have failed')
    assert.strictEqual(tr.stdout.includes('loc_mock_ResultError'), true, "Should contain 'loc_mock_ResultError'")
    assert.strictEqual(tr.stdout.indexOf('##vso[artifact.upload containerfolder=Gitleaks;artifactname=gitleaks;]'), -1, "Should not contain '##vso[artifact.upload containerfolder=gitleaks;artifactname=gitleaks;].'")
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
})

describe('Configuration Files', function () {
  it('Should accept no config file', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'ConfigFiles_ShouldAcceptNoConfig')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should accept a predefined config file', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'ConfigFiles_ShouldAcceptPredefinedConfig')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should succeed when existing custom config file is provided', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'ConfigFiles_ShouldAcceptCustomConfigFile')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should fail when config file is not provided', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'ConfigFiles_ShouldFailWhenCustomConfigFileIsNotProvided')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.failed, true, 'should have failed')
    assert.strictEqual(tr.invokedToolCount, 0, 'Gitleaks tool should be invoked 0 time')
    assert.strictEqual(tr.errorIssues.length, 1, 'should have one error')
    assert.strictEqual(tr.stdout.includes('loc_mock_IncorrectConfig'), true, "Should contain 'Incorrect configuration set.'")
    done()
  })
})

describe('Gitleaks parameter calls', function () {
  it('Should provide the --verbose parameter to gitleaks when verbose flag is on', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksCall_ShouldWorkWithVerboseParameter')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should provide the --redact parameter to gitleaks when redact flag is on', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksCall_ShouldWorkWithRedactParameter')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should provide the --log-level debug parameter to gitleaks when system.debug is on', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksCall_ShouldWorkWithSystemDebug')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })

  it('Should provide the --report-format to gitleaks when provided', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksCall_ShouldWorkWithReportFormat')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
})

describe('Set scanmode', function () {
  it('Should scan everything with scanmode all', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'Gitleaks_ScanModeAll')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should scan flat with scanmode nogit', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'Gitleaks_ScanModeNoGit')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should scan with provided logoptions when scanmode is custom', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'Gitleaks_ScanModeCustom')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should fail when logoptions are not provided and scanmode is custom', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'Gitleaks_ScanModeCustomNotProvidedShouldFail')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.stdout.includes('loc_mock_NoCommitsToScan'), true, "Should contain 'loc_mock_NoCommitsToScan'")
    done()
  })
  it('Should scan pre-validation builds when scanmode is prevalidation', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'Gitleaks_ScanModePrevalidation')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should fail when scanmode is pre-validation builds but buildreason is manual', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'Gitleaks_ScanModePrevalidationShouldFailWhenBuildReasonIsNotPullRequest')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.failed, true, 'should have failed')
    assert.strictEqual(tr.stdout.includes('loc_mock_PreValidationBuildInvallid'), true, "Should contain 'loc_mock_PreValidationBuildInvallid'")
    assert.strictEqual(tr.invokedToolCount, 0, 'Gitleaks tool should not be invoked 0 time')
    done()
  })
  it('Should scan pre-validation builds when scanmode is smart and buildreason is pullrequest', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'Gitleaks_ScanModeSmartPullRequest')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })

  it('Should scan build changes when scanmode is smart and buildreason is manual', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'Gitleaks_ScanModeSmartManual')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should scan build changes when scanmode is changes', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'Gitleaks_ScanModeChanges')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
  it('Should fail when scanmode is unknown', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'Gitleaks_ScanModeUnknown')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.failed, true, 'should have failed')
    assert.strictEqual(tr.stdout.includes('loc_mock_UnknownScanMode'), true, "Should contain 'loc_mock_UnknownScanModet'")
    assert.strictEqual(tr.invokedToolCount, 0, 'Gitleaks tool should not be invoked 0 time')
    done()
  })
})

describe('Gitleaks Releases', function () {
  it('Should download Darwin/x64', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksRelease_ShouldWorkOnDarwinX64')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('darwin_x64'), true, "Should contain 'darwin_x64'")
    done()
  })
  it('Should not download WindowsNT/x128 because Os/Arch not supported', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksRelease_ShouldFailOnOsArchNotSupported')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.failed, true, 'should have failed')
    assert.strictEqual(tr.stdout.includes('loc_mock_OsArchNotSupported'), true, "Should contain 'loc_mock_OsArchNotSupported'")
    assert.strictEqual(tr.invokedToolCount, 0, 'Gitleaks tool should not be invoked 0 time')
    done()
  })
  it('Should download WindowsNT/x64', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksRelease_ShouldWorkOnWindowsNTx64')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('windows_x64'), true, "Should contain 'windows_x64'")
    done()
  })
  it('Should download WindowsNT/x32', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksRelease_ShouldWorkOnWindowsNTx86')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('windows_x32'), true, "Should contain 'windows_x32'")
    done()
  })
  it('Should download Linux/x64', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksRelease_ShouldWorkOnLinuxx64')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('linux_x64'), true, "Should contain 'linux_x64'")
    done()
  })
  it('Should download Linux/x32', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksRelease_ShouldWorkOnLinuxx86')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('linux_x32'), true, "Should contain 'linux_x32'")
    done()
  })
})

describe('Gitleaks Versions', function () {
  it('Should get latest when input version is set to latest', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksVersion_ShouldDownloadedWhenLatest')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('loc_mock_OnlineAgentHasNotTheLatestVersion'), true, "Should contain 'loc_mock_OnlineAgentHasNotTheLatestVersion.'")
    done()
  })
  it('Should get version that is specified.', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksVersion_ShouldDownloadedWhenSpecified')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('loc_mock_NoToolcacheDownloading'), true, "Should contain 'loc_mock_NoToolcacheDownloading.'")
    done()
  })
  it('Should fail when version is lower then 8.0.0.', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksVersion_ShouldFailWhenVersionIsBelow8')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.failed, true, 'should have failed')
    assert.strictEqual(tr.stdout.includes('loc_mock_MinimalAllowdVersion'), true, "Should contain 'loc_mock_MinimalAllowdVersion'")
    assert.strictEqual(tr.invokedToolCount, 0, 'Gitleaks tool should not be invoked 0 time')
    done()
  })
})

describe('Gitleaks custom location', function () {
  it('Should fail when custom tool cannot be found', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksVersion_ShouldFailWhenCustomToolLocationCanNotBeFound.js')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, false, 'should have failed')
    assert.strictEqual(tr.invokedToolCount, 0, 'Gitleaks tool should be invoked 0 times')
    assert.strictEqual(tr.stdout.includes('loc_mock_GitLeaksNotFound'), true, "customLocation/gitleaks-darwin-amd64'")
    done()
  })
  it('Should succeed with custom tool', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksVersion_ShouldSucceedWithCustomLocation.js')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    done()
  })
})

describe('Gitleaks toolcache', function () {
  it('Should download when gitleaks version is not in toolcache', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksRelease_ShouldDownloadWhenNotInToolCache')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('loc_mock_NoToolcacheDownloading'), true, "Should contain 'loc_mock_NoToolcacheDownloading'.")
    done()
  })
  it('Should not download when gitleaks version is in toolcache.', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksRelease_ShouldNotDownloadWhenInToolCache')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('loc_mock_AvailableInToolcache'), true, "Should contain 'loc_mock_AvailableInToolcache'.")
    done()
  })

  it('Should not download when gitleaks version is in toolcache and that is the latest version.', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksRelease_ShouldNotDownloadWhenInToolCacheAndLatest')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('loc_mock_OnlineAgentHasLatestVersion'), true, "loc_mock_OnlineAgentHasLatestVersion'")
    done()
  })
})

describe('Gitleaks with Offline Agent', function () {
  it('Should take the latest version in toolcache when agent is offline', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksOfflineAgent_TakeLatestVersionShouldSucceed')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, true, 'should have succeeded')
    assert.strictEqual(tr.invokedToolCount, 1, 'Gitleaks tool should be invoked 1 time')
    assert.strictEqual(tr.stdout.includes('loc_mock_OfflineAgent'), true, "Should contain 'loc_mock_OfflineAgent'.")
    done()
  })

  it('Should fail when there is no version in toolcache and agent is offline', function (done: Mocha.Done) {
    const tp = path.join(__dirname, 'GitleaksOfflineAgent_TakeLatestVersionShouldFail')
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp)
    tr.run()
    assert.strictEqual(tr.succeeded, false, 'should have failed')
    assert.strictEqual(tr.invokedToolCount, 0, 'Gitleaks tool should be invoked 0 times')
    assert.strictEqual(tr.stdout.includes('loc_mock_OfflineAgentToolNotAvailable'), true, "Should contain 'loc_mock_OfflineAgentToolNotAvailable'.")
    done()
  })
})
