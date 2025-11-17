'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase/provider';
import { ref, onValue, query, orderByChild, equalTo, update } from 'firebase/database';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function ActivePlanUsersPage() {
  const { database } = useFirebase();
  const [users, setUsers] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!database) return;

    const usersRef = ref(database, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      if (usersData) {
        const allUsers = Object.keys(usersData).map(key => ({
          uid: key,
          ...usersData[key],
        }));

        // Filter for users with an active plan (expiry date is in the future and status is not cancelled/blocked)
        const activePlanUsers = allUsers.filter(user => 
            user.membership && 
            user.membership.expiryDate && 
            new Date(user.membership.expiryDate) > new Date() &&
            (!user.status || user.status === 'active')
        );
        setUsers(activePlanUsers);
      }
    });

    return () => unsubscribe();
  }, [database]);

  const handleCancelPlan = async (userId: string) => {
    if (!database) return;
    try {
      const userRef = ref(database, `users/${userId}`);
      await update(userRef, {
        status: 'cancelled',
        'membership/plan': 'Cancelled',
      });
      toast({
        title: 'Plan Cancelled',
        description: "The user's plan has been successfully cancelled.",
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to cancel the plan.',
      });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Active Plan Users</h1>
       <Card>
            <CardHeader>
                <CardTitle>Premium Members</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Expiry Date</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.uid}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.membership?.plan === 'Gold' ? 'secondary' : 'default'}>{user.membership?.plan}</Badge>
                                </TableCell>
                                <TableCell>{user.membership?.expiryDate ? format(new Date(user.membership.expiryDate), 'dd MMM yyyy') : 'N/A'}</TableCell>
                                <TableCell>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                             <Button variant="destructive" size="sm">Cancel Plan</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will cancel the user's plan and move them to the cancelled list. This action cannot be undone immediately.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleCancelPlan(user.uid)}>Confirm</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {users.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No users with active plans found.
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
