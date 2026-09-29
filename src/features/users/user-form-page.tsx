import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

import { FilterSelect } from "@/components/common/filter-select"
import { FormField } from "@/components/common/form-field"
import { Page, PageHeader } from "@/components/common/page"
import { QueryState } from "@/components/common/query-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { getErrorMessage } from "@/lib/api-error"
import { queryClient } from "@/lib/query-client"
import { queryKeys } from "@/lib/query-keys"
import { createUser, getUser, updateUser } from "@/services/users"
import { userRoles, type UserInput } from "@/types/user"

const userSchema = z.object({
  name: z.string().trim().min(1, { error: "Enter a name." }),
  email: z.email({ error: "Enter a valid email." }),
  role: z.enum(userRoles),
  status: z.enum(["active", "inactive"]),
  password: z.string(),
})

type UserFormValues = z.infer<typeof userSchema>

export function UserFormPage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const existing = useQuery({
    queryKey: queryKeys.user(userId ?? "new"),
    queryFn: () => getUser(userId ?? ""),
    enabled: Boolean(userId),
  })
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "viewer",
      status: "active",
      password: "",
    },
  })

  const role = useWatch({ control: form.control, name: "role" })
  const status = useWatch({ control: form.control, name: "status" })

  useEffect(() => {
    if (!existing.data) {
      return
    }
    form.reset({
      name: existing.data.name,
      email: existing.data.email,
      role: existing.data.role,
      status: existing.data.status,
      password: "",
    })
  }, [existing.data, form])

  const mutation = useMutation({
    mutationFn: (values: UserFormValues) => {
      const input: UserInput = values
      return userId ? updateUser(userId, input) : createUser(input)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.users })
      toast.success(userId ? "User updated" : "User added")
      navigate("/users")
    },
  })

  const fields = (
    <form
      className="grid max-w-lg gap-4"
      onSubmit={form.handleSubmit((values) => {
        if (!userId && !values.password.trim()) {
          form.setError("password", { message: "Enter a password." })
          return
        }
        mutation.mutate(values)
      })}
      noValidate
    >
      <FormField label="Name" htmlFor="name" error={form.formState.errors.name?.message}>
        <Input id="name" {...form.register("name")} />
      </FormField>
      <FormField label="Email" htmlFor="email" error={form.formState.errors.email?.message}>
        <Input id="email" type="email" {...form.register("email")} />
      </FormField>
      <FormField label="Role" htmlFor="role">
        <FilterSelect
          label="Role"
          value={role}
          onChange={(value) =>
            form.setValue(
              "role",
              value === "administrator" || value === "manager" ? value : "viewer"
            )
          }
          options={[
            { value: "administrator", label: "Administrator" },
            { value: "manager", label: "Manager" },
            { value: "viewer", label: "Viewer" },
          ]}
        />
      </FormField>
      <FormField label="Status" htmlFor="status">
        <FilterSelect
          label="Status"
          value={status}
          onChange={(value) =>
            form.setValue("status", value === "inactive" ? "inactive" : "active")
          }
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      </FormField>
      <FormField
        label={userId ? "Password" : "Password"}
        htmlFor="password"
        error={form.formState.errors.password?.message}
      >
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder={userId ? "Leave blank to keep the current password" : ""}
          {...form.register("password")}
        />
      </FormField>
      {mutation.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {getErrorMessage(mutation.error)}
        </p>
      ) : null}
      <div className="flex gap-2">
        <Button type="button" variant="outline" asChild>
          <Link to="/users">Cancel</Link>
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {userId ? "Save user" : "Add user"}
        </Button>
      </div>
    </form>
  )

  return (
    <Page>
      <PageHeader
        title={userId ? "Edit user" : "Add user"}
        description="Roles shown here are Administrator, Manager, and Viewer."
      />
      {userId ? (
        <QueryState query={existing} skeleton={<Skeleton className="h-64" />}>
          {() => fields}
        </QueryState>
      ) : (
        fields
      )}
    </Page>
  )
}
