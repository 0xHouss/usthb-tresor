import { logout } from '@/actions/auth-actions'
import { getInitials } from '@/lib/utils'
import { User } from 'next-auth'
import Image from 'next/image'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'

interface UserDropdownProps {
  user: User
}

export default function UserDropdown({ user }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:outline-none focus:outline-none">
        {user.image ? (
          <Image alt="User Dropdown" src={user.image} width={50} height={50} className="rounded-full w-10 h-10" />
        ) : (
          <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-300">{getInitials(user.name ?? "")}</span>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="px-2 py-2 text-sm">
          <p>{user.name}</p>
          <p className="truncate text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={logout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
