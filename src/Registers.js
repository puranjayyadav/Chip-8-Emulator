import { LOAD_PROGRAM_ADDRESS } from "./constants/memoryConstants";
import { NUMBER_OF_REGISTERS,STACK_DEEP } from "./constants/registersConstants";

export class Registers{
    constructor(){
        this.V = new Uint8Array(NUMBER_OF_REGISTERS);
        this.I =0;
        this.DT =0;
        this.ST=0;
        this.PC = LOAD_PROGRAM_ADDRESS;
        this.SP = -1;
        this.stack = new Uint16Array(STACK_DEEP);
        this.reset();
    }
    reset(){
        this.V.fill(0);
        this.I =0;
        this.delayTimer =0;
        this.soundTimer=0;
        this.PC = LOAD_PROGRAM_ADDRESS;
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
        console.assert(this.SP<STACK_DEEP,'Error stack overflow')
    }
    assertStackOverFlow(){
        console.assert(this.SP>=-1,'Error stack underflow')
    }

}