'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase/provider';
import { ref, onValue, update, remove } from 'firebase/database';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { cn } from '@/lib/utils';

export default function RegisteredUsersPage() {
  const { database } = useFirebase();
  const [users, setUsers] = useState<any[]>([]);
  const { toast } = useToast();

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
        setUsers(usersList);
      }
    });

    return () => unsubscribe();
  }, [database]);

  const handleBlock = async (userId: string) => {
    if (!database) return;
    try {
      const userRef = ref(database, `users/${userId}`);
      await update(userRef, { status: 'blocked' });
      toast({
        title: 'User Blocked',
        description: 'The user has been successfully blocked.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to block the user.',
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className='text-green-600 border-green-200 bg-green-50'>Active</Badge>;
      case 'blocked':
        return <Badge variant="destructive">Blocked</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className='text-orange-600 border-orange-200 bg-orange-50'>Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Active</Badge>;
    }
  }


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Registered Users</h1>
       <Card>
            <CardHeader>
                <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.uid}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.membership?.plan || 'Free'}</TableCell>
                                <TableCell>{getStatusBadge(user.status)}</TableCell>
                                <TableCell className="space-x-2">
                                    <Button variant="outline" size="sm">View</Button>
                                    <Button variant="outline" size="sm" onClick={() => handleBlock(user.uid)}>Block</Button>
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
            </CardContent>
        </Card>
    </div>
  );
}
