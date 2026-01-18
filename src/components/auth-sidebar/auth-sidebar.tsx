'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LucideLogOut, LucideTicketCheck } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { signOut } from '@/features/auth/actions/sign-out';
import { useAuth } from '@/features/auth/hooks/use-auth';

import { navItems } from './constants';

const AuthSidebar = () => {
  const pathname = usePathname();
  const { setOpen } = useSidebar();
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="bg-secondary/20 w-19.5" />;

  if (!user) return null;

  return (
    <Sidebar
      className="animate-in slide-in-from-left h-full pt-16"
      collapsible="icon"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Header - Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="TicketBounty">
              <Link href="/">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <LucideTicketCheck className="size-4" />
                </div>
                <span className="font-semibold">TicketBounty</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content - Nav Items */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navItems.map((navItem) => {
                const isActive = pathname === navItem.href;

                return (
                  <SidebarMenuItem key={navItem.title}>
                    <SidebarMenuButton
                      asChild
                      className="[&_svg]:size-5"
                      isActive={isActive}
                      tooltip={navItem.title}
                    >
                      <Link className="text-lg" href={navItem.href}>
                        {navItem.icon}
                        <span>{navItem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer - User Info */}
      <SidebarFooter>
        <SidebarMenu>
          {!isLoading && user && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton className="cursor-pointer" size="lg" tooltip={user.email}>
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">{user.username}</span>
                    <span className="text-muted-foreground max-w-35 truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <form action={signOut} className="w-full">
                  <SidebarMenuButton
                    className="cursor-pointer [&_svg]:size-5"
                    tooltip="Sign Out"
                    type="submit"
                  >
                    <LucideLogOut />
                    <span>Sign Out</span>
                  </SidebarMenuButton>
                </form>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export { AuthSidebar };
