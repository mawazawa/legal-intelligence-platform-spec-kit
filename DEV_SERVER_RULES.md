# Dev Server Rules - STRICT PORT 3000 ENFORCEMENT

## =® CRITICAL RULES

**ONLY PORT 3000. ONE DEV SERVER. PERIOD.**

This project enforces strict dev server rules to prevent port sprawl (3000, 3001, 3002, etc.).

---

##  How to Run Dev Server

```bash
npm run dev
```

**What happens:**
1.  Checks if port 3000 is in use
2. =* Kills any process using port 3000
3. =* Kills any zombie Next.js dev processes
4.  Verifies port 3000 is free
5. =Ä Starts dev server on port 3000 ONLY

**Output:**
```
= Checking for existing dev servers...
 Port 3000 is available
=Ä Starting dev server on http://localhost:3000

```

---

## =* Kill Existing Dev Servers

If you need to manually kill dev servers:

```bash
npm run kill-dev
```

This kills:
- Any process on port 3000
- All Next.js dev processes
- Background zombie processes

---

## † Emergency Use Only

If you absolutely must bypass the enforcement (NOT RECOMMENDED):

```bash
npm run dev:unsafe
```

**WARNING:** This allows Next.js to auto-increment ports (3000 í 3001 í 3002).
**DO NOT USE THIS** unless you have a very specific reason.

---

## =À Scripts Reference

| Script | Purpose | Use Case |
|--------|---------|----------|
| `npm run dev` | **Start dev server with enforcement** |  Always use this |
| `npm run kill-dev` | Kill all dev servers | When stuck processes exist |
| `npm run dev:unsafe` | Bypass enforcement | † Emergency only |

---

## =' How It Works

### Script: `scripts/dev-server.sh`

```bash
1. Check port 3000 í If in use í Kill process
2. Check for zombie Next.js processes í Kill all
3. Verify port is free í Exit if still blocked
4. Start Next.js on PORT=3000 (forced)
```

### package.json Changes

```json
{
  "scripts": {
    "dev": "./scripts/dev-server.sh",  // ê Enforced
    "dev:unsafe": "next dev --turbopack", // ê Bypass
    "kill-dev": "lsof -ti:3000 | xargs kill -9 ..." // ê Cleanup
  }
}
```

---

## = Troubleshooting

### Problem: "Port 3000 is still in use"

**Solution:**
```bash
# Manual cleanup
npm run kill-dev

# Then restart
npm run dev
```

### Problem: "Permission denied: scripts/dev-server.sh"

**Solution:**
```bash
chmod +x scripts/dev-server.sh
```

### Problem: "Cannot find module 'next'"

**Solution:**
```bash
npm install
npm run dev
```

---

## =° Why This Matters

**Before:**
```
Developer A: npm run dev í Port 3000
Developer A: npm run dev (again) í Port 3001
Developer A: npm run dev (again) í Port 3002
Claude Agent: npm run dev í Port 3005
...chaos ensues...
```

**After:**
```
Anyone: npm run dev í Kills existing í Port 3000
Anyone: npm run dev (again) í Kills existing í Port 3000
Anyone: npm run dev (always) í Port 3000 ONLY
```

**Benefits:**
-  Consistent development URLs
-  No port confusion
-  Easier debugging (always localhost:3000)
-  Cleaner process management
-  Prevents zombie processes

---

## <Ø Best Practices

1. **Always use `npm run dev`** - Never bypass enforcement
2. **One terminal, one server** - Don't open multiple terminals
3. **Use Ctrl+C to stop** - Graceful shutdown
4. **Run `npm run kill-dev`** - If you see port errors
5. **Check localhost:3000** - Always the same URL

---

## =› Notes for Claude Agents

When asked to start the dev server:
1. Always use `npm run dev` (not `npm run dev:unsafe`)
2. Never use background mode (`&`) unless explicitly requested
3. If port errors occur, run `npm run kill-dev` first
4. Dev server always runs on port 3000

---

**Created:** 2025-10-17
**Enforced By:** scripts/dev-server.sh
**Maintained By:** Project team
**Port:** 3000 (and ONLY 3000)
