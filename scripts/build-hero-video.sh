#!/usr/bin/env bash
#
# build-hero-video.sh — Builds the hero loops from the Higgsfield / Kling 3.0 clips
# (one clip per scene and orientation). Same recipe as the Tu Destino Panamá hero.
#
# Inputs ($CLIPS_DIR, default assets-src/hero-video/clips/, gitignored):
#   <scene>-{16x9,9x16}.mp4 for SCENES (default 1-montaje 2-luz 3-changan 4-publico 5-detalle)
#   Each clip must last at least OFFSET + 2.0 s.
#
# Outputs ($OUT_DIR, default public/videos/):
#   hero-top-<version>-desktop-16x9.mp4   1920×1080, 24 fps, 10.0 s, 240 frames
#   hero-top-<version>-mobile-9x16.mp4    1080×1920, 24 fps, 10.0 s, 240 frames
#   hero-top-<version>-{desktop,mobile}-poster.webp  (first frame, with --posters)
#   <version> = HERO_VERSION in data/site.ts. Bump it for a new montage: never
#   overwrite a published file under the same name (browsers keep the old one).
#
# Camera: the Kling clips are shot locked-off; the move is added here as one perfectly
# linear lateral slide per shot (same direction for all, sub-pixel via a 2× working
# canvas): the window covers SLIDE_ZOOM of the frame and travels across the spare width.
#
# Montage: 5 × 2.000 s, hard cuts (concat, no crossfades), no audio,
# H.264 High, CRF 26 (16x9) / 29 (9x16) — override with CRF_16x9 / CRF_9x16, preset slow, +faststart.
#
# Usage: scripts/build-hero-video.sh [--only 16x9|9x16] [--posters] [-h]
#
# Env: OFFSET_<scene>_<orientation>  seconds skipped at the start of a clip (default 0.3),
#      scene with "_" instead of "-", e.g. OFFSET_3_changan_9x16=0.5
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

CLIPS_DIR="${CLIPS_DIR:-$PROJECT_ROOT/assets-src/hero-video/clips}"
OUT_DIR="${OUT_DIR:-$PROJECT_ROOT/public/videos}"
DEFAULT_OFFSET="${DEFAULT_OFFSET:-0.3}"

HERO_VERSION="$(sed -n "s/^export const HERO_VERSION = '\(.*\)';$/\1/p" "$PROJECT_ROOT/data/site.ts")"
[ -n "$HERO_VERSION" ] || { echo "ERROR: HERO_VERSION not found in data/site.ts" >&2; exit 1; }
SCENES="${SCENES:-1-montaje 2-luz 3-changan 4-publico 5-detalle}"
SEG_SECONDS="2.000"
FPS=24 # Kling 3.0 delivers 24 fps
SEG_FRAMES=$((FPS * 2))
SLIDE_ZOOM="${SLIDE_ZOOM:-0.9167}" # window size vs frame; 1 - SLIDE_ZOOM = travel
TOTAL_FRAMES=$((FPS * 10))

DO_POSTERS=0
ONLY=""

die() { echo "ERROR: $*" >&2; exit 1; }

while [ $# -gt 0 ]; do
  case "$1" in
    --posters) DO_POSTERS=1 ;;
    --only) [ $# -ge 2 ] || die "--only needs 16x9 or 9x16"; ONLY="$2"; shift ;;
    -h|--help) sed -n '2,/^set -euo pipefail/p' "${BASH_SOURCE[0]}" | sed '$d' | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) die "unknown argument: $1" ;;
  esac
  shift
done

case "$ONLY" in
  "") ORIENTATIONS="16x9 9x16" ;;
  16x9|9x16) ORIENTATIONS="$ONLY" ;;
  *) die "invalid --only value: '$ONLY'" ;;
esac

command -v ffmpeg >/dev/null 2>&1 || die "ffmpeg is not installed."

