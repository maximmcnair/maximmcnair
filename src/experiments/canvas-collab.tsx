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
  width: number;
  height: number;
  color: string;
  isDragging: boolean;
  text: string;
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
      width: 15 * 18,
      height: 15 * 18,
      color: getRandomColor(),
      isDragging: false,
      text: '',
    },
    {
      id: 1,
      x: 15 * 30,
      y: 15 * 30,
      width: 15 * 18,
      height: 15 * 18,
      color: getRandomColor(),
      isDragging: false,
      text: 'asdfsdf asdf asd f',
    },
  ];

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
  });

  let boardPos: Coordinates = {x: 0, y: 0};

  const bgImage = new Image();
  let bgPattern: CanvasPattern | null = null;
  bgImage.src = '/bg-dots.png';
  bgImage.onload = () => {
    bgPattern = ctx.createPattern(bgImage, 'repeat');
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
    })
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

        // x: evt.clientX - draggingNoteContext.offsetX, 
        // y: evt.clientY - draggingNoteContext.offsetY 
      });
    } else if (draggingBackground) {
      boardPos.x += evt.movementX;
      boardPos.y += evt.movementY;
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
  });

  // function boardPosX(val: number){
  //   return val + boardPos.x;
  // }
  // function boardPosX(val: number){
  //   return val + boardPos.x;
  // }
  
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

      const note = notes.find(note => 
        inRange(mouse.x - boardPos.x, note.x, note.x + note.width) &&
        inRange(mouse.y - boardPos.y, note.y, note.y + note.height)
      );

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
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";

    // note
    ctx.fillStyle = note.color;
    ctx.fillRect(note.x, note.y, note.width, note.height);

    // disable shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0)";

    // selected border
    if (noteSelectedId === note.id) {
      ctx.lineWidth = 2;
      ctx.strokeRect(note.x, note.y, note.width, note.height);
    }

    // text
    const textPadding = 15
    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.fillText(note.text, note.x + textPadding, note.y + 30, note.width - (textPadding * 2))

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

    // TODO performance of dot pattern: image vs circle

    if (bgPattern) {
      ctx.fillStyle = bgPattern;
      ctx.fillRect(-(width * 2), -(width * 2), width * 4, height * 4);
    }

    // for (let i = -50; i <= 150; i++) {
    //   for (let j = -50; j <= 150; j++) {
    //     let x = i * GRID_SIZE;
    //     let y = j * GRID_SIZE;
    //
    //     ctx.beginPath();
    //     ctx.fillStyle = 'rgba(198, 204, 220, 0.3)';
    //     ctx.arc(x, y, 1, 0, 2 * Math.PI, false);
    //     ctx.fill(); 
    //     ctx.closePath();
    //   }
    // }


    // Loop through and render our cards 
    for (let note of notes) {
      renderNote(note)
    }

    ctx.restore();

    // Request the browser the call render once its ready for a new frame
    window.requestAnimationFrame(render);
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

