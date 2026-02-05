"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface RelaxContextType {
    isPlayingBgm: boolean;
    toggleBgm: () => void;
    bgmVolume: number;
    setBgmVolume: (volume: number) => void;

    // SE States
    isPlayingRain: boolean;
    toggleRain: () => void;
    rainVolume: number;
    setRainVolume: (volume: number) => void;

    isPlayingFire: boolean;
    toggleFire: () => void;
    fireVolume: number;
    setFireVolume: (volume: number) => void;

    isPlayingCafe: boolean;
    toggleCafe: () => void;
    cafeVolume: number;
    setCafeVolume: (volume: number) => void;

    // BGM Selection
    selectedBgmId: string;
    setSelectedBgmId: (id: string) => void;
}

export const BGM_LIST = [
    { id: "classic", label: "Midnight Lo-Fi", url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" },
    { id: "forest", label: "Forest Chill", url: "https://raw.githubusercontent.com/bradtraversy/ambient-sound-mixer/main/audio/birds.mp3" },
];

const RelaxContext = createContext<RelaxContextType | undefined>(undefined);

export function RelaxProvider({ children }: { children: ReactNode }) {
    // BGM
    const [isPlayingBgm, setIsPlayingBgm] = useState(false);
    const [bgmVolume, setBgmVolume] = useState(0.2);

    // SE
    const [isPlayingRain, setIsPlayingRain] = useState(false);
    const [rainVolume, setRainVolume] = useState(0.3);

    const [isPlayingFire, setIsPlayingFire] = useState(false);
    const [fireVolume, setFireVolume] = useState(0.3);

    const [isPlayingCafe, setIsPlayingCafe] = useState(false);
    const [cafeVolume, setCafeVolume] = useState(0.3);

    const [selectedBgmId, setSelectedBgmId] = useState("classic");

    return (
        <RelaxContext.Provider value={{
            isPlayingBgm,
            toggleBgm: () => setIsPlayingBgm(prev => !prev),
            bgmVolume,
            setBgmVolume,

            isPlayingRain,
            toggleRain: () => setIsPlayingRain(prev => !prev),
            rainVolume,
            setRainVolume,

            isPlayingFire,
            toggleFire: () => setIsPlayingFire(prev => !prev),
            fireVolume,
            setFireVolume,

            isPlayingCafe,
            toggleCafe: () => setIsPlayingCafe(prev => !prev),
            cafeVolume,
            setCafeVolume,

            selectedBgmId,
            setSelectedBgmId,
        }}>
            {children}
        </RelaxContext.Provider>
    );
}

export function useRelax() {
    const context = useContext(RelaxContext);
    if (!context) {
        throw new Error("useRelax must be used within a RelaxProvider");
    }
    return context;
}
