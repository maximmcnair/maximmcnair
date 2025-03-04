#!/bin/bash

# Set the output directory for converted files
OUTPUT_DIR="web_optimized"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Find all .mov files in the current directory
MOV_FILES=$(find . -maxdepth 1 -type f -name "*.mov")

# Check if any .mov files were found
if [ -z "$MOV_FILES" ]; then
  echo "No .mov files found in the current directory."
  exit 1
fi

# Process each .mov file
for INPUT in $MOV_FILES; do
  # Get the filename without extension and path
  FILENAME=$(basename "$INPUT" .mov)

  echo "Processing $INPUT..."

  # Output filenames
  MP4_OUTPUT="$OUTPUT_DIR/${FILENAME}.mp4"
  WEBM_OUTPUT="$OUTPUT_DIR/${FILENAME}.webm"
  OGV_OUTPUT="$OUTPUT_DIR/${FILENAME}.ogv"
  POSTER_OUTPUT="$OUTPUT_DIR/${FILENAME}-thumbnail.jpg"

  # 1. Convert to MP4 (H.264) - most widely supported
  echo "  Creating MP4 version..."
  ffmpeg -i "$INPUT" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart "$MP4_OUTPUT"

  # 2. Convert to WebM (VP9) - better compression, good support in modern browsers
  echo "  Creating WebM version..."
  ffmpeg -i "$INPUT" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus -b:a 96k "$WEBM_OUTPUT"

  # 3. Convert to Ogg Theora (less common, but helps with older Firefox versions)
  echo "  Creating OGV version..."
  ffmpeg -i "$INPUT" -c:v libtheora -q:v 7 -c:a libvorbis -q:a 5 "$OGV_OUTPUT"

  # 4. Extract first frame as poster/thumbnail image
  echo "  Creating thumbnail..."
  ffmpeg -i "$INPUT" -ss 00:00:00 -vframes 1 -q:v 2 "$POSTER_OUTPUT"

  echo "  Completed $FILENAME"
  echo "----------------------------------------"
done

echo "All conversions complete. Files created in $OUTPUT_DIR directory:"
find "$OUTPUT_DIR" -type f | sort
