'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase/provider';
import { ref, onValue, query, orderByChild, equalTo, update, remove } from 'firebase/database';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

export default function BlockedIdsPage() {
  const { database } = useFirebase();
  const [users, setUsers] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!database) return;

    const usersRef = ref(database, 'users');
    const blockedUsersQuery = query(usersRef, orderByChild('status'), equalTo('blocked'));

    const unsubscribe = onValue(blockedUsersQuery, (snapshot) => {
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

  const handleUnblock = async (userId: string) => {
    if (!database) return;
    try {
      const userRef = ref(database, `users/${userId}`);
      await update(userRef, { status: 'active' });
      toast({
        title: 'User Unblocked',
        description: 'The user has been successfully unblocked.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to unblock the user.',
      });
    }
  };
  
  const handleDelete = async (userId: string) => {
    if (!database) return;
    try {
      const userRef = ref(database, `users/${userId}`);
      await remove(userRef);
      toast({
        title: 'User Deleted',
        description: 'The user has been permanently deleted.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete the user.',
      });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Blocked IDs</h1>
       <Card>
            <CardHeader>
                <CardTitle>Blocked Users</CardTitle>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.uid}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="space-x-2">
                                     <Button variant="outline" size="sm" onClick={() => handleUnblock(user.uid)}>Unblock</Button>
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                             <Button variant="destructive" size="sm">Delete</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the user account and remove their data from our servers.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(user.uid)}>Delete</AlertDialogAction>
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
                        No blocked users found.
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
