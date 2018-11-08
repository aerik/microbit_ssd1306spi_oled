class SSD1306 {
    private screen: number[];
    private _cmd(cAry: number[]): void {
        pins.P16.digitalWrite(false);
        for (let i = 0; i < cAry.length; i++) {
            pins.spiWrite(cAry[i]);
        }
        pins.P16.digitalWrite(true);
    }
    private _cmd2(cAry: string): void {
        pins.P16.digitalWrite(false);
        for (let i = 0; i < cAry.length; i++) {
            pins.spiWrite(cAry.charCodeAt(i));
        }
        pins.P16.digitalWrite(true);
    }
    constructor() {
        let c = [174, 164, 213, 240, 168, 63, 211, 0, 0, 141, 20, 32, 0, 33, 0, 127, 34, 0, 63, 161, 200, 218, 18, 129, 207, 217, 241, 219, 64, 166, 214, 0, 175];
        let x = '\xAE\xA4\xD5\xF0\xA8\x3F\xD3\x00\x00\x8D\x14\x20\x00\x21\x00\x7F\x22\x00\x3F\xa1\xc8\xDA\x12\x81\xCF\xd9\xF1\xDB\x40\xA6\xd6\x00\xaf';
        pins.P15.digitalWrite(false);
        pins.spiPins(DigitalPin.P14, DigitalPin.P14, DigitalPin.P13);
        pins.spiFormat(8, 0);
        pins.spiFrequency(9600);
        pins.P15.digitalWrite(true);
        this._cmd(c);
        this.screen = [];
        for (let i = 0; i < 1024; i++) {
            this.screen[i] = 0;
        }
    }
    private _set_pos(col: number, page: number) {
        let c1 = col * 2 & 0x0F;
        let c2 = col >> 3;
        this._cmd([0xb0 | page, 0x00 | c1, 0x10 | c2]);
    }
    public clear_old() {
        for (let i = 0; i < 1024; i++) {
            this.screen[i] = 0;
        }
    }
    public draw_screen() {
        this._set_pos(0, 0);
        for (let i = 0; i < this.screen.length; i++) {
            pins.spiWrite(this.screen[i]);
        }
    }

    public test() {
        this.screen[32] = 255;
        this.screen[68] = 255;
        this.screen[72] = 255;
        this.screen[88] = 255;
        this.draw_screen();
    }
}