"use client";

import FloatingArea from "@/components/FloatingArea";
import PostForm from "@/components/PostForm";
import Disclaimer from "@/components/Disclaimer";
import CoffeeLog from "@/components/CoffeeLog";
import BeanList from "@/components/BeanList";
import LineOpenBanner from "@/components/LineOpenBanner";
import CafeSearch from "@/components/CafeSearch";
import RelaxMode from "@/components/RelaxMode"; // Added RelaxMode import
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState, Suspense } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, Timestamp } from "firebase/firestore";
import { getCurrentUserId } from "@/lib/auth";
import { BADGES } from "@/data/badges";

type TabType = "home" | "log" | "beans" | "explore" | "relax"; // Added relax tab

interface Notification {
  id: string;
  type?: 'cheers' | 'badge';
  postId?: string;
  coffeeName?: string;
  senderNickname?: string;
  badgeName?: string;
  badgeIcon?: string;
  read: boolean;
  createdAt: Timestamp;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("home"); // Updated activeTab state type
  const [unreadCount, setUnreadCount] = useState(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [beans, setBeans] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    let unsubscribeNotifs: () => void;
    let unsubscribePosts: () => void;
    let unsubscribeBeans: () => void;

    const init = async () => {
      const id = await getCurrentUserId();
      if (!id) return;

      // Listen to notifications
      const qNotifs = query(
        collection(db, "notifications"),
        where("toUserId", "==", id),
        orderBy("createdAt", "desc")
      );
      unsubscribeNotifs = onSnapshot(qNotifs, (snapshot) => {
        const fetchedNotifs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Notification[];
        setNotifications(fetchedNotifs);
      });

      // Listen to posts for badge calculation
      const qPosts = query(
        collection(db, "posts"),
        where("userId", "==", id),
        orderBy("createdAt", "desc")
      );
      unsubscribePosts = onSnapshot(qPosts, (snapshot) => {
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      // Listen to beans for badge calculation
      const qBeans = query(
        collection(db, "beans"),
        where("userId", "==", id)
      );
      unsubscribeBeans = onSnapshot(qBeans, (snapshot) => {
        setBeans(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    };

    init();
    return () => {
      unsubscribeNotifs?.();
      unsubscribePosts?.();
      unsubscribeBeans?.();
    };
  }, []);

  // Badge calculation logic moved to page.tsx
  useEffect(() => {
    if (posts.length === 0 && beans.length === 0) return;

    const earned = BADGES
      .filter(badge => badge.condition({ posts, beans }))
      .map(badge => badge.id);

    const seenBadgesJson = localStorage.getItem("coffee_float_seen_badges");
    const seenBadges = seenBadgesJson ? JSON.parse(seenBadgesJson) : [];
    const newBadges = earned.filter(id => !seenBadges.includes(id));

    if (newBadges.length > 0) {
      const newLocalNotifs: Notification[] = newBadges.map(id => {
        const badge = BADGES.find(b => b.id === id);
        return {
          id: `badge_${id}_${Date.now()}`,
          type: 'badge',
          badgeName: badge?.name || "Unknown Badge",
          badgeIcon: badge?.icon || "🏅",
          read: false,
          createdAt: Timestamp.now()
        };
      });

      setLocalNotifications(prev => {
        // Filter out any duplicates that might have been added
        const combined = [...newLocalNotifs, ...prev];
        const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        return unique;
      });

      const updatedSeen = Array.from(new Set([...seenBadges, ...newBadges]));
      localStorage.setItem("coffee_float_seen_badges", JSON.stringify(updatedSeen));
    }
  }, [posts, beans]);

  // Sync with localStorage for "read" status of local notifications
  useEffect(() => {
    const unreadLocal = localNotifications.filter(n => !n.read).length;
    const unreadFirestore = notifications.filter(n => !n.read).length;
    setUnreadCount(unreadLocal + unreadFirestore);
  }, [localNotifications, notifications]);

  return (
    <main style={{ height: "100dvh", position: "relative", overflow: "hidden" }}>
      {/* Header Area */}
      <div style={{
        position: "fixed",
        top: "calc(1.5rem + var(--safe-top))",
        left: "1.5rem",
        zIndex: 10,
        pointerEvents: "none"
      }}>
        <h1 style={{
          fontSize: "1.8rem",
          fontWeight: "700",
          color: "var(--accent-gold)",
          letterSpacing: "0.1em",
          textShadow: "0 2px 10px rgba(0,0,0,0.5)"
        }}>
          Coffee Float
        </h1>
        <p style={{
          fontSize: "0.8rem",
          opacity: 0.6,
          marginTop: "0.2rem"
        }}>
          今、この瞬間の美味しいを。
        </p>
      </div>

      {/* Main Content Area */}
      <div style={{ width: "100%", height: "100%" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ width: "100%", height: "100%" }}
          >
            {activeTab === "home" && <FloatingArea />}
            {activeTab === "log" && (
              <CoffeeLog
                posts={posts}
                beans={beans}
                notifications={notifications}
                localNotifications={localNotifications}
                setLocalNotifications={setLocalNotifications}
              />
            )}
            {activeTab === "beans" && <BeanList />}
            {activeTab === "explore" && <CafeSearch />}
            {activeTab === "relax" && <RelaxMode />}
          </motion.div>
        </AnimatePresence>
      </div>

      <Suspense fallback={null}>
        <PostForm showTriggerButton={activeTab === "home"} />
      </Suspense>
      <Disclaimer />
      <LineOpenBanner />

      {/* Background Decor */}
      <div style={{
        position: "fixed",
        bottom: "-100px",
        left: "-100px",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(198, 166, 100, 0.05) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Modern Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} unreadCount={unreadCount} />
    </main>
  );
}
