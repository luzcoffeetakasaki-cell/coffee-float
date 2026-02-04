"use client";

import { useEffect, useRef } from "react";
import { useRelax } from "@/context/RelaxContext";

export default function BgmPlayer() {
    const { isPlayingBgm, bgmVolume, isPlayingRain, rainVolume, isPlayingFire, fireVolume, isPlayingCafe, cafeVolume } = useRelax();

    const bgmRef = useRef<HTMLAudioElement>(null);
    const rainRef = useRef<HTMLAudioElement>(null);
    const fireRef = useRef<HTMLAudioElement>(null);
    const cafeRef = useRef<HTMLAudioElement>(null);

    // Audio Sources (Free/Royalty Free)
    // Using placeholder URLs for SE - in production these should be local files or stable CDNs
    const BGM_URL = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3";
    const RAIN_URL = "https://cdn.pixabay.com/download/audio/2022/01/18/audio_823a2335f6.mp3"; // Rain effect
    const FIRE_URL = "https://cdn.pixabay.com/download/audio/2021/08/09/audio_a46234b4c7.mp3"; // Fireplace
    const CAFE_URL = "https://cdn.pixabay.com/download/audio/2021/08/09/audio_88447e769f.mp3"; // Cafe Ambience

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
