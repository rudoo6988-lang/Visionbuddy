import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from '../components/FirebaseProvider';
import { WaitlistSignup, OperationType } from '../types';
import { handleFirestoreError } from './error-handler';

export const useWaitlist = () => {
  const { user } = useAuth();
  const [hasSignedUp, setHasSignedUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signups, setSignups] = useState<WaitlistSignup[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Check if user has already signed up
  useEffect(() => {
    if (!user) {
      setHasSignedUp(false);
      setLoading(false);
      return;
    }

    const checkSignup = async () => {
      const path = `waitlist/${user.uid}`;
      try {
        const docRef = doc(db, 'waitlist', user.uid);
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

  // Real-time counter (estimated or real if admin)
  useEffect(() => {
    // For normal users, we might want to just show a "simulated" count + base real count 
    // but the request says "Live counter: 12,541 people interested".
    // We'll show a base number + actual Firestore signups count if possible.
    const q = query(collection(db, 'waitlist'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTotalCount(snapshot.size);
    }, (error) => {
      // Permission denied is expected for non-admin users as they can't list the whole collection
      if (error.code !== 'permission-denied') {
        console.error("Counter sync error:", error);
      }
    });

    return unsubscribe;
  }, []);

  const signUp = async () => {
    if (!user) return;
    setLoading(true);
    const path = `waitlist/${user.uid}`;
    try {
      const signupData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || '',
        timestamp: serverTimestamp(),
      };
      
      await setDoc(doc(db, 'waitlist', user.uid), signupData);
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

    const q = query(collection(db, 'waitlist'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const signups = snapshot.docs.map(doc => ({
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toLocaleString() || 'Pending...'
      })) as WaitlistSignup[];
      setData(signups);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'waitlist');
    });

    return unsubscribe;
  }, [user, isAdmin]);

  return { data, loading };
};
