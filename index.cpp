#include <SDL2/SDL.h>
#include <emscripten.h>
#include <cstdlib>
#include <stdio.h>
#include <math.h>

//git commands
//git init <-- starts looking for new changes. used before you work
//git add . <-- grabs all the new stuff
//git commit -m "first commit"
//git push -u origin master
//git push -u origin gh-pages

SDL_Window *window;
SDL_Renderer *renderer;
Uint32 flags = SDL_WINDOW_OPENGL | SDL_WINDOW_RESIZABLE;

struct context{ // this is for handling the stage and frames

    SDL_Renderer *renderer;
    int iteration;

}context_t;

struct player_Position{ //this is for handling player position and input states

    int player_VX;
    int player_VY;
    int player_X;
    int player_Y;

    bool up_pressed;
    bool down_pressed;
    bool left_pressed;
    bool right_pressed;

}playerPos_t;

struct canvas_dementions{

    int canvas_width;
    int canvas_height;

}canvasDem_t;

struct player_dementions{

    int player_width;
    int player_height;

}playerDem_t;

void input_listenter(struct context *ctx){ //This is for listening for the keyboard controls

    SDL_Event event;

    while (SDL_PollEvent(&event)) {

        switch (event.key.keysym.sym){

            case SDLK_UP:
                if (event.key.type == SDL_KEYDOWN){

                    playerPos_t.up_pressed = true;
                }
                else if (event.key.type == SDL_KEYUP){

                    playerPos_t.up_pressed = false;
                }
                break;
            case SDLK_DOWN:
                if (event.key.type == SDL_KEYDOWN){

                    playerPos_t.down_pressed = true;
                }
                else if (event.key.type == SDL_KEYUP){

                    playerPos_t.down_pressed = false;
                }
                break;
            case SDLK_LEFT:
                if (event.key.type == SDL_KEYDOWN){

                    playerPos_t.left_pressed = true;
                }
                else if (event.key.type == SDL_KEYUP){

                    playerPos_t.left_pressed = false;
                }
                break;
            case SDLK_RIGHT:
                if (event.key.type == SDL_KEYDOWN){

                    playerPos_t.right_pressed = true;
                }
                else if (event.key.type == SDL_KEYUP){

                    playerPos_t.right_pressed = false;
                }
                break;
            case SDLK_w:
                if (event.key.type == SDL_KEYDOWN){

                    playerPos_t.up_pressed = true;
                }
                else if (event.key.type == SDL_KEYUP){

                    playerPos_t.up_pressed = false;
                }
                break;
            case SDLK_s:
                if (event.key.type == SDL_KEYDOWN){

                    playerPos_t.down_pressed = true;
                }
                else if (event.key.type == SDL_KEYUP){

                    playerPos_t.down_pressed = false;
                }
                break;
            case SDLK_a:
                if (event.key.type == SDL_KEYDOWN){

                    playerPos_t.left_pressed = true;
                }
                else if (event.key.type == SDL_KEYUP){

                    playerPos_t.left_pressed = false;
                }
                break;
            case SDLK_d:
                if (event.key.type == SDL_KEYDOWN){

                    playerPos_t.right_pressed = true;
                }
                else if (event.key.type == SDL_KEYUP){

                    playerPos_t.right_pressed = false;
                }
                break;
            default:
                break;
        }

    }
    // These are for diagonal movement
    if(playerPos_t.up_pressed == true && 
        playerPos_t.left_pressed == true){

            playerPos_t.player_VY = -2;
            playerPos_t.player_VX = -2;
    }
    if(playerPos_t.up_pressed == true && 
        playerPos_t.right_pressed == true){

            playerPos_t.player_VY = -2;
            playerPos_t.player_VX = 2;
    }
    if(playerPos_t.down_pressed == true && 
        playerPos_t.left_pressed == true){

            playerPos_t.player_VY = 2;
            playerPos_t.player_VX = -2;
    }
    if(playerPos_t.down_pressed == true && 
        playerPos_t.right_pressed == true){

            playerPos_t.player_VY = 2;
            playerPos_t.player_VX = 2;
    }

    // These are for straight movement
    if(playerPos_t.up_pressed == true && 
        playerPos_t.left_pressed == false &&
        playerPos_t.right_pressed == false){

        playerPos_t.player_VY = -2;
        playerPos_t.player_VX = 0;
    }
    if(playerPos_t.down_pressed == true && 
        playerPos_t.left_pressed == false &&
        playerPos_t.right_pressed == false){

        playerPos_t.player_VY = 2;
        playerPos_t.player_VX = 0;
    }
    if(playerPos_t.left_pressed == true && 
        playerPos_t.up_pressed == false &&
        playerPos_t.down_pressed == false){

        playerPos_t.player_VX = -2;
        playerPos_t.player_VY = 0;
    }
    if(playerPos_t.right_pressed == true && 
        playerPos_t.up_pressed == false &&
        playerPos_t.down_pressed == false){

        playerPos_t.player_VX = 2;
        playerPos_t.player_VY = 0;
    }

    //This is when no movement keys are pressed
    if(playerPos_t.up_pressed == false && 
       playerPos_t.down_pressed == false &&
       playerPos_t.left_pressed == false &&
       playerPos_t.right_pressed == false){

        playerPos_t.player_VX = 0;
        playerPos_t.player_VY = 0;
    }
}

