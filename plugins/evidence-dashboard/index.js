// dsh-evidence-dashboard — official bundle entry (host half).
// Serves the release archive over an exact HTTP route; the browser half ships
// through exports["./client"] (see package.json dsh.client).

import { readFileSync, statSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const PACKAGE_DIR = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(PACKAGE_DIR, 'data')

export const name = 'dsh-evidence-dashboard'
export const inject = ['webServer']

const cache = new Map()

function readJson(rel) {
  if (cache.has(rel)) return cache.get(rel)
  const value = JSON.parse(readFileSync(join(DATA_DIR, rel), 'utf8'))
  cache.set(rel, value)
  return value
}

function readChangelog() {
  if (cache.has('changelog')) return cache.get('changelog')
  const candidates = [
    join(PACKAGE_DIR, '..', '..', 'CHANGELOG.md'),
    join(DATA_DIR, 'CHANGELOG.md')
  ]
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      const markdown = readFileSync(candidate, 'utf8')
      cache.set('changelog', { markdown, source: candidate })
      return cache.get('changelog')
    }
  }
  return { error: 'CHANGELOG.md not found' }
}

function sendJson(res, value) {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(value))
}

export function apply(ctx) {
  console.log('[dsh-evidence-dashboard] bundle loaded')
  ctx.webServer.register({
    kind: 'exact',
    path: '/api/dash-data',
    handler: (req, res) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { Allow: 'GET, HEAD' })
        res.end()
        return
      }
      const url = new URL(req.url, 'http://localhost')
      const dataset = url.searchParams.get('dataset')
      try {
        if (dataset === 'catalog') {
          const overview = readJson('overview.json')
          const decisions = readJson('evidence-map-v2.json')
          const rejected = readJson('attention-conflict-matrix-v2.json')
          const versions = readJson('versions.json')
          const nodeCount = (versions.branches || []).reduce((acc, b) => acc + (b.nodes || []).length, 0)
          return sendJson(res, {
            data_dir: DATA_DIR,
            datasets: [
              { id: 'overview', label: 'Overview', count: (overview.components || []).length, description: 'Components, release highlights, runtime notes, design principles, compatibility.' },
              { id: 'evidence', label: 'Decisions', count: (decisions.entries || []).length, description: 'Design decisions log with rationale and trade-offs.' },
              { id: 'conflicts', label: 'Rejected options', count: (rejected.entries || []).length, description: 'Options that were considered and rejected, with reasons.' },
              { id: 'versions', label: 'Versions', count: nodeCount, description: "Version tree of this repository's releases + changelog timeline." }
            ]
          })
        }
        if (dataset === 'overview') return sendJson(res, readJson('overview.json'))
        if (dataset === 'evidence') return sendJson(res, readJson('evidence-map-v2.json'))
        if (dataset === 'conflicts') return sendJson(res, readJson('attention-conflict-matrix-v2.json'))
        if (dataset === 'versions') return sendJson(res, readJson('versions.json'))
        if (dataset === 'changelog') return sendJson(res, readChangelog())
        return sendJson(res, { error: 'unknown dataset: ' + String(dataset) })
      } catch (error) {
        return sendJson(res, { error: 'data load failed: ' + String(error && error.message ? error.message : error) })
      }
    }
  })
}
