// automatically mutes video if twitch ad pops up
// this should not affect anything if the user touches the video volume
// doesn't do sidebar ads because those are auto-muted already

// for testing
console.log("RUNNING RN");

let recentVolume = 0.5;
let isMutedByMe = false;
let mutedVideo = null // to check if it's the same video 

// get video object
function getVideo() {
    return document.querySelector("video")
}

// check if ad label exists (on Twitch, doesn't exist on regular vid)
function adLabelPresent() {
  return !!document.querySelector('[data-a-target="video-ad-label"]');
}

// get rid of prob
// function adPlaying(video) {
//     if (!video) return false;

//     const adOverlay = document.querySelector(
//         '[data-a-target*="ad"], [data-test-selector*="ad"]'
//     );

//     return (
//         adOverlay ||
//         video.getAttribute("data-a-target") === "video-ad" ||
//         (video.duration > 0 && video.duration < 180)
//     );
// }

function mute(video) {
    // if I previously muted and the video is unmuted (user changed state)
    if (isMutedByMe && !video.muted) {
        isMutedByMe = false;
        mutedVideo = null;
        return;
    }

    // if I muted already and is still muted
    if (isMutedByMe) return;

    // otherwise mute video
    recentVolume = video.volume;
    mutedVideo = video;
    video.muted = true;
    isMutedByMe = true;
    console.log('Ad detected. Muting.')
}

function unmute(video) {
    // if I didn't previously mute
    if (!isMutedByMe) return;

    // if the video is muted but it's not the ad (user changed state)
    if (video.muted && video !==mutedVideo) return;

    // otherwise unmute video
    video.muted = false;
    video.volume = recentVolume;
    isMutedByMe = false;
    mutedVideo = null;
    console.log('Ad is over!')
}

function handleChange() {
    const video = getVideo();
    if (!video) return;

    if (adLabelPresent(video)){
        mute(video);
    }
    else {
        unmute(video);
    }
}

// const observer = new MutationObserver(handleChange);

// observer.observe(document.body, {
//     childList: true,
//     subtree: true,
//     attributes: true,
//     attributeFilter: ["data-a-target", "src"]
// });

// setInterval(handleChange, 1000);

handleChange();