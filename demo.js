const { execSync, spawn } = require('node:child_process');
const { existsSync } = require('node:fs');
const { join } = require('node:path');

const main = async () => {
  console.log('Starting tsup with --watch --clean --publicDir...')
  const proc = spawn('npx', ['tsup', 'src/index.ts', '--watch', '--clean', '--publicDir'], { stdio: 'inherit' });
  await wait(1000)

  console.log('Checking example.txt (from public dir) is copied')
  if (!existsSync(join(__dirname, 'dist', 'example.txt'))) {
    throw new Error("example.txt missing")
  }
  console.log('It is copied correctly!')
  
  console.log('Now editing src/index.ts...')
  execSync('touch src/index.ts')
  await wait(1000)
  
  console.log('Checking example.txt (from public dir) is copied now')
  if (existsSync(join(__dirname, 'dist', 'example.txt'))) {
    throw new Error("example.txt was present - bug is fixed?")
  }
  console.log('It is missing! This is the bug.')

  proc.kill('SIGINT')
  process.exit()
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

main()
