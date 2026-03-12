'use client'
import { FormEvent, useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, usePathname } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter();
  const pathname = usePathname();
  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // TODO: Replace with real login API call
      console.log("Log in user with email/password", { email, password })
      alert("Login submitted. Wire this up to your auth backend.")
      router.push('account')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleGoogleLogin() {
    // TODO: Replace with your Google OAuth route or provider
    console.log("Google login clicked")
    alert("Google login clicked. Point this to your Google auth route.")
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-border/60 bg-card/80 p-8 shadow-lg backdrop-blur">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back!</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Log in to access your account and manage your cart.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Log in..." : "Log in"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <span>OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="flex w-full items-center justify-center gap-2"
          onClick={handleGoogleLogin}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4"
          >
            <path
              fill="currentColor"
              d="M21.6 12.227c0-.638-.057-1.251-.163-1.84H12v3.48h5.381a4.59 4.59 0 0 1-1.99 3.012v2.507h3.223c1.889-1.737 2.986-4.296 2.986-7.159Z"
            />
            <path
              fill="currentColor"
              d="M12 22c2.7 0 4.968-.896 6.624-2.414l-3.223-2.507c-.896.6-2.044.957-3.401.957-2.615 0-4.827-1.764-5.619-4.134H3.03v2.592A9.997 9.997 0 0 0 12 22Z"
            />
            <path
              fill="currentColor"
              d="M6.381 13.902A5.999 5.999 0 0 1 5.963 12c0-.662.114-1.302.318-1.902V7.506H3.03A9.997 9.997 0 0 0 2 12c0 1.61.386 3.133 1.03 4.494l3.351-2.592Z"
            />
            <path
              fill="currentColor"
              d="M12 6.25c1.468 0 2.784.505 3.821 1.497l2.866-2.866C16.962 3.346 14.695 2.4 12 2.4A9.997 9.997 0 0 0 3.03 7.506l3.351 2.592C7.173 8.014 9.385 6.25 12 6.25Z"
            />
          </svg>
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Need an account?{" "}
          <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
        <div>
          <Link href={'/'}>
            <Button
              type="submit"
              className="mt-5 w-full"
            >
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}