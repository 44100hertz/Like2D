import { createLike, type ImageHandle } from "like";

let image: ImageHandle | null = null;
const like = createLike(document.getElementById("game-container")!);

like.load = () => {
  like.setMode({ pixelResolution: [800, 600] });
  image = like.gfx.newImage("pepper.png");
};

like.update = (_dt: number) => {
  // game logic here
};

like.draw = () => {
  like.gfx.clear([0.1, 0.1, 0.15, 1]);
  like.gfx.print("white", "Like2D Starter", [20, 20]);
  
  if (image?.isReady()) {
    like.gfx.draw(image, like.mouse.getPosition());
  }
};

await like.start();

document.getElementById("fullscreen-btn")?.addEventListener("click", () => {
  like.setMode({ fullscreen: true });
});
