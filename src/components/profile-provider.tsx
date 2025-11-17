'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useFirebase } from '@/firebase/provider';
import { ref, onValue, off } from 'firebase/database';
import { onAuthStateChanged, User } from 'firebase/auth';

type Step = {
  id: string; 
  title: string;
  description: string;
  completed: boolean;
};

type ProfileContextType = {
  progress: number;
  steps: Step[];
  hasMembership: boolean;
  fetchUserData: () => void;
  userData: any | null;
};

const initialSteps: Step[] = [
  { id: '1', title: 'Basic Information', description: 'Name, DOB, Gender, etc.', completed: false },
  { id: '2', title: 'Personal Information', description: 'Contact, ID, Address, etc.', completed: false },
  { id: '3', title: 'Career Details', description: 'Occupation, Income, etc.', completed: false },
  { id: '4', title: 'Family & Lifestyle', description: 'Family type, Occupations, etc.', completed: false },
  { id: '5', title: 'Upload Photos', description: 'Add photos to your profile.', completed: false },
];


const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [overallProgress, setOverallProgress] = useState(0);
  const [hasMembership, setHasMembership] = useState(false);
  const [userData, setUserData] = useState<any | null>(null);
  const { auth, database } = useFirebase();

  const processUserData = useCallback((data: any) => {
    setUserData(data);
    if (data) {
      const progressData = data.progress || {};
      const membershipData = data.membership || null;

      const newSteps = initialSteps.map(step => ({
        ...step,
        completed: !!progressData[step.id.toString()]
      }));
      
      const completedCount = newSteps.filter(s => s.completed).length;
      const newOverallProgress = Math.round((completedCount / newSteps.length) * 100);
      
      setSteps(newSteps);
      setOverallProgress(newOverallProgress);

      const isActiveMember = membershipData && new Date(membershipData.expiryDate) > new Date();
      setHasMembership(isActiveMember);

    } else {
      // Reset to initial state if no user data
      const newSteps = initialSteps.map(s => ({ ...s, completed: false }));
      setSteps(newSteps);
      setOverallProgress(0);
      setHasMembership(false);
    }
  }, []);
  
  const fetchUserData = useCallback((user: User | null) => {
    if (user && database) {
      const userRef = ref(database, `users/${user.uid}`);
      const listener = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        processUserData(data);
      });
      return () => {
          if (userRef) {
            off(userRef, 'value', listener);
          }
      };
    } else {
      processUserData(null);
    }
    return () => {};
  }, [database, processUserData]);


  useEffect(() => {
    if (auth) {
      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        const unsubscribeDb = fetchUserData(user);
        
        return () => {
          if (unsubscribeDb) {
            unsubscribeDb();
          }
        };
      });

      return () => unsubscribeAuth();
    }
  }, [auth, fetchUserData]);

  const value = { 
    progress: overallProgress, 
    steps,
    hasMembership,
    fetchUserData: () => {
        if(auth?.currentUser) {
            const userRef = ref(database!, `users/${auth.currentUser.uid}`);
            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                processUserData(data);
            }, { onlyOnce: true });
        }
    },
    userData,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
