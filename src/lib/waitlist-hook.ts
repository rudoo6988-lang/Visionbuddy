import { useState, useEffect } from 'react';
import { doc, getDoc, serverTimestamp, collection, query, orderBy, onSnapshot, writeBatch, increment } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from '../components/FirebaseProvider';
import { WaitlistSignup, OperationType } from '../types';
import { handleFirestoreError } from './error-handler';

export const useWaitlist = () => {
  const { user } = useAuth();
  const [hasSignedUp, setHasSignedUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Check if user has already signed up
  useEffect(() => {
    if (!user) {
      setHasSignedUp(false);
      setLoading(false);
      return;
    }

    const checkSignup = async () => {
      try {
        const docRef = doc(db, 'registrations', user.uid);
        const docSnap = await getDoc(docRef);
        setHasSignedUp(docSnap.exists());
      } catch (error) {
        console.error("Error checking signup state", error);
      } finally {
        setLoading(false);
      }
    };

    checkSignup();
  }, [user]);

  // Real-time counter from stats/global
  useEffect(() => {
    const statsRef = doc(db, 'stats', 'global');
    const unsubscribe = onSnapshot(statsRef, (doc) => {
      if (doc.exists()) {
        setTotalCount(doc.data().count || 0);
      }
    }, (error) => {
      console.error("Stats sync error:", error);
    });

    return unsubscribe;
  }, []);

  const signUp = async () => {
    if (!user) return;
    setLoading(true);
    const path = `registrations/${user.uid}`;
    try {
      const batch = writeBatch(db);
      
      const signupRef = doc(db, 'registrations', user.uid);
      const statsRef = doc(db, 'stats', 'global');

      const signupData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || '',
        timestamp: serverTimestamp(),
      };
      
      batch.set(signupRef, signupData);

      // Verify if stats exists first to use set with merge or update
      const statsSnap = await getDoc(statsRef);
      if (!statsSnap.exists()) {
        batch.set(statsRef, { count: 1 });
      } else {
        batch.update(statsRef, { count: increment(1) });
      }

      await batch.commit();
      setHasSignedUp(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setLoading(false);
    }
  };

  return { hasSignedUp, signUp, loading, totalCount };
};

// Admin specific hook
export const useAdminStats = () => {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState<WaitlistSignup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) return;

    const q = query(collection(db, 'registrations'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const signups = snapshot.docs.map(doc => ({
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toLocaleString() || 'Pending...'
      })) as WaitlistSignup[];
      setData(signups);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'registrations');
    });

    return unsubscribe;
  }, [user, isAdmin]);

  return { data, loading };
};
