import {Tencent} from "./Tencent";

async function main() {
    const args = process.argv.slice(2)
    if (args.length < 1) return console.log("输入视频vid")
    //不登录仅支持标清与高清  两种格式
    let hd = args[0] == "0" ? 0 : 1;
    let episode = await Tencent.instance.getUrl(args[0],hd);
    console.log(episode.url);
    console.log(`ffmpeg -i '${episode.url}' -c copy -bsf:a aac_adtstoasc output.mp4`);
}

main();
