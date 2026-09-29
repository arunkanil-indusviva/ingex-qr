import { useState } from "react"
import { Link } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { z } from "zod"

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
import { requestPasswordReset } from "@/services/auth"

const emailSchema = z.email({ error: "Enter a valid email." })

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const mutation = useMutation({
    mutationFn: requestPasswordReset,
  })

  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <BrandLogo />
          <CardTitle>Forgot password</CardTitle>
          <CardDescription>
            Enter the email for your admin account. This prototype does not send
            mail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mutation.isSuccess ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm">{mutation.data.message}</p>
              <Button asChild>
                <Link to="/login">Back to sign in</Link>
              </Button>
            </div>
          ) : (
            <form
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault()
                const parsed = emailSchema.safeParse(email)
                if (!parsed.success) {
                  setError("Enter a valid email.")
                  return
                }
                setError("")
                mutation.mutate(parsed.data)
              }}
            >
              <FormField label="Email" htmlFor="email" error={error}>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </FormField>
              {mutation.isError ? (
                <p className="text-sm text-destructive" role="alert">
                  {getErrorMessage(mutation.error)}
                </p>
              ) : null}
              <Button type="submit" disabled={mutation.isPending}>
                Send reset link
              </Button>
              <Button variant="link" className="h-auto px-0" asChild>
                <Link to="/login">Back to sign in</Link>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
