'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFirebase } from '@/firebase/provider';
import { ref, onValue, query, orderByChild, equalTo, push, serverTimestamp, set, remove, update } from 'firebase/database';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Mail, Search, Send, Smile, Heart, ThumbsUp, Laugh, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProfile } from '@/components/profile-provider';
import { AnimatePresence, motion } from 'framer-motion';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

function ChatListItem({ chat, isActive, currentUserId }: { chat: any; isActive: boolean; currentUserId: string }) {
    // Determine the other user in the chat
    const otherUser = chat.memberDetails?.find((m: any) => m.uid !== currentUserId);

    if (!otherUser) return null;

    return (
        <Link
            href={`/dashboard/messages?chatId=${chat.id}`}
            className={cn(
                'flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors',
                isActive ? 'bg-primary/10' : 'hover:bg-muted'
            )}
        >
            <Avatar>
                <AvatarImage src={otherUser.photoURL} alt={otherUser.name} />
                <AvatarFallback>{otherUser.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
                <div className="flex justify-between">
                    <h3 className="font-semibold">{otherUser.name}</h3>
                     <p className="text-xs text-muted-foreground">
                        {chat.lastMessageTimestamp ? new Date(chat.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </p>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage || 'No messages yet.'}</p>
                    {/* Placeholder for unread count */}
                </div>
            </div>
        </Link>
    );
}

function ChatList() {
    const { auth, database } = useFirebase();
    const searchParams = useSearchParams();
    const activeChatId = searchParams.get('chatId');
    const [chats, setChats] = useState<any[]>([]);

    useEffect(() => {
        if (!database || !auth?.currentUser) return;
        
        // This query finds chats where the current user's ID is a key under the 'members' object.
        const chatsRef = ref(database, 'chats');
        const userChatsQuery = query(chatsRef, orderByChild(`members/${auth.currentUser.uid}`), equalTo(true));

        const unsubscribe = onValue(userChatsQuery, (snapshot) => {
            const chatsData = snapshot.val();
            if (chatsData) {
                const chatsList = Object.keys(chatsData).map(key => ({
                    id: key,
                    ...chatsData[key],
                })).sort((a, b) => (b.lastMessageTimestamp || 0) - (a.lastMessageTimestamp || 0)); // Sort by most recent
                setChats(chatsList);
            } else {
                setChats([]);
            }
        });

        return () => unsubscribe();
    }, [database, auth?.currentUser]);
    
    if (!auth?.currentUser) return null;

    return (
        <Card className="w-full md:w-1/3 lg:w-1/4 h-[calc(100vh-10rem)] flex flex-col">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Accepted Chats</h2>
                <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        className="w-full pl-9 p-2 rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {chats.length > 0 ? (
                    chats.map(chat => (
                        <ChatListItem key={chat.id} chat={chat} isActive={chat.id === activeChatId} currentUserId={auth.currentUser!.uid} />
                    ))
                ) : (
                    <div className="text-center text-muted-foreground p-4">No active chats yet.</div>
                )}
            </div>
        </Card>
    );
}

const ReactionEmojis = {
    '❤️': Heart,
    '👍': ThumbsUp,
    '😂': Laugh,
};

