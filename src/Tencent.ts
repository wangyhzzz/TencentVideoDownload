import fetch from "node-fetch";
import {readFileSync} from "fs";

export interface Episode {
    name: string,
    url: string
}

export class Tencent {
    public Ga: any = null;
    // @ts-ignore
    public wasmobject: WebAssembly.Instance;

    static get instance(): Tencent {
        if (!this._instance) this._instance = new Tencent();
        return this._instance;
    }

    private appVer = '3.6.3';
    private guid = 'd2f657c14374c957cf22d85fff31f6df';
    private wasmUrl = "assets/tx-ckey.wasm"

    private static _instance: Tencent;

    private static getString(Ga: any, e: any, t = 0) {
        for (var o, i = 0, n = 0; i |= o = Ga[e + n], 0 != o; n++) ;
        t = t || n;
        var r = "";
        for (var a; 0 < t;) {
            a = String.fromCharCode.apply(String, Ga.subarray(e, e + Math.min(t, 1024))),
                r = r ? r + a : a,
                e += 1024,
                t -= 1024;
        }
        return r
    }

    public static writeString(e: any, t: any, o: any, i: any) {
        if (!(0 < i))
            return 0;
        for (var n = o, r = o + i - 1, a = 0; a < e.length; ++a) {
            var s = e.charCodeAt(a);
            if (55296 <= s && s <= 57343 && (s = 65536 + ((1023 & s) << 10) | 1023 & e.charCodeAt(++a)),
            s <= 127) {
                if (r <= o)
                    break;
                t[o++] = s
            } else if (s <= 2047) {
                if (r <= o + 1)
                    break;
                t[o++] = 192 | s >> 6,
                    t[o++] = 128 | 63 & s
            } else if (s <= 65535) {
                if (r <= o + 2)
                    break;
                t[o++] = 224 | s >> 12,
                    t[o++] = 128 | s >> 6 & 63,
                    t[o++] = 128 | 63 & s
            } else if (s <= 2097151) {
                if (r <= o + 3)
                    break;
                t[o++] = 240 | s >> 18,
                    t[o++] = 128 | s >> 12 & 63,
                    t[o++] = 128 | s >> 6 & 63,
                    t[o++] = 128 | 63 & s
            } else if (s <= 67108863) {
                if (r <= o + 4)
                    break;
                t[o++] = 248 | s >> 24,
                    t[o++] = 128 | s >> 18 & 63,
                    t[o++] = 128 | s >> 12 & 63,
                    t[o++] = 128 | s >> 6 & 63,
                    t[o++] = 128 | 63 & s
            } else {
                if (r <= o + 5)
                    break;
                t[o++] = 252 | s >> 30,
                    t[o++] = 128 | s >> 24 & 63,
                    t[o++] = 128 | s >> 18 & 63,
                    t[o++] = 128 | s >> 12 & 63,
                    t[o++] = 128 | s >> 6 & 63,
                    t[o++] = 128 | 63 & s
            }
        }
        return t[o] = 0,
        o - n
    }

    private c2string(str: string) {
        var addr = 0, len = (str.length << 2) + 1;
        // @ts-ignore
        addr = this.wasmobject.exports.stackAlloc.apply(null, [len]);
        Tencent.writeString(str, this.Ga, addr, len);
        return addr;
    }

    public async getUrl(vid: string, cb: (url: string) => any = a => a): Promise<Episode> {
        if (!this.wasmobject) await this.init();
        var tm = Math.floor(Date.now() / 1000);
        var ckey = this.getCkey(vid, tm);
        var url = 'https://vd.l.qq.com/proxyhttp'
        var data = `{"buid":"vinfoad","vinfoparam":"spsrt=1&charge=0&defaultfmt=auto&otype=ojson&guid=${this.guid}&flowid=0f072c413ab6cd5c9a20a2060874b409_10201&platform=10201&sdtfrom=v1010&defnpayver=1&appVer=3.6.3&host=v.qq.com&ehost=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Fjvhuaf93hh858fs%2Fi0024rxw2f4.html&refer=v.qq.com&sphttps=1&tm=${tm}&spwm=4&logintoken=&unid=73ebacf7461411e99d19a0424b63310a&vid=${vid}&defn=&fhdswitch=0&show1080p=1&isHLS=1&dtype=3&sphls=2&spgzip=1&dlver=2&drm=32&hdcp=0&spau=1&spaudio=15&defsrc=1&encryptVer=9.1&cKey=${ckey}&fp2p=1"}`
        var playurl = await fetch(url, {
            method: "POST",
            body: data,
        }).then(e => e.json())
            .catch(e => console.log(e));
        playurl = JSON.parse(playurl.vinfo)
        let name = playurl.vl.vi[0].ti
        playurl = playurl.vl.vi[0].ul.ui[2].url
        cb(playurl)
        return {name: name, url: playurl};
    }

    public getCkey(vid: string, t: number): string {
        var _args = ['10201', this.c2string(this.appVer), this.c2string(vid), this.c2string(''), this.c2string(this.guid), t];
        // @ts-ignore
        var addr = this.wasmobject.exports._getckey.apply(null, _args);
        return Tencent.getString(this.Ga, addr);
    }

