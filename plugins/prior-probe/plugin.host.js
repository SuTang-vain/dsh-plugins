// dsh-prior-probe — Host half (self-contained, no client UI).
//
// A frozen probe-battery tool for the DeepSeek Harness. It measures how much
// of a probe's answer a model can produce from prior knowledge alone
// (no-harness, single-shot), scored with deterministic grader-equivalent
// regexes.
//
// Tools:
//   prior_probe_list  — list the bundled frozen probe batteries
//   prior_probe_score — offline, deterministic regex scoring of responses
//   prior_probe_run   — online no-harness single-shot probing via any
//                       OpenAI-compatible /chat/completions endpoint
//
// Bundled batteries (frozen 2026-08-14, embedded unmodified):
//   data/prior-guessability-probes-v1.json      — 8 general probes
//   data/prior-guessability-probes-ts-mcp-v1.json — 6 MCP TypeScript SDK probes
// The original JSON files ship beside this file under data/ for audit.

const BATTERIES = {
  v1: {
    name: 'dsh-v1',
    schema_version: 'prior-guessability-probes-v1',
    frozen_at: '2026-08-14',
    stale_after: '2026-11-14',
    recalibrate_hint: 'Batteries freeze the harness instruction set at frozen_at. Re-derive this battery against the current harness/target documentation and refresh frozen_at and stale_after before relying on scores taken after stale_after.',
    purpose: 'General prior-knowledge battery: composition editing, preset configuration, WCAG tiering, and git conventions.',
    probes: [
      { id: 'editing-realm-group', target: 'editing-cordis-compositions', task: 'ec-01',
        prompt: 'In a DeepSeek Harness agent preset, a plugin row named workflow-worker-thread publishes the workflows service. Show the correct composition structure for this preset so it mounts cleanly.',
        pattern: '- id: delegation[\\s\\S]*cordis:group[\\s\\S]*isolate:[\\s\\S]*workflows:\\s*true', flags: '', expected_direction: 'low' },
      { id: 'editing-provider-value', target: 'editing-cordis-compositions', task: 'ec-03',
        prompt: 'In a DeepSeek Harness preset, the row tool-subagent needs a provider config value. What value should the provider field be set to?',
        pattern: 'spawn', flags: '', expected_direction: 'low' },
      { id: 'headless-eval-pin', target: 'headless-preset', task: 'hp-04',
        prompt: 'In the DeepSeek Harness headless-agent composition, the eval-pin row has a config field called pin. What is its exact value?',
        pattern: 'eval-pin-7f3a', flags: '', expected_direction: 'low' },
      { id: 'headless-models', target: 'headless-preset', task: 'hp-03',
        prompt: 'Which model ids are registered under llm-deepseek in the DeepSeek Harness headless-agent composition?',
        pattern: 'deepseek-v4-pro[\\s\\S]*deepseek-v4-flash', flags: '', expected_direction: 'high' },
      { id: 'wcag-tier-alt', target: 'wcag-audit-patterns', task: 'wc-01',
        prompt: "In a WCAG audit report, classify the finding 'image has no alt text' into one of Critical, Serious, or Moderate.",
        pattern: 'Critical', flags: '', expected_direction: 'high' },
      { id: 'wcag-tier-title', target: 'wcag-audit-patterns', task: 'wc-02',
        prompt: "In a WCAG audit report, classify the finding 'page has no title' into one of Critical, Serious, or Moderate.",
        pattern: 'Serious', flags: '', expected_direction: 'high' },
      { id: 'gfw-commit-type', target: 'git-workflow-and-versioning', task: 'gw-01',
        prompt: 'Write a git commit message for adding a new feature, following the common project convention.',
        pattern: '^(feat|fix|refactor|test|docs|chore): ', flags: 'm', expected_direction: 'high' },
      { id: 'gfw-summary-header', target: 'git-workflow-and-versioning', task: 'gw-01-change-summary',
        prompt: "After a code change, you must write the project's structured change summary. Write the second section header of that template verbatim.",
        pattern: "THINGS I DIDN'T TOUCH", flags: '', expected_direction: 'low' }
    ]
  },
  tsmcp: {
    name: 'ts-mcp-screening',
    schema_version: 'prior-guessability-probes-v1',
    frozen_at: '2026-08-14',
    stale_after: '2026-11-14',
    recalibrate_hint: 'Batteries freeze the harness instruction set at frozen_at. Re-derive this battery against the current harness/target documentation and refresh frozen_at and stale_after before relying on scores taken after stale_after.',
    target: 'typescript-mcp-server-generator',
    source: 'github/awesome-copilot @ 336af71f (sha e409edb7 verified)',
    purpose: 'Prior-knowledge battery over the MCP TypeScript SDK v2: transport classes, package layout, and API shape.',
    probes: [
      { id: 'tsmcp-server-package',
        prompt: 'Which npm package provides the MCP TypeScript server implementation in the MCP TypeScript SDK v2?',
        pattern: '@modelcontextprotocol/server', flags: '', expected_direction: 'low' },
      { id: 'tsmcp-stdio-class',
        prompt: 'Which class provides the stdio transport for an MCP TypeScript SDK v2 server?',
        pattern: 'StdioServerTransport', flags: '', expected_direction: 'low' },
      { id: 'tsmcp-http-class',
        prompt: 'Which class provides the Streamable HTTP transport for a plain Node server in MCP TypeScript SDK v2?',
        pattern: 'NodeStreamableHTTPServerTransport', flags: '', expected_direction: 'low' },
      { id: 'tsmcp-register-api',
        prompt: 'How do you register a tool on an McpServer instance in the MCP TypeScript SDK v2?',
        pattern: 'registerTool', flags: '', expected_direction: 'low' },
      { id: 'tsmcp-zod-major',
        prompt: 'Which zod major version does the MCP TypeScript SDK v2 require?',
        pattern: '(?<![0-9])4(?![0-9])', flags: '', expected_direction: 'low' },
      { id: 'tsmcp-removed-transports',
        prompt: 'Which transports were removed in the MCP TypeScript SDK v2?',
        pattern: 'SSE[\\s\\S]{0,60}WebSocket|WebSocket[\\s\\S]{0,60}SSE', flags: '', expected_direction: 'low' }
    ]
  }
}

