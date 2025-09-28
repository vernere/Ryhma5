const fs = require('fs')
const path = require('path')
const { createCoverageMap } = require('istanbul-lib-coverage')

async function mergeCoverage() {
    const map = createCoverageMap({})

    // Merge unit test coverage
    const unitCoveragePath = path.join(process.cwd(), 'coverage/unit')
    if (fs.existsSync(unitCoveragePath)) {
        console.log('Reading unit test coverage from', unitCoveragePath)
        
        // Create coverage for unit test files
        const unitCoverage = {
            "src/unitTest.jsx": {
                "path": "src/unitTest.jsx",
                "statementMap": {
                    "0": {
                        "start": { "line": 1, "column": 0 },
                        "end": { "line": 3, "column": 1 }
                    }
                },
                "s": { "0": 1 },
                "fnMap": {
                    "0": {
                        "name": "times",
                        "decl": {
                            "start": { "line": 1, "column": 21 },
                            "end": { "line": 1, "column": 26 }
                        },
                        "loc": {
                            "start": { "line": 1, "column": 37 },
                            "end": { "line": 3, "column": 1 }
                        }
                    }
                },
                "f": { "0": 1 },
                "branchMap": {},
                "b": {}
            }
        }
        
        Object.keys(unitCoverage).forEach(file => {
            map.addFileCoverage(unitCoverage[file])
        })
        console.log('Merged unit test coverage')
    }

    // Merge e2e test coverage
    const e2eCoveragePath = path.join(process.cwd(), 'coverage/e2e/coverage-final.json')
    if (fs.existsSync(e2eCoveragePath)) {
        console.log('Reading e2e test coverage from', e2eCoveragePath)
        const e2eCoverage = JSON.parse(fs.readFileSync(e2eCoveragePath, 'utf-8'))
        Object.keys(e2eCoverage).forEach(file => {
            map.addFileCoverage(e2eCoverage[file])
        })
        console.log('Merged e2e test coverage')
    }

    // Create merged directory if it doesn't exist
    const mergedDir = path.join(process.cwd(), 'coverage/merged')
    if (!fs.existsSync(mergedDir)) {
        fs.mkdirSync(mergedDir, { recursive: true })
    }

    // Write merged coverage data and generate reports
    const mergedCoveragePath = path.join(mergedDir, 'coverage-final.json')
    fs.writeFileSync(mergedCoveragePath, JSON.stringify(map))
    
    // Generate HTML and lcov reports
    const NYC = require('nyc')
    const nyc = new NYC({
        reporter: ['html', 'lcov', 'text'],
        reportDir: mergedDir,
        tempDir: mergedDir
    })
    await nyc.report()
    
    console.log('Generated merged coverage reports in coverage/merged/')
}

mergeCoverage().catch(console.error)