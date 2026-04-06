#!/usr/bin/env python3
"""
Generate royalty-free lo-fi chill background music for YouTube Shorts.
100% original — safe for commercial use, no copyright claims.

Output: music.mp3 (~2.5 minutes, loopable)
"""

import subprocess
import random
import os
from midiutil import MIDIFile

DURATION_BARS = 64  # ~2.5 min at 75 BPM
BPM = 75
BEATS_PER_BAR = 4
SF2 = "/usr/share/sounds/sf2/default-GM.sf2"

random.seed(42)  # reproducible

midi = MIDIFile(4)  # 4 tracks: chords, melody, bass, percussion

# Track setup
CHORDS_TRACK = 0
MELODY_TRACK = 1
BASS_TRACK = 2
PERC_TRACK = 3

for t in range(4):
    midi.addTempo(t, 0, BPM)

# Channels
CHORD_CH = 0
MELODY_CH = 1
BASS_CH = 2
PERC_CH = 9  # GM percussion

# Instruments (GM)
midi.addProgramChange(CHORDS_TRACK, CHORD_CH, 0, 4)   # Electric Piano 1
midi.addProgramChange(MELODY_TRACK, MELODY_CH, 0, 11)  # Vibraphone
midi.addProgramChange(BASS_TRACK, BASS_CH, 0, 33)      # Finger Bass

# Lo-fi chord progression in C minor (Cm - Ab - Eb - Bb)
PROGRESSIONS = [
    # Cm       Ab       Eb       Bb
    [(60,63,67), (56,60,63), (51,55,58), (58,62,65)],
    # Fm       Cm       Ab       Eb
    [(53,57,60), (60,63,67), (56,60,63), (51,55,58)],
    # Ab       Eb       Fm       Cm
    [(56,60,63), (51,55,58), (53,57,60), (60,63,67)],
]

# Melody notes that fit over Cm pentatonic
MELODY_NOTES = [60, 63, 65, 67, 70, 72, 75, 67, 63, 65]

# Percussion patterns (GM note numbers)
KICK = 36
SNARE = 38
HIHAT_C = 42
HIHAT_O = 46
RIDE = 51


def add_chords():
    """Warm electric piano chords with gentle velocity."""
    for bar in range(DURATION_BARS):
        prog = PROGRESSIONS[bar % len(PROGRESSIONS)]
        chord = prog[(bar // 4) % 4]
        beat = bar * BEATS_PER_BAR
        vel = random.randint(50, 65)
        for note in chord:
            midi.addNote(CHORDS_TRACK, CHORD_CH, note, beat, BEATS_PER_BAR, vel)


def add_melody():
    """Simple vibraphone melody — sparse and dreamy."""
    for bar in range(DURATION_BARS):
        beat = bar * BEATS_PER_BAR
        if bar < 4:
            continue  # intro: no melody

        # Play 2-4 notes per bar, with rests
        num_notes = random.choice([2, 2, 3, 3, 4])
        positions = sorted(random.sample([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], num_notes))
        for pos in positions:
            note = random.choice(MELODY_NOTES)
            dur = random.choice([0.5, 1, 1.5])
            vel = random.randint(55, 75)
            midi.addNote(MELODY_TRACK, MELODY_CH, note, beat + pos, dur, vel)


def add_bass():
    """Simple root-note bass line."""
    roots = {
        (60, 63, 67): 48,  # C
        (56, 60, 63): 44,  # Ab
        (51, 55, 58): 39,  # Eb
        (58, 62, 65): 46,  # Bb
        (53, 57, 60): 41,  # F
    }
    for bar in range(DURATION_BARS):
        prog = PROGRESSIONS[bar % len(PROGRESSIONS)]
        chord = prog[(bar // 4) % 4]
        root = roots.get(chord, 48)
        beat = bar * BEATS_PER_BAR
        vel = random.randint(60, 75)
        # Root on beat 1
        midi.addNote(BASS_TRACK, BASS_CH, root, beat, 1.5, vel)
        # Octave on beat 3
        midi.addNote(BASS_TRACK, BASS_CH, root, beat + 2, 1, vel - 10)
        # Sometimes add a walk note
        if random.random() > 0.6:
            walk = root + random.choice([2, 3, 5, 7])
            midi.addNote(BASS_TRACK, BASS_CH, walk, beat + 3, 0.5, vel - 15)


def add_drums():
    """Lo-fi drum pattern — laid back, slightly swung."""
    for bar in range(DURATION_BARS):
        beat = bar * BEATS_PER_BAR
        if bar < 2:
            continue  # intro: no drums

        # Kick: beats 1 and 3 (sometimes skip)
        if random.random() > 0.1:
            midi.addNote(PERC_TRACK, PERC_CH, KICK, beat, 0.5, random.randint(70, 85))
        if random.random() > 0.2:
            midi.addNote(PERC_TRACK, PERC_CH, KICK, beat + 2, 0.5, random.randint(65, 80))

        # Snare: beats 2 and 4
        midi.addNote(PERC_TRACK, PERC_CH, SNARE, beat + 1, 0.5, random.randint(55, 70))
        midi.addNote(PERC_TRACK, PERC_CH, SNARE, beat + 3, 0.5, random.randint(55, 70))

        # Hi-hats: eighth notes with swing
        for i in range(8):
            swing = 0.08 if i % 2 == 1 else 0  # slight swing
            pos = beat + i * 0.5 + swing
            vel = 40 if i % 2 == 0 else 30  # accent downbeats
            hat = HIHAT_O if (i == 4 and random.random() > 0.7) else HIHAT_C
            midi.addNote(PERC_TRACK, PERC_CH, hat, pos, 0.25, vel + random.randint(-5, 5))


print("🎵 Generating MIDI...")
add_chords()
add_melody()
add_bass()
add_drums()

midi_path = "/tmp/bgm.mid"
wav_path = "/tmp/bgm.wav"
mp3_path = "music.mp3"

with open(midi_path, "wb") as f:
    midi.writeFile(f)
print(f"✅ MIDI written: {midi_path}")

# Convert MIDI → WAV using fluidsynth
print("🎹 Rendering with FluidSynth...")
subprocess.run([
    "fluidsynth", "-ni", SF2, midi_path,
    "-F", wav_path,
    "-r", "44100",
    "-g", "0.6",
], check=True, capture_output=True)
print(f"✅ WAV rendered: {wav_path}")

# Convert WAV → MP3 with ffmpeg, add fade out at end
print("🔊 Encoding MP3...")
subprocess.run([
    "ffmpeg", "-y",
    "-i", wav_path,
    "-af", "afade=t=in:st=0:d=3,afade=t=out:st=125:d=5",
    "-b:a", "192k",
    mp3_path,
], check=True, capture_output=True)
print(f"✅ MP3 saved: {mp3_path}")

# Cleanup
os.remove(midi_path)
os.remove(wav_path)

# Get duration
result = subprocess.run(
    ["ffprobe", "-v", "error", "-show_entries", "format=duration",
     "-of", "default=noprint_wrappers=1:nokey=1", mp3_path],
    capture_output=True, text=True
)
duration = float(result.stdout.strip())
print(f"\n🎶 Done! {mp3_path} — {duration:.1f}s ({duration/60:.1f} min)")
print("📜 License: Original composition, royalty-free, safe for YouTube")
