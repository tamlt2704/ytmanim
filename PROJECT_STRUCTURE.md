# Project Structure

```
ytmanim/
├── videos/                 # Manim video scripts (grouped by topic)
│   ├── git/
│   │   └── git_commands_video.py
│   ├── dns/
│   │   └── how_dns_works.py
│   ├── docker/
│   │   └── docker_vs_vm.py
│   ├── https/
│   │   └── https_handshake.py
│   ├── bigo/
│   │   └── big_o_notation.py
│   ├── jwt/
│   │   └── how_jwt_works.py
│   ├── css/
│   │   └── flexbox_vs_grid.py
│   ├── git_branching/
│   │   └── git_branching.py
│   ├── rest_graphql/
│   │   └── rest_vs_graphql.py
│   └── load_balancer/
│       └── load_balancer.py
├── media/                  # Generated videos (ignored by git)
├── scripts/                # Utility scripts
│   └── render_video.py
├── config.json            # Render configuration
├── music.mp3              # Background music
├── requirements.txt        # Dependencies
├── pyproject.toml         # Project configuration
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation
```

## Usage

1. Install dependencies: `uv pip install -r requirements.txt`
2. Edit `config.json` → set topics in `"render"` array
3. Render video: `python scripts/render_video.py`
4. Output will be in `media/videos/` folder

## Video Topics

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