for o in $ORIENTATIONS; do
  for s in $SCENES; do
    [ -f "$CLIPS_DIR/$s-$o.mp4" ] || die "missing clip $CLIPS_DIR/$s-$o.mp4"
  done
done
mkdir -p "$OUT_DIR"

offset_for() { # $1 = scene, $2 = orientation
  local var="OFFSET_$(printf '%s' "$1" | tr '-' '_')_$2"
  printf '%s' "${!var:-$DEFAULT_OFFSET}"
}

build_graph() { # $1 = orientation, $2 = width, $3 = height
  local o="$1" w="$2" h="$3" i=0 s concat_in=""
  INPUT_ARGS=()
  FILTER=""
  for s in $SCENES; do
    INPUT_ARGS+=(-ss "$(offset_for "$s" "$o")" -t 2.5 -i "$CLIPS_DIR/$s-$o.mp4")
    local W2=$((w * 2)) H2=$((h * 2)) CW CH
    CW=$(awk -v a="$W2" -v z="$SLIDE_ZOOM" 'BEGIN { printf "%d", int(a * z / 2) * 2 }')
    CH=$(awk -v a="$H2" -v z="$SLIDE_ZOOM" 'BEGIN { printf "%d", int(a * z / 2) * 2 }')
    FILTER="${FILTER}[$i:v]fps=$FPS,scale=$W2:$H2:force_original_aspect_ratio=increase:flags=lanczos,crop=$W2:$H2,setsar=1,trim=start_frame=0:end_frame=$SEG_FRAMES,setpts=PTS-STARTPTS,crop=$CW:$CH:'($W2-$CW)*t/$SEG_SECONDS':$(((H2 - CH) / 2)),scale=$w:$h:flags=lanczos,format=yuv420p[v$i];"
    concat_in="$concat_in[v$i]"
    i=$((i + 1))
  done
  FILTER="${FILTER}${concat_in}concat=n=$i:v=1:a=0,fps=$FPS[out]"
}

for o in $ORIENTATIONS; do
  if [ "$o" = "16x9" ]; then
    W=1920; H=1080; CRF="${CRF_16x9:-26}"; NAME="hero-top-$HERO_VERSION-desktop-16x9"; POSTER="hero-top-$HERO_VERSION-desktop-poster.webp"
  else
    W=1080; H=1920; CRF="${CRF_9x16:-29}"; NAME="hero-top-$HERO_VERSION-mobile-9x16"; POSTER="hero-top-$HERO_VERSION-mobile-poster.webp"
  fi
  echo "== $o → $OUT_DIR/$NAME.mp4" >&2
  build_graph "$o" "$W" "$H"
  out="$OUT_DIR/$NAME.mp4"
  ffmpeg -hide_banner -loglevel error -y "${INPUT_ARGS[@]}" \
    -filter_complex "$FILTER" -map "[out]" -an \
    -frames:v "$TOTAL_FRAMES" -r "$FPS" \
    -c:v libx264 -profile:v high -preset slow -crf "$CRF" -pix_fmt yuv420p \
    -g "$((FPS * 2))" -movflags +faststart "$out"
  frames="$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nw=1:nk=1 "$out")"
  [ "$frames" = "$TOTAL_FRAMES" ] || die "$out has $frames frames, expected $TOTAL_FRAMES"
  echo "  OK: $out ($(awk -v b="$(wc -c < "$out")" 'BEGIN { printf "%.2f MB", b / 1048576 }'))" >&2

  if [ "$DO_POSTERS" -eq 1 ]; then
    # First frame, so the video starts exactly on the poster (no jump).
    png="$OUT_DIR/$NAME.tmp-poster.png"
    ffmpeg -hide_banner -loglevel error -y -i "$out" -frames:v 1 "$png"
    python3 -c "import sys; from PIL import Image; Image.open(sys.argv[1]).save(sys.argv[2], 'WEBP', quality=72, method=6)" "$png" "$OUT_DIR/$POSTER"
    rm -f "$png"
    echo "  poster: $OUT_DIR/$POSTER" >&2
  fi
done
