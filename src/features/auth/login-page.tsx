import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { z } from "zod"

import { env } from "@/config/env"
import { prototypeAdmin } from "@/config/prototype"
import { BrandLogo } from "@/components/common/brand-logo"
import { FormField } from "@/components/common/form-field"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getErrorMessage } from "@/lib/api-error"
import { queryClient } from "@/lib/query-client"
import { queryKeys } from "@/lib/query-keys"
import { login } from "@/services/auth"
import type { LoginInput } from "@/types/auth"

const loginSchema = z.object({
  email: z.email({ error: "Enter a valid email." }),
  password: z.string().min(1, { error: "Enter a password." }),
}) satisfies z.ZodType<LoginInput>

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname || "/dashboard"

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: env.useMocks
      ? {
          email: prototypeAdmin.email,
          password: prototypeAdmin.password,
        }
      : {
          email: "",
          password: "",
        },
  })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      queryClient.setQueryData(queryKeys.session, result.user)
      navigate(from, { replace: true })
    },
  })

  const emailError = form.formState.errors.email?.message
  const passwordError = form.formState.errors.password?.message

  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <BrandLogo className="h-10" />
          <CardTitle>QR admin</CardTitle>
          <CardDescription>
            Sign in to manage products and the QR codes attached to them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            noValidate
          >
            <FormField label="Email" htmlFor="email" error={emailError}>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? "email-error" : undefined}
                {...form.register("email")}
              />
            </FormField>
            <FormField
              label="Password"
              htmlFor="password"
              error={passwordError}
            >
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={Boolean(passwordError)}
                aria-describedby={passwordError ? "password-error" : undefined}
                {...form.register("password")}
              />
            </FormField>
            {mutation.isError ? (
              <p className="text-xs text-destructive" role="alert">
                {getErrorMessage(mutation.error)}
              </p>
            ) : null}
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Signing in" : "Sign in"}
            </Button>
            <Button variant="link" className="h-auto px-0" asChild>
              <Link to="/forgot-password">Forgot password</Link>
            </Button>
            {env.useMocks ? (
              <p className="text-xs text-muted-foreground">
                Prototype sign-in is filled in. Change the password to see the
                error.
              </p>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
