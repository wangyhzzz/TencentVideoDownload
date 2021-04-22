import {Tencent} from "./Tencent";

async function main() {
    const args = process.argv.slice(2)
    if (args.length < 1) return console.log("输入视频vid")
    let episode = await Tencent.instance.getUrl(args[0]);
    console.log(episode.url);
    console.log(`ffmpeg -i '${episode.url}' -c copy -bsf:a aac_adtstoasc output.mp4`);
}

main();