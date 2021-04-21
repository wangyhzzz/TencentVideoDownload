import {Tencent} from "./Tencent";

async function main() {
    let episode = await Tencent.instance.getUrl("e0024f5mhf8");
    console.log(episode.url);
    console.log(`ffmpeg -i '${episode.url}' -c copy -bsf:a aac_adtstoasc output.mp4`);
}

main();