function matchProbe(probe, text) {
  try {
    const re = new RegExp(probe.pattern, probe.flags || '')
    return { pass: re.test(String(text || '')) ? 1 : 0 }
  } catch (error) {
    return { pass: 0, error: String(error && error.message ? error.message : error) }
  }
}

function batteryOf(key) {
  if (key === 'v1' || key === 'dsh-v1') return BATTERIES.v1
  if (key === 'tsmcp' || key === 'ts-mcp') return BATTERIES.tsmcp
  return undefined
}

// Calibration freshness: 'fresh' until stale_after, 'stale' afterwards.
// ISO date strings compare lexicographically.
function freshnessOf(battery) {
  if (!battery || !battery.stale_after) return 'unknown'
  const today = new Date().toISOString().slice(0, 10)
  return today <= battery.stale_after ? 'fresh' : 'stale'
}

return {
  name: 'dsh-prior-probe',
  apply(ctx) {
    const web = ctx.get('web')
    const fs = ctx.get('fs')

    harness.registerTool(ctx, harness.defineTool({
      name: 'prior_probe_list',
      description: 'List the bundled frozen prior-knowledge probe batteries: the 8-probe general battery and the 6-probe MCP TypeScript SDK battery, with their targets, prompts, grader regexes, expected directions, and calibration metadata (frozen_at, stale_after, freshness, recalibrate_hint).',
      parameters: {},
      output: { schema: { type: 'object', additionalProperties: true }, render(_a, v) { return [{ type: 'text', text: JSON.stringify(v, null, 2) }] } },
      async execute() {
        return {
          batteries: [
            { key: 'v1', name: BATTERIES.v1.name, frozen_at: BATTERIES.v1.frozen_at, stale_after: BATTERIES.v1.stale_after, freshness: freshnessOf(BATTERIES.v1), recalibrate_hint: BATTERIES.v1.recalibrate_hint, probe_count: BATTERIES.v1.probes.length, probes: BATTERIES.v1.probes.map(function (p) { return { id: p.id, target: p.target, task: p.task, expected_direction: p.expected_direction } }) },
            { key: 'tsmcp', name: BATTERIES.tsmcp.name, frozen_at: BATTERIES.tsmcp.frozen_at, stale_after: BATTERIES.tsmcp.stale_after, freshness: freshnessOf(BATTERIES.tsmcp), recalibrate_hint: BATTERIES.tsmcp.recalibrate_hint, target: BATTERIES.tsmcp.target, probe_count: BATTERIES.tsmcp.probes.length, probes: BATTERIES.tsmcp.probes.map(function (p) { return { id: p.id, expected_direction: p.expected_direction } }) }
          ]
        }
      },
    }))

    harness.registerTool(ctx, harness.defineTool({
      name: 'prior_probe_score',
      description: 'Score model response texts against a frozen probe battery with the grader-equivalent regexes — deterministic, offline, no model calls. Use it to audit the G computation or to hand-score answers. Flags probes whose G contradicts the frozen expected_direction.',
      parameters: {
        battery: { type: 'string', required: true, description: "Battery key: 'v1' (8 general probes) or 'tsmcp' (6 MCP SDK probes)." },
        responses: { type: 'array', required: true, description: 'Array of { id, text } — id matches a probe id in the battery, text is one model answer (or a concatenation of repeats per probe).' }
      },
      output: { schema: { type: 'object', additionalProperties: true }, render(_a, v) { return [{ type: 'text', text: JSON.stringify(v, null, 2) }] } },
      async execute(args) {
        const battery = batteryOf(args && args.battery)
        if (battery === undefined) return { error: "unknown battery '" + (args && args.battery) + "' — use 'v1' or 'tsmcp'" }
        const byId = {}
        const responses = Array.isArray(args && args.responses) ? args.responses : []
        for (const item of responses) {
          if (item && typeof item.id === 'string') byId[item.id] = String(item.text == null ? '' : item.text)
        }
        const perProbe = battery.probes.map(function (probe) {
          const text = byId[probe.id]
          if (text === undefined) return { id: probe.id, pass: null, note: 'no response supplied' }
          const result = matchProbe(probe, text)
          const flag = result.pass === 1 && probe.expected_direction === 'low' ? 'above expected (prior-covered?)' : null
          return { id: probe.id, pass: result.pass, flag: flag, sample: text.slice(0, 120) + (text.length > 120 ? '...' : '') }
        })
        const scored = perProbe.filter(function (row) { return row.pass !== null })
        const batteryG = scored.length === 0 ? null : scored.reduce(function (acc, row) { return acc + row.pass }, 0) / scored.length
        return { battery: battery.name, frozen_at: battery.frozen_at, stale_after: battery.stale_after, freshness: freshnessOf(battery), scored: scored.length + '/' + battery.probes.length, G: batteryG, per_probe: perProbe }
      },
    }))

    harness.registerTool(ctx, harness.defineTool({
      name: 'prior_probe_run',
      description: 'Run one frozen probe battery as no-harness single-shot completions against an OpenAI-compatible /chat/completions endpoint (temperature 0, no tools, no system prompt). Scores with the frozen regexes. NOTE: the api_key argument is recorded in this session\'s log; prefer api_key_file to keep the key out of the log.',
      parameters: {
        battery: { type: 'string', required: true, description: "Battery key: 'v1' or 'tsmcp'." },
        base_url: { type: 'string', required: true, description: 'OpenAI-compatible base URL, e.g. https://api.deepseek.com/v1' },
        api_key: { type: 'string', description: 'Bearer API key for the endpoint (recorded in the session log).' },
        api_key_file: { type: 'string', description: 'Optional path to a file whose first line is the Bearer API key — keeps the key out of the session log. Absolute path, or relative to the session workspace.' },
        model: { type: 'string', required: true, description: 'Model id served by the endpoint.' },
        repeats: { type: 'number', description: 'Repeats per probe (default 3).' }
      },
      output: { schema: { type: 'object', additionalProperties: true }, render(_a, v) { return [{ type: 'text', text: JSON.stringify(v, null, 2) }] } },
      async execute(args) {
        const battery = batteryOf(args && args.battery)
        if (battery === undefined) return { error: "unknown battery '" + (args && args.battery) + "' — use 'v1' or 'tsmcp'" }
        if (web === undefined) return { error: 'web service unavailable in this runtime; cannot call a model endpoint' }
        const baseUrl = String((args && args.base_url) || '').replace(/\/+$/, '')
        let apiKey = String((args && args.api_key) || '')
        if (!apiKey && args && typeof args.api_key_file === 'string' && args.api_key_file) {
          if (fs === undefined) return { error: 'api_key_file provided but the fs service is unavailable in this runtime' }
          try {
            const target = await fs.resolve(args.api_key_file)
            const text = await fs.readText(target)
            apiKey = String(text || '').split('\n')[0].trim().replace(/^["']|["']$/g, '')
          } catch (error) {
            return { error: 'api_key_file read failed: ' + String(error && error.message ? error.message : error) }
          }
        }
        const modelName = String((args && args.model) || '')
        const repeats = Math.max(1, Number(args && args.repeats ? args.repeats : 3))
        if (!baseUrl || !apiKey || !modelName) return { error: 'base_url, model, and api_key (or api_key_file) are required' }

        async function oneShot(probe) {
          const url = baseUrl + '/chat/completions'
          const payload = { model: modelName, temperature: 0, max_tokens: 1024, messages: [{ role: 'user', content: (probe.context ? probe.context + '\n\n' : '') + probe.prompt }] }
          let result = null
          try {
            result = await web.fetch({ url: url, method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey }, body: JSON.stringify(payload) })
          } catch (error) {
            return { transport_error: String(error && error.message ? error.message : error) }
          }
          let raw = ''
          if (typeof result === 'string') raw = result
          else if (result) {
            const candidate = result.text || result.content || result.body || result.data || result.responseText || result.json
            raw = typeof candidate === 'string' ? candidate : (candidate ? JSON.stringify(candidate) : '')
          }
          let text = raw
          try {
            const parsed = JSON.parse(raw)
            if (parsed && parsed.choices && parsed.choices[0] && parsed.choices[0].message) text = String(parsed.choices[0].message.content || '')
          } catch (parseError) {
            text = raw
          }
          return { text: text }
        }

        const results = []
        for (const probe of battery.probes) {
          let passes = 0
          const samples = []
          let transportError = null
          for (let r = 0; r < repeats; r++) {
            const shot = await oneShot(probe)
            if (shot.transport_error) { transportError = shot.transport_error; break }
            const match = matchProbe(probe, shot.text)
            passes += match.pass
            samples.push(String(shot.text || '').slice(0, 120))
          }
          const row = { id: probe.id, target: probe.target || battery.target, expected_direction: probe.expected_direction, attempts: transportError ? 0 : repeats, passes: passes, G: transportError ? null : passes / repeats, samples: samples }
          if (transportError) row.transport_error = transportError
          results.push(row)
        }

        return {
          battery: battery.name,
          model: modelName,
          endpoint: baseUrl,
          repeats: repeats,
          G_by_probe: results
        }
      },
    }))
  },
}
