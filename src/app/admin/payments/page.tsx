
'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase/provider';
import { ref, onValue, query, orderByChild, equalTo, update } from 'firebase/database';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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
import { format } from 'date-fns';
import { plans } from '@/app/dashboard/upgrade/page';


export default function PendingPaymentsPage() {
  const { database } = useFirebase();
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!database) return;

    const usersRef = ref(database, 'users');
    const pendingPaymentsQuery = query(usersRef, orderByChild('payment/paymentStatus'), equalTo('Pending'));

    const unsubscribe = onValue(pendingPaymentsQuery, (snapshot) => {
      const usersData = snapshot.val();
      if (usersData) {
        const usersList = Object.keys(usersData).map(key => ({
          uid: key,
          ...usersData[key],
        }));
        setPendingUsers(usersList);
      } else {
        setPendingUsers([]);
      }
    });

    return () => unsubscribe();
  }, [database]);
  
  const handleApprove = async (user: any) => {
    if (!database || !user.payment) return;
    try {
      const userRef = ref(database, `users/${user.uid}`);
      const planInfo = plans.find(p => p.name === user.payment.planName);
      if (!planInfo) {
          throw new Error('Plan details not found!');
      }
      
      const expiryDate = new Date();
      const durationString = planInfo.duration;
      const durationMonths = durationString.includes('Year') ? 12 : parseInt(durationString.split(" ")[0]);

      expiryDate.setMonth(expiryDate.getMonth() + durationMonths);

      await update(userRef, { 
        'payment/paymentStatus': 'Success',
        'membership/plan': user.payment.planName,
        'membership/expiryDate': expiryDate.toISOString(),
        'membership/features': planInfo.features,
      });

      toast({
        title: 'Payment Approved',
        description: `${user.name}'s ${user.payment.planName} plan has been activated.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to approve payment.',
      });
    }
  };

  const handleReject = async (userId: string) => {
    if (!database) return;
    try {
      const userRef = ref(database, `users/${userId}`);
      await update(userRef, { 'payment/paymentStatus': 'Rejected' });
      toast({
        title: 'Payment Rejected',
        description: 'The payment has been marked as rejected.',
        variant: 'destructive',
      });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reject payment.',
      });
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Pending Payments</h1>
       <Card>
            <CardHeader>
                <CardTitle>Awaiting Verification</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>UTR / Txn ID</TableHead>
                            <TableHead>Bank / UPI</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingUsers.map(user => (
                            <TableRow key={user.uid}>
                                <TableCell>
                                    <div>{user.name}</div>
                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{user.payment?.planName}</Badge>
                                </TableCell>
                                <TableCell>₹{user.payment?.planPrice}</TableCell>
                                <TableCell>{user.payment?.utr}</TableCell>
                                <TableCell>
                                    <div>{user.payment?.bankName}</div>
                                    <div className="text-xs text-muted-foreground">{user.payment?.upiId}</div>
                                </TableCell>
                                <TableCell>{user.payment?.paymentDate ? format(new Date(user.payment.paymentDate), 'dd MMM yyyy, HH:mm') : 'N/A'}</TableCell>
                                <TableCell className="space-x-2">
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="sm">Approve</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Approve Payment?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will activate the {user.payment?.planName} plan for {user.name}. This action cannot be easily undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleApprove(user)}>Confirm Approval</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">Reject</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Reject Payment?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   This will mark the payment as rejected. The user will be notified to try again.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleReject(user.uid)}>Confirm Rejection</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {pendingUsers.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No pending payments found.
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
