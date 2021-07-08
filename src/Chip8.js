import { CHAR_SET_ADDRESS, LOAD_PROGRAM_ADDRESS, MEMORY_SIZE } from "./constants/memoryConstants";
import { Display } from "./Display";
import { Keyboard } from "./Keyboard";
import {Memory} from './Memory'
import { Registers } from "./Registers";
import { CHAR_SET } from "./constants/charSetConstants";
import { TIMER_60_HZ } from "./constants/registersConstants";
import { SoundCard } from "./soundCard";
import { Disassembler } from "./Disasslembler";
import { SPRITE_HEIGHT } from "./constants/displayConstants";
export class Chip8{
    constructor(romBuffer){ //create a constructor 
        console.log('create a new chip-8');
       
        
        this.memory = new Memory(); // Creating a instance of memory everytime 
        this.registers = new Registers();

        this.loadCharSet(); // Loading the Charset 
        
        this.loadRom(romBuffer);
        this.keyboard= new Keyboard();
        this.soundCard = new SoundCard();
        this.disassembler = new Disassembler()
        this.display = new Display(this.memory); //Creating a instance of Display everytime, passing this.memory to the Display so that we have the memory inside Display to show the graphics to the user 
    }
    sleep(ms =TIMER_60_HZ){
        return new Promise((resolve)=>setTimeout(resolve,ms))
    }

    loadCharSet(){
        this.memory.memory.set(CHAR_SET,CHAR_SET_ADDRESS)
    }
    loadRom(romBuffer){
        console.assert(romBuffer.length + LOAD_PROGRAM_ADDRESS <= MEMORY_SIZE,'This ROM is too large')
        this.memory.memory.set(romBuffer, LOAD_PROGRAM_ADDRESS);
        this.registers.PC = LOAD_PROGRAM_ADDRESS;
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
                            this.registers.I=this.registers.V[args[0]] * SPRITE_HEIGHT;
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

