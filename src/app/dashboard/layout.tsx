
'use client';

import { Suspense } from 'react';
import { useFirebase } from '@/firebase/provider';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ChevronDown, LayoutGrid, LogOut, Menu, Settings, User, Heart, Star, Crown } from 'lucide-react';
import { FirebaseProvider } from '@/firebase/provider';
import Link from 'next/link';
import { ProfileProvider, useProfile } from '@/components/profile-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { differenceInDays, format } from 'date-fns';
import Image from 'next/image';

function DashboardSidebar() {
  const { hasMembership } = useProfile();

  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard' },
    { icon: Heart, label: 'Matching Profiles', href: '/dashboard/matches' },
    { icon: User, label: 'My Profile', href: '/dashboard/profile' },
    ...(!hasMembership ? [{ icon: Star, label: 'Upgrade Plan', href: '/dashboard/upgrade' }] : []),
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <aside className="w-64 bg-card p-6 hidden lg:flex flex-col justify-between">
      <div>
        <Link href="/dashboard" className="mb-10 flex justify-center">
          <Image src="https://ik.imagekit.io/rgazxzsxr/WhatsApp_Image_2025-11-17_at_14.09.46_86744fba-removebg-preview.png" alt="Eternal Union Logo" width={100} height={70} className="object-contain" />
        </Link>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 text-muted-foreground font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Eternal Union</p>
      </div>
    </aside>
  );
}


function DashboardHeader() {
    const { auth } = useFirebase();
    const router = useRouter();
    const { progress, hasMembership, userData } = useProfile();

    const handleLogout = async () => {
        if (auth) {
            await auth.signOut();
            router.push('/login');
        }
    };
    
    const userName = auth?.currentUser?.displayName || "User";
    const greeting = `Welcome, ${userName} 👋`;

    const planName = userData?.membership?.plan;
    const expiryDate = userData?.membership?.expiryDate;
    
    let isExpiringSoon = false;
    let formattedExpiryDate = '';
    if (expiryDate) {
        const daysUntilExpiry = differenceInDays(new Date(expiryDate), new Date());
        isExpiringSoon = daysUntilExpiry <= 7;
        formattedExpiryDate = ` (Expires: ${format(new Date(expiryDate), 'dd MMM yyyy')})`;
    }


    return (
        <header className="bg-background/80 backdrop-blur-sm border-b">
            <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                 <div className="flex items-center gap-4 lg:hidden">
                    <Button variant="ghost" size="icon">
                        <Menu className="w-6 h-6" />
                    </Button>
                    <Link href="/dashboard" className="font-serif text-2xl font-bold text-primary">
                        EU
                    </Link>
                </div>

                <div className="flex-1 max-w-md ml-auto lg:ml-0">
                    <div className='hidden lg:block'>
                        <h1 className="text-xl font-bold text-foreground">{greeting}</h1>
                        <p className="text-sm text-muted-foreground">Welcome Back!</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                     {hasMembership && planName && (
                        <Badge variant="secondary" className={cn("border-accent text-accent-foreground font-bold", isExpiringSoon && "bg-destructive/10 text-destructive border-destructive/20")}>
                            <Crown className="w-4 h-4 mr-2 fill-current" />
                            {planName} Plan {formattedExpiryDate}
                        </Badge>
                     )}
                    {!hasMembership && (
                        <Button asChild size="sm">
                            <Link href="/dashboard/upgrade">
                                <Star className="mr-2 h-4 w-4" />
                                Upgrade Plan
                            </Link>
                        </Button>
                    )}
                    <div className='hidden lg:flex items-center gap-4 w-48'>
                        <Progress value={progress} className="h-2" />
                        <span className="text-sm font-semibold text-primary">{progress}%</span>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2">
                               <Avatar className="w-8 h-8">
                                    <AvatarImage src={auth?.currentUser?.photoURL || ''} alt={userName} />
                                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className='hidden md:inline'>{userName}</span>
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className='w-56'>
                             <DropdownMenuItem asChild>
                                <Link href="/dashboard/profile">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>My Profile</span>
                                </Link>
                             </DropdownMenuItem>
                             <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                                </Link>
                             </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background romantic-gradient-shift flex">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <main className='flex-1 p-6'>
                    <Suspense fallback={<div>Loading...</div>}>
                        {children}
                    </Suspense>
                </main>
            </div>
        </div>
    );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FirebaseProvider>
      <ProfileProvider>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </ProfileProvider>
    </FirebaseProvider>
  )
}
