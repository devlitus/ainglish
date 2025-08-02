# Testing and Coverage Setup

## Overview
This project uses Jest for testing with coverage reporting integrated into the CI/CD pipeline.

## Coverage Configuration

### Jest Configuration
- **Coverage Directory**: `coverage/`
- **Coverage Formats**: Text, LCOV, HTML
- **Coverage Thresholds**: 70% for branches, functions, lines, and statements
- **Included Files**: All TypeScript/JavaScript files in `src/` directory
- **Excluded Files**: Type definitions, CSS files, and style directories

### Commands
```bash
# Run tests without coverage
npm test

# Run tests with coverage generation
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## CI/CD Integration

### Coverage Reporting
- Coverage reports are generated during CI runs
- Reports are uploaded to Codecov for tracking
- Coverage failures don't block CI pipeline (`fail_ci_if_error: false`)

### Codecov Setup
1. Coverage is generated using `npm run test:coverage`
2. LCOV report is uploaded to Codecov
3. Requires `CODECOV_TOKEN` secret in GitHub repository settings

## Viewing Coverage Reports

### Local Development
After running `npm run test:coverage`, open `coverage/lcov-report/index.html` in your browser.

### Online
View coverage reports on [Codecov](https://codecov.io) after CI runs.

## Troubleshooting

### Common Issues
1. **Codecov Upload Fails**: Ensure `CODECOV_TOKEN` is set in repository secrets
2. **Coverage Threshold Failures**: Increase test coverage or adjust thresholds in `jest.config.js`
3. **Missing Coverage Files**: Ensure `npm run test:coverage` runs successfully

### Coverage Thresholds
Current thresholds are set to 70%. To modify:

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70
  }
}
```