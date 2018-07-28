#include <SDL2/SDL.h>
#include <emscripten.h>
#include <cstdlib>
#include <stdio.h>

#define SCREEN_WIDTH  500
#define SCREEN_HEIGHT 500


struct context{ // this is for handling the stage and frames

    SDL_Renderer *renderer;
    int iteration;

}context_t;

struct player{ //this is for handling player position and input states

    int player_VX;
    int player_VY;
    int player_X;
    int player_Y;

    bool upPressed;
    bool downPressed;
    bool leftPressed;
    bool rightPressed;

}player_t;

void input_listenter(struct context *ctx){ //This is for listening for the keyboard controls

    SDL_Event event;

    while (SDL_PollEvent(&event)) { //movement issue is in the else if key up in each case statement

        switch (event.key.keysym.sym){

            case SDLK_UP:
                if (event.key.type == SDL_KEYDOWN){

                    player_t.upPressed = true;
                }
                else if (event.key.type == SDL_KEYUP){

                    player_t.upPressed = false;
                }
                break;
            case SDLK_DOWN:
                if (event.key.type == SDL_KEYDOWN){

                    player_t.downPressed = true;
                }
                else if (event.key.type == SDL_KEYUP){

                    player_t.downPressed = false;
                }
                break;
            case SDLK_LEFT:
                if (event.key.type == SDL_KEYDOWN){

                    player_t.leftPressed = true;
                }
                else if (event.key.type == SDL_KEYUP){

                    player_t.leftPressed = false;
                }
                break;
            case SDLK_RIGHT:
                if (event.key.type == SDL_KEYDOWN){

                    player_t.rightPressed = true;
                }
                else if (event.key.type == SDL_KEYUP){

                    player_t.rightPressed = false;
                }
                break;
            case SDLK_w:
                if (event.key.type == SDL_KEYDOWN){

                    player_t.upPressed = true;
                }
                else if (event.key.type == SDL_KEYUP){

                    player_t.upPressed = false;
                }
                break;
            case SDLK_s:
                if (event.key.type == SDL_KEYDOWN){

                    player_t.downPressed = true;
                }
                else if (event.key.type == SDL_KEYUP){

                    player_t.downPressed = false;
                }
                break;
            case SDLK_a:
                if (event.key.type == SDL_KEYDOWN){

                    player_t.leftPressed = true;
                }
                else if (event.key.type == SDL_KEYUP){

                    player_t.leftPressed = false;
                }
                break;
            case SDLK_d:
                if (event.key.type == SDL_KEYDOWN){

                    player_t.rightPressed = true;
                }
                else if (event.key.type == SDL_KEYUP){

                    player_t.rightPressed = false;
                }
                break;
            default:
                break;
        }

    }
    // These are for diagonal movement
    if(player_t.upPressed == true && 
        player_t.leftPressed == true){

            player_t.player_VY = -2;
            player_t.player_VX = -2;
    }
    if(player_t.upPressed == true && 
        player_t.rightPressed == true){

            player_t.player_VY = -2;
            player_t.player_VX = 2;
    }
    if(player_t.downPressed == true && 
        player_t.leftPressed == true){

            player_t.player_VY = 2;
            player_t.player_VX = -2;
    }
    if(player_t.downPressed == true && 
        player_t.rightPressed == true){

            player_t.player_VY = 2;
            player_t.player_VX = 2;
    }

    // These are for straight movement
    if(player_t.upPressed == true && 
        player_t.leftPressed == false &&
        player_t.rightPressed == false){

        player_t.player_VY = -2;
        player_t.player_VX = 0;
    }
    if(player_t.downPressed == true && 
        player_t.leftPressed == false &&
        player_t.rightPressed == false){

        player_t.player_VY = 2;
        player_t.player_VX = 0;
    }
    if(player_t.leftPressed == true && 
        player_t.upPressed == false &&
        player_t.downPressed == false){

        player_t.player_VX = -2;
        player_t.player_VY = 0;
    }
    if(player_t.rightPressed == true && 
        player_t.upPressed == false &&
        player_t.downPressed == false){

        player_t.player_VX = 2;
        player_t.player_VY = 0;
    }

    //This is when no movement keys are pressed
    if(player_t.upPressed == false && 
       player_t.downPressed == false &&
       player_t.leftPressed == false &&
       player_t.rightPressed == false){

        player_t.player_VX = 0;
        player_t.player_VY = 0;
    }
}

void physics_loop(void *arg){

    context *ctx = static_cast<context*>(arg);
    SDL_Renderer *renderer = ctx->renderer;
    
    input_listenter(ctx); //get the keypresses

    player_t.player_X += player_t.player_VX;
    player_t.player_Y += player_t.player_VY;

    //printf("Project Goes Blep Blep!\n");
    
    // grey background
    SDL_SetRenderDrawColor(renderer, 192, 192, 192, 255);
    SDL_RenderClear(renderer);
    
    // purple player
    SDL_Rect rect;
    rect.w = 25;
    rect.h = 25;
    rect.x = player_t.player_X;
    rect.y = player_t.player_Y;
    
    SDL_SetRenderDrawColor(renderer, 75, 0, 130, 255);
    SDL_RenderFillRect(renderer, &rect);

    SDL_RenderPresent(renderer);

    ctx->iteration++;
}

int main(){

    SDL_Init(SDL_INIT_VIDEO);
    SDL_Window *window;
    SDL_Renderer *renderer;
    SDL_CreateWindowAndRenderer(SCREEN_WIDTH, SCREEN_HEIGHT, 0, &window, &renderer);

    context ctx;
    ctx.renderer = renderer;
    ctx.iteration = 0;

    player_t.player_VX = 0;
    player_t.player_VY = 0;
    player_t.player_X = 50;
    player_t.player_Y = 50;

    const int loop = 1; // <- call the function as fast as the browser can (typically 60fps)
    const int fps = -1; // <- call the function as fast as the browser can (typically 60fps)
    emscripten_set_main_loop_arg(physics_loop, &ctx, fps, loop);
    
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();

    return EXIT_SUCCESS;
}