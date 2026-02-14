'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase/provider';
import { ref, onValue, query, orderByChild, equalTo, update } from 'firebase/database';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function CancelledPlansPage() {
  const { database } = useFirebase();
  const [users, setUsers] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!database) return;

    const usersRef = ref(database, 'users');
    const cancelledUsersQuery = query(usersRef, orderByChild('status'), equalTo('cancelled'));

    const unsubscribe = onValue(cancelledUsersQuery, (snapshot) => {
      const usersData = snapshot.val();
      if (usersData) {
        const usersList = Object.keys(usersData).map(key => ({
          uid: key,
          ...usersData[key],
        }));
        setUsers(usersList);
      } else {
        setUsers([]);
      }
    });

    return () => unsubscribe();
  }, [database]);
  
  const handleReactivate = async (userId: string) => {
    if (!database) return;
    try {
      // For simplicity, we reactivate them as a free user.
      // A real app might have more complex logic.
      const userRef = ref(database, `users/${userId}`);
      await update(userRef, { 
        status: 'active',
        membership: null, // Reset membership
        payment: null // Reset payment info
      });
      toast({
        title: 'User Reactivated',
        description: 'The user has been reactivated with a Free plan.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reactivate the user.',
      });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Cancelled Plans</h1>
       <Card>
            <CardHeader>
                <CardTitle>Users with Cancelled Plans</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Last Plan</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.uid}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant="destructive">{user.payment?.planName || 'N/A'}</Badge>
                                </TableCell>
                                <TableCell>
                                     <Button variant="outline" size="sm" onClick={() => handleReactivate(user.uid)}>Reactivate (as Free)</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {users.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No users with cancelled plans found.
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
