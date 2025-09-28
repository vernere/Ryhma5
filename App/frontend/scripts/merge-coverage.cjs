const fs = require('fs')
const path = require('path')
const { createCoverageMap } = require('istanbul-lib-coverage')
const v8ToIstanbul = require('v8-to-istanbul')

async function mergeCoverage() {
    let unitMap = createCoverageMap({})
    let e2eMap = createCoverageMap({})
    const finalMap = createCoverageMap({})
    
    // Helper function to normalize file paths
    function normalizePath(filePath) {
        // Remove absolute path prefix and normalize slashes
        const normalizedPath = filePath.replace(/\\/g, '/')
        const workspacePath = process.cwd().replace(/\\/g, '/')
        return normalizedPath.includes(workspacePath) 
            ? normalizedPath.replace(`${workspacePath}/`, '')
            : normalizedPath
    }

    // Merge unit test coverage
    const unitCoveragePath = path.join(process.cwd(), 'coverage/unit')
    
    if (fs.existsSync(unitCoveragePath)) {
        const files = fs.readdirSync(unitCoveragePath)
        console.log('Unit coverage directory contents:', files)
        
        // Look for JSON files
        const jsonFiles = files.filter(f => f.endsWith('.json'))
        if (jsonFiles.length > 0) {
            for (const file of jsonFiles) {
                const fullPath = path.join(unitCoveragePath, file)
                console.log('Reading coverage from:', fullPath)
                try {
                    const coverage = JSON.parse(fs.readFileSync(fullPath, 'utf-8'))
                    Object.entries(coverage).forEach(([file, fileCov]) => {
                        // Convert V8 format to Istanbul format if needed
                        if ('scriptId' in fileCov || ('functions' in fileCov && Array.isArray(fileCov.functions))) {
                            // This looks like V8 format, convert it
                            try {
                                const absolutePath = path.resolve(process.cwd(), file)
                                const converter = v8ToIstanbul(absolutePath)
                                converter.applyCoverage(fileCov)
                                fileCov = converter.toIstanbul()
                            } catch (err) {
                                console.error(`Error converting V8 coverage for ${file}:`, err)
                                return // Skip this file
                            }
                        }
                        
                        // Remove 'all' property if it exists
                        if (fileCov.all) delete fileCov.all
                        
                        // Normalize path - use the path from the key if path is missing
                        fileCov.path = fileCov.path || file
                        const normalizedPath = normalizePath(fileCov.path)
                        fileCov.path = normalizedPath
                        
                        // Convert statement/branch/function count objects
                        if (fileCov.s) {
                            Object.keys(fileCov.s).forEach(key => {
                                fileCov.s[key] = typeof fileCov.s[key] === 'boolean' ? (fileCov.s[key] ? 1 : 0) : fileCov.s[key]
                            })
                        }
                        if (fileCov.b) {
                            Object.keys(fileCov.b).forEach(key => {
                                fileCov.b[key] = typeof fileCov.b[key] === 'boolean' ? [fileCov.b[key] ? 1 : 0] : fileCov.b[key]
                            })
                        }
                        if (fileCov.f) {
                            Object.keys(fileCov.f).forEach(key => {
                                fileCov.f[key] = typeof fileCov.f[key] === 'boolean' ? (fileCov.f[key] ? 1 : 0) : fileCov.f[key]
                            })
                        }
                        
                        try {
                            console.log('Adding coverage for file:', fileCov.path)
                            unitMap.addFileCoverage(fileCov)
                        } catch (err) {
                            console.error(`Error adding coverage for ${file}:`, err)
                        }
                    })
                } catch (err) {
                    console.error(`Error reading coverage from ${fullPath}:`, err)
                    continue
                }
            }
            console.log('Merged unit test coverage from JSON')
        } else {
            console.warn('No coverage files found in unit coverage directory')
        }
    } else {
        console.warn('Unit coverage directory not found:', unitCoveragePath)
    }

    // Merge e2e test coverage
    const e2eCoveragePath = path.join(process.cwd(), 'coverage/e2e/coverage-final.json')
    if (fs.existsSync(e2eCoveragePath)) {
        console.log('Reading e2e test coverage from', e2eCoveragePath)
        try {
            const e2eCoverage = JSON.parse(fs.readFileSync(e2eCoveragePath, 'utf-8'))
            Object.entries(e2eCoverage).forEach(([file, fileCov]) => {
                const normalizedPath = normalizePath(fileCov.path)
                fileCov.path = normalizedPath
                
                // Remove 'all' property and convert counts like above
                if (fileCov.all) delete fileCov.all
                
                if (fileCov.s) {
                    Object.keys(fileCov.s).forEach(key => {
                        fileCov.s[key] = typeof fileCov.s[key] === 'boolean' ? (fileCov.s[key] ? 1 : 0) : fileCov.s[key]
                    })
                }
                if (fileCov.b) {
                    Object.keys(fileCov.b).forEach(key => {
                        fileCov.b[key] = typeof fileCov.b[key] === 'boolean' ? [fileCov.b[key] ? 1 : 0] : fileCov.b[key]
                    })
                }
                if (fileCov.f) {
                    Object.keys(fileCov.f).forEach(key => {
                        fileCov.f[key] = typeof fileCov.f[key] === 'boolean' ? (fileCov.f[key] ? 1 : 0) : fileCov.f[key]
                    })
                }
                
                try {
                    console.log('Adding coverage for file:', fileCov.path)
                    e2eMap.addFileCoverage(fileCov)
                } catch (err) {
                    console.error(`Error adding coverage for ${file}:`, err)
                }
            })
            console.log('Merged e2e test coverage')
        } catch (err) {
            console.error('Error reading e2e coverage:', err)
        }
    }

    // Create merged directory if it doesn't exist
    const mergedDir = path.join(process.cwd(), 'coverage/merged')
    if (!fs.existsSync(mergedDir)) {
        fs.mkdirSync(mergedDir, { recursive: true })
    }

    // Merge coverage data with priority for unit tests
    Object.entries(unitMap.toJSON()).forEach(([file, coverage]) => {
        finalMap.addFileCoverage(coverage)
    })

    // For any files not covered by unit tests, add e2e coverage
    Object.entries(e2eMap.toJSON()).forEach(([file, coverage]) => {
        try {
            if (!finalMap.data[file]) {
                finalMap.addFileCoverage(coverage)
            }
        } catch (err) {
            console.warn(`Warning: Could not merge coverage for ${file}:`, err.message)
        }
    })

    // Write merged coverage data
    const mergedCoveragePath = path.join(mergedDir, 'coverage-final.json')
    fs.writeFileSync(mergedCoveragePath, JSON.stringify(finalMap.toJSON(), null, 2))

    // Write LCOV format too
    const Reporter = require('istanbul-lib-report')
    const reports = require('istanbul-reports')
    const { createContext } = require('istanbul-lib-report')

    const context = createContext({
        dir: mergedDir,
        coverageMap: finalMap
    })

    const lcovReport = reports.create('lcov', { dir: mergedDir })
    lcovReport.execute(context)

    const htmlReport = reports.create('html', { dir: path.join(mergedDir, 'lcov-report') })
    htmlReport.execute(context)

    console.log('Merged coverage reports written to', mergedDir)
}

// Call the function and catch any errors
mergeCoverage().catch(err => {
    console.error('Error merging coverage:', err)
    process.exit(1)
})
