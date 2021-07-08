/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Chip8": () => (/* binding */ Chip8)
/* harmony export */ });
/* harmony import */ var _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _Display__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _Keyboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _Memory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8);
/* harmony import */ var _Registers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);
/* harmony import */ var _constants_charSetConstants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4);
/* harmony import */ var _constants_registersConstants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(10);
/* harmony import */ var _soundCard__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(11);
/* harmony import */ var _Disasslembler__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(13);
/* harmony import */ var _constants_displayConstants__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(5);










class Chip8{
    constructor(romBuffer){ //create a constructor 
        console.log('create a new chip-8');
       
        
        this.memory = new _Memory__WEBPACK_IMPORTED_MODULE_3__.Memory(); // Creating a instance of memory everytime 
        this.registers = new _Registers__WEBPACK_IMPORTED_MODULE_4__.Registers();

        this.loadCharSet(); // Loading the Charset 
        
        this.loadRom(romBuffer);
        this.keyboard= new _Keyboard__WEBPACK_IMPORTED_MODULE_2__.Keyboard();
        this.soundCard = new _soundCard__WEBPACK_IMPORTED_MODULE_7__.SoundCard();
        this.disassembler = new _Disasslembler__WEBPACK_IMPORTED_MODULE_8__.Disassembler()
        this.display = new _Display__WEBPACK_IMPORTED_MODULE_1__.Display(this.memory); //Creating a instance of Display everytime, passing this.memory to the Display so that we have the memory inside Display to show the graphics to the user 
    }
    sleep(ms =_constants_registersConstants__WEBPACK_IMPORTED_MODULE_6__.TIMER_60_HZ){
        return new Promise((resolve)=>setTimeout(resolve,ms))
    }

