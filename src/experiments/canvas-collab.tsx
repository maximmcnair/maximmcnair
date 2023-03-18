import { useEffect, useState } from 'react';

/*
Challenge: Build Miro/Figjam style postits while 4.5 hrs

After we'll write up into a tutorial. Try to get featured on codrops

Features:
- Stickies / render on screen
- Stickies / drag to move
- Infinite Canvas / drag to scroll
- Cursors / update on drag

bg-dot.png
- Stickies / click to edit
- Infinite Canvas / dot background
- Stickies / update color
- Stickies / drag to scroll edge of screen
*/

function inRange(value: number, min: number, max: number) {
  return value >= Math.min(min, max) && value <= Math.max(min, max);
}

const GRID_SIZE = 15;

function snapToGrid(pos: number): number {
  return Math.round(pos / GRID_SIZE) * GRID_SIZE;
}

const colors: Record<Color, string> = {
  'grey': '#b0bcce',
  'purple': '#d8b8fd',
  'blue': '#85c9fd',
  'orange': '#fcb0a5',
  'green': '#89e0a4',
}

function getRandomColor(): string {
  const cols = Object.values(colors);
  const colorIdx = Math.floor(Math.random() * cols.length);
  return cols[colorIdx] as string;
}

type Color = 'grey' | 'purple' | 'blue' | 'orange' | 'green';

interface Note {
  id: number;
  x: number;
  y: number;
  color: string;
  isDragging: boolean;
  text: string;
  zIndex: number;
}

interface Coordinates {
  x: number;
  y: number;
}

