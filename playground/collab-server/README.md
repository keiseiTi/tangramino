# Collaboration Server

Real-time collaboration server for the Tangramino low-code editor using Fastify, Socket.IO, and Loro CRDT.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The server will start on `http://localhost:3001`.

## Configuration

Environment variables:
- `PORT` - Server port (default: 3001)
- `CORS_ORIGIN` - Allowed CORS origin (default: http://localhost:5173)

## API

### HTTP Endpoints

- `GET /health` - Health check
- `GET /rooms` - List active rooms

### Socket.IO Events

**Client -> Server:**
- `join-room` - Join a collaboration room
- `sync-request` - Request initial document sync
- `update` - Send local changes to server
- `init-schema` - Initialize document with schema (first client only)

**Server -> Client:**
- `room-joined` - Confirmation of room join with peer list
- `sync-response` - Initial document snapshot
- `remote-update` - Changes from other clients
- `peer-joined` / `peer-left` - Peer status updates

## Architecture

```
Client A ──────┐
               │
Client B ─────>│ Room ──> Loro Document (CRDT)
               │
Client C ──────┘
```

Each room maintains a single Loro document that automatically merges concurrent edits using CRDT conflict resolution.
