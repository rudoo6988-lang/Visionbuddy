import { useState, useEffect } from 'react';
import { 
  doc, 
  getDoc, 
  serverTimestamp, 
  onSnapshot, 
  writeBatch, 
  increment,
  query,
  collection,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from '../components/FirebaseProvider';
import { OperationType, WaitlistSignup } from '../types';
import { handleFirestoreError } from './error-handler';

export const useWaitlist = () => {
  const [hasSignedUp, setHasSignedUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  // Initialize device ID and check local state
  useEffect(() => {
    let id = localStorage.getItem('visionbuddy_device_id');
    const voted = localStorage.getItem('visionbuddy_has_voted') === 'true';

    if (!id) {
      id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('visionbuddy_device_id', id);
    }

    setDeviceId(id);
    setHasSignedUp(voted);

    // Verify with server if we have an ID
    const checkServerState = async () => {
      try {
        const docRef = doc(db, 'public_registrations', id!);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHasSignedUp(true);
          localStorage.setItem('visionbuddy_has_voted', 'true');
        }
      } catch (error) {
        // Silently fail if server check fails (might be offline or rules)
      } finally {
        setLoading(false);
      }
    };

    checkServerState();
  }, []);

  // Real-time counter from stats/global
  useEffect(() => {
    const statsRef = doc(db, 'stats', 'global');
    const unsubscribe = onSnapshot(statsRef, (doc) => {
      if (doc.exists()) {
        setTotalCount(doc.data().count || 0);
      } else {
        setTotalCount(0);
      }
    }, (error) => {
      if (error.code !== 'permission-denied') {
        console.error("Stats sync error:", error);
      }
    });

    return unsubscribe;
  }, []);

  const signUp = async () => {
    if (hasSignedUp || !deviceId) return;
    setLoading(true);
    
    // Anti-spam cooldown check (3 seconds)
    const lastClick = localStorage.getItem('visionbuddy_last_click');
    if (lastClick && Date.now() - parseInt(lastClick) < 3000) {
      setLoading(false);
      return;
    }
    localStorage.setItem('visionbuddy_last_click', Date.now().toString());

    const path = `public_registrations/${deviceId}`;
    try {
      const batch = writeBatch(db);
      
      const signupRef = doc(db, 'public_registrations', deviceId);
      const statsRef = doc(db, 'stats', 'global');

      const signupData = {
        deviceId,
        timestamp: serverTimestamp(),
      };
      
      batch.set(signupRef, signupData);

      const statsSnap = await getDoc(statsRef);
      if (!statsSnap.exists()) {
        batch.set(statsRef, { count: 1, initialDeviceId: deviceId, lastDeviceId: deviceId });
      } else {
        batch.update(statsRef, { 
          count: increment(1),
          lastDeviceId: deviceId
        });
      }

      await batch.commit();
      setHasSignedUp(true);
      localStorage.setItem('visionbuddy_has_voted', 'true');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { hasSignedUp, signUp, loading, totalCount };
};

// Admin specific hook
export const useAdminStats = () => {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) return;

    const q = query(collection(db, 'public_registrations'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const signups = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data() as any).timestamp?.toDate().toLocaleString() || 'Pending...'
      }));
      setData(signups);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'public_registrations');
    });

    return unsubscribe;
  }, [user, isAdmin]);

  return { data, loading };
};
