import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getInitials } from "@/lib/utils"

interface UserAvatarProps {
  name: string
  image?: string | null
  className?: string
}

export function UserAvatar({ name, image, className }: UserAvatarProps) {
  return (
    <Avatar className={cn("h-8 w-8", className)}>
      {image && <AvatarImage src={image} alt={name} />}
      <AvatarFallback className="text-xs">{getInitials(name)}</AvatarFallback>
    </Avatar>
  )
}
