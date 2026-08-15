// dsh-evidence-dashboard — Host half: serves the release archive to the
// Client half over Package-private RPC (harness.handle / host.call).
//
// Data sources (plain JSON files under data/):
//   data/overview.json                      — components + release notes
//   data/evidence-map-v2.json              — design decisions log
//   data/attention-conflict-matrix-v2.json — rejected options log
//   data/versions.json                     — version tree (release history)
//   data/CHANGELOG.md                      — bundled changelog snapshot (fallback for the timeline)
//
// Portability: the data directory is resolved by probing DATA_DIR_CANDIDATES
// in order (first existing wins); the resolved path is reported by the
// 'catalog' dataset. Point the first candidate at your copy when deploying.

const DATA_DIR_CANDIDATES = [
  '/Users/tangyaoyue/DEV/deepseek_harnees_experiment/opensource/plugins/evidence-dashboard/data',
  './plugins/evidence-dashboard/data',
  './data'
]

return {
  name: 'dsh-evidence-dashboard',
  apply(ctx) {
    const fs = ctx.get('fs')
    if (fs === undefined) return

    let dataDir = DATA_DIR_CANDIDATES[0]
    let dataDirResolved = false
    async function resolveDataDir() {
      if (dataDirResolved) return
      for (const candidate of DATA_DIR_CANDIDATES) {
        try {
          const target = await fs.resolve(candidate)
          const info = await fs.stat(target)
          if (info !== undefined) { dataDir = candidate; break }
        } catch (ignored) { /* try the next candidate */ }
      }
      dataDirResolved = true
    }

    const cache = {}
    async function readJson(rel) {
      if (cache[rel] !== undefined) return cache[rel]
      await resolveDataDir()
      const target = await fs.resolve(dataDir + '/' + rel)
      const text = await fs.readText(target)
      const value = JSON.parse(text)
      cache[rel] = value
      return value
    }

    harness.handle('dash_data', async (args) => {
      const dataset = args && args.dataset
      try {
        if (dataset === 'catalog') {
          await resolveDataDir()
          const overview = await readJson('overview.json')
          const evidence = await readJson('evidence-map-v2.json')
          const conflicts = await readJson('attention-conflict-matrix-v2.json')
          const versions = await readJson('versions.json')
          const nodeCount = (versions.branches || []).reduce(function (acc, b) { return acc + (b.nodes || []).length }, 0)
          return {
            data_dir: dataDir,
            datasets: [
              { id: 'overview', label: 'Overview', count: (overview.components || []).length, description: 'Components, release highlights, runtime notes, design principles, compatibility.' },
              { id: 'evidence', label: 'Decisions', count: (evidence.entries || []).length, description: 'Design decisions log with rationale and trade-offs.' },
              { id: 'conflicts', label: 'Rejected options', count: (conflicts.entries || []).length, description: 'Options that were considered and rejected, with reasons.' },
              { id: 'versions', label: 'Versions', count: nodeCount, description: "Version tree of this repository's releases + changelog timeline." }
            ]
          }
        }
        if (dataset === 'overview') return await readJson('overview.json')
        if (dataset === 'evidence') return await readJson('evidence-map-v2.json')
        if (dataset === 'conflicts') return await readJson('attention-conflict-matrix-v2.json')
        if (dataset === 'versions') return await readJson('versions.json')
        if (dataset === 'changelog') {
          await resolveDataDir()
          const candidates = [dataDir + '/../../../CHANGELOG.md', dataDir + '/../../CHANGELOG.md', dataDir + '/CHANGELOG.md']
          for (const candidate of candidates) {
            try {
              const target = await fs.resolve(candidate)
              const info = await fs.stat(target)
              if (info !== undefined) {
                const text = await fs.readText(target)
                return { markdown: text, source: candidate }
              }
            } catch (ignored) { /* try the next candidate */ }
          }
          return { error: 'CHANGELOG.md not found near the data directory' }
        }
        return { error: 'unknown dataset: ' + String(dataset) }
      } catch (error) {
        return { error: 'data load failed: ' + String(error && error.message ? error.message : error) }
      }
    })
  },
}
