// scripts/generate-secrets.ts
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const envPath = path.resolve(process.cwd(), '.env');

function generateSecret(): string {
  return crypto.randomBytes(64).toString('hex');
}

function updateEnvFile(content: string, key: string, value: string): string {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(content)) {
    return content.replace(regex, `${key}=${value}`);
  }
  return content + `\n${key}=${value}`;
}

async function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 's');
    });
  });
}

async function main() {
  if (!fs.existsSync(envPath)) {
    console.error('❌ No se encontró el archivo .env');
    console.log('💡 Crea uno primero: cp .env.example .env');
    process.exit(1);
  }

  let content = fs.readFileSync(envPath, 'utf-8');

  const hasJwt = /^JWT_SECRET=.+$/m.test(content);
  const hasCsrf = /^CSRF_SECRET=.+$/m.test(content);

  if (hasJwt || hasCsrf) {
    console.log('⚠️  Ya existen secrets en el .env:');
    if (hasJwt) console.log('   - JWT_SECRET');
    if (hasCsrf) console.log('   - CSRF_SECRET');

    const ok = await confirm('\n¿Sobreescribir? (s/n): ');
    if (!ok) {
      console.log('❌ Operación cancelada');
      process.exit(0);
    }
  }

  const jwtSecret = generateSecret();
  const csrfSecret = generateSecret();

  content = updateEnvFile(content, 'JWT_SECRET', jwtSecret);
  content = updateEnvFile(content, 'CSRF_SECRET', csrfSecret);

  fs.writeFileSync(envPath, content, 'utf-8');

  console.log('✅ Secrets generados correctamente en .env');
  console.log('   - JWT_SECRET');
  console.log('   - CSRF_SECRET');
}

void main();
