"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Archive, ArrowUpDown, Clipboard, Download, Eye, MoreHorizontal } from "lucide-react";
import { redirect } from "next/navigation";
import { mapReferralStatus, ReferralStatusBadge } from "./ReferralStatusBadge";
import { ReferralStatus } from "@/types/ReferralStatus";
import { Checkbox } from "../ui/checkbox";

type ReferralData = {
  reference: string;
  family: Array<string>;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

const data: ReferralData[] = [
  {
    reference: "GB-4DS1O0",
    family: ["Smith", "Johnson"],
    status: "Accepted",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    reference: "GB-6SD91V",
    family: ["Stone", "Vale"],
    status: "Rejected",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function ReferralDataTable() {
  const columns: ColumnDef<ReferralData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "reference",
      header: "Reference",
      cell: ({ row }) => {
        const rowReference = row.getValue("reference");
        return (
          <code>{rowReference as string}</code>
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: "family",
      header: "Family",
      cell: ({ row }) => {
        const familyNames = row.getValue("family") as string[];
        return (
          <div>
            {familyNames.map((name) => (
              <span key={name}>
                {name}<br/>
              </span>
            ))}
          </div>
        );
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <ReferralStatusBadge status={mapReferralStatus(row.getValue("status"))} />
      ),
      filterFn: "arrIncludes",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const formattedDate = new Date(row.getValue("createdAt") as string);
        return (
          <span>
            {formattedDate.toLocaleString("en-GB", { timeZone: "UTC" })}
          </span>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => {
        const formattedDate = new Date(row.getValue("updatedAt") as string);
        return (
          <span>
            {formattedDate.toLocaleString("en-GB", { timeZone: "UTC" })}
          </span>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const referral = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open actions</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => redirect(`/referrals/${row.getValue("reference")}`)}
              >
                <Eye />
                View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(referral.reference)
                }
              >
                <Clipboard />
                Copy Reference
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Archive />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DataTable 
      columns={columns} 
      data={data} 
      searchableFields={["reference", "family"]}
      filterableColumns={[
        {
          key: "status",
          label: "Filter",
          options: Object.values(ReferralStatus),
        }
      ]}
    />
  );
}
