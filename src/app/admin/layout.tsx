'use client';

import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, LayoutGrid, LogOut, Menu, User, UserCheck, UserX, XCircle, Settings, Search } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { FirebaseProvider } from '@/firebase/provider';


function AdminSidebar() {
  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: User, label: 'Registered Users', href: '/admin/users' },
    { icon: UserCheck, label: 'Active Plan Users', href: '/admin/active-plans' },
    { icon: UserX, label: 'Blocked IDs', href: '/admin/blocked' },
    { icon: XCircle, label: 'Cancelled Plans', href: '/admin/cancelled' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-card p-6 hidden lg:flex flex-col justify-between">
      <div>
        <Link href="/admin/dashboard" className="font-serif text-3xl font-bold text-primary mb-10 block">
          Admin Panel
        </Link>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 text-muted-foreground font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <item.icon className="w-5 h-5" />
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


function AdminHeader() {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        // In a real app, you'd clear the admin session
        router.push('/login');
    };
    
    const adminName = "Admin";
    const greeting = `Welcome Admin 👋`;

    return (
        <header className="bg-background/80 backdrop-blur-sm border-b">
            <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                 <div className="flex items-center gap-4 lg:hidden">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-6">
                            <Link href="/admin/dashboard" className="font-serif text-3xl font-bold text-primary mb-10 block" onClick={() => setOpen(false)}>
                                Admin Panel
                            </Link>
                             <nav className="space-y-2">
                                {[
                                    { icon: LayoutGrid, label: 'Dashboard', href: '/admin/dashboard' },
                                    { icon: User, label: 'Registered Users', href: '/admin/users' },
                                    { icon: UserCheck, label: 'Active Plan Users', href: '/admin/active-plans' },
                                    { icon: UserX, label: 'Blocked IDs', href: '/admin/blocked' },
                                    { icon: XCircle, label: 'Cancelled Plans', href: '/admin/cancelled' },
                                    { icon: Settings, label: 'Settings', href: '/admin/settings' },
                                ].map((item) => (
                                    <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-muted-foreground font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                                    >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <Link href="/admin/dashboard" className="font-serif text-2xl font-bold text-primary">
                        EU
                    </Link>
                </div>

                <div className="flex-1 max-w-md ml-auto lg:ml-0">
                    <div className='hidden lg:block'>
                        <h1 className="text-xl font-bold text-foreground">{greeting}</h1>
                        <p className="text-sm text-muted-foreground">Manage your application efficiently.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search users..." className="pl-9" />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2">
                               <Avatar className="w-8 h-8">
                                    <AvatarImage src={'/admin-avatar.png'} alt={adminName} />
                                    <AvatarFallback>{adminName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className='hidden md:inline'>{adminName}</span>
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className='w-56'>
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

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background romantic-gradient-shift flex">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <AdminHeader />
                <main className='flex-1 p-6'>
                    <Suspense fallback={<div>Loading...</div>}>
                         <FirebaseProvider>
                            {children}
                        </FirebaseProvider>
                    </Suspense>
                </main>
            </div>
        </div>
    );
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminLayoutContent>{children}</AdminLayoutContent>
  )
}
