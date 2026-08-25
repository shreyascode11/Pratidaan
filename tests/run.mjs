import { spawn } from 'node:child_process'

/**
 * Runs each suite in its own process so one crash can't take down the rest,
 * and exits non-zero if any suite fails — suitable for CI.
 */
const suites = ['tests/e2e.test.mjs', 'tests/a11y.test.mjs']

let failed = 0
for (const suite of suites) {
  const code = await new Promise((resolve) => {
    spawn(process.execPath, [suite], { stdio: 'inherit' }).on('close', resolve)
  })
  if (code !== 0) failed++
}

console.log(
  failed === 0
    ? `\nAll ${suites.length} suites passed.`
    : `\n${failed} of ${suites.length} suites failed.`,
)
process.exit(failed > 0 ? 1 : 0)
