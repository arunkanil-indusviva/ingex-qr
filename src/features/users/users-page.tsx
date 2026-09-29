import { useState } from "react"
import { Link } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

import { Page, PageHeader } from "@/components/common/page"
import { QueryState } from "@/components/common/query-state"
import { StatusBadge } from "@/components/common/status-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDateTime, formatRole } from "@/lib/format"
import { queryKeys } from "@/lib/query-keys"
import { queryClient } from "@/lib/query-client"
import { deactivateUser, listUsers } from "@/services/users"

export function UsersPage() {
  const [pendingId, setPendingId] = useState<string | null>(null)
  const query = useQuery({
    queryKey: queryKeys.users,
    queryFn: listUsers,
  })
  const mutation = useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.users })
      setPendingId(null)
      toast.success("User deactivated")
    },
  })

  return (
    <Page>
      <PageHeader
        title="Users"
        description="People who can sign in, and the role each person has."
        actions={
          <Button asChild>
            <Link to="/users/new">Add user</Link>
          </Button>
        }
      />
      <QueryState query={query} skeleton={<Skeleton className="h-64" />}>
        {(users) => (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatRole(user.role)}</TableCell>
                  <TableCell>
                    <StatusBadge value={user.status} />
                  </TableCell>
                  <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="link" className="h-auto px-0" asChild>
                        <Link to={`/users/${user.id}/edit`}>Edit</Link>
                      </Button>
                      {user.status === "active" ? (
                        <Button
                          variant="link"
                          className="h-auto px-0"
                          onClick={() => setPendingId(user.id)}
                        >
                          Deactivate
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </QueryState>
      <Dialog open={Boolean(pendingId)} onOpenChange={() => setPendingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate user</DialogTitle>
            <DialogDescription>
              This person will no longer be able to sign in.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingId(null)}>
              Cancel
            </Button>
            <Button
              disabled={mutation.isPending || !pendingId}
              onClick={() => {
                if (pendingId) {
                  mutation.mutate(pendingId)
                }
              }}
            >
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  )
}
