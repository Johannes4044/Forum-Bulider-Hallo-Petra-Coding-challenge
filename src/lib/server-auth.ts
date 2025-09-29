import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth.config"

export async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new Error('Unauthorized - No session')
  }

  return session
}