function ChatWindow() {
    const { auth, database } = useFirebase();
    const { userData } = useProfile();
    const searchParams = useSearchParams();
    const chatId = searchParams.get('chatId');
    const { toast } = useToast();

    const [chatDetails, setChatDetails] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

     useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const otherUser = useMemo(() => {
        if (!chatDetails || !auth?.currentUser) return null;
        return chatDetails.memberDetails?.find((m: any) => m.uid !== auth.currentUser.uid);
    }, [chatDetails, auth?.currentUser]);

    useEffect(() => {
        if (!chatId || !database) {
            setChatDetails(null);
            setMessages([]);
            return;
        };

        const chatRef = ref(database, `chats/${chatId}`);
        const messagesRef = ref(database, `messages/${chatId}`);
        
        const unsubscribeChat = onValue(chatRef, (snapshot) => {
            setChatDetails(snapshot.val());
        });

        const unsubscribeMessages = onValue(query(messagesRef, orderByChild('createdAt')), (snapshot) => {
            const messagesData: any[] = [];
            snapshot.forEach((childSnapshot) => {
                messagesData.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val(),
                });
            });
            setMessages(messagesData);
        });

        const typingRef = ref(database, `chats/${chatId}/typing`);
        const unsubscribeTyping = onValue(typingRef, (snapshot) => {
            const typingUsers = snapshot.val() || {};
            const otherUserId = chatDetails?.memberDetails?.find((m: any) => m.uid !== auth?.currentUser?.uid)?.uid;
            if (otherUserId && typingUsers[otherUserId]) {
                setIsOtherUserTyping(true);
            } else {
                setIsOtherUserTyping(false);
            }
        });

        return () => {
            unsubscribeChat();
            unsubscribeMessages();
            unsubscribeTyping();
        };
    }, [chatId, database, auth?.currentUser?.uid]);

    const updateTypingStatus = useCallback((isTyping: boolean) => {
        if (!chatId || !database || !auth?.currentUser) return;
        const typingRef = ref(database, `chats/${chatId}/typing/${auth.currentUser.uid}`);
        if (isTyping) {
            set(typingRef, true);
        } else {
            remove(typingRef);
        }
    }, [chatId, database, auth?.currentUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        } else {
            updateTypingStatus(true);
        }

        typingTimeoutRef.current = setTimeout(() => {
            updateTypingStatus(false);
            typingTimeoutRef.current = null;
        }, 2000); // User is considered "not typing" after 2 seconds of inactivity
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !chatId || !database || !auth?.currentUser || !userData) return;

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        updateTypingStatus(false);

        const messagesRef = ref(database, `messages/${chatId}`);
        const newMsgRef = push(messagesRef);

        const messageData = {
            senderId: auth.currentUser.uid,
            senderName: userData.name,
            text: newMessage,
            createdAt: serverTimestamp(),
            isUnsent: false,
            reactions: {}
        };

        await set(newMsgRef, messageData);

        // Update last message in the chat object
        set(ref(database, `chats/${chatId}/lastMessage`), newMessage);
        set(ref(database, `chats/${chatId}/lastMessageTimestamp`), serverTimestamp());


        setNewMessage('');
    };

    const handleUnsendMessage = async (messageId: string) => {
        if (!chatId || !database) return;
        const messageRef = ref(database, `messages/${chatId}/${messageId}`);
        try {
            await update(messageRef, {
                text: 'This message was unsent',
                isUnsent: true,
                reactions: {},
            });
            toast({ title: "Message unsent" });
        } catch (error) {
            toast({ variant: 'destructive', title: "Error", description: "Could not unsend message." });
        }
    };

    const handleReaction = async (messageId: string, emoji: string) => {
         if (!chatId || !database || !auth?.currentUser) return;
        const messageRef = ref(database, `messages/${chatId}/${messageId}/reactions/${emoji}`);
        
        try {
            onValue(messageRef, async (snapshot) => {
                const existingReactors: string[] = snapshot.val() || [];
                const currentUserUid = auth.currentUser!.uid;

                if (existingReactors.includes(currentUserUid)) {
                    // User is removing their reaction
                    const newReactors = existingReactors.filter(uid => uid !== currentUserUid);
                    await set(messageRef, newReactors.length > 0 ? newReactors : null);
                } else {
                    // User is adding a reaction
                    await set(messageRef, [...existingReactors, currentUserUid]);
                }
            }, { onlyOnce: true }); // We only need to check the state once
        } catch (error) {
             toast({ variant: 'destructive', title: "Error", description: "Could not apply reaction." });
        }
    };
    

    if (!chatId) {
        return (
             <Card className="flex-1 h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-muted/20">
                <div className="text-center text-muted-foreground">
                    <Mail className="w-16 h-16 mx-auto text-gray-300" />
                    <h3 className="mt-4 text-xl font-medium">Select a Conversation</h3>
                    <p className="mt-1 text-sm">Start chatting with your matches.</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="flex-1 h-[calc(100vh-10rem)] flex flex-col">
            {otherUser && (
                <div className="p-4 border-b flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={otherUser.photoURL} alt={otherUser.name} />
                        <AvatarFallback>{otherUser.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-bold">{otherUser.name}</h3>
                        <p className={cn("text-xs", isOtherUserTyping ? "text-primary italic" : "text-green-500")}>
                            {isOtherUserTyping ? 'typing...' : 'Online'}
                        </p>
                    </div>
                </div>
            )}
             <div className="flex-1 p-6 overflow-y-auto space-y-2">
                <AnimatePresence>
                {messages.map((msg) => (
                    <div key={msg.id} className={cn('flex flex-col', msg.senderId === auth?.currentUser?.uid ? 'items-end' : 'items-start')}>
                        <div className={cn('flex items-end gap-2 max-w-xs md:max-w-md', msg.senderId === auth?.currentUser?.uid ? 'flex-row-reverse' : 'flex-row')}>
                            {msg.senderId !== auth?.currentUser?.uid && (
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={otherUser?.photoURL} />
                                    <AvatarFallback>{otherUser?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            )}
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className={cn('p-3 rounded-2xl cursor-pointer', {
                                            'bg-primary text-primary-foreground rounded-br-none': msg.senderId === auth?.currentUser?.uid,
                                            'bg-muted rounded-bl-none': msg.senderId !== auth?.currentUser?.uid,
                                            'bg-transparent text-muted-foreground italic border': msg.isUnsent,
                                        })}
                                    >
                                        <p className="text-sm">{msg.text}</p>
                                         {!msg.isUnsent && (
                                            <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                         )}
                                    </motion.div>
                                </DropdownMenuTrigger>
                                {!msg.isUnsent && (
                                    <DropdownMenuContent>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>React</DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    {Object.entries(ReactionEmojis).map(([emoji, Icon]) => (
                                                        <DropdownMenuItem key={emoji} onClick={() => handleReaction(msg.id, emoji)}>
                                                            <Icon className="mr-2 h-4 w-4" /> {emoji}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                        {msg.senderId === auth?.currentUser?.uid && (
                                             <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        <Trash2 className="mr-2 h-4 w-4 text-destructive" /> Unsend
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Unsend message?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently remove the message for everyone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleUnsendMessage(msg.id)}>Unsend</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </DropdownMenuContent>
                                )}
                            </DropdownMenu>
                        </div>
                        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                             <div className={cn("flex gap-1 mt-1", msg.senderId === auth?.currentUser?.uid ? 'mr-12' : 'ml-12' )}>
                                {Object.entries(msg.reactions).map(([emoji, reactors]) => (
                                    (reactors as string[]).length > 0 &&
                                    <div key={emoji} className="text-xs bg-muted border rounded-full px-2 py-0.5 flex items-center gap-1">
                                        <span>{emoji}</span>
                                        <span>{(reactors as string[]).length}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t bg-background">
                 <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" type='button'>
                        <Smile />
                    </Button>
                    <Input
                        value={newMessage}
                        onChange={handleInputChange}
                        placeholder="Type a message..."
                        className="flex-1 bg-muted border-none focus:ring-2 focus:ring-primary"
                        autoComplete='off'
                    />
                    <Button type="submit" size="icon">
                        <Send />
                    </Button>
                </form>
            </div>
        </Card>
    )
}

export default function MessagesPage() {
    return (
        <div className="flex gap-6">
            <ChatList />
            <ChatWindow />
        </div>
    );
}
