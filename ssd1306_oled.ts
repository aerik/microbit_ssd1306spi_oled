namespace SSD1306oled {

    const screenSize = 1024;

    //private singleton class
    class SSD1306oledInstance {

        private _cmd(cAry: number[]): void {
            pins.P16.digitalWrite(false);
            for (let i = 0; i < cAry.length; i++) {
                pins.spiWrite(cAry[i]);
            }
            pins.P16.digitalWrite(true);
        }

        private _cmdTxt(cAry: string): void {
            pins.P16.digitalWrite(false);
            for (let i = 0; i < cAry.length; i++) {
                pins.spiWrite(cAry.charCodeAt(i));
            }
            pins.P16.digitalWrite(true);
        }

        constructor() {
            let x = '\xAE\xA4\xD5\xF0\xA8\x3F\xD3\x00\x00\x8D\x14\x20\x00\x21\x00\x7F\x22\x00\x3F\xa1\xc8\xDA\x12\x81\xCF\xd9\xF1\xDB\x40\xA6\xd6\x00\xaf';
            pins.P15.digitalWrite(false);
            pins.spiPins(DigitalPin.P14, DigitalPin.P14, DigitalPin.P13);
            pins.spiFormat(8, 0);
            pins.spiFrequency(115200);
            pins.P15.digitalWrite(true);
            this._cmdTxt(x);
            this.clear_screen();
        }

        protected _set_pos(col: number, page: number) {
            let c1 = col * 2 & 0x0F;
            let c2 = col >> 3;
            this._cmd([0xb0 | page, 0x00 | c1, 0x10 | c2]);
        }

        public clear_screen() {
            this._set_pos(0, 0);
            for (let i = 0; i < screenSize; i++) {
                pins.spiWrite(0);
            }
        }

        public drawValueAt(val: number, col: number, page: number) {
            this._set_pos(col, page);
            pins.spiWrite(val);
        }
    }

    //private singleton class
    class SSD1306oledBufferedInstance extends SSD1306oledInstance {

        private screenBuffer: Buffer; //each char is (at least) a byte

        constructor() {
            super();
            this.screenBuffer = pins.createBuffer(1024);
        }

        protected _clear_buffer() {
            this.screenBuffer.fill(0);
        }

        public draw_screen() {
            this._set_pos(0, 0);
            for (let i = 0; i < this.screenBuffer.length; i++) {
                pins.spiWrite(this.screenBuffer.getNumber(NumberFormat.Int8LE, i));
            }
        }
    }


    //private singleton instance
    //% fixedInstance whenUsed
    let oled = new SSD1306oledInstance();

    export function drawValueAt(val: number, col: number, page: number) {
        oled.drawValueAt(val, col, page);
    }

    export function drawTextAt(txt: string, col: number, page: number) {
        let cVals = vFont.GetCharacterColValues(txt);
        for (let i = 0; i < cVals.length; i++) {
            oled.drawValueAt(cVals[i], col + i, page);
        }
    }
}