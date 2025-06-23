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
          className="relative overflow-hidden rounded-full"
          variant="ghost"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage
              alt={userName || "User"}
              src={userImage || undefined}
            />
            <AvatarFallback>
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
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <Avatar className="h-8 w-8 bg-primary/10">
            <AvatarImage
              alt={userName || "User"}
              src={userImage || undefined}
            />
            <AvatarFallback>
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
                <UserIcon className="h-4 w-4 text-primary" />
              )}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">
              {userName || userEmail?.split("@")[0] || "User"}
            </p>
            <p
              className={"max-w-[160px] truncate text-xs text-muted-foreground"}
            >
              {userEmail}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/dashboard/stats">
            <BarChart className="mr-2 h-4 w-4" />
            {t("Nav.stats")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/dashboard/profile">
            <UserIcon className="mr-2 h-4 w-4" />
            {t("Nav.profile")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            {t("Nav.settings")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/dashboard/uploads">
            <Upload className="mr-2 h-4 w-4" />
            {t("Nav.uploads")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/admin/summary">
            <Shield className="mr-2 h-4 w-4" />
            {t("Nav.admin")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={cn(
            "cursor-pointer",
            isDashboard
              ? "text-red-600"
              : `
                text-destructive
                focus:text-destructive
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Auth.confirmSignOut")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("Auth.confirmSignOutDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("Common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className={`
                bg-destructive text-destructive-foreground
                hover:bg-destructive/90
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
