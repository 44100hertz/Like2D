import like from './like/index.ts';

// Example demonstrating Like2D graphics API
let rotation = 0;

like.setCallbacks({
  load: () => {
    console.log('Game loaded!');
    // Set initial background color (dark gray)
    like.graphics.setBackgroundColor(0.2, 0.2, 0.25, 1);
    like.graphics.setFont(24);
  },
  
  update: (dt: number) => {
    // Update rotation
    rotation += dt;
  },
  
  draw: () => {
    const centerX = like.getWidth() / 2;
    const centerY = like.getHeight() / 2;
    
    // Draw white text
    like.graphics.setColor(1, 1, 1, 1);
    like.graphics.print('Like2D Framework Demo', 20, 30);
    
    // Draw filled red rectangle
    like.graphics.setColor(0.9, 0.2, 0.2, 1);
    like.graphics.rectangle('fill', 50, 100, 100, 80);
    
    // Draw outlined rectangle
    like.graphics.setColor(0.2, 0.9, 0.2, 1);
    like.graphics.rectangle('line', 50, 100, 100, 80);
    
    // Draw filled blue circle
    like.graphics.setColor(0.2, 0.4, 0.9, 1);
    like.graphics.circle('fill', centerX, centerY, 50);
    
    // Draw outlined circle
    like.graphics.setColor(1, 1, 0.2, 1);
    like.graphics.circle('line', centerX, centerY, 60);
    
    // Draw lines
    like.graphics.setColor(0.5, 0.5, 0.5, 1);
    like.graphics.line(200, 100, 350, 180);
    like.graphics.line(200, 180, 350, 100, 400, 140);
    
    // Draw polygon
    like.graphics.setColor(0.8, 0.3, 0.8, 1);
    like.graphics.polygon('fill', 500, 100, 550, 150, 500, 200, 450, 150);
    
    // Draw outlined polygon
    like.graphics.setColor(1, 0.5, 0.2, 1);
    like.graphics.polygon('line', 600, 100, 650, 150, 600, 200, 550, 150);
    
    // Demo coordinate transformations
    like.graphics.push();
    like.graphics.translate(centerX, 300);
    like.graphics.rotate(rotation); // Rotate over time
    like.graphics.setColor(0.2, 0.8, 0.9, 1);
    like.graphics.rectangle('fill', -40, -40, 80, 80);
    like.graphics.pop();
    
    // Print instructions
    like.graphics.setColor(0.8, 0.8, 0.8, 1);
    like.graphics.setFont(16);
    like.graphics.print('Press any key to see it logged', 20, like.getHeight() - 40);
    like.graphics.print('Click anywhere for mouse position', 20, like.getHeight() - 20);
  },
  
  keypressed: (key: string) => {
    console.log('Key pressed:', key);
  },
  
  mousepressed: (x: number, y: number, button: number) => {
    console.log('Mouse pressed at', x, y, 'button:', button);
  }
});

// Initialize and start
like.init(800, 600);
like.start();
