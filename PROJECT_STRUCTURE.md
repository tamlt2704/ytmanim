# Project Structure

```
ytmanim/
├── motioncanvas/
│   └── my-animation/              # Motion Canvas project
│       ├── src/
│       │   ├── scenes/            # Animation scenes (.tsx)
│       │   ├── styles.ts          # Shared styles
│       │   ├── project.ts         # Scene imports & project config
│       │   └── project.meta       # Render settings (fps, resolution, exporter)
│       ├── output/                # Rendered video (ignored by git)
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
├── output/
│   └── videos/                    # Final video with background music (ignored by git)
├── config.json                    # YouTube metadata (titles, descriptions, tags)
├── music.mp3                      # Background music (loops if shorter than animation)
├── view_video.py                  # Render + add music + open video locally
├── requirements.txt               # Python dependencies
├── pyproject.toml                 # Project configuration
├── .gitignore                     # Git ignore rules
├── .github/
│   └── workflows/
│       └── render.yml             # GitHub Actions: render + add music
└── README.md
```

## Usage

1. Install Node.js dependencies: `cd motioncanvas/my-animation && npm install`
2. Edit scenes in `motioncanvas/my-animation/src/scenes/`
3. Preview: `cd motioncanvas/my-animation && npm start`
4. Render + add music: `python view_video.py`
5. Output: `output/videos/final.mp4`

## Workflow

1. Motion Canvas renders all scenes to a single `.mp4` via `@motion-canvas/ffmpeg` exporter
2. ffmpeg adds `music.mp3` as background audio, looping if the animation is longer than the music
3. Output stops exactly when the animation ends
