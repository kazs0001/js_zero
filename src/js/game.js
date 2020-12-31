import { Player } from './player';
import World from './world';
import { DebugView } from "./debug_view";

import * as cannon from "cannon";

// ammo npm package does not work together with babylon.js currently 
// import * as Ammo from "ammo.js";

// this hard-copy integrates well but building with webpack takes forever
// import * as Ammo from "./external/ammo.js";


import * as BABYLON from "babylonjs";
import 'babylonjs-loaders';



class Game {
    constructor(engine, canvas) { 
        this.engine = engine;
        this.canvas = canvas;
 
        // game state ---------------------------------------------------------
        this.debug_mode = false;
        this.paused = true;
        
        // Create the scene ---------------------------------------------------
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.gravity = BABYLON.Vector3(0,-9.81, 0);
        this.scene.collisionsEnabled = true;
       
        BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (loader) {
            if (loader.name === "gltf") {
                // do something with the loader
                console.log("GLTF_Loader:", loader);
                loader.animationStartMode = 0;
                // loader.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE;
                // loader.<option2> = <...>
            }
        });
    
        this.assetManager = new BABYLON.AssetsManager(this.scene);


        // attach to scene
        this.scene.physicsPlugin = new BABYLON.CannonJSPlugin(true, 10, cannon);
        // this.scene.physicsPlugin = new BABYLON.AmmoJSPlugin(false, Ammo );

        this.gravityVector = new BABYLON.Vector3(0,-9.81, 0);
        this.scene.enablePhysics(this.gravityVector, this.scene.physicsPlugin);

            

        // create the level to play in ----------------------------------------
        this.world = new World(this.scene, this.assetManager);

        this.player = new Player(
            this.scene, 
            this.canvas, 
            this.world, 
            this.assetManager);
          
        // put debug functionality here 
        this.debug_view = new DebugView(
            this.scene, 
            canvas);
        
        this.assetManager.load();
        this.assetManager.onFinish = () => {
            this.resume();
        };
        
        this.engine.enterPointerlock();
    }

    handleMouseInput(mouseEvent) {
        if(!this.debug_mode) {
            this.player.handleMouseInput(mouseEvent);
        }
    }

    // input forwarding -------------------------------------------------------
    // TODO: if game is not paused....
    handleInput(keyEvent) {
        if(keyEvent.keyCode == 67 && keyEvent.type == "keydown") { 
            console.log("Event", keyEvent);
            this.debug_mode = !this.debug_mode;
            if (!this.debug_mode) {
                this.debug_view.deactivate();
                this.player.activate();
            } else {
                this.debug_view.activate();
                this.player.deactivate();
            }
        }
        if(!this.debug_mode) {
            this.player.handleInput(keyEvent);
        } 
    }

    pause() {
        this.paused = true;
        this.world.music.pause();
        console.log("Pause")
    }

    resume() {
        this.paused = false;
        if(!this.world.music.isPlaying){
            this.world.music.play();
        }
    }

    mainloop(dTimeMs){
        if(this.player && !this.paused){
            this.player.update(dTimeMs);
        }
    }   
}
  
export { Game };
  