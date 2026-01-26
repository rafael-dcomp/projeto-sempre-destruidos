#!/usr/bin/env node

/**
 * CI/CD Maturity Audit Script
 * 
 * This script analyzes a GitHub repository to evaluate its CI/CD maturity level.
 * It uses the GitHub API to collect data about workflows, pull requests, and checks.
 * 
 * Usage:
 *   node ci-audit.js <owner> <repo> [github-token]
 * 
 * Example:
 *   node ci-audit.js rafael-dcomp projeto-sempre-destruidos
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const GITHUB_API_BASE = 'https://api.github.com';
const OUTPUT_DIR = path.join(__dirname, '../../docs/audit');

// Utility function to make GitHub API requests
function githubRequest(path, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: path,
            method: 'GET',
            headers: {
                'User-Agent': 'CI-Audit-Script',
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `token ${token}`;
        }

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error('Failed to parse JSON response'));
                    }
                } else if (res.statusCode === 404) {
                    resolve(null);
                } else {
                    reject(new Error(`GitHub API returned status ${res.statusCode}: ${data}`));
                }
            });
        });
        
        req.on('error', (e) => {
            reject(e);
        });
        
        req.end();
    });
}

// Check if .github/workflows directory exists
async function checkWorkflowsExist(owner, repo, token) {
    try {
        const result = await githubRequest(`/repos/${owner}/${repo}/contents/.github/workflows`, token);
        return result !== null && Array.isArray(result);
    } catch (error) {
        return false;
    }
}

// Get workflow files
async function getWorkflowFiles(owner, repo, token) {
    try {
        const files = await githubRequest(`/repos/${owner}/${repo}/contents/.github/workflows`, token);
        if (!files || !Array.isArray(files)) return [];
        
        return files.filter(file => 
            file.name.endsWith('.yml') || file.name.endsWith('.yaml')
        );
    } catch (error) {
        return [];
    }
}

// Get workflow file content
async function getWorkflowContent(downloadUrl) {
    return new Promise((resolve, reject) => {
        https.get(downloadUrl, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// Get repository information
async function getRepoInfo(owner, repo, token) {
    return await githubRequest(`/repos/${owner}/${repo}`, token);
}

// Get recent pull requests
async function getPullRequests(owner, repo, token, state = 'all', perPage = 30) {
    return await githubRequest(`/repos/${owner}/${repo}/pulls?state=${state}&per_page=${perPage}`, token);
}

// Get check runs for a commit
async function getCheckRuns(owner, repo, ref, token) {
    try {
        const result = await githubRequest(`/repos/${owner}/${repo}/commits/${ref}/check-runs`, token);
        return result;
    } catch (error) {
        return null;
    }
}

// Analyze repository maturity
async function analyzeRepository(owner, repo, token) {
    console.log(`\n🔍 Analyzing repository: ${owner}/${repo}\n`);
    
    const analysis = {
        repository: `${owner}/${repo}`,
        timestamp: new Date().toISOString(),
        hasCI: false,
        hasBuildSystem: false,
        hasTests: false,
        workflows: [],
        pullRequests: {
            total: 0,
            withChecks: 0,
            withoutChecks: 0
        },
        maturityLevel: 'None',
        risks: [],
        recommendations: []
    };

    try {
        // Get repository info
        console.log('📊 Fetching repository information...');
        const repoInfo = await getRepoInfo(owner, repo, token);
        if (repoInfo) {
            analysis.repoInfo = {
                name: repoInfo.name,
                description: repoInfo.description,
                language: repoInfo.language,
                stars: repoInfo.stargazers_count,
                forks: repoInfo.forks_count,
                openIssues: repoInfo.open_issues_count
            };
        }

        // Check for workflows
        console.log('🔎 Checking for GitHub Actions workflows...');
        const hasWorkflows = await checkWorkflowsExist(owner, repo, token);
        analysis.hasCI = hasWorkflows;

        if (hasWorkflows) {
            const workflowFiles = await getWorkflowFiles(owner, repo, token);
            console.log(`✅ Found ${workflowFiles.length} workflow file(s)`);
            
            for (const file of workflowFiles) {
                console.log(`   - ${file.name}`);
                const content = await getWorkflowContent(file.download_url);
                analysis.workflows.push({
                    name: file.name,
                    path: file.path,
                    content: content
                });
            }
        } else {
            console.log('❌ No GitHub Actions workflows found');
        }

        // Check for package.json and scripts
        console.log('📦 Checking for build system...');
        try {
            const packageJson = await githubRequest(`/repos/${owner}/${repo}/contents/package.json`, token);
            if (packageJson) {
                const content = Buffer.from(packageJson.content, 'base64').toString('utf-8');
                const pkg = JSON.parse(content);
                analysis.hasBuildSystem = true;
                analysis.packageScripts = pkg.scripts || {};
                
                if (pkg.scripts) {
                    analysis.hasTests = !!(pkg.scripts.test && pkg.scripts.test !== 'echo "Error: no test specified" && exit 1');
                    console.log(`✅ Build system detected (npm)`);
                    console.log(`   Scripts: ${Object.keys(pkg.scripts).join(', ')}`);
                }
            }
        } catch (error) {
            console.log('⚠️  No package.json found');
        }

        // Analyze pull requests
        console.log('🔄 Analyzing pull requests...');
        const pullRequests = await getPullRequests(owner, repo, token);
        
        if (pullRequests && Array.isArray(pullRequests)) {
            analysis.pullRequests.total = pullRequests.length;
            console.log(`   Found ${pullRequests.length} pull requests`);
            
            let withChecks = 0;
            for (const pr of pullRequests.slice(0, 10)) { // Check first 10 PRs
                const checks = await getCheckRuns(owner, repo, pr.head.sha, token);
                if (checks && checks.total_count > 0) {
                    withChecks++;
                }
            }
            analysis.pullRequests.withChecks = withChecks;
            analysis.pullRequests.withoutChecks = Math.min(10, pullRequests.length) - withChecks;
            console.log(`   PRs with checks: ${withChecks}`);
            console.log(`   PRs without checks: ${analysis.pullRequests.withoutChecks}`);
        }

        // Determine maturity level
        if (!analysis.hasCI) {
            analysis.maturityLevel = 'Initial (Level 1)';
            analysis.risks = [
                'No automated CI/CD pipeline',
                'Manual testing increases risk of regressions',
                'No automated quality checks',
                'Dependent on individual developer knowledge',
                'Difficult onboarding for new contributors',
                'No consistent build process',
                'Longer time to detect issues'
            ];
            analysis.recommendations = [
                'Implement GitHub Actions workflow for automated builds',
                'Add automated testing to the pipeline',
                'Configure code quality checks (linting, static analysis)',
                'Set up automated deployment for different environments',
                'Require CI checks to pass before merging PRs',
                'Document the build and test process'
            ];
        } else if (analysis.hasCI && !analysis.hasTests) {
            analysis.maturityLevel = 'Basic (Level 2)';
            analysis.risks = [
                'CI pipeline exists but no automated tests',
                'Limited quality assurance',
                'Potential for undetected regressions'
            ];
            analysis.recommendations = [
                'Add unit tests to the codebase',
                'Integrate test execution in CI pipeline',
                'Add code coverage reporting',
                'Implement integration tests'
            ];
        } else if (analysis.hasCI && analysis.hasTests) {
            analysis.maturityLevel = 'Managed (Level 3)';
            analysis.recommendations = [
                'Consider adding deployment automation',
                'Implement branch protection rules',
                'Add performance testing',
                'Set up monitoring and alerts'
            ];
        }

    } catch (error) {
        console.error('❌ Error during analysis:', error.message);
        analysis.error = error.message;
    }

    return analysis;
}

// Generate markdown report
function generateMarkdownReport(analysis) {
    let report = `# CI/CD Maturity Audit Report\n\n`;
    report += `**Repository:** ${analysis.repository}\n`;
    report += `**Date:** ${new Date(analysis.timestamp).toLocaleString()}\n`;
    report += `**Maturity Level:** ${analysis.maturityLevel}\n\n`;
    
    report += `---\n\n`;
    
    report += `## 📊 Repository Overview\n\n`;
    if (analysis.repoInfo) {
        report += `- **Name:** ${analysis.repoInfo.name}\n`;
        if (analysis.repoInfo.description) {
            report += `- **Description:** ${analysis.repoInfo.description}\n`;
        }
        report += `- **Language:** ${analysis.repoInfo.language || 'Not specified'}\n`;
        report += `- **Stars:** ${analysis.repoInfo.stars}\n`;
        report += `- **Forks:** ${analysis.repoInfo.forks}\n`;
        report += `- **Open Issues:** ${analysis.repoInfo.openIssues}\n`;
    }
    report += `\n`;
    
    report += `## 🔍 CI/CD Analysis\n\n`;
    report += `### Automation Status\n\n`;
    report += `- **Has CI/CD Pipeline:** ${analysis.hasCI ? '✅ Yes' : '❌ No'}\n`;
    report += `- **Has Build System:** ${analysis.hasBuildSystem ? '✅ Yes' : '❌ No'}\n`;
    report += `- **Has Automated Tests:** ${analysis.hasTests ? '✅ Yes' : '❌ No'}\n\n`;
    
    if (analysis.workflows.length > 0) {
        report += `### Workflows Found\n\n`;
        analysis.workflows.forEach(workflow => {
            report += `#### ${workflow.name}\n\n`;
            report += `**Path:** \`${workflow.path}\`\n\n`;
            report += `<details>\n<summary>View workflow content</summary>\n\n`;
            report += `\`\`\`yaml\n${workflow.content}\n\`\`\`\n\n`;
            report += `</details>\n\n`;
        });
    }
    
    if (analysis.packageScripts) {
        report += `### Build Scripts Available\n\n`;
        Object.entries(analysis.packageScripts).forEach(([script, command]) => {
            report += `- **${script}:** \`${command}\`\n`;
        });
        report += `\n`;
    }
    
    report += `### Pull Request Analysis\n\n`;
    report += `- **Total PRs Analyzed:** ${analysis.pullRequests.total}\n`;
    report += `- **PRs with Automated Checks:** ${analysis.pullRequests.withChecks}\n`;
    report += `- **PRs without Checks:** ${analysis.pullRequests.withoutChecks}\n\n`;
    
    if (analysis.risks.length > 0) {
        report += `## ⚠️ Identified Risks\n\n`;
        analysis.risks.forEach(risk => {
            report += `- ${risk}\n`;
        });
        report += `\n`;
    }
    
    if (analysis.recommendations.length > 0) {
        report += `## 💡 Recommendations\n\n`;
        analysis.recommendations.forEach((rec, idx) => {
            report += `${idx + 1}. ${rec}\n`;
        });
        report += `\n`;
    }
    
    report += `## 📈 Maturity Model\n\n`;
    report += `### Level 1 - Initial\n`;
    report += `- No automated CI/CD\n`;
    report += `- Manual builds and tests\n`;
    report += `- Ad-hoc processes\n\n`;
    
    report += `### Level 2 - Basic\n`;
    report += `- Basic CI pipeline exists\n`;
    report += `- Automated builds\n`;
    report += `- Limited or no automated testing\n\n`;
    
    report += `### Level 3 - Managed\n`;
    report += `- CI/CD with automated tests\n`;
    report += `- Code quality checks\n`;
    report += `- Consistent processes\n\n`;
    
    report += `### Level 4 - Optimized\n`;
    report += `- Automated deployments\n`;
    report += `- Comprehensive test coverage\n`;
    report += `- Performance and security checks\n`;
    report += `- Monitoring and feedback loops\n\n`;
    
    report += `---\n\n`;
    report += `*Report generated by CI/CD Maturity Audit Tool*\n`;
    
    return report;
}

// Main function
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.error('Usage: node ci-audit.js <owner> <repo> [github-token]');
        console.error('Example: node ci-audit.js rafael-dcomp projeto-sempre-destruidos');
        process.exit(1);
    }
    
    const owner = args[0];
    const repo = args[1];
    const token = args[2] || process.env.GITHUB_TOKEN;
    
    if (!token) {
        console.warn('⚠️  No GitHub token provided. API rate limits will be restricted.');
        console.warn('   Set GITHUB_TOKEN environment variable or pass as third argument.\n');
    }
    
    try {
        const analysis = await analyzeRepository(owner, repo, token);
        
        // Create output directory
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }
        
        // Save JSON report
        const jsonPath = path.join(OUTPUT_DIR, 'audit-report.json');
        fs.writeFileSync(jsonPath, JSON.stringify(analysis, null, 2));
        console.log(`\n✅ JSON report saved to: ${jsonPath}`);
        
        // Generate and save markdown report
        const mdReport = generateMarkdownReport(analysis);
        const mdPath = path.join(OUTPUT_DIR, 'audit-report.md');
        fs.writeFileSync(mdPath, mdReport);
        console.log(`✅ Markdown report saved to: ${mdPath}`);
        
        // Print summary
        console.log('\n' + '='.repeat(60));
        console.log('AUDIT SUMMARY');
        console.log('='.repeat(60));
        console.log(`Repository: ${analysis.repository}`);
        console.log(`Maturity Level: ${analysis.maturityLevel}`);
        console.log(`Has CI/CD: ${analysis.hasCI ? 'Yes ✅' : 'No ❌'}`);
        console.log(`Has Tests: ${analysis.hasTests ? 'Yes ✅' : 'No ❌'}`);
        console.log('='.repeat(60) + '\n');
        
    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { analyzeRepository, generateMarkdownReport };
