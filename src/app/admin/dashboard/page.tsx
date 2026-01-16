'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase/provider';
import { ref, onValue } from 'firebase/database';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, UserCheck, UserX, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboardPage() {
  const { database } = useFirebase();
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!database) return;
    const usersRef = ref(database, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      if (usersData) {
        const usersList = Object.keys(usersData).map(key => ({
          uid: key,
          ...usersData[key],
        }));
        setAllUsers(usersList);
      }
    });

    return () => unsubscribe();
  }, [database]);
  
  const totalUsers = allUsers.length;
  const activePlanUsers = allUsers.filter(u => u.membership && u.membership.plan && new Date(u.membership.expiryDate) > new Date() && (!u.status || u.status === 'active')).length;
  const blockedUsers = allUsers.filter(u => u.status === 'blocked').length;
  const cancelledPlans = allUsers.filter(u => u.status === 'cancelled').length;

  const stats = [
    { title: "Total Registered Users", value: totalUsers, icon: <User /> },
    { title: "Total Active Plans", value: activePlanUsers, icon: <UserCheck /> },
    { title: "Blocked Users", value: blockedUsers, icon: <UserX /> },
    { title: "Cancelled Plans", value: cancelledPlans, icon: <XCircle /> },
  ];
  
  const planDistribution = allUsers.reduce((acc, user) => {
    const plan = user.membership?.plan;
    if (plan && (!user.status || user.status === 'active') && new Date(user.membership.expiryDate) > new Date()) {
        acc[plan] = (acc[plan] || 0) + 1;
    }
    return acc;
  }, {} as {[key: string]: number});
  
  const chartData = Object.keys(planDistribution).map(planName => ({
      name: planName,
      users: planDistribution[planName]
  }));

  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <div className="text-muted-foreground">{stat.icon}</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Plan Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="users" fill="var(--color-primary)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
