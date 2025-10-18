#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runLighthouseAudit(url) {
  console.log('🔍 Starting Lighthouse performance audit...');
  
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  try {
    const runnerResult = await lighthouse(url, options);
    
    // Save HTML report
    const reportHtml = runnerResult.report;
    const reportPath = path.join(__dirname, '..', 'lighthouse-report.html');
    fs.writeFileSync(reportPath, reportHtml);
    
    // Extract key metrics
    const lhr = runnerResult.lhr;
    const categories = lhr.categories;
    
    console.log('\n📊 Performance Audit Results:');
    console.log('================================');
    
    Object.keys(categories).forEach(category => {
      const score = Math.round(categories[category].score * 100);
      const emoji = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
      console.log(`${emoji} ${category.toUpperCase()}: ${score}/100`);
    });
    
    // Performance metrics
    const audits = lhr.audits;
    console.log('\n⚡ Key Performance Metrics:');
    console.log('==========================');
    
    const metrics = [
      'first-contentful-paint',
      'largest-contentful-paint',
      'speed-index',
      'cumulative-layout-shift',
      'total-blocking-time',
      'interactive'
    ];
    
    metrics.forEach(metric => {
      if (audits[metric]) {
        const value = audits[metric].displayValue || audits[metric].numericValue;
        const score = audits[metric].score;
        const emoji = score >= 0.9 ? '🟢' : score >= 0.5 ? '🟡' : '🔴';
        console.log(`${emoji} ${metric}: ${value}`);
      }
    });
    
    console.log(`\n📄 Full report saved to: ${reportPath}`);
    
  } catch (error) {
    console.error('❌ Lighthouse audit failed:', error);
  } finally {
    await chrome.kill();
  }
}

// Run audit if URL provided
const url = process.argv[2] || 'http://localhost:3000';
runLighthouseAudit(url).catch(console.error);