    loadCharSet(){
        this.memory.memory.set(_constants_charSetConstants__WEBPACK_IMPORTED_MODULE_5__.CHAR_SET,_constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__.CHAR_SET_ADDRESS)
    }
    loadRom(romBuffer){
        console.assert(romBuffer.length + _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__.LOAD_PROGRAM_ADDRESS <= _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__.MEMORY_SIZE,'This ROM is too large')
        this.memory.memory.set(romBuffer, _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__.LOAD_PROGRAM_ADDRESS);
        this.registers.PC = _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__.LOAD_PROGRAM_ADDRESS;
    }
    async execute(opcode){
      const {instruction,args} = this.disassembler.disassembler(opcode);
      const {id} = instruction;
      console.log('i',instruction);
      console.log('a', args);
      console.log('id' ,id);
      switch(id){
        case 'CLS':
          this.display.reset();
          break;
          case 'RET':
            this.registers.PC = this.registers.stackPop();
            break;
            case 'JP_ADDR':
              this.registers.PC = args[0];
              break;
              case 'CALL_ADDR':
                this.registers.stackPush(this.registers.PC);
                this.registers.PC = args[0];
                break;
                case 'SE_VX_KK':
                  if(this.registers.V[args[0] === args[1]]){
                    this.registers.PC +=2;
                  }
                  break;
                  case 'SNE_VX_KK':
                    if(this.registers.V[args[0] !== args[1]]){
                      this.registers.PC +=2;
                    }
                    break;
                    case 'SE_VX_VY' :
                      if(this.registers.V[args[0]]=== this.registers.V[args[1]]){
                        this.registers.PC +=2;
                      }
                      break;
                    case 'LD_VX_KK':
                      this.registers.V[args[0]] = args[1]
                      break;
                      case 'ADD_VX_KK': 
                      this.registers.V[args[0]] += args[1]
                      break;
                      case 'LD_VX_VY':
                        this.registers.V[args[0]] = this.registers.V[args[1]]
                        break;
                        case 'OR_VX_VY':
                          this.registers.V[args[0]] |= this.registers.V[args[1]] 
                          break;
                        case 'AND_VX_VY':
                          this.registers.V[args[0]] &= this.registers.V[args[1]] 
                          break;
                        case 'XOR_VX_VY':
                           this.registers.V[args[0]] ^= this.registers.V[args[1]] 
                            break;
                        case 'ADD_VX_VY':
                        this.registers.V[0x0f] = (this.registers.V[args[0]] + this.registers.V[args[1]] > 0xff);
                          this.registers.V[args[0]] += this.registers.V[args[1]];
                          break;
                        case 'SUB_VX_VY':
                          this.registers.V[0x0f] = this.registers.V[args[0]] > this.registers.V[args[1]];
                          this.registers.V[args[0]] -= this.registers.V[args[1]];
                          break;
                        case 'SHR_VX_VY':
                          this.registers.V[0x0f] = this.registers.V[args[0]] & 0x01
                          this.registers.V[args[0]] >>= 1
                          break;
                        case 'SUBN_VX_VY':
                          this.registers.V[0x0f] = this.registers.V[args[1]]> this.registers.V[args[0]];
                          this.registers.V[args[0]] = this.registers.V[args[1]] = this.registers.V[args[0]];
                          break;
                        case 'SHL_VX_VY':
                          this.registers.V[0x0f] = this.registers.V[args[0]] & 0x80
                          this.registers.V[args[0]] <<=1;
                          break;
                        case 'SNE_VX_VY':
                          if(this.registers.V[args[0]] !== this.registers.V[args[1]]){
                            this.registers.PC += 2;
                          }
                          break;
                        case 'LD_I_ADDR':
                          this.registers.I = args[0];
                          break;
                        case 'JP_V0_ADDR':
                          this.registers.PC = this.registers.V[0] + args[0];
                          break;
                        case 'RND_VX':
                          const random = Math.floor(Math.random() * 0xff);
                          this.registers.V[args[0]] = random & args[1];
                          break;
                        case 'DRW_VX_VY_N':
                      const collision=  this.display.drawSprite(
                          this.registers.V[args[0]],
                          this.registers.V[args[1]],
                          this.registers.I,
                          args[2]
                        );
                        this.registers.V[0x0f] =collision;
                        break;
                        case 'SKP_VX':
                          if(this.keyboard.isKeyDown(this.registers.V[args[0]])){
                            this.registers.PC +=2;
                          }
                          break;
                        case 'SKNP_VX':
                          if(!this.keyboard.isKeyDown(this.registers.V[args[0]])){
                            this.registers.PC +=2;
                          }break;
                        case 'LD_VX_DT':
                          this.registers.V[args[0]] = this.registers.DT;
                          break;
                          case 'LD_VX_K':
                            while(keyPressed === -1){
                              keyPressed = this.keyboard.hasKeydown();
                              await this.sleep();
  
                            }
                            this.registers.V[args[0]]= keyPressed;
                            break;
                        case 'LD_DT_VX':
                          this.registers.DT = this.registers.V[args[0]];
                          break;
                        case 'LD_ST_VX':
                          this.registers.ST = this.registers.V[args[0]];
                          break;
                        case 'ADD_I_VX':
                          this.registers.I +=this.registers.V[args[0]];
                          break;
                          case 'LD_F_VX':
                            this.registers.I=this.registers.V[args[0]] * _constants_displayConstants__WEBPACK_IMPORTED_MODULE_9__.SPRITE_HEIGHT;
                            break;
                            case 'LD_B_VX':
                              let x = this.registers.V[args[0]];
                              const hundreds = Math.floor(x / 100);
                              x = x - hundreds * 100;
                              const tens = Math.floor(x / 10);
                              const ones = x - tens * 10;
                              this.memory.memory[this.registers.I] = hundreds;
                              this.memory.memory[this.registers.I + 1] = tens;
                              this.memory.memory[this.registers.I + 2] = ones;
                              break;
                            case 'LD_I_VX':
                              for(let i=0;i<=args[0];i++){
                                this.Memory.memory[this.registers.I +i] = this.registers.V[i]
                              }
                              break;
                            case 'LD_VX_I':
                              for(let i=0; i<=args[0];i++){
                                this.registers.V[i] = this.memory.memory[this.registers.I +i]
                              }
                              break;
          default:
            console.error(`Instruction set with id ${id} not found `, instruction,args )
      }
    }
}   



