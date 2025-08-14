import * as React from "react";
import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "./ui/badge";
import { useState } from "react";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    dialog: string;
    icon: LucideIcon;
    hasBadge: boolean;
    counter: number;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const handleItemClick = (dialogName: string) => {
    setOpenDialog(dialogName);

    // TODO: Implement openDialog logic.
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                size="sm"
                onClick={() => handleItemClick(item.dialog)}
              >
                <div className="cursor-pointer">
                  <item.icon />
                  <span>{item.title}</span>
                  {item.hasBadge && item.counter > 0 ? (
                    <Badge
                      className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums ml-auto"
                      variant="secondary"
                    >
                      {item.counter}
                    </Badge>
                  ) : null}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
