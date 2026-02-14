
'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase/provider';
import { useProfile } from '@/components/profile-provider';
import { ref, onValue, remove, set, serverTimestamp } from 'firebase/database';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ChatRequestsPage() {
  const { auth, database } = useFirebase();
  const { userData: currentUserData } = useProfile();
  const [requests, setRequests] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!database || !auth?.currentUser) return;

    const requestsRef = ref(database, 'chatRequests');
    const unsubscribe = onValue(requestsRef, (snapshot) => {
        const requestsData = snapshot.val();
        if (requestsData) {
            const requestsList = Object.keys(requestsData)
                .map(key => ({
                    id: key,
                    ...requestsData[key],
                }))
                .filter(req => req.receiverId === auth.currentUser!.uid && req.status === 'pending');
            setRequests(requestsList);
        } else {
            setRequests([]);
        }
    });

    return () => unsubscribe();
  }, [database, auth?.currentUser]);


  const handleAccept = async (request: any) => {
    if (!database || !auth?.currentUser || !currentUserData) return;

    const chatId = request.id;
    const chatRef = ref(database, `chats/${chatId}`);
    const requestRef = ref(database, `chatRequests/${request.id}`);
    
    try {
        await set(chatRef, {
            members: {
                [request.senderId]: true,
                [request.receiverId]: true
            },
            memberDetails: [
                { uid: request.senderId, name: request.senderName, photoURL: request.senderPhotoURL },
                { uid: request.receiverId, name: currentUserData.name, photoURL: currentUserData.photoURL },
            ],
            createdAt: serverTimestamp(),
        });
        
        await remove(requestRef);
        
        toast({
          title: 'Request Accepted',
          description: `You can now chat with ${request.senderName}.`,
        });

    } catch (error) {
        console.error("Failed to accept request:", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to accept the request. Please try again.',
        });
    }
  };

  const handleDecline = async (requestId: string, senderName: string) => {
    if (!database) return;
    const requestRef = ref(database, `chatRequests/${requestId}`);
    try {
        await remove(requestRef);
        toast({
          variant: 'default',
          title: 'Request Declined',
          description: `You have declined the chat request from ${senderName}.`,
        });
    } catch (error) {
        console.error("Failed to decline request:", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to decline the request. Please try again.',
        });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Chat Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length > 0 ? (
            <ul className="space-y-4">
              {requests.map((req) => (
                <li
                  key={req.id}
                  className="flex items-center justify-between p-4 bg-background rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={req.senderPhotoURL} alt={req.senderName} />
                      <AvatarFallback>{req.senderName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{req.senderName}</p>
                      <p className="text-sm text-muted-foreground">Wants to connect with you.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-500 hover:bg-green-100 hover:text-green-600"
                      onClick={() => handleAccept(req)}
                    >
                      <Check className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-100 hover:text-red-600"
                      onClick={() => handleDecline(req.id, req.senderName)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You have no new chat requests.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    