    private async init() {
        var document = {
            URL: "https://v.qq.com/x/cover/jvhuaf93hh858fs/i0024rxw2f4.html",
            referrer: "https://v.qq.com/x/cover/jvhuaf93hh858fs/i0024rxw2f4.html",
        }
        var window = {
            document: document,
            navigator: {
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
                appCodeName: "Mozilla",
                appName: "Netscape",
                platform: "Win32"
            },
        };
        var cb = 5242880, db = 16777216, ab = 65536;

        var wasmMemory = new WebAssembly.Memory({
            initial: db / ab,
            maximum: db / ab
        });
        var Da = 16;

        var Ha, Ja, Na, Oa = 0, Qa, Sa, Ta, Ua, Wa = (new Array(0), 1024);

        let Ea = wasmMemory.buffer;

        Ha = new Int16Array(Ea);
        Ja = new Int32Array(Ea);
        this.Ga = new Uint8Array(Ea);

        function d(a: any) {
            var b = Oa;
            return Oa = Oa + a + 15 & -16,
                b
        }

        function e(a: any, b: any = Da) {
            return Math.ceil(a / b) * b
        }

        function malloc(size: number) {
            // @ts-ignore
            return Tencent.instance.wasmobject.exports._malloc.apply(null, [size])
        }

        let gga = this.Ga;

        function GetUnicode() {      // function 20( )
            function p(a: any) {
                for (var b = 0, c = 0; c < a.length; ++c) {
                    var d = a.charCodeAt(c);
                    d >= 55296 && d <= 57343 && (d = 65536 + ((1023 & d) << 10) | 1023 & a.charCodeAt(++c)),
                        d <= 127 ? ++b : b += d <= 2047 ? 2 : d <= 65535 ? 3 : d <= 2097151 ? 4 : d <= 67108863 ? 5 : 6
                }
                return b
            }

            function a(a: any) {
                return a ? a.length > 48 ? a.substr(0, 48) : a : ""
            }

            function b() {
                var b = document.URL
                    , c = window.navigator.userAgent.toLowerCase()
                    , d = "";
                document.referrer.length > 0 && (d = document.referrer);
                try {
                    0 == d.length && opener.location.href.length > 0 && (d = opener.location.href)
                } catch (e) {
                }
                var f = window.navigator.appCodeName
                    , g = window.navigator.appName
                    , h = window.navigator.platform;
                return b = a(b),
                    d = a(d),
                    c = a(c),
                b + "|" + c + "|" + d + "|" + f + "|" + g + "|" + h
            }

            var c = b()
                , d = p(c) + 1
                , e = malloc(d);
            return Tencent.writeString(c, gga, e, d + 1),
                e
        }

        function C() {
            return db
        }


        //////////////////////////////// init global var


        Ja[0] = 1668509029;
        Ha[1] = 25459;


        Na = Wa, Oa = Na + 6928;

        Oa += 16;

        Ua = d(4),
            Qa = e(Oa),
            Sa = Qa + cb,
            Ta = e(Sa),
            Ja[Ua >> 2] = Ta;

        ////////////////////////////////// wasm env ///////////////////////////////////////

        var fun_ = function () {
        };

        let wasm_env = {
            abort: fun_,
            assert: fun_,
            enlargeMemory: fun_,
            getTotalMemory: C,
            abortOnCannotGrowMemory: fun_,
            abortStackOverflow: fun_,
            nullFunc_ii: fun_,
            nullFunc_iiii: fun_,
            nullFunc_v: fun_,
            nullFunc_vi: fun_,
            nullFunc_viiii: fun_,
            nullFunc_viiiii: fun_,
            nullFunc_viiiiii: fun_,
            invoke_ii: fun_,
            invoke_iiii: fun_,
            invoke_v: fun_,
            invoke_vi: fun_,
            invoke_viiii: fun_,
            invoke_viiiii: fun_,
            invoke_viiiiii: fun_,
            __ZSt18uncaught_exceptionv: fun_,
            ___cxa_find_matching_catch: fun_,
            ___gxx_personality_v0: fun_,
            ___lock: fun_,
            ___resumeException: fun_,
            ___setErrNo: fun_,
            ___syscall140: fun_,
            ___syscall146: fun_,
            ___syscall54: fun_,
            ___syscall6: fun_,
            ___unlock: fun_,
            _abort: fun_,
            _emscripten_memcpy_big: fun_,
            _get_unicode_str: GetUnicode,              // function 20( ) => P( )
            flush_NO_FILESYSTEM: fun_,
            DYNAMICTOP_PTR: 7968,               //Ua
            tempDoublePtr: 7952,                //rb
            STACKTOP: 7984,                     //Ra
            STACK_MAX: 5250864,                 //Sa

            memoryBase: 1024,
            tableBase: 0,
            memory: wasmMemory,
            table: new WebAssembly.Table({
                initial: 99,
                maximum: 99,
                element: "anyfunc"
            })
        };

        let importObject: WebAssembly.Imports = {
            'env': wasm_env,
            'asm2wasm': {
                "f64-rem": (a: any, b: any) => a % b,
                "debugger": function () {
                }
            },
            'global': {
                NaN: NaN,
                Infinity: 1 / 0
            },
        };
        let data = readFileSync(this.wasmUrl)
        this.wasmobject = await WebAssembly.compile(data)
            .then(d => WebAssembly.instantiate(d, importObject))
    }


}
