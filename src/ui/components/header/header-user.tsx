import {
  BarChart,
  LogOut,
  Settings,
  Shield,
  Upload,
  UserIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

import { useSupabase } from "~/components/providers/SupabaseProvider";
import { cn } from "~/lib/cn";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/ui/primitives/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/primitives/avatar";
import { Button } from "~/ui/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/ui/primitives/dropdown-menu";

interface HeaderUserDropdownProps {
  isDashboard: boolean;
  userEmail: string;
  userImage?: null | string;
  userName: string;
}

export function HeaderUserDropdown({
  isDashboard = false,
  userEmail,
  userImage,
  userName,
}: HeaderUserDropdownProps) {
  const { signOut } = useSupabase();
  const t = useTranslations();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowLogoutDialog(false);
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`
            group relative overflow-hidden rounded-full transition-all
            duration-200
            hover:scale-105 hover:shadow-md hover:ring-2 hover:ring-primary/20
          `}
          variant="ghost"
        >
          <Avatar
            className={`
              h-9 w-9 transition-all duration-200
              group-hover:ring-2 group-hover:ring-primary/30
            `}
          >
            <AvatarImage
              alt={userName || "User"}
              className={`
                transition-all duration-200
                group-hover:scale-110
              `}
              src={userImage || undefined}
            />
            <AvatarFallback
              className={`
                bg-gradient-to-br from-primary/10 to-primary/5 font-semibold
                text-primary
              `}
            >
              {userName ? (
                userName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              ) : userEmail ? (
                userEmail.charAt(0).toUpperCase()
              ) : (
                <UserIcon className="h-4 w-4" />
              )}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 duration-200 animate-in slide-in-from-top-2"
      >
        <div
          className={`
            flex items-center justify-start gap-3 bg-gradient-to-r
            from-primary/5 to-transparent p-3
          `}
        >
          <Avatar className="h-10 w-10 shadow-sm ring-2 ring-primary/20">
            <AvatarImage
              alt={userName || "User"}
              src={userImage || undefined}
            />
            <AvatarFallback
              className={`
                bg-gradient-to-br from-primary/15 to-primary/5 font-semibold
                text-primary
              `}
            >
              {userName ? (
                userName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              ) : userEmail ? (
                userEmail.charAt(0).toUpperCase()
              ) : (
                <UserIcon className="h-5 w-5 text-primary" />
              )}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold text-foreground">
              {userName || userEmail?.split("@")[0] || "User"}
            </p>
            <p className="max-w-[180px] truncate text-xs text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem asChild>
          <Link
            className={`
              cursor-pointer transition-all
              hover:bg-primary/5
              focus:bg-primary/5
            `}
            href="/dashboard/stats"
          >
            <BarChart className="mr-2 h-4 w-4 text-primary/60" />
            {t("Nav.stats")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            className={`
              cursor-pointer transition-all
              hover:bg-primary/5
              focus:bg-primary/5
            `}
            href="/dashboard/profile"
          >
            <UserIcon className="mr-2 h-4 w-4 text-primary/60" />
            {t("Nav.profile")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            className={`
              cursor-pointer transition-all
              hover:bg-primary/5
              focus:bg-primary/5
            `}
            href="/dashboard/settings"
          >
            <Settings className="mr-2 h-4 w-4 text-primary/60" />
            {t("Nav.settings")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            className={`
              cursor-pointer transition-all
              hover:bg-primary/5
              focus:bg-primary/5
            `}
            href="/dashboard/uploads"
          >
            <Upload className="mr-2 h-4 w-4 text-primary/60" />
            {t("Nav.uploads")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            className={`
              cursor-pointer transition-all
              hover:bg-primary/5
              focus:bg-primary/5
            `}
            href="/admin/summary"
          >
            <Shield className="mr-2 h-4 w-4 text-primary/60" />
            {t("Nav.admin")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem
          className={cn(
            "cursor-pointer transition-all",
            isDashboard
              ? `
                text-red-600
                hover:bg-red-50
                focus:bg-red-50
              `
              : `
                text-destructive
                hover:bg-destructive/5
                focus:bg-destructive/5 focus:text-destructive
              `
          )}
          onClick={() => setShowLogoutDialog(true)}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("Auth.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>

      {/* 确认登出对话框 */}
      <AlertDialog onOpenChange={setShowLogoutDialog} open={showLogoutDialog}>
        <AlertDialogContent className="duration-200 animate-in zoom-in-95">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">
              {t("Auth.confirmSignOut")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {t("Auth.confirmSignOutDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              className={`
                transition-all
                hover:scale-105
              `}
            >
              {t("Common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className={`
                bg-destructive text-destructive-foreground transition-all
                hover:scale-105 hover:bg-destructive/90 hover:shadow-md
              `}
              onClick={handleSignOut}
            >
              {t("Auth.signOut")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
}
