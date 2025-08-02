# Three.js Car Demo - Technical Documentation

## Overview
This is a 3D car racing game built with Three.js for rendering and Cannon.js for physics simulation. The game features a vintage racing car that can be controlled using keyboard inputs, with realistic physics including collision detection and a chase camera system.

## Architecture

### Core Classes

**Experience.js** (`Experience/Experience.js:143`)
- Main application singleton that orchestrates all components
- Manages scene, camera, renderer, physics world, and resources
- Handles resize and update events

**PhysicsWorld.js** (`Experience/PhysicsWorld.js:234`)
- Wraps Cannon.js physics engine
- Configures gravity, broadphase collision detection, and materials
- Includes optional debug visualization

**World.js** (`Experience/World/World.js:1392`)
- Manages 3D world objects (floor, car, environment)
- Waits for resources to load before initializing components

## Physics Implementation

### Car Physics (`Experience/World/CarPhysics.js:1035`)
- **Chassis**: Box-shaped rigid body with mass of 6 units
- **Wheels**: Four cylindrical bodies with wheel material
- **Vehicle System**: Uses Cannon.js RigidVehicle for realistic car dynamics
- **Collision Detection**: Event listeners for collision events
- **Materials**: Custom wheel material with friction and restitution properties

### Floor Physics (`Experience/World/Floor.js:1368`)
- Static box body for ground collision
- Textured surface with displacement mapping
- Shadow receiving capability

## Controls & Gameplay

### Input System (`Experience/World/CarController.js:869`)
- **Forward**: W key or Up Arrow - applies force to rear wheels
- **Backward**: S key or Down Arrow - applies reverse force (50% power)
- **Left**: A key or Left Arrow - sets steering angle for front wheels
- **Right**: D key or Right Arrow - sets steering angle for front wheels  
- **Jump**: Spacebar - applies upward impulse to chassis body

### Camera System (`Experience/World/Car.js:739`)
- **Chase Camera**: Follows car with smooth interpolation
- **Position Lerp**: Smoothly tracks car position (default: 0.08)
- **Look-at Lerp**: Smoothly focuses on car (default: 0.1)
- **Debug Controls**: Real-time camera parameter adjustment when debug mode active

## Technical Details

### Resource Management (`Experience/Utils/Resources.js:556`)
- **GLTF Loader**: Loads 3D car model with Draco compression
- **Texture Loader**: Loads floor textures (base, normal, roughness, etc.)
- **Loading Screen**: Animated loader with fade-out transition

### Rendering Features (`Experience/Renderer.js:285`)
- **Shadows**: PCF soft shadow mapping enabled
- **Tone Mapping**: Cineon tone mapping for realistic lighting
- **Anti-aliasing**: MSAA for smooth edges
- **Physically Correct Lights**: Enhanced lighting model

### Environment (`Experience/World/Environment.js:1142`)
- **Sky System**: Procedural sky with atmospheric scattering
- **Directional Lighting**: Shadow-casting sun light
- **Debug Controls**: Real-time sky and lighting parameter adjustment

### Debug System (`Experience/Utils/Debug.js:365`)
- **Activation**: URL hash `#debug` enables debug mode
- **GUI**: lil-gui interface for real-time parameter tweaking
- **Physics Visualization**: Cannon debugger for collision shapes

## File Structure
```
Experience/
├── Camera.js           # Perspective camera setup
├── Experience.js       # Main application singleton
├── PhysicsWorld.js     # Cannon.js wrapper
├── Renderer.js         # WebGL renderer configuration
├── sources.js          # Asset definitions
├── Utils/
│   ├── Debug.js        # Debug interface
│   ├── EventEmitter.js # Custom event system
│   ├── Resources.js    # Asset loading
│   ├── Sizes.js        # Viewport management
│   └── Time.js         # Game loop timing
└── World/
    ├── Car.js          # Car entity controller
    ├── CarController.js # Input handling
    ├── CarModel.js     # 3D model management
    ├── CarPhysics.js   # Physics setup
    ├── Environment.js  # Sky and lighting
    ├── Floor.js        # Ground surface
    └── World.js        # World coordinator
```

## Key Features

### Game Loop
- **Time Management**: Custom Time class handles delta time and elapsed time
- **Fixed Physics Step**: Cannon.js uses fixed timestep for consistent physics
- **Render Loop**: RequestAnimationFrame for smooth 60fps rendering

### Asset Pipeline
- **3D Models**: GLTF format with Draco compression for optimized loading
- **Textures**: PBR textures (albedo, normal, roughness, height, AO)
- **Loading Manager**: Three.js LoadingManager with progress tracking

### Performance Optimizations
- **Singleton Pattern**: Experience class prevents multiple instances
- **Event-Driven Architecture**: Custom EventEmitter for loose coupling
- **Shadow Optimization**: Configured shadow camera bounds for performance
- **Texture Wrapping**: Efficient texture repeating for large surfaces

## Development Notes

### Debug Features
Access debug mode by adding `#debug` to the URL. This enables:
- Real-time physics visualization
- Camera parameter adjustment
- Sky and lighting controls
- Performance monitoring

### Code Patterns
- **Modular Design**: Each component is self-contained
- **Resource Loading**: Centralized asset management
- **Physics Synchronization**: Manual mesh position updates from physics bodies
- **Camera Smoothing**: Lerp interpolation for smooth camera movement

This Three.js car demo demonstrates modern web game development techniques with realistic physics simulation, dynamic lighting, and smooth camera controls. The modular architecture allows for easy extension and modification of game features.