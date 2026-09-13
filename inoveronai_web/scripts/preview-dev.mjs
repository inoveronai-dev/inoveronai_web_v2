import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const nextBin = fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url))
const forwarded = process.argv.slice(2)
const args = ['dev']

for (let index = 0; index < forwarded.length; index += 1) {
  const argument = forwarded[index]
  if (argument === '--strictPort') continue
  if (argument === '--host') {
    args.push('--hostname', forwarded[index + 1])
    index += 1
    continue
  }
  args.push(argument)
}

const child = spawn(process.execPath, [nextBin, ...args], { stdio: 'inherit' })

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal))
}

child.on('exit', (code) => process.exit(code ?? 0))
