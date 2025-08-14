"use client"

import * as React from "react"
import {
  Bell,
  Calendar,
  HeartHandshake,
  LifeBuoy,
  Package,
  Send,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Referrals",
      url: "/referrals",
      icon: Package,
      // roles: [Role.VOLUNTEER, Role.ADMINISTRATOR],
      isActive: false,
      items: [
        {
          title: "Archived",
          url: "/referrals/archived",
        },
        {
          title: "Withdrawn",
          url: "/referrals/withdrawn",
        },
      ],
    },
    {
      title: "Bookings",
      url: "/bookings",
      icon: Calendar,
      // roles: [Role.VOLUNTEER, Role.ADMINISTRATOR],
      isActive: false,
      items: [
        {
          title: "Timeslots",
          url: "/timeslots",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      dialog: "support",
      icon: LifeBuoy,
      hasBadge: false,
      counter: 0,
    },
    {
      title: "Feedback",
      dialog: "feedback",
      icon: Send,
      hasBadge: false,
      counter: 0,
    },
    {
      title: "Settings",
      dialog: "settings",
      icon: Settings2,
      hasBadge: false,
      counter: 0,
    },
    {
      title: "Notifications",
      dialog: "notifications",
      icon: Bell,
      hasBadge: true,
      counter: 1,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <HeartHandshake className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Union</span>
                  <span className="truncate text-xs">Gloucestershire Bundles</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