/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MEMORY_SIZE": () => (/* binding */ MEMORY_SIZE),
/* harmony export */   "LOAD_PROGRAM_ADDRESS": () => (/* binding */ LOAD_PROGRAM_ADDRESS),
/* harmony export */   "CHAR_SET_ADDRESS": () => (/* binding */ CHAR_SET_ADDRESS)
/* harmony export */ });
const MEMORY_SIZE = 4095;
const LOAD_PROGRAM_ADDRESS = 0x200;
const CHAR_SET_ADDRESS = 0x000;

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Display": () => (/* binding */ Display)
/* harmony export */ });
/* harmony import */ var _constants_charSetConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);

 //Import CONSTANTS from a file

class Display { 
    constructor(memory){                            
        console.log('create a new display');
        this.memory = memory;
        this.screen = document.querySelector('canvas') //Defining a object of screen. Displays the screen on HTML attribute CANVAS
        this.screen.width =_constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__.DISPLAY_WIDTH*_constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__.DISPLAY_MULTIPLAY; // Mulitplying the width by 10to increase the size of the window 
        this.screen.height=_constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__.DISPLAY_HEIGHT*_constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__.DISPLAY_MULTIPLAY;//Increasing the height
        this.context = this.screen.getContext('2d'); //Using getContext so that we get 2d rendering of the canvas element on the screen 
        this.context.fillStyle=_constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__.BG_COLOR; // Filling the canvas with Black color
        this.frameBuffer =[]; // Setting the array to blank 
        this.reset();
    }
    reset(){
        for(let i=0;i<_constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__.DISPLAY_HEIGHT;i++){ //Run the loop till max height defined
            this.frameBuffer.push([]);// Allocate or push empty array in the context canvas
            for(let j=0;j<_constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__.DISPLAY_WIDTH;j++){ //Run the loop till width 
                this.frameBuffer[i].push(0); //
            }
        }
        this.context.fillRect(0,0,this.screen.width,this.screen.height); // Fill the rectangle till the end of the screen 
        this.drawBuffer() //call drawBuffer() method 
        console.log('reset display')
    }
    drawBuffer(){
        for(let h=0;h<_constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__.DISPLAY_HEIGHT;h++){
            this.frameBuffer.push([]);
            for(let w=0;w<_constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__.DISPLAY_WIDTH;w++){
                this.drawPixel(h,w,this.frameBuffer[h][w]); // Draw the pixel till h,w and frame buffer
            }
        }
 
    }

