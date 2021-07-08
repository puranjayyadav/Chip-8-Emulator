import { CHAR_SET_WITH } from "./constants/charSetConstants";
import { DISPLAY_HEIGHT, DISPLAY_MULTIPLAY, DISPLAY_WIDTH ,BG_COLOR, COLOR} from "./constants/displayConstants"; //Import CONSTANTS from a file

export class Display { 
    constructor(memory){                            
        console.log('create a new display');
        this.memory = memory;
        this.screen = document.querySelector('canvas') //Defining a object of screen. Displays the screen on HTML attribute CANVAS
        this.screen.width =DISPLAY_WIDTH*DISPLAY_MULTIPLAY; // Mulitplying the width by 10to increase the size of the window 
        this.screen.height=DISPLAY_HEIGHT*DISPLAY_MULTIPLAY;//Increasing the height
        this.context = this.screen.getContext('2d'); //Using getContext so that we get 2d rendering of the canvas element on the screen 
        this.context.fillStyle=BG_COLOR; // Filling the canvas with Black color
        this.frameBuffer =[]; // Setting the array to blank 
        this.reset();
    }
    reset(){
        for(let i=0;i<DISPLAY_HEIGHT;i++){ //Run the loop till max height defined
            this.frameBuffer.push([]);// Allocate or push empty array in the context canvas
            for(let j=0;j<DISPLAY_WIDTH;j++){ //Run the loop till width 
                this.frameBuffer[i].push(0); //
            }
        }
        this.context.fillRect(0,0,this.screen.width,this.screen.height); // Fill the rectangle till the end of the screen 
        this.drawBuffer() //call drawBuffer() method 
        console.log('reset display')
    }
    drawBuffer(){
        for(let h=0;h<DISPLAY_HEIGHT;h++){
            this.frameBuffer.push([]);
            for(let w=0;w<DISPLAY_WIDTH;w++){
                this.drawPixel(h,w,this.frameBuffer[h][w]); // Draw the pixel till h,w and frame buffer
            }
        }
 
    }

    drawPixel(h,w,value){
        if(value){ //if it is a valid value defined between height and width constants then run the following 
            this.context.fillStyle = COLOR //fill the background or the pixel with COLOR
        }else{//Else make it black 
            this.context.fillStyle = BG_COLOR;
        }
        this.context.fillRect(w*DISPLAY_MULTIPLAY,h*DISPLAY_MULTIPLAY,DISPLAY_MULTIPLAY,DISPLAY_MULTIPLAY); // Filling the whole background 
    }
    //Chip-8 draws graphics on screen through the use of sprites. A sprite is a group of bytes which are a binary representation of the desired picture. Chip-8 sprites may be up to 15 bytes, for a possible sprite size of 8x15.
//Programs may also refer to a group of sprites representing the hexadecimal digits 0 through F. These sprites are 5 bytes long, or 8x5 pixels. The data should be stored in the interpreter area of Chip-8 memory (0x000 to 0x1FF). Below is a listing of each character's bytes, in binary and hexadecimal:
drawSprite(h,w,spriteAddress,num){
    let pixelCollision=0;

    for(let lh=0; lh<num;lh++ ){ // Loop for line height 
        const line = this.memory.memory[spriteAddress+lh] //passing sprite 
        for(let lw=0; lw<CHAR_SET_WITH;lw++){
                const bitToCheck = (0b10000000 >> lw) //Initialising a binary value . since a sprite is 8 bits long.
               
                const value = line & bitToCheck; // Doing & of line and bitToCheck to draw pixels 
                const ph = (h+lh)% DISPLAY_HEIGHT;
                const pw = (w+lw) % DISPLAY_WIDTH;
                if(value ===0){
                    continue;
                }
                if(this.frameBuffer[ph][pw] === 1){
                    pixelCollision = 1;
                }
                this.frameBuffer[ph][pw]^=1;
        }
    }
    this.drawBuffer();
    return pixelCollision;
}
} 