void create_window(){ //this is used to create the window

    window = SDL_CreateWindow(
        "Project Wasm",                    // window title
        SDL_WINDOWPOS_UNDEFINED,           // initial x position
        SDL_WINDOWPOS_UNDEFINED,           // initial y position
        canvasDem_t.canvas_width,          // width, in pixels
        canvasDem_t.canvas_height,         // height, in pixels
        flags                              //flags, 0
    );
}

void rebuild_window(){ //this will rebuild the window and apply the new viewport

    SDL_Rect viewPort;
    viewPort.w = canvasDem_t.canvas_width;
    viewPort.h = canvasDem_t.canvas_height;
    viewPort.x = 0;
    viewPort.y = 0;
        

    SDL_DestroyWindow(window);
    create_window();
    SDL_RenderSetViewport(renderer, &viewPort);
}

void resize_game(int width, int height){ //this will listen for screen size changes and apply new dementions

    if(width > canvasDem_t.canvas_width || width < canvasDem_t.canvas_width){ // breaks at canvas width 640; height 573
                                                                             // keep an eye out. appears to be fixed
        double width_variation;

        width_variation =  round(10 * ((double)playerPos_t.player_X / canvasDem_t.canvas_width)) / 10;
            
        canvasDem_t.canvas_width = width;
        playerDem_t.player_width = (int)width * .03;
        playerDem_t.player_height = (int)width * .03;

        playerPos_t.player_X = width * width_variation;

        rebuild_window();
        
    }

    if(height > canvasDem_t.canvas_height || height < canvasDem_t.canvas_height){

        double height_variation;

        height_variation =  round(10 * ((double)playerPos_t.player_Y / canvasDem_t.canvas_height)) / 10;

        canvasDem_t.canvas_height = height;

        playerPos_t.player_Y = height * height_variation;

        rebuild_window();
    }

}

void physics_loop(void *arg){ //this is the main loop

    context *ctx = static_cast<context*>(arg);
    SDL_Renderer *renderer = ctx->renderer;

    input_listenter(ctx); //get the keypresses

    playerPos_t.player_X += playerPos_t.player_VX;
    playerPos_t.player_Y += playerPos_t.player_VY;

    //printf("Project Goes Blep Blep!\n");

    int get_new_canvas_width = EM_ASM_INT({

        var canvasWidth = (window.innerWidth) * .72;
        return canvasWidth;

    });

    int get_new_canvas_height = EM_ASM_INT({

        var canvasHeight = (window.innerHeight) * .80;
        return canvasHeight;

    });

    resize_game(get_new_canvas_width, get_new_canvas_height);

    //printf("%d\n", get_new_canvas_width);
    
    // grey background
    SDL_SetRenderDrawColor(renderer, 192, 192, 192, 255);
    SDL_RenderClear(renderer);
    
    // purple player
    SDL_Rect rect;
    rect.w = playerDem_t.player_width;
    rect.h = playerDem_t.player_height;
    rect.x = playerPos_t.player_X;
    rect.y = playerPos_t.player_Y;
    
    SDL_SetRenderDrawColor(renderer, 75, 0, 130, 255);
    SDL_RenderFillRect(renderer, &rect);

    SDL_RenderPresent(renderer);

    ctx->iteration++;
}

int get_game_width = EM_ASM_INT({

    var canvasWidth = (window.innerWidth) * .72;
    return canvasWidth;

});

int get_game_height = EM_ASM_INT({

    var canvasHeight = (window.innerHeight) * .80;
    return canvasHeight;

});

int get_player_width = EM_ASM_INT({

    var canvas = (window.innerWidth) * .72;
    var playerWidth = canvas * .03;
    return playerWidth;

});

int get_player_height = EM_ASM_INT({

    var canvas = (window.innerWidth) * .72;
    var playerHeight = canvas * .03;
    return playerHeight;

});

int main(){
    
    canvasDem_t.canvas_width = get_game_width;
    canvasDem_t.canvas_height = get_game_height;

    playerDem_t.player_width = get_player_width;
    playerDem_t.player_height = get_player_height;
    //printf("%f\n", get_player_width); //for console logging floats and doubles
    //printf("%d\n", get_player_width); //for console logging ints

    SDL_Init(SDL_INIT_VIDEO);
    
    create_window();

    renderer = SDL_CreateRenderer(window, -1, 0);

    context ctx;
    ctx.renderer = renderer;
    ctx.iteration = 0;

    playerPos_t.player_VX = 0;
    playerPos_t.player_VY = 0;
    playerPos_t.player_X = (canvasDem_t.canvas_width) * .50;
    playerPos_t.player_Y = (canvasDem_t.canvas_height) * .50;

    const int loop = 1; // <- call the function as fast as the browser can (typically 60fps)
    const int fps = -1; // <- call the function as fast as the browser can (typically 60fps)
    emscripten_set_main_loop_arg(physics_loop, &ctx, fps, loop);

    
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();

    return EXIT_SUCCESS;
}