    drawPixel(h,w,value){
        if(value){ //if it is a valid value defined between height and width constants then run the following 
            this.context.fillStyle = _constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__.COLOR //fill the background or the pixel with COLOR
        }else{//Else make it black 
            this.context.fillStyle = _constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__.BG_COLOR;
        }
        this.context.fillRect(w*_constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__.DISPLAY_MULTIPLAY,h*_constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__.DISPLAY_MULTIPLAY,_constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__.DISPLAY_MULTIPLAY,_constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__.DISPLAY_MULTIPLAY); // Filling the whole background 
    }
    //Chip-8 draws graphics on screen through the use of sprites. A sprite is a group of bytes which are a binary representation of the desired picture. Chip-8 sprites may be up to 15 bytes, for a possible sprite size of 8x15.
//Programs may also refer to a group of sprites representing the hexadecimal digits 0 through F. These sprites are 5 bytes long, or 8x5 pixels. The data should be stored in the interpreter area of Chip-8 memory (0x000 to 0x1FF). Below is a listing of each character's bytes, in binary and hexadecimal:
drawSprite(h,w,spriteAddress,num){
    let pixelCollision=0;

    for(let lh=0; lh<num;lh++ ){ // Loop for line height 
        const line = this.memory.memory[spriteAddress+lh] //passing sprite 
        for(let lw=0; lw<_constants_charSetConstants__WEBPACK_IMPORTED_MODULE_0__.CHAR_SET_WITH;lw++){
                const bitToCheck = (0b10000000 >> lw) //Initialising a binary value . since a sprite is 8 bits long.
               
                const value = line & bitToCheck; // Doing & of line and bitToCheck to draw pixels 
                const ph = (h+lh)% _constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__.DISPLAY_HEIGHT;
                const pw = (w+lw) % _constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__.DISPLAY_WIDTH;
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


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CHAR_SET_WITH": () => (/* binding */ CHAR_SET_WITH),
/* harmony export */   "CHAR_SET": () => (/* binding */ CHAR_SET)
/* harmony export */ });
  
const CHAR_SET_WITH = 8;
const CHAR_SET = [
  0xf0,
  0x90,
  0x90,
  0x90,
  0xf0,
  0x20,
  0x60,
  0x20,
  0x20,
  0x70,
  0xf0,
  0x10,
  0xf0,
  0x80,
  0xf0,
  0xf0,
  0x10,
  0xf0,
  0x10,
  0xf0,
  0x90,
  0x90,
  0xf0,
  0x10,
  0x10,
  0xf0,
  0x80,
  0xf0,
  0x10,
  0xf0,
  0xf0,
  0x80,
  0xf0,
  0x90,
  0xf0,
  0xf0,
  0x10,
  0x20,
  0x40,
  0x40,
  0xf0,
  0x90,
  0xf0,
  0x90,
  0xf0,
  0xf0,
  0x90,
  0xf0,
  0x10,
  0xf0,
  0xf0,
  0x90,
  0xf0,
  0x90,
  0x90,
  0xe0,
  0x90,
  0xe0,
  0x90,
  0xe0,
  0xf0,
  0x80,
  0x80,
  0x80,
  0xf0,
  0xe0,
  0x90,
  0x90,
  0x90,
  0xe0,
  0xf0,
  0x80,
  0xf0,
  0x80,
  0xf0,
  0xf0,
  0x80,
  0xf0,
  0x80,
  0x80,
];

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DISPLAY_WIDTH": () => (/* binding */ DISPLAY_WIDTH),
/* harmony export */   "DISPLAY_HEIGHT": () => (/* binding */ DISPLAY_HEIGHT),
/* harmony export */   "DISPLAY_MULTIPLAY": () => (/* binding */ DISPLAY_MULTIPLAY),
/* harmony export */   "BG_COLOR": () => (/* binding */ BG_COLOR),
/* harmony export */   "COLOR": () => (/* binding */ COLOR),
/* harmony export */   "SPRITE_HEIGHT": () => (/* binding */ SPRITE_HEIGHT)
/* harmony export */ });
const DISPLAY_WIDTH = 64;
const DISPLAY_HEIGHT =  32;
const DISPLAY_MULTIPLAY = 10;
const BG_COLOR ="#000";
const COLOR = '#3f6';
const SPRITE_HEIGHT = 5;

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Keyboard": () => (/* binding */ Keyboard)
/* harmony export */ });
/* harmony import */ var _constants_keyboardConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);


class Keyboard{
    constructor(){
        this.keys= new Array(_constants_keyboardConstants__WEBPACK_IMPORTED_MODULE_0__.NUMBER_OF_KEYS).fill(false);
        document.addEventListener("keydown", (event)=>this.keydown(event.key));
        document.addEventListener('keyup',(event)=>this.keyup(event.key));
    }
    keydown(key){
        const keyIndex = _constants_keyboardConstants__WEBPACK_IMPORTED_MODULE_0__.keyMap.findIndex((mapKey)=>mapKey === key.toLowerCase());
        if (keyIndex>-1){
            this.keys[keyIndex] = true;
        };
    }
        keyup(key){
            const keyIndex = _constants_keyboardConstants__WEBPACK_IMPORTED_MODULE_0__.keyMap.findIndex((mapKey)=>mapKey === key.toLowerCase());
            if (keyIndex>-1){
                this.keys[keyIndex] = false;
            }
    }
    isKeyDown(keyIndex){
        return this.keys[keyIndex]
    }
    hasKeydown(){
        return this.keys.findIndex((key)=>key)
    }
}

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NUMBER_OF_KEYS": () => (/* binding */ NUMBER_OF_KEYS),
/* harmony export */   "keyMap": () => (/* binding */ keyMap)
/* harmony export */ });
const NUMBER_OF_KEYS=16;
const keyMap =[
    "1","2","3",
    "q","w","e",
    "a","s","d",
    "x","z","c",
    "4","r","f","v"
]

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Memory": () => (/* binding */ Memory)
/* harmony export */ });
/* harmony import */ var _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
 
class Memory{
    constructor(){
        this.memory = new Uint8Array(_constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__.MEMORY_SIZE); // new instance of the Uint8Array  is made everytime the constructor is called . Creates 8 byte of typed unsigned array
        this.reset();
    }
    reset(){
        this.memory.fill(0);//Fills the memory with 0
    }
    setMemory(index,value){
        this.assertMemory(index)
        this.memory[index]=value;
    }
    getMemory(index){
        this.assertMemory(index)
        return this.memory[index];
    }
    getOpcode(index){
        const highByte = this.getMemory(index);
        const lowByte = this.getMemory(index+1);
        return (highByte << 8) | lowByte;
    }

    assertMemory(index){
        console.assert(index>=0 &&index< _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__.MEMORY_SIZE,`Error trying to access memory at index ${index}`)
    }
}

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Registers": () => (/* binding */ Registers)
/* harmony export */ });
/* harmony import */ var _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _constants_registersConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);



class Registers{
    constructor(){
        this.V = new Uint8Array(_constants_registersConstants__WEBPACK_IMPORTED_MODULE_1__.NUMBER_OF_REGISTERS);
        this.I =0;
        this.DT =0;
        this.ST=0;
        this.PC = _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__.LOAD_PROGRAM_ADDRESS;
        this.SP = -1;
        this.stack = new Uint16Array(_constants_registersConstants__WEBPACK_IMPORTED_MODULE_1__.STACK_DEEP);
        this.reset();
    }
    reset(){
        this.V.fill(0);
        this.I =0;
        this.delayTimer =0;
        this.soundTimer=0;
        this.PC = _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__.LOAD_PROGRAM_ADDRESS;
        this.SP = -1;
        this.stack.fill(0)  ;      
    }

    stackPush(value){
        this.SP++;
        this.assertStackOverFlow()
        this.stack[this.SP]=value
    }
    stackPop(){
        const value = this.stack[this.SP];
        this.SP--;
        this.assertStackUnderFlow();
        return value;
    }

    assertStackUnderFlow(){
        console.assert(this.SP<_constants_registersConstants__WEBPACK_IMPORTED_MODULE_1__.STACK_DEEP,'Error stack overflow')
    }
    assertStackOverFlow(){
        console.assert(this.SP>=-1,'Error stack underflow')
    }

}

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NUMBER_OF_REGISTERS": () => (/* binding */ NUMBER_OF_REGISTERS),
/* harmony export */   "STACK_DEEP": () => (/* binding */ STACK_DEEP),
/* harmony export */   "TIMER_60_HZ": () => (/* binding */ TIMER_60_HZ)
/* harmony export */ });
const NUMBER_OF_REGISTERS =16;
const STACK_DEEP = 16;
const TIMER_60_HZ=1000/60

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SoundCard": () => (/* binding */ SoundCard)
/* harmony export */ });
/* harmony import */ var _constants_soundCardConstant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);


class SoundCard {
  constructor() {
    this.soundEnabled = false;
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      const audioContext = new (AudioContext || webkitAudioContext)();
      const masterGain = new GainNode(audioContext);
      masterGain.gain.value = _constants_soundCardConstant__WEBPACK_IMPORTED_MODULE_0__.INITIAL_VOLUME;
      masterGain.connect(audioContext.destination);
      let soundEnabled = false;
      let oscillator;
      Object.defineProperties(this, {
        soundEnabled: {
          get: function () {
            return soundEnabled;
          },
          set: function (value) {
            if (value === soundEnabled) {
              return;
            }
            soundEnabled = value;
            if (soundEnabled) {
              oscillator = new OscillatorNode(audioContext, {
                type: 'square',
              });
              oscillator.connect(masterGain);
              oscillator.start();
            } else {
              oscillator.stop();
            }
          },
        },
      });
    }
  }
  enableSound() {
    this.soundEnabled = true;
  }
  disableSound() {
    this.soundEnabled = false;
  }
}

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "INITIAL_VOLUME": () => (/* binding */ INITIAL_VOLUME)
/* harmony export */ });
const INITIAL_VOLUME= 0.3;

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Disassembler": () => (/* binding */ Disassembler)
/* harmony export */ });
/* harmony import */ var _constants_instructionSetConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


