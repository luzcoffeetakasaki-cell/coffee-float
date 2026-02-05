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

    const currentBgm = BGM_LIST.find(b => b.id === selectedBgmId) || BGM_LIST[0];
    const BGM_URL = currentBgm.url;
    const RAIN_URL = "https://raw.githubusercontent.com/bradtraversy/ambient-sound-mixer/main/audio/rain.mp3";
    const FIRE_URL = "https://raw.githubusercontent.com/bradtraversy/ambient-sound-mixer/main/audio/fireplace.mp3";
    const CAFE_URL = "https://raw.githubusercontent.com/bradtraversy/ambient-sound-mixer/main/audio/cafe.mp3";

    // Handle Volumes independently
    useEffect(() => { if (bgmRef.current) bgmRef.current.volume = bgmVolume; }, [bgmVolume]);
    useEffect(() => { if (rainRef.current) rainRef.current.volume = rainVolume; }, [rainVolume]);
    useEffect(() => { if (fireRef.current) fireRef.current.volume = fireVolume; }, [fireVolume]);
    useEffect(() => { if (cafeRef.current) cafeRef.current.volume = cafeVolume; }, [cafeVolume]);

    // Handle Playback
    useEffect(() => {
        if (!bgmRef.current) return;
        if (isPlayingBgm) bgmRef.current.play().catch(console.error);
        else bgmRef.current.pause();
    }, [isPlayingBgm, BGM_URL]);

    useEffect(() => {
        if (!rainRef.current) return;
        if (isPlayingRain) rainRef.current.play().catch(console.error);
        else rainRef.current.pause();
    }, [isPlayingRain]);

    useEffect(() => {
        if (!fireRef.current) return;
        if (isPlayingFire) fireRef.current.play().catch(console.error);
        else fireRef.current.pause();
    }, [isPlayingFire]);

    useEffect(() => {
        if (!cafeRef.current) return;
        if (isPlayingCafe) cafeRef.current.play().catch(console.error);
        else cafeRef.current.pause();
    }, [isPlayingCafe]);

    return (
        <div style={{ display: "none" }}>
            <audio ref={bgmRef} src={BGM_URL} loop preload="auto" />
            <audio ref={rainRef} src={RAIN_URL} loop preload="auto" />
            <audio ref={fireRef} src={FIRE_URL} loop preload="auto" />
            <audio ref={cafeRef} src={CAFE_URL} loop preload="auto" />
        </div>
    );
}
