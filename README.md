# Azure Log Analytics on Github Workflow

This custom action supports to push entire Github workflow logs into the Azure Log Analytics.

### Example workflow

```yaml
name: My Workflow
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - name: Run action
      uses: choreo-templates/azure-logs-workflow-action@v1
      with:
        shared-key: <<Use either the primary or the secondary Connected Sources client authentication key>>
        azure-customer-id: <<Customer ID to your Log Analytics workspace ID>>
        github-token: <<Github PAT>>
        component-id: <<Choreo component Id>>
        run-id: <<Run ID of the workflow>>
        repo: <<Value of $GITHUB_REPOSITORY>>
        
```

### Inputs

| Input                                             | Description                                        |
|------------------------------------------------------|-----------------------------------------------|
| `shared-key`  _(required)_  | mandatory input    |
| `azure-customer-id` _(required)_  | mandatory input    |
| `github-token` _(required)_  | mandatory input  |
| `component-id` _(required)_  | mandatory input  |
| `run-id` _(required)_  | mandatory input  |
| `repo` _(required)_  | mandatory input  |