function canvasAnimation(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  // notes: Note[]
) {
  let notes: Note[] = [
    {
      id: 0,
      x: 15 * 5,
      y: 15 * 5,
      color: colors.blue,
      isDragging: false,
      text: '',
      zIndex: 0,
    },
    {
      id: 1,
      x: 15 * 6,
      y: 15 * 6,
      color: colors.blue,
      isDragging: false,
      text: '',
      zIndex: 0,
    },
    {
      id: 1,
      x: 15 * 7,
      y: 15 * 7,
      color: colors.blue,
      isDragging: false,
      text: '',
      zIndex: 0,
    },
    {
      id: 1,
      x: 15 * 8,
      y: 15 * 8,
      color: colors.blue,
      isDragging: false,
      text: '',
      zIndex: 0,
    },
    {
      id: 1,
      x: 15 * 35,
      y: 15 * 5,
      color: colors.orange,
      isDragging: false,
      text: '',
      zIndex: 0,
    },
    {
      id: 1,
      x: 15 * 36,
      y: 15 * 6,
      color: colors.orange,
      isDragging: false,
      text: '',
      zIndex: 0,
    },
    {
      id: 1,
      x: 15 * 37,
      y: 15 * 7,
      color: colors.orange,
      isDragging: false,
      text: '',
      zIndex: 0,
    },
    {
      id: 1,
      x: 15 * 38,
      y: 15 * 8,
      color: colors.orange,
      isDragging: false,
      text: '',
      zIndex: 0,
    },
  ].map((c, idx) => {
    return {
      ...c,
      id: idx,
      zIndex: idx,
    }
  });

  // set height&width of canvas
  let width = window.innerWidth;
  let height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;
    render();
  });

  let boardPos: Coordinates = {x: 0, y: 0};

  const bgImage = new Image();
  let bgPattern: CanvasPattern | null = null;
  bgImage.src = '/bg-dots.png';
  bgImage.onload = () => {
    bgPattern = ctx.createPattern(bgImage, 'repeat');
    render();
  }

  function noteUpdate(noteId: number, updated: Partial<Note>) {
    notes = notes.map(n => {
      // update if n.id match noteId
      if (n.id === noteId) {
        return {
          ...n,
          ...updated,
        }
      }
      return n;
    });
  }

  type Cursor = 'text' | 'grab' | 'grabbing' | 'default';
  function updateCursor(cursor: Cursor){
    canvas.style.cursor = cursor;
  }

  function noteDelete(noteId: number) {
    notes = notes.filter(n => {
      if (n.id !== noteId) return true;
      return false;
    })
  }

  interface DraggingNoteContext {
    id: number | undefined;
    offsetX: number;
    offsetY: number;
  }

  let draggingNoteContext: DraggingNoteContext = {
    id: undefined,
    offsetX: 0,
    offsetY: 0,
  }

  let draggingBackground = false;
  let noteSelectedId: undefined | number = undefined;

  window.addEventListener('mousemove', (evt: MouseEvent) => {
    if (draggingNoteContext.id != undefined) {
      // snapToGrid
      noteUpdate(draggingNoteContext.id, { 
        x: snapToGrid(evt.clientX - draggingNoteContext.offsetX), 
        y: snapToGrid(evt.clientY - draggingNoteContext.offsetY),
      });
      render();
    } else if (draggingBackground) {
      boardPos.x += evt.movementX;
      boardPos.y += evt.movementY;
      render();
    }
  })

  window.addEventListener('mouseup', (evt: MouseEvent) => {
    if (draggingNoteContext.id != undefined) {
      noteUpdate(draggingNoteContext.id, { 
        isDragging: false,
        x: snapToGrid(evt.clientX - draggingNoteContext.offsetX), 
        y: snapToGrid(evt.clientY - draggingNoteContext.offsetY) 
      });
      draggingNoteContext.id = undefined;
    } 
    if (draggingBackground) {
      draggingBackground = false;
    }
    updateCursor('default');
    render();
  });

  window.addEventListener('keydown', (evt: KeyboardEvent) => {
    if (noteSelectedId !== null){
      const note = notes.find(note => note.id === noteSelectedId);
      if (!note) return;
      // Backspace
      if (evt.key === 'Backspace') {
        // Only allow deleting of notes with no text
        if (note.text === '') {
          noteDelete(note.id);
        } else {

        }
      } else {
        // noteUpdate(note.id, { })
      }
    }
    render();
  });

  window.addEventListener('mousedown', (evt: MouseEvent) => {
    if (evt.button === 1) {
        // start background drag
        draggingBackground = true;
    } else {
      const mouse: Coordinates = {
        x: evt.clientX,
        y: evt.clientY,
      }

      let note: Note | undefined = undefined;
      for (let i = 0; i < notes.length; i++) {
        if (
          inRange(mouse.x - boardPos.x, notes[i].x, notes[i].x + 270) &&
          inRange(mouse.y - boardPos.y, notes[i].y, notes[i].y + 270) &&
          (!note || (note.zIndex < notes[i].zIndex))
        ){
          note = notes[i];
        }
      }

      if (note) {
        // start note drag
        draggingNoteContext.id = note.id;
        draggingNoteContext.offsetX = evt.clientX - note.x;
        draggingNoteContext.offsetY = evt.clientY - note.y;
        noteUpdate(note.id, {
          isDragging: true,
        });
        noteSelectedId = note.id;
      } else {
        // start background drag
        draggingBackground = true;
      }
    }
    updateCursor('grabbing');
    render();
  })

  function renderNote(note: Note) {
    // Set our canvas scale
    // if (currentlyDraggingNoteId === note.id) {
    //   ctx.scale(1.1, 1.1);
    // }

    // shadow
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 5;
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)";

    // note
    ctx.fillStyle = note.color;
    // path.rect(note.x, note.y, 270, 270);
    ctx.fillRect(note.x, note.y, 270, 270);

    // disable shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0)";

    // selected border
    if (noteSelectedId === note.id) {
      ctx.lineWidth = 2;
      ctx.strokeRect(note.x, note.y, 270, 270);
    }

    // text
    const textPadding = 15
    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.fillText(String(note.id), note.x + textPadding, note.y + 30, 270 - (textPadding * 2))

    // if (currentlyDraggingNoteId === note.id) {
    //   // Reset current transformation matrix to the identity matrix
    //   ctx.setTransform(1, 0, 0, 1, 0, 0);
    // }
  }

  function render(){
    ctx.save();

    // Clear current canvas
    ctx.clearRect(0, 0, width, height);

    // Translate to current scroll position
    ctx.translate(boardPos.x, boardPos.y);

    // Render background
    if (bgPattern) {
      ctx.fillStyle = bgPattern;
      ctx.fillRect(-(width * 2), -(width * 2), width * 4, height * 4);
    }

    // Loop through and render our cards 
    for (let note of notes) {
      renderNote(note)
    }

    ctx.restore();

    // Request the browser the call render once its ready for a new frame
    // window.requestAnimationFrame(render);
  }

  render();
}

export default function CanvasCollab() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvasAnimation(canvas, ctx);
  }, [notes]);

  return <canvas id="canvas" className="canvas canvas-collab" />;
}

