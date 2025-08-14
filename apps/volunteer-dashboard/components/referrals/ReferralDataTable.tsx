import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";

type ReferralData = {
  reference: string;
  familyNames: Array<string>;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const data: ReferralData[] = [
    {
        reference: "GB-4DS1O0",
        familyNames: ["Smith", "Johnson"],
        status: "Accepted",
        createdAt: "today",
        updatedAt: "yesterday"
    }
]

export function ReferralDataTable() {
  const columns: ColumnDef<ReferralData>[] = [
    {
      accessorKey: "reference",
      header: "Reference",
    },
    {
      accessorKey: "familyNames",
      header: "Family Name(s)",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "createdAt",
      header: "Submission At",
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
    },
  ];

  return (
    <DataTable columns={columns} data={data} />
  )
}
