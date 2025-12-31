'use client';

import { useEffect, useState } from 'react';

interface UserData {
  totalPoints: number;
  isSubscribed: boolean;
  collegeName: string | null;
}

export function UserStats() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => setUserData(data));
  }, []);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="p-4 border border-gray-800 rounded-lg">
      <p>Points: {userData.totalPoints}</p>
      <p>Status: {userData.isSubscribed ? 'Premium' : 'Free'}</p>
      <p>College: {userData.collegeName || 'Not set'}</p>
    </div>
  );
}
