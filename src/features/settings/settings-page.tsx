import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

import { FormField } from "@/components/common/form-field"
import { Page, PageHeader } from "@/components/common/page"
import { QueryState } from "@/components/common/query-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getErrorMessage } from "@/lib/api-error"
import { invalidateCatalog, queryKeys } from "@/lib/query-keys"
import { queryClient } from "@/lib/query-client"
import { getSettings, updateSettings } from "@/services/settings"
import type { Settings } from "@/types/settings"

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-4 text-sm">
      {label}
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  )
}

export function SettingsPage() {
  const query = useQuery({
    queryKey: queryKeys.settings,
    queryFn: getSettings,
  })
  const form = useForm<Settings>({
    defaultValues: {
      companyName: "",
      qrBaseUrl: "",
      requireStrongPasswords: true,
      sessionTimeoutMinutes: 30,
      emailOnScan: false,
      emailOnQrGenerated: true,
    },
  })
  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: (settings) => {
      queryClient.setQueryData(queryKeys.settings, settings)
      invalidateCatalog(queryClient)
      toast.success("Settings saved")
    },
  })

  const requireStrongPasswords = useWatch({
    control: form.control,
    name: "requireStrongPasswords",
  })
  const emailOnScan = useWatch({ control: form.control, name: "emailOnScan" })
  const emailOnQrGenerated = useWatch({
    control: form.control,
    name: "emailOnQrGenerated",
  })

  useEffect(() => {
    if (query.data) {
      form.reset(query.data)
    }
  }, [query.data, form])

  return (
    <Page>
      <PageHeader
        title="Settings"
        description="Company details, QR links, security, and notifications."
      />
      <QueryState query={query} skeleton={<Skeleton className="h-80" />}>
        {() => (
          <form
            className="flex max-w-xl flex-col gap-6"
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <Tabs defaultValue="general">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="qr">QR</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="flex flex-col gap-4 pt-4">
                <FormField label="Company name" htmlFor="companyName">
                  <Input id="companyName" {...form.register("companyName")} />
                </FormField>
              </TabsContent>
              <TabsContent value="qr" className="flex flex-col gap-4 pt-4">
                <FormField label="QR base URL" htmlFor="qrBaseUrl">
                  <Input id="qrBaseUrl" {...form.register("qrBaseUrl")} />
                </FormField>
                <p className="text-sm text-muted-foreground">
                  New and existing QR codes use this address plus the product code.
                </p>
              </TabsContent>
              <TabsContent value="security" className="flex flex-col gap-4 pt-4">
                <ToggleRow
                  label="Require a strong password"
                  checked={requireStrongPasswords}
                  onChange={(checked) =>
                    form.setValue("requireStrongPasswords", checked)
                  }
                />
                <FormField
                  label="Session timeout (minutes)"
                  htmlFor="sessionTimeoutMinutes"
                >
                  <Input
                    id="sessionTimeoutMinutes"
                    type="number"
                    min={5}
                    {...form.register("sessionTimeoutMinutes", {
                      valueAsNumber: true,
                    })}
                  />
                </FormField>
              </TabsContent>
              <TabsContent value="notifications" className="flex flex-col gap-4 pt-4">
                <ToggleRow
                  label="Email when a QR is scanned"
                  checked={emailOnScan}
                  onChange={(checked) => form.setValue("emailOnScan", checked)}
                />
                <ToggleRow
                  label="Email when a QR is generated"
                  checked={emailOnQrGenerated}
                  onChange={(checked) =>
                    form.setValue("emailOnQrGenerated", checked)
                  }
                />
              </TabsContent>
            </Tabs>
            {mutation.isError ? (
              <p className="text-sm text-destructive" role="alert">
                {getErrorMessage(mutation.error)}
              </p>
            ) : null}
            <Button type="submit" className="w-fit" disabled={mutation.isPending}>
              Save changes
            </Button>
          </form>
        )}
      </QueryState>
    </Page>
  )
}