class Disassembler{
     disassembler(opcode){
        const instruction = _constants_instructionSetConstants__WEBPACK_IMPORTED_MODULE_0__.INSTRUCTION_SET.find(
            instruction=>(opcode & instruction.mask) ===instruction.pattern
        );
        const args = instruction.arguments.map(arg => (opcode & arg.mask) >> arg.shift)
        return { instruction, args};
    }
} 

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MASK_NNN": () => (/* binding */ MASK_NNN),
/* harmony export */   "MASK_N": () => (/* binding */ MASK_N),
/* harmony export */   "MASK_X": () => (/* binding */ MASK_X),
/* harmony export */   "MASK_Y": () => (/* binding */ MASK_Y),
/* harmony export */   "MASK_KK": () => (/* binding */ MASK_KK),
/* harmony export */   "MASK_HIGHEST_BYTE": () => (/* binding */ MASK_HIGHEST_BYTE),
/* harmony export */   "MASK_HIGHEST_AND_LOWEST_BYTE": () => (/* binding */ MASK_HIGHEST_AND_LOWEST_BYTE),
/* harmony export */   "INSTRUCTION_SET": () => (/* binding */ INSTRUCTION_SET)
/* harmony export */ });
const MASK_NNN = { mask: 0x0fff };
const MASK_N = { mask: 0x000f };
const MASK_X = { mask: 0x0f00, shift: 8 };
const MASK_Y = { mask: 0x00f0, shift: 4 };
const MASK_KK = { mask: 0x00ff };
const MASK_HIGHEST_BYTE = 0xf000;
const MASK_HIGHEST_AND_LOWEST_BYTE = 0xf00f;
const INSTRUCTION_SET = [
  {
    key: 2,
    id: 'CLS',
    name: 'CLS',
    mask: 0xffff,
    pattern: 0x00e0,
    arguments: [],
  },
  {
    key: 3,
    id: 'RET',
    name: 'RET',
    mask: 0xffff,
    pattern: 0x00ee,
    arguments: [],
  },
  {
    key: 4,
    id: 'JP_ADDR',
    name: 'JP',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0x1000,
    arguments: [MASK_NNN],
  },
  {
    key: 5,
    id: 'CALL_ADDR',
    name: 'CALL',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0x2000,
    arguments: [MASK_NNN],
  },
  {
    key: 6,
    id: 'SE_VX_KK',
    name: 'SE',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0x3000,
    arguments: [MASK_X, MASK_KK],
  },
  {
    key: 7,
    id: 'SNE_VX_KK',
    name: 'SNE',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0x4000,
    arguments: [MASK_X, MASK_KK],
  },
  {
    key: 8,
    id: 'SE_VX_VY',
    name: 'SE',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x5000,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 9,
    id: 'LD_VX_KK',
    name: 'LD',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0x6000,
    arguments: [MASK_X, MASK_KK],
  },
  {
    key: 10,
    id: 'ADD_VX_KK',
    name: 'ADD',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0x7000,
    arguments: [MASK_X, MASK_KK],
  },
  {
    key: 11,
    id: 'LD_VX_VY',
    name: 'LD',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x8000,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 12,
    id: 'OR_VX_VY',
    name: 'OR',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x8001,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 13,
    id: 'AND_VX_VY',
    name: 'AND',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x8002,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 14,
    id: 'XOR_VX_VY',
    name: 'XOR',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x8003,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 15,
    id: 'ADD_VX_VY',
    name: 'ADD',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x8004,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 16,
    id: 'SUB_VX_VY',
    name: 'SUB',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x8005,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 17,
    id: 'SHR_VX_VY',
    name: 'SHR',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x8006,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 18,
    id: 'SUBN_VX_VY',
    name: 'SUBN',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x8007,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 19,
    id: 'SHL_VX_VY',
    name: 'SHL',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x800e,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 20,
    id: 'SNE_VX_VY',
    name: 'SNE',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x9000,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 21,
    id: 'LD_I_ADDR',
    name: 'LD',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0xa000,
    arguments: [MASK_NNN],
  },
  {
    key: 22,
    id: 'JP_V0_ADDR',
    name: 'JP',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0xb000,
    arguments: [MASK_NNN],
  },
  {
    key: 23,
    id: 'RND_VX_KK',
    name: 'RND',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0xc000,
    arguments: [MASK_X, MASK_KK],
  },
  {
    key: 24,
    id: 'DRW_VX_VY_N',
    name: 'DRW',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0xd000,
    arguments: [MASK_X, MASK_Y, MASK_N],
  },
  {
    key: 25,
    id: 'SKP_VX',
    name: 'SKP',
    mask: 0xf0ff,
    pattern: 0xe09e,
    arguments: [MASK_X],
  },
  {
    key: 26,
    id: 'SKNP_VX',
    name: 'SKNP',
    mask: 0xf0ff,
    pattern: 0xe0a1,
    arguments: [MASK_X],
  },
  {
    key: 27,
    id: 'LD_VX_DT',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf007,
    arguments: [MASK_X],
  },
  {
    key: 27,
    id: 'LD_VX_K',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf00a,
    arguments: [MASK_X],
  },
  {
    key: 28,
    id: 'LD_DT_VX',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf015,
    arguments: [MASK_X],
  },
  {
    key: 29,
    id: 'LD_ST_VX',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf018,
    arguments: [MASK_X],
  },
  {
    key: 30,
    id: 'ADD_I_VX',
    name: 'ADD',
    mask: 0xf0ff,
    pattern: 0xf01e,
    arguments: [MASK_X],
  },
  {
    key: 31,
    id: 'LD_F_VX',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf029,
    arguments: [MASK_X],
  },
  {
    key: 32,
    id: 'LD_B_VX',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf033,
    arguments: [MASK_X],
  },
  {
    key: 32,
    id: 'LD_I_VX',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf055,
    arguments: [MASK_X],
  },
  {
    key: 33,
    id: 'LD_VX_I',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf065,
    arguments: [MASK_X],
  },
];

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Chip8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


async function runChip8(){
const rom = await fetch('./roms/test_opcode');
const arrayBuffer = await rom.arrayBuffer();
const romBuffer = new Uint8Array(arrayBuffer);
const  chip8 = new _Chip8__WEBPACK_IMPORTED_MODULE_0__.Chip8(romBuffer);

 while(1){
    await chip8.sleep(200);
     if(chip8.registers.DT >0){
         await chip8.sleep()
         chip8.registers.DT--; 
     }
     if(chip8.registers.ST>0){
         chip8.soundCard.enableSound();
         await chip8.sleep();
         chip8.registers.ST --;
     }
     if(chip8.registers.ST ===0){
         chip8.soundCard.disableSound();
     }
 }
 }

runChip8();
})();

/******/ })()
;