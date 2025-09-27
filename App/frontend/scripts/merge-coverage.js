const { createCoverageMap } = require('instanbul-lib-coverage')
const { createReporter } = require('instanbul-lib-report')
const reports = require('instabul-reports')
const fs = require('fs')
const path = require('path')
const { CoverageMap } = require('istanbul-lib-coverage')

async function mergeCoverage() {
    const map = createCoverageMap({})

    const unitCoveragePath = path.join(process.cwd(), 'coverage/unit/coverage-final.js')
    if (fs.existsSync(unitCoveragePath)) {
        const unitCoverage = JSON.parse(fs.readFileSync(unitCoveragePath, 'utf-8'))
        map.merge(unitCoverage)
        console.log('Merged unit test coverage')
    }

    const e2eCoveragePath = path.join(process.cwd(), 'coverage/e2e/coverage-final.json')
    if (fs.existsSync(e2eCoveragePath)) {
        const e2eCoverage = JSON.parse(fs.readFileSync(e2eCoveragePath, 'utf8'))
        map.merge(e2eCoverage)
        console.log('Merged e2e test coverage')
    }

    const mergedDir = path.join(process.cwd(), 'coverage/merged')
    if (!fs.existsSync(mergedDir)) {
        fs.mkdirSync(mergedDir, { recursive: true })
    }

    const context = createReporter().createContext({
        dir: mergedDir,
        coverageMap: map,
    })

    const report = reports.create('html')
    report.execute(context)

    const lcovReport = reports.create('lcov')
    lcovReport.execute(context)

    const jsonReport = reports.create('json')
    jsonReport.execute(context)

    console.log('Generated merged coverage reports in coverage/merged/')

}

mergeCoverage.catch(console.error)
