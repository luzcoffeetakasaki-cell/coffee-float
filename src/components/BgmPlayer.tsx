"use client";

import { useEffect, useRef } from "react";
import { useRelax, BGM_LIST } from "@/context/RelaxContext";

export default function BgmPlayer() {
    const {
        isPlayingBgm, bgmVolume,
        isPlayingRain, rainVolume,
        isPlayingFire, fireVolume,
        isPlayingCafe, cafeVolume,
        selectedBgmId
    } = useRelax();

    const bgmRef = useRef<HTMLAudioElement>(null);
    const rainRef = useRef<HTMLAudioElement>(null);
    const fireRef = useRef<HTMLAudioElement>(null);
    const cafeRef = useRef<HTMLAudioElement>(null);

    // Dynamic BGM URL
    const currentBgm = BGM_LIST.find(b => b.id === selectedBgmId) || BGM_LIST[0];
    const BGM_URL = currentBgm.url;
    const RAIN_URL = "https://raw.githubusercontent.com/bradtraversy/ambient-sound-mixer/main/audio/rain.mp3";
    const FIRE_URL = "https://raw.githubusercontent.com/bradtraversy/ambient-sound-mixer/main/audio/fireplace.mp3";
    const CAFE_URL = "https://raw.githubusercontent.com/bradtraversy/ambient-sound-mixer/main/audio/cafe.mp3";

    // Helper to control audio elements
    const controlAudio = (ref: React.RefObject<HTMLAudioElement | null>, isPlaying: boolean, volume: number) => {
        if (!ref.current) return;
        ref.current.volume = volume;
        if (isPlaying) {
            ref.current.play().catch(e => console.error("Play failed", e));
        } else {
            ref.current.pause();
        }
    };

    useEffect(() => {
        if (bgmRef.current) {
            bgmRef.current.src = BGM_URL;
            if (isPlayingBgm) {
                bgmRef.current.play().catch(e => console.error("BGM play failed", e));
            }
        }
    }, [BGM_URL]);

    useEffect(() => { controlAudio(bgmRef, isPlayingBgm, bgmVolume); }, [isPlayingBgm, bgmVolume]);
    useEffect(() => { controlAudio(rainRef, isPlayingRain, rainVolume); }, [isPlayingRain, rainVolume]);
    useEffect(() => { controlAudio(fireRef, isPlayingFire, fireVolume); }, [isPlayingFire, fireVolume]);
    useEffect(() => { controlAudio(cafeRef, isPlayingCafe, cafeVolume); }, [isPlayingCafe, cafeVolume]);

    return (
        <div style={{ display: "none" }}>
            <audio ref={bgmRef} src={BGM_URL} loop preload="auto" />
            <audio ref={rainRef} src={RAIN_URL} loop preload="auto" />
            <audio ref={fireRef} src={FIRE_URL} loop preload="auto" />
            <audio ref={cafeRef} src={CAFE_URL} loop preload="auto" />
        </div>
    );
}
