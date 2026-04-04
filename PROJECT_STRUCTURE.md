# Project Structure

```
ytmanim/
├── videos/
│   └── shorts/                # Short video scripts (grouped by topic)
│       ├── git/
│       ├── dns/
│       ├── docker/
│       ├── https/
│       ├── bigo/
│       ├── jwt/
│       ├── css/
│       ├── git_branching/
│       ├── rest_graphql/
│       ├── load_balancer/
│       ├── tcp_udp/
│       ├── http_methods/
│       ├── sql_joins/
│       ├── stack_queue/
│       ├── linked_list/
│       ├── binary_search/
│       ├── hash_table/
│       ├── recursion/
│       ├── oauth/
│       ├── cors/
│       ├── websockets/
│       ├── caching/
│       ├── cdn/
│       ├── cicd/
│       ├── kubernetes/
│       ├── microservices/
│       ├── sql_nosql/
│       ├── acid/
│       ├── cap_theorem/
│       ├── race_condition/
│       ├── deadlock/
│       ├── mutex/
│       ├── pub_sub/
│       ├── message_queue/
│       ├── event_loop/
│       ├── callback_hell/
│       ├── promises/
│       ├── async_await/
│       ├── closure/
│       ├── hoisting/
│       ├── prototype/
│       ├── virtual_dom/
│       ├── ssr_csr/
│       ├── cookies_sessions/
│       ├── xss/
│       ├── sql_injection/
│       ├── csrf/
│       ├── rate_limiting/
│       ├── pagination/
│       ├── indexing/
│       ├── sharding/
│       ├── replication/
│       ├── proxy_reverse/
│       ├── osi_model/
│       ├── tcp_handshake/
│       ├── ip_address/
│       ├── subnetting/
│       ├── encryption/
│       ├── hashing/
│       └── design_patterns/
├── media/                      # Generated output (ignored by git)
│   ├── videos/
│   └── thumbnails/
├── scripts/                    # Utility scripts
│   ├── render_video.py         # Render videos + add background music
│   ├── generate_thumbnails.py  # Generate YouTube thumbnails
│   └── export_metadata.py      # Export YouTube titles/descriptions/tags
├── config.json                 # Topics, scenes, YouTube metadata, render list
├── music.mp3                   # Background music
├── requirements.txt            # Dependencies
├── pyproject.toml              # Project configuration
├── .gitignore                  # Git ignore rules
├── .github/
│   └── workflows/
│       └── render.yml          # GitHub Actions workflow
└── README.md                   # Project documentation
```

## Usage

1. Install dependencies: `uv pip install -r requirements.txt`
2. Edit `config.json` → set topics in `"render"` array
3. Render videos: `python scripts/render_video.py`
4. Generate thumbnails: `python scripts/generate_thumbnails.py`
5. Export YouTube metadata: `python scripts/export_metadata.py`
6. Output will be in `media/` folder

## Video Topics (60)

- Git Commands You Didn't Know ✅
- How DNS Works ✅
- Docker vs VM ✅
- How HTTPS Handshake Works ✅
- Big O Notation Explained ✅
- How JWT Tokens Work ✅
- CSS Flexbox vs Grid ✅
- How Git Branching Works ✅
- REST vs GraphQL ✅
- How Load Balancers Work ✅
- TCP vs UDP ✅
- HTTP Methods ✅
- SQL Joins Visualized ✅
- Stack vs Queue ✅
- Linked List ✅
- Binary Search ✅
- Hash Tables ✅
- Recursion ✅
- OAuth 2.0 Flow ✅
- CORS Explained ✅
- WebSockets ✅
- How Caching Works ✅
- How CDN Works ✅
- CI/CD Pipeline ✅
- Kubernetes ✅
- Microservices vs Monolith ✅
- SQL vs NoSQL ✅
- ACID Properties ✅
- CAP Theorem ✅
- Race Condition ✅
- Deadlock ✅
- Mutex ✅
- Pub/Sub Pattern ✅
- Message Queues ✅
- Event Loop ✅
- Callback Hell ✅
- Promises ✅
- Async/Await ✅
- Closures ✅
- JavaScript Hoisting ✅
- Prototype Chain ✅
- Virtual DOM ✅
- SSR vs CSR ✅
- Cookies vs Sessions ✅
- XSS Attack ✅
- SQL Injection ✅
- CSRF Attack ✅
- Rate Limiting ✅
- API Pagination ✅
- Database Indexing ✅
- Database Sharding ✅
- Database Replication ✅
- Proxy vs Reverse Proxy ✅
- OSI Model ✅
- TCP 3-Way Handshake ✅
- IP Addresses ✅
- Subnetting ✅
- Encryption ✅
- Hashing ✅
- Design Patterns ✅
