import { createLike, StartupScene, type Scene, type ImageHandle, type Source, type CanvasMode, type Like } from "like";
import { Vec2 } from "like";

let pepperImage: ImageHandle | null = null;
let audioSource: Source | null = null;

const player = {
  pos: [240, 160] as [number, number],
  speed: 200,
};

const scalingModes: CanvasMode[] = [
  { pixelResolution: [320, 320], fullscreen: false },
  { pixelResolution: [800, 300], fullscreen: false },
  { pixelResolution: [240, 320], fullscreen: false },
  { pixelResolution: null, fullscreen: false },
];
let currentScalingIndex = 0;
let scalingModeName = 'Pixel 320x320';
let isFullscreen = false;

const container = document.getElementById('game-container')!;
const like = createLike(container);

const demoScene: Scene = {
  load(like: Like) {
    like.setMode({ pixelResolution: [800, 600], fullscreen: false });
    pepperImage = like.gfx.newImage('pepper.png');
    audioSource = like.audio.newSource('./test.ogg');
    
    like.input.map('jump', ['Space', 'ArrowUp', 'KeyW', 'ButtonBottom']);
    like.input.map('fire', ['MouseLeft', 'RT']);
    like.input.map('move_left', ['ArrowLeft', 'KeyA', 'DPLeft']);
    like.input.map('move_right', ['ArrowRight', 'KeyD', 'DPRight']);
    like.input.map('move_up', ['ArrowUp', 'KeyW', 'DPUp']);
    like.input.map('move_down', ['ArrowDown', 'KeyS', 'DPDown']);
  },

  update(like: Like, dt: number) {
    let moveDelta: [number, number] = [0, 0];
    if (like.input.isDown('move_left')) moveDelta = Vec2.add(moveDelta, [-1, 0]);
    if (like.input.isDown('move_right')) moveDelta = Vec2.add(moveDelta, [1, 0]);
    if (like.input.isDown('move_up')) moveDelta = Vec2.add(moveDelta, [0, -1]);
    if (like.input.isDown('move_down')) moveDelta = Vec2.add(moveDelta, [0, 1]);
    
    player.pos = Vec2.add(player.pos, Vec2.mul(moveDelta, player.speed * dt));
    player.pos = Vec2.clamp(player.pos, [15, 15], Vec2.sub(like.getCanvasSize(), [15, 15]));
  },

  keypressed(like: Like, scancode: string) {
    if (scancode === 'KeyZ') {
      currentScalingIndex = (currentScalingIndex + 1) % scalingModes.length;
      const mode = scalingModes[currentScalingIndex];
      like.setMode({ pixelResolution: mode.pixelResolution, fullscreen: isFullscreen });
      const names = ['Pixel 320x320', 'Wide 800x300', 'Portrait 240x320', 'Native'];
      scalingModeName = names[currentScalingIndex];
    }
  },

  actionpressed(like: Like, action: string) {
    console.log('Action pressed:', action);
    if (action === 'jump') console.log('Jump!');
    if (action === 'fire') console.log('Fire!');
    if (action === 'audio_play_pause' && audioSource?.isReady()) {
      audioSource.isPlaying() ? audioSource.stop() : audioSource.play();
    }
    if (action === 'sleep_timer') {
      like.timer.sleep(2);
    }
  },

  draw(like: Like) {
    const { timer, mouse, gamepad, gfx } = like;
    gfx.clear([0.1, 0.1, 0.15, 1]);
    const canvasSize = like.getCanvasSize();
    const center = Vec2.mul(canvasSize, 0.5);
    const [w, h] = canvasSize;

    gfx.print('white', 'Like Demo', [20, 30], { font: '28px sans-serif' });
    gfx.print('yellow', `Scaling: ${scalingModeName} (Z to cycle)`, [20, 60], { font: '14px sans-serif' });

    gfx.print('lime', `FPS: ${timer.getFPS()}`, [w - 80, 30]);
    gfx.print('lime', `${(timer.getDelta() * 1000).toFixed(1)}ms`, [w - 80, 48]);
    if (timer.isSleeping()) gfx.print('red', 'SLEEPING', [w - 100, 66]);

    gfx.rectangle('fill', 'red', [50, 100, 100, 80]);
    gfx.rectangle('line', 'lime', [50, 100, 100, 80]);
    gfx.circle('fill', 'blue', center, 50);
    gfx.circle('line', 'yellow', center, 60);
    gfx.line('gray', [[200, 100], [350, 180]]);
    gfx.polygon('fill', 'magenta', [[350, 100], [400, 150], [350, 200], [300, 150]]);

    if (pepperImage?.isReady()) {
      gfx.draw(pepperImage, [380, 220]);
      gfx.draw(pepperImage, [420, 220], { scale: 0.5 });
    }

    const mousePos = mouse.getPosition();
    gfx.print('cyan', `Mouse: (${Math.round(mousePos[0])}, ${Math.round(mousePos[1])})`, [20, 180], { font: '16px sans-serif' });
    gfx.circle('line', 'cyan', mousePos, 10);

    const [l, m, r] = [mouse.isDown(1) ? 'L' : '_', mouse.isDown(2) ? 'M' : '_', mouse.isDown(3) ? 'R' : '_'];
    gfx.print('yellow', `Buttons: [${l}] [${m}] [${r}]`, [20, 200], { font: '16px sans-serif' });

    const gpCount = gamepad.getConnectedGamepads().length;
    gfx.print(gpCount ? 'limegreen' : 'gray', `Gamepads: ${gpCount}`, [20, h - 60], { font: '16px sans-serif' });

    gfx.print('springgreen', `Player: (${Math.round(player.pos[0])}, ${Math.round(player.pos[1])})`, [20, h - 30], { font: '16px sans-serif' });
    gfx.circle('fill', 'springgreen', player.pos, 15);
    gfx.circle('line', 'lime', player.pos, 15);
  },
};

document.getElementById('fullscreen-btn')?.addEventListener('click', () => {
  isFullscreen = !isFullscreen;
  const mode = scalingModes[currentScalingIndex];
  like.setMode({ pixelResolution: mode.pixelResolution, fullscreen: isFullscreen });
});

like.setMode({ pixelResolution: null });
like.setScene(new StartupScene(demoScene));
await like.start();
