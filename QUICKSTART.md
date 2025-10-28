# Quick Start Guide

## Testing Your Package Locally

### 1. Run Tests

```bash
cd smart-env
npm test
```

All 26 tests should pass.

### 2. Build the Package

```bash
npm run build
```

This creates optimized CJS and ESM bundles in `dist/`.

### 3. Test in a Local Project

Create a test project:

```bash
mkdir ../test-smart-env
cd ../test-smart-env
npm init -y
npm install typescript @types/node zod
npm link ../smart-env
```

Create `test.ts`:

```typescript
import { loadEnv, defineSchema } from "smart-env";

const schema = defineSchema({
  PORT: { type: "number", default: 3000 },
  API_KEY: { type: "string", required: true },
});

try {
  const env = loadEnv(schema);
  console.log("Loaded:", env);
} catch (error) {
  console.error("Error:", error);
}
```

Create `.env`:

```
PORT=8080
API_KEY=test123
```

Run it:

```bash
npx ts-node test.ts
```

## Publishing to NPM

### 1. Verify Package Contents

```bash
npm pack --dry-run
```

This shows what will be published.

### 2. Login to NPM

```bash
npm login
```

### 3. Publish

```bash
npm publish --access public
```

### 4. Verify Publication

```bash
npm view smart-env
```

## Setting Up GitHub

### 1. Create Repository

```bash
git init
git add .
git commit -m "Initial commit: smart-env v0.1.0"
```

### 2. Push to GitHub

```bash
git remote add origin https://github.com/yourusername/smart-env.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Actions

The CI workflow in `.github/workflows/ci.yml` will run automatically on push.

### 4. Add NPM Token for Auto-Publish

1. Get your NPM token from npmjs.com
2. Add it to GitHub secrets as `NPM_TOKEN`
3. Uncomment the publish step in `ci.yml`

## Development Workflow

### Watch Mode

```bash
npm run dev
```

Rebuilds on file changes.

### Coverage Report

```bash
npm run test:coverage
```

Generates coverage report in `coverage/` directory.

## Package Info

- **Size**: ~2.2 KB gzipped
- **Format**: Dual ESM/CJS
- **TypeScript**: Full type definitions included
- **Peer Dependencies**: zod (optional)
- **Node**: 18+

## Next Steps

1. ✅ Tests pass
2. ✅ Build succeeds
3. ⬜ Publish to NPM
4. ⬜ Create GitHub repository
5. ⬜ Add NPM and build badges
6. ⬜ Announce on Twitter/Dev.to
7. ⬜ Submit to awesome-nodejs lists

## Support

For issues and questions:

- GitHub Issues: https://github.com/yourusername/smart-env/issues
- NPM: https://www.npmjs.com/package/smart-env

## License

